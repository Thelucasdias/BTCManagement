import { createTRPCRouter } from "../trpc";
import { clientRouter } from "./client";
import { transactionRouter } from "./transactions";
import { publicRouter } from "./public";

export const appRouter = createTRPCRouter({
  client: clientRouter,
  transaction: transactionRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
