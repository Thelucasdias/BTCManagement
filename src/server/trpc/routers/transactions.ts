import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import axios from "axios";
import { TransactionDTO } from "@/types/transaction";

export const transactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        clientId: z.string(),
        type: z.enum(["DEPOSIT", "WITHDRAWAL"]),
        amountCents: z.bigint(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: { ids: "bitcoin", vs_currencies: "brl" },
        }
      );
      const btcPrice = data.bitcoin.brl as number;

      const amountBRL = Number(input.amountCents) / 100;
      const btcValue = amountBRL / btcPrice;

      if (input.type === "WITHDRAWAL") {
        const existingTxs = await ctx.prisma.transaction.findMany({
          where: { clientId: input.clientId },
          select: { type: true, btcValue: true },
        });

        const currentBalanceBTC = existingTxs.reduce((balance, tx) => {
          const txBtcValue = Number(tx.btcValue);
          return tx.type === "DEPOSIT"
            ? balance + txBtcValue
            : balance - txBtcValue;
        }, 0);

        // 1. Calcular o saldo disponível em BRL
        const currentBalanceBRL = currentBalanceBTC * btcPrice;

        // 2. Formatar o saldo BRL para exibição na mensagem de erro
        const formattedBRL = currentBalanceBRL.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        if (btcValue > currentBalanceBTC) {
          // 3. Modificar a mensagem de erro para mostrar o saldo BRL
          throw new Error(
            `Saldo insuficiente. Limite disponível para saque: ${formattedBRL}.`
          );
        }
      }

      return ctx.prisma.transaction.create({
        data: {
          clientId: input.clientId,
          type: input.type,
          amountCents: input.amountCents,
          btcValue: btcValue.toFixed(8),
          price_brl_per_btc: btcPrice.toString(),
        },
      });
    }),

  listByClient: publicProcedure
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
        btc_value: t.btcValue.toString(),
        price_brl_per_btc: t.price_brl_per_btc.toString(),
      }));
    }),
});
