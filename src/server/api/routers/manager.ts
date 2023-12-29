import { z } from "zod";
import { type UserRole } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export type Created =
  | {
      id: string;
      name: string | null;
      email: string | null;
      emailVerified: Date | null;
      image: string | null;
      role: UserRole | null;
      createdAt: Date;
    }[]
  | undefined;

type Data = {
  created: Created;
  createdAt: Date | null;
  email: string | null;
  emailVerified: Date | null;
  id: string | null;
  image: string | null;
  name: string | null;
  role: UserRole | null;
};

export const managerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ email: z.string().min(5), name: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
      const createdUser = await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          role: "WAITER",
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
      const deleted = await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      return deleted;
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        created: true,
      },
    });

    const filtered = user[0]?.created.filter((i) => i.role === "WAITER");

    let data: Data[] = [];

    user.forEach((e) => {
      data.push({
        created: filtered,
        createdAt: e.createdAt,
        email: e.email,
        emailVerified: e.emailVerified,
        id: e.id,
        image: e.image,
        name: e.name,
        role: e.role,
      });
    });
    return data;
  }),
  getGiftOn: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.bonusSystem.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  updateGift: protectedProcedure
    .input(z.object({ select: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.bonusSystem.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          gift: input.select,
        },
      });
    }),
  createClientUser: publicProcedure
    .input(z.object({ email: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.create({
        data: {
          email: input.email,
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
});
