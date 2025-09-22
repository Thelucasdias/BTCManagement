import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { prisma } from "@/server/db";
import superjson from "superjson";

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
  transformer: superjson,
});

// A new procedure that is *public* and has no authentication
export const publicProcedure = t.procedure;

// A standard procedure that requires authentication
export const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    // Se não houver userId no contexto, a requisição não está autenticada
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você não tem permissão para acessar este recurso.",
    });
  }
  // Se o usuário estiver autenticado, continue para o próximo middleware ou resolver
  return next({
    ctx: {
      // Aqui você pode refinar o contexto para garantir que o userId não é nulo
      userId: ctx.userId,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
