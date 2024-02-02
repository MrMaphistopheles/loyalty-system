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

const TransactionSchema = z.object({
  actual_amount: z.string(),
  actual_currency: z.string(),
  additional_info: z.string(),
  amount: z.string(),
  approval_code: z.string(),
  card_bin: z.string(),
  card_type: z.string(),
  currency: z.string(),
  eci: z.string(),
  fee: z.string(),
  get_without_parameters: z.string(),
  masked_card: z.string(),
  merchant_data: z.string(),
  merchant_id: z.string(),
  order_id: z.string(),
  order_status: z.string(),
  order_time: z.string(),
  parent_order_id: z.string(),
  payment_id: z.string(),
  payment_system: z.string(),
  product_id: z.string(),
  rectoken: z.string(),
  rectoken_lifetime: z.string(),
  response_code: z.string(),
  response_description: z.string(),
  response_signature_string: z.string(),
  response_status: z.string(),
  reversal_amount: z.string(),
  rrn: z.string(),
  sender_account: z.string(),
  sender_cell_phone: z.string(),
  sender_email: z.string(),
  settlement_amount: z.string(),
  settlement_currency: z.string(),
  settlement_date: z.string(),
  signature: z.string(),
  tran_type: z.string(),
  verification_status: z.string(),
});

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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const paymentDetailsObj = {
        orderId: uuidv4(),
        orderDesc: `Чайові для ${input.waiterName}`,
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
          orderStatus: "in_process",
        },
      });
      console.log(tipDetails);

      return { redirectUrl: checkout_url };
    }),

  updatePaymentDetails: publicProcedure
    .input(TransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const findWaiter = await ctx.db.tips.findUnique({
        where: {
          orderId: input.order_id,
        },
      });

      const findTipsBlance = await ctx.db.tipBalance.findFirst({
        where: {
          userId: findWaiter?.userId,
        },
      });

      const tipBalanceUpdate = await ctx.db.tipBalance.updateMany({
        where: {
          userId: findWaiter?.userId,
        },
        data: {
          balance:
            findTipsBlance?.balance !== undefined
              ? findTipsBlance?.balance + parseInt(input.amount)
              : +0,
        },
      });

      return await ctx.db.tips.update({
        where: {
          orderId: input.order_id,
        },
        data: {
          orderStatus: input.order_status,
          transaction: {
            create: {
              actual_amount: input.actual_amount,
              actual_currency: input.actual_currency,
              additional_info: Buffer.from(input.additional_info, "utf-8"),
              amount: input.amount,
              approval_code: input.approval_code,
              card_bin: input.card_bin,
              card_type: input.card_type,
              currency: input.currency,
              eci: input.eci,
              fee: input.fee,
              get_without_parameters: input.get_without_parameters,
              masked_card: input.masked_card,
              merchant_data: input.merchant_data,
              merchant_id: input.merchant_id,
              order_id: input.order_id,
              order_status: input.order_status,
              order_time: input.order_time,
              parent_order_id: input.parent_order_id,
              payment_id: input.payment_id,
              payment_system: input.payment_system,
              product_id: input.product_id,
              rectoken: input.rectoken,
              rectoken_lifetime: input.rectoken_lifetime,
              response_code: input.response_code,
              response_description: input.response_description,
              response_signature_string: Buffer.from(
                input.response_signature_string,
                "utf-8",
              ),
              response_status: input.response_status,
              reversal_amount: input.reversal_amount,
              rrn: input.rrn,
              sender_account: input.sender_account,
              sender_cell_phone: input.sender_cell_phone,
              sender_email: input.sender_email,
              settlement_amount: input.settlement_amount,
              settlement_currency: input.settlement_currency,
              settlement_date: input.settlement_date,
              signature: input.signature,
              tran_type: input.tran_type,
              verification_status: input.verification_status,
            },
          },
        },
      });
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
