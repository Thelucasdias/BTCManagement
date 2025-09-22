import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const customerRouter = createTRPCRouter({
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

      return ctx.prisma.customer.findMany({
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

  // Você pode manter seus resolvers atuais aqui
  list: baseProcedure.query(async ({ ctx }) => {
    return ctx.prisma.customer.findMany({
      include: { transactions: true }, // cuidado: pode ter BigInt
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
      return ctx.prisma.customer.create({ data: input });
    }),
});
