import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const transactionRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        customerId: z.string(),
        type: z.enum(["DEPOSIT", "WITHDRAWAL"]),
        amountCents: z.bigint(),
        btcSats: z.bigint(),
        price_brl_per_btc: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.transaction.create({
        data: {
          ...input,
          price_brl_per_btc: input.price_brl_per_btc,
        },
      });
    }),

  listByCustomer: baseProcedure
    .input(z.object({ customerId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.transaction.findMany({
        where: { customerId: input.customerId },
      });
    }),
});
