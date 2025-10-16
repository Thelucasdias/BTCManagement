import { z } from "zod";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure, baseProcedure } from "../trpc";

export const clientRouter = createTRPCRouter({
  listForAdmin: publicProcedure
    .input(
      z
        .object({
          q: z.string().optional(),
          limit: z.number().int().min(1).max(100).optional(),
          cursor: z.string().cuid().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const take = input?.limit ?? 20;
      return ctx.prisma.client.findMany({
        where: input?.q
          ? {
              OR: [
                { name: { contains: input.q, mode: "insensitive" } },
                { email: { contains: input.q, mode: "insensitive" } },
                { phone: { contains: input.q, mode: "insensitive" } },
                { cpf: { contains: input.q, mode: "insensitive" } },
              ],
            }
          : undefined,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          createdAt: true,
          _count: { select: { transactions: true } },
        },
        orderBy: { createdAt: "desc" },
        take,
        ...(input?.cursor ? { skip: 1, cursor: { id: input.cursor } } : {}),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email(),
        phone: z.string().optional().nullable(),
        cpf: z.string().optional().nullable(),
        password: z
          .string()
          .min(6, "Senha obrigatória com mínimo 6 caracteres"),
        walletRef: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { password, ...rest } = input;
      const passwordHash = await bcrypt.hash(password, 10);

      return ctx.prisma.client.create({
        data: {
          ...rest,
          passwordHash,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional().nullable(),
        phone: z.string().optional().nullable(),
        cpf: z.string().optional().nullable(),
        walletRef: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
      );
      return ctx.prisma.client.update({
        where: { id },
        data: filteredData,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.client.delete({
        where: { id: input.id },
      });
    }),

  getTransactions: baseProcedure.query(async ({ ctx }) => {
    const client = await ctx.prisma.client.findUnique({
      where: { id: ctx.userId! },
      select: { name: true },
    });

    const prismaTransactions = await ctx.prisma.transaction.findMany({
      where: {
        clientId: ctx.userId!,
      },
      select: {
        id: true,
        type: true,
        amountCents: true,
        btcValue: true,
        price_brl_per_btc: true,
        createdAt: true,
        clientId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const transactions = prismaTransactions.map((tx) => {
      const transformedTx = {
        id: tx.id,
        type: tx.type as "DEPOSIT" | "WITHDRAWAL",
        customerId: tx.clientId,
        customerName: client?.name ?? "Nome Desconhecido",
        date: tx.createdAt.toISOString(),
        amount_cents: Number(tx.amountCents),
        btc_value: tx.btcValue.toFixed(8),
        price_brl_per_btc: tx.price_brl_per_btc.toFixed(2),
      };

      return {
        id: transformedTx.id,
        customerId: transformedTx.customerId,
        customerName: transformedTx.customerName,
        date: transformedTx.date,
        amount_cents: transformedTx.amount_cents,
        type: transformedTx.type,
        btc_value: transformedTx.btc_value,
        price_brl_per_btc: transformedTx.price_brl_per_btc,
      } as const;
    });

    return transactions;
  }),
});
