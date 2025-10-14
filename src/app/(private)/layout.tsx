import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Se não estiver logado, vai pro login
  if (!session) {
    redirect("/login");
  }

  // Se for um user (ADMIN ou USER), bloqueia e manda pro /clients (painel admin)
  if (session.user.role === "ADMIN" || session.user.role === "USER") {
    redirect("/clients");
  }

  // Se chegou até aqui, é client autenticado
  return <>{children}</>;
}
