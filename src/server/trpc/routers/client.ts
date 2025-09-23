import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const clientRouter = createTRPCRouter({
  listForAdmin: baseProcedure
    .input(
      z
        .object({
          q: z.string().optional(),
          limit: z.number().int().min(1).max(100).optional(),
          cursor: z.string().uuid().optional(),
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
          createdAt: true,
          _count: { select: { transactions: true } }, // only counts
        },
        orderBy: { createdAt: "desc" },
        take,
        ...(input?.cursor ? { skip: 1, cursor: { id: input.cursor } } : {}),
      });
    }),

  list: baseProcedure.query(async ({ ctx }) => {
    return ctx.prisma.client.findMany({
      include: { transactions: true },
    });
  }),

  create: baseProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        cpf: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.client.create({ data: input });
    }),
});
