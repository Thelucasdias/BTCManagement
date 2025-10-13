import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/server/db";
import { compare } from "bcrypt";
import { z } from "zod";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailLower = credentials.email.toLowerCase();
        let authEntity: AuthUser | null = null;
        let passwordHash: string | null = null;

        const user = await prisma.user.findUnique({
          where: { email: emailLower },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
          },
        });

        if (user) {
          authEntity = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
          passwordHash = user.passwordHash;
        }

        if (!authEntity) {
          const client = await prisma.client.findUnique({
            where: { email: emailLower },
            select: { id: true, email: true, name: true, passwordHash: true },
          });

          if (client) {
            authEntity = {
              id: client.id,
              email: client.email,
              name: client.name,
              role: "CLIENT",
            };
            passwordHash = client.passwordHash;
          }
        }

        if (!authEntity || !passwordHash) return null;

        const isValid = await compare(credentials.password, passwordHash);

        if (!isValid) return null;

        return {
          id: authEntity.id,
          email: authEntity.email,
          role: authEntity.role,
          name: authEntity.name || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
