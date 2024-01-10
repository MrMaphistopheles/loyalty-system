import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const waiterRouter = createTRPCRouter({
  scan: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            id: input.clientId,
          },
          include: {
            bonusAcc: true,
          },
        });

        const rate = await ctx.db.Rate.create({
          data: {
            customarId: input.clientId,
            waiterId: ctx.session.user.id,
          },
        });
        console.log(rate);

        const waiter = await ctx.db.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
          include: {
            createdBy: true,
          },
        });

        const companyId = waiter?.createdBy[0]?.id;

        const company = await ctx.db.user.findUnique({
          where: {
            id: companyId,
          },
          include: {
            bonusSystem: true,
          },
        });

        const giftFor = company?.bonusSystem[0]?.gift;

        const balance = user?.bonusAcc[0]?.balance
          ? user?.bonusAcc[0]?.balance
          : 0;

        let status: number = 500;

        if (giftFor !== undefined) {
          if (balance >= giftFor) {
            const bonusAcc = await ctx.db.bonusAcc.update({
              where: {
                id: user?.bonusAcc[0]?.id ?? "",
              },
              data: {
                balance: 0,
              },
            });
            const history = await ctx.db.purchaseHistory.create({
              data: {
                userId: ctx.session.user.id,
                bonusAccId: user?.bonusAcc[0]?.id,
                gotFree: "yes",
              },
            });
            //console.log(history);

            status = 200;
          } else if (balance < giftFor) {
            const bonusAcc = await ctx.db.bonusAcc.update({
              where: {
                id: user?.bonusAcc[0]?.id ?? "",
              },
              data: {
                balance: balance + 1,
              },
            });
            const history = await ctx.db.purchaseHistory.create({
              data: {
                userId: ctx.session.user.id,
                bonusAccId: user?.bonusAcc[0]?.id,
              },
            });
            //console.log(history);
            status = 201;
          }
        }
        return { status: status };
      } catch (error) {
        return error;
      }
    }),
});
