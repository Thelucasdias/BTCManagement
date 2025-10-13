import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN" || session.user.role === "USER") {
    redirect("/clients");
  }

  if (!session.user.role) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
