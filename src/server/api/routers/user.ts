import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { UserRole } from "@prisma/client";
import { Payment } from "@/server/func/paymant";
import { v4 as uuidv4, v4 } from "uuid";

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
  getUserData: protectedProcedure.query(async ({ ctx }) => {
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
  getCompany: protectedProcedure.query(async ({ ctx }) => {
    const company = await ctx.db.user.findMany({
      where: {
        role: "MANAGER",
      },
      include: {
        Theme: true,
        bonusSystem: true,
        created: true,
      },
    });

    let data: Data[] = [];
    company.forEach((e) => {
      data.push({
        id: e.id,
        email: e.email,
        name: e.name,
        image: e.Theme[0]?.image,
        created: e.created.map((i) => i.id),
      });
    });
    const arr = data.filter((i) => !i.created?.includes(ctx.session.user.id));
    return arr;
  }),
  addPass: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          bonusAcc: {
            create: {
              companyId: input.id,
            },
          },
          createdBy: {
            connect: {
              id: input.id,
            },
          },
        },
      });
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

  getRatesInfo: protectedProcedure.query(async ({ ctx }) => {
    const rates = await ctx.db.rate.findMany({
      where: {
        customarId: ctx.session.user.id,
      },
    });

    let ids: string[] = [];
    rates.forEach((e) => {
      ids.push(e.waiterId ? e.waiterId : "");
    });

    const waiter = await ctx.db.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    type Modified = {
      wId: string | null;
      name: string | null;
      image: string | null;
    };

    let modified: Modified[] = [];

    waiter.forEach((e) => {
      modified.push({
        wId: e.id,
        name: e.name,
        image: e.image,
      });
    });

    const data = rates.map((i) => {
      const match = modified.find((e) => e.wId === i.waiterId);
      if (match) {
        return {
          ...i,
          description: i.description?.toString("utf-8"),
          ...match,
        };
      }
    });
    return data;
  }),

  getRateInfo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rate = await ctx.db.rate.findUnique({
        where: {
          id: input.id,
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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const paymentDetailsObj = {
        orderId: uuidv4(),
        orderDesc: `Tip for ${input.waiterName}`,
        amount: input.amount,
        email: ctx.session.user.email,
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
          orderStatus: "in process",
        },
      });
      console.log(tipDetails);

      return { redirectUrl: checkout_url };
    }),

  updatePaymentDetails: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        orderStatus: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.tips.update({
        where: {
          orderId: input.orderId,
        },
        data: {
          orderStatus: input.orderStatus,
        },
      });
    }),
});
