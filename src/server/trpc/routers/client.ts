import { z } from "zod";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "../trpc";

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

  // UPDATE without password
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
      // Remove keys with null or undefined values
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
});
