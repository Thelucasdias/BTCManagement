import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createTRPCContext({ req, res }: any) {
  const session = await getServerSession(req, res, authOptions);
  return { session };
}
