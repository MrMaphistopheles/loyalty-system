import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { UserRole } from "@prisma/client";
import { Payment } from "@/server/func/paymant";
import { v4 as uuidv4 } from "uuid";

type Data = {
  id: string | null;
  email: string | null;
  name: string | null;
  image: string | null | undefined;
  created: string[] | null;
};

type BonusSystem = {
  id: string;
  gift: number;
  userId: string | null;
  createdAt: Date;
}[];
type THEME = {
  id: string;
  color: string;
  image: string | null;
  userId: string;
  createdAt: Date;
}[];

export type Dishes = {
  id: string;
  name: string;
  price: number | null;
  categorysId: string | null;
  image: string | undefined;
  description: string | undefined;
};

export type UserPasses = {
  bonusSystem: BonusSystem;
  Theme: THEME;
  email: string;
  emailVerified: string | null;
  id: string;
  image: string;
  name: string;
  points: number | null;
  role: UserRole;
};

export type Res = {
  id: string;
  stars: number;
  description: string | undefined;
  customarId: string;
  waiterId: string | null;
};

export const userRouter = createTRPCRouter({
  getUserData: protectedProcedure
    //.input(z.object({ key: z.string() }))
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          bonusAcc: true,
        },
      });

      let companyId: string[] = [];
      if (user && user.bonusAcc) {
        companyId = user.bonusAcc.map((i) =>
          i.companyId !== null ? i.companyId : "",
        );
      } else {
        companyId = [];
      }

      const companyAcc = await ctx.db.user.findMany({
        where: {
          id: {
            in: companyId,
          },
        },
        include: {
          Theme: true,
          bonusSystem: true,
        },
      });

      const data = companyAcc.map((i) => {
        const match = user?.bonusAcc.find((f) => f.companyId === i.id);
        if (match) {
          return { ...i, ...{ points: match.balance } };
        } else {
          return companyAcc;
        }
      });

      return data;
    }),

  getUserDataT: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const getComapnyId = await ctx.db.company_url.findFirst({
        where: {
          path_key: input.key,
        },
      });

      const getBonusAcc = await ctx.db.bonusAcc.findFirst({
        where: {
          companyId: getComapnyId?.userId,
          userId: ctx.session.user.id,
        },
      });

      const companyAcc = await ctx.db.user.findFirst({
        where: {
          id: getComapnyId?.userId,
        },
        include: {
          Theme: true,
          bonusSystem: true,
        },
      });

      const data = [{ points: getBonusAcc?.balance, ...companyAcc }];

      return data;
    }),

  getCategorys: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          menu: true,
        },
      });
      return await ctx.db.menu.findUnique({
        where: {
          id: user?.menu[0]?.id,
        },
        include: {
          categorys: true,
        },
      });
    }),

  getDishes: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const dish = await ctx.db.dish.findMany({
        where: {
          categorysId: input.id,
        },
        include: {
          images: true,
        },
      });

      let dishes: Dishes[] = [];
      dish.forEach((e) => {
        dishes.push({
          id: e.id,
          name: e.name,
          price: e.price,
          categorysId: e.categorysId,
          description: e.description?.toString("utf-8"),
          image: e.images[0]?.path,
        });
      });
      return dishes;
    }),

  getRates: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.rate.findMany({
      where: {
        customarId: ctx.session.user.id,
      },
    });

    let data: Res[] = [];
    res.forEach((e) => {
      data.push({
        id: e.id,
        stars: e.stars,
        description: e.description?.toString("utf-8"),
        customarId: e.customarId,
        waiterId: e.waiterId,
      });
    });

    return data;
  }),

  getRatesList: protectedProcedure
    .input(
      z.object({
        companyKey: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, companyKey } = input;

      const cId = await ctx.db.company_url.findFirst({
        where: {
          path_key: companyKey,
        },
        select: {
          userId: true,
        },
      });

      const waiter = await ctx.db.user.findUnique({
        where: {
          id: cId?.userId,
        },
        select: {
          created: {
            where: {
              role: "WAITER",
            },
          },
        },
      });

      const wId = waiter?.created.map((i) => i.id);

      const waiteData = waiter?.created.map((i) => {
        return {
          wId: i.id,
          image: i.image,
          name: i.name,
        };
      });

      const rate = await ctx.db.rate.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          waiterId: {
            in: wId,
          },
        },
      });

      const items = rate.map((i) => {
        const mutch = waiteData?.find((e) => e.wId === i.waiterId);

        if (mutch) {
          return {
            ...i,
            description: i.description?.toString("utf-8") ?? "",
            name: mutch.name,
            image: mutch.image,
          };
        }
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (rate.length > limit) {
        const nextItem = rate.pop();
        nextCursor = nextItem?.id;
      }

      let hasMore = true;
      if (nextCursor === undefined) {
        hasMore = false;
      }

      return { items, nextCursor, hasMore };
    }),

  getRateInfo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rate = await ctx.db.rate.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tips: true,
        },
      });

      const waiter = await ctx.db.user.findUnique({
        where: {
          id: rate?.waiterId ?? "",
        },
      });

      let data = [
        {
          ...rate,
          description: rate?.description?.toString("utf-8"),
          name: waiter?.name,
          image: waiter?.image,
        },
      ];

      return data;
    }),

  updateRate: protectedProcedure
    .input(
      z.object({ id: z.string(), stars: z.number(), description: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.rate.update({
        where: {
          id: input.id,
        },
        data: {
          stars: input.stars,
          description: Buffer.from(input.description, "utf-8"),
        },
      });
      return { ...res, description: res.description?.toString("utf-8") };
    }),

  payment: protectedProcedure
    .input(
      z.object({
        rateId: z.string(),
        waiterId: z.string(),
        customarId: z.string().optional(),
        amount: z.number(),
        waiterName: z.string(),
        company: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const paymentDetailsObj = {
        orderId: uuidv4(),
        orderDesc: `Чайові для ${input.waiterName}`,
        amount: input.amount,
        email: ctx.session.user.email,
        pathKey: input.company,
      };

      const { checkout_url, payment_id, response_status } =
        await Payment(paymentDetailsObj);

      const tipDetails = await ctx.db.tips.create({
        data: {
          orderId: paymentDetailsObj.orderId,
          orderDesc: paymentDetailsObj.orderDesc,
          amount: input.amount,
          payment_id: payment_id,
          customarId: ctx.session.user.id,
          rateId: input.rateId,
          userId: input.waiterId,
          orderStatus: "in_process",
        },
      });

      return { redirectUrl: checkout_url };
    }),

  autoCreateBonusAcc: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pathKey = await ctx.db.company_url.findFirst({
        where: {
          path_key: input.key,
        },
      });

      const bonusAcc = await ctx.db.bonusAcc.findFirst({
        where: {
          userId: ctx.session.user.id,
          companyId: pathKey?.userId,
        },
      });

      if (bonusAcc) return { msg: "this account exist" };

      return await ctx.db.bonusAcc.create({
        data: {
          userId: ctx.session.user.id,
          companyId: pathKey?.userId,
        },
      });
    }),
});
