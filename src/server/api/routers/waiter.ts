import { number, string, z } from "zod";

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

      type Item = { [date: string]: number[] };

      const groups: Item = {};

      for (const amounts of Data) {
        const date: string = amounts.createdAt?.toDateString() || "";

        if (!groups[date]) {
          groups[date] = [];
        }

        groups[date]?.push(amounts.amount);
      }

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
  requestWithDraw: protectedProcedure
    .input(z.object({ amount: z.number(), accepted: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const withDraw = await ctx.db.withdraw.create({
        data: {
          amount: input.amount,
          accepted: input.accepted,
          userId: ctx.session.user.id,
        },
      });
      const reserved = await ctx.db.tipBalance.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          balance: 0,
          reserved: input.amount,
        },
      });
      return { withDraw, reserved };
    }),

  changeCardNum: protectedProcedure
    .input(z.object({ cardNum: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.tipBalance.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          card: input.cardNum,
        },
      });
    }),
  getWithDrawStatus: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.withdraw.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getRating: protectedProcedure.query(async ({ ctx }) => {
    const rating = await ctx.db.rate.findMany({
      where: {
        waiterId: ctx.session.user.id,
      },
    });

    const val = rating.map((i) => i.stars).reduce((a, b) => a + b, 0);
    const devided = val / rating.length;
    const value = devided.toString().slice(0, 4);
    const persenteg = (devided * 100) / 5;

    return { value, persenteg };
  }),

  getRatingDescription: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const rating = await ctx.db.rate.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          waiterId: ctx.session.user.id,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (rating.length > limit) {
        const nextItem = rating.pop();
        nextCursor = nextItem?.id;
      }

      let hasMore = true;
      if (nextCursor === undefined) {
        hasMore = false;
      }

      let items: {
        id: string;
        stars: number;
        desc: string;
      }[] = [];

      rating.forEach((e) => {
        items.push({
          id: e.id,
          stars: e.stars,
          desc: e.description?.toString("utf-8") ?? "",
        });
      });

      return { items, nextCursor, hasMore };
    }),
});
