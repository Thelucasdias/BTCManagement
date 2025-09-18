import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc";

export const customerRouter = createTRPCRouter({
  list: baseProcedure.query(async ({ ctx }) => {
    return ctx.prisma.customer.findMany({
      include: { transactions: true },
    });
  }),

  create: baseProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        cpf: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.customer.create({
        data: input,
      });
    }),
});
