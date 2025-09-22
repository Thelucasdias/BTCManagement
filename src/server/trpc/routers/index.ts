import { createTRPCRouter } from "../trpc";
import { customerRouter } from "./customer";
import { transactionRouter } from "./transactions";
import { publicRouter } from "./public";

export const appRouter = createTRPCRouter({
  customer: customerRouter,
  transaction: transactionRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
