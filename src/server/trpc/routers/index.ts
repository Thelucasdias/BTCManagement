import { createTRPCRouter } from "../trpc";
import { customerRouter } from "./customer";
import { transactionRouter } from "./transactions";

export const appRouter = createTRPCRouter({
  customer: customerRouter,
  transaction: transactionRouter,
});

export type AppRouter = typeof appRouter;
