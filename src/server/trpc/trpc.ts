import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { prisma } from "@/server/db";

type CreateContextOptions = {
  headers: Headers;
};

export const createTRPCContext = cache(async (opts: CreateContextOptions) => {
  const authHeader = opts.headers.get("authorization");
  const userId = authHeader?.replace("Bearer ", "") ?? null;

  return {
    prisma,
    userId,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: undefined,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
