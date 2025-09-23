import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";
import { TransactionDTO } from "@/types/transaction";

export const transactionRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        clientId: z.string(),
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

  listByClient: baseProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }): Promise<TransactionDTO[]> => {
      const txs = await ctx.prisma.transaction.findMany({
        where: { clientId: input.clientId },
        orderBy: { occurredAt: "desc" },
        include: { client: true },
      });

      return txs.map((t) => ({
        id: t.id,
        customerId: t.clientId,
        customerName: t.client.name,
        date: t.occurredAt.toISOString(),
        amount_cents: Number(t.amountCents),
        type: t.type,
        btc_sats: t.btcSats.toString(),
      }));
    }),
});
