import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";
import axios from "axios";
import { TransactionDTO } from "@/types/transaction";

const transactionInputSchema = z.object({
  clientId: z.string(),
  type: z.enum(["DEPOSIT", "WITHDRAWAL"]),
  amountCents: z.bigint(),
  occurredAt: z.date().optional(),
  manualBtcPrice: z.string().optional(),
});

export const transactionRouter = createTRPCRouter({
  create: baseProcedure
    .input(transactionInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new Error(
          "Unauthorized. You must be logged in to perform this action."
        );
      }

      const isAdministrator = ctx.session.user.role === "ADMIN";

      let btcPrice: number;
      let occurredAt: Date;

      if (isAdministrator) {
        if (input.manualBtcPrice && input.occurredAt) {
          btcPrice = parseFloat(input.manualBtcPrice);
          occurredAt = input.occurredAt;
        } else {
          console.warn(
            "Admin did not provide manual date/price. Using current data."
          );

          const { data } = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price",
            {
              params: { ids: "bitcoin", vs_currencies: "brl" },
            }
          );
          btcPrice = data.bitcoin.brl as number;
          occurredAt = new Date();
        }
      } else {
        if (input.manualBtcPrice || input.occurredAt) {
          throw new Error(
            "Date and BTC price are automatically recorded. You cannot provide them manually."
          );
        }

        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            params: { ids: "bitcoin", vs_currencies: "brl" },
          }
        );
        btcPrice = data.bitcoin.brl as number;
        occurredAt = new Date();
      }

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

        const currentBalanceBRL = currentBalanceBTC * btcPrice;

        const formattedBRL = currentBalanceBRL.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        if (btcValue > currentBalanceBTC) {
          throw new Error(
            `Insufficient balance. Available withdrawal limit: ${formattedBRL}.`
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
          occurredAt: occurredAt,
        },
      });
    }),

  listByClient: baseProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }): Promise<TransactionDTO[]> => {
      if (!ctx.session?.user) {
        throw new Error("Unauthorized.");
      }

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
