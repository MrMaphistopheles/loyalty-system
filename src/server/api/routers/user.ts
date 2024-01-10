import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UserRole } from "@prisma/client";

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
});
