import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ email: z.string().min(5), name: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
      const createdUser = await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          role: "MANAGER",
          bonusSystem: {
            create: {},
          },
          Theme: {
            create: {},
          },
          menu: {
            create: {},
          },
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return createdUser;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          created: true,
        },
      });

      let userIdArr = userId?.created
        .filter((i) => i.role === "WAITER")
        .map((i) => i.id);
      userIdArr?.push(input.id);

      const deleted = await ctx.db.user.deleteMany({
        where: {
          id: {
            in: userIdArr,
          },
        },
      });

      return deleted;
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        created: true,
      },
    });
  }),
});
