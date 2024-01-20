import { string, z } from "zod";

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

        const rate = await ctx.db.rate.create({
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

  getTips: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.tipBalance.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getTipsDataForChart: protectedProcedure
    .input(z.object({ days: z.number() }))
    .query(async ({ ctx, input }) => {
      const unixDate =
        Math.round(Date.now() / 1000) - input.days * 24 * 60 * 60;
      const date = new Date(unixDate * 1000);

      const tips = await ctx.db.tips.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: new Date(date),
          },
        },
      });
      const filteredByStatus = tips.filter((i) => i.orderStatus === "approved");

      let Data: { amount: number; createdAt: Date }[] = [];

      filteredByStatus.forEach((i) => {
        Data.push({
          amount: i.amount,
          createdAt: i.createdAt,
        });
      });
      /* type Item = { [date: string]: number[] };

      const groups: Item = Data.reduce((groups, amounts) => {
        const date: string = amounts.createdAt?.toDateString() ?? "";

        if (!groups[date as keyof Item]) {
          groups[date] = [];
        }

        groups[date as keyof Item].push(amounts.amount);
        return groups;
      }, {}); */

      type Item = { [date: string]: number[] };

      let groups: Item = {};

      for (const amounts of Data) {
        const date: string = amounts.createdAt?.toDateString() ?? "";

        if (!groups[date]) {
          groups[date] = [];
        }
        //@ts-ignore
        groups[date].push(amounts.amount);
      }

      console.log(groups);

      const groupArrays = Object.keys(groups).map((date) => {
        return {
          date,
          amount: groups[date],
        };
      });

      let chartData: { date: string; amount: number }[] = [];
      groupArrays.forEach((e) => {
        chartData.push({
          date: e.date,
          amount:
            e.amount !== undefined
              ? e.amount.reduce((prev, additional) => prev + additional, 0)
              : 0,
        });
      });

      return chartData;
    }),
});
