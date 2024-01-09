import { z } from "zod";
import { type UserRole } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { deleteImageFromBucket, uploadImage } from "@/server/func/uploadImage";

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
  updateTheme: protectedProcedure
    .input(z.object({ color: z.string(), image: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const path = await uploadImage(input.image, input.name);
      return await ctx.db.theme.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          image: path,
          color: input.color,
        },
      });
    }),
  updateOnlyColorTheme: protectedProcedure
    .input(z.object({ color: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.theme.updateMany({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          color: input.color,
        },
      });
    }),
  loadTheme: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.theme.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  /// Menu actions
  addCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const menu = await ctx.db.menu.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const category = await ctx.db.categorys.create({
        data: {
          name: input.name,
          menu: {
            connect: {
              id: menu?.id,
            },
          },
        },
      });
      return category;
    }),

  getCategorys: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.menu.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        categorys: true,
      },
    });
  }),
  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.categorys.delete({
        where: {
          id: input.id,
        },
      });
    }),

  /// dishes

  getCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.categorys.findUnique({
        where: {
          id: input.id,
        },
        include: {
          dish: true,
        },
      });

      type Dish = {
        id: string | null;
        name: string | null;
      };

      let dish: Dish[] = [];
      data?.dish.forEach((e) => {
        dish.push({
          id: e.id,
          name: e.name,
        });
      });
      const clientData = {
        id: data?.id,
        name: data?.name,
        menuId: data?.menuId,
        createdAt: data?.createdAt,
        dish: dish,
      };

      return clientData;
    }),

  addDish: protectedProcedure
    .input(z.object({ name: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.dish.create({
        data: {
          categorys: {
            connect: {
              id: input.id,
            },
          },
          name: input.name,
        },
      });
    }),

  deleteDish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.dish.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getDish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.dish.findUnique({
        where: {
          id: input.id,
        },
        include: {
          images: true,
        },
      });
      console.log(data);

      let dataForClient = {
        images: data?.images,
        id: data?.id,
        name: data?.name,
        description: data?.description?.toString("utf-8"),
        price: data?.price,
        categorysId: data?.categorysId,
        createdAt: data?.createdAt,
      };
      console.log(dataForClient);

      return dataForClient;
    }),
  updateDish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.dish.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: Buffer.from(input.description, "utf-8"),
          price: input.price,
        },
      });
      return { msg: 200 };
    }),
  updateDishWithPhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        image: z.string(),
        imageName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const findImage = await ctx.db.images.findFirst({
        where: {
          dishId: input.id,
        },
      });

      if (findImage) {
        await deleteImageFromBucket(findImage.path);
        const deleteImage = await ctx.db.images.deleteMany({
          where: {
            dishId: input.id,
          },
        });
      }

      const path = await uploadImage(input.image, input.imageName);

      const response = await ctx.db.dish.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: Buffer.from(input.description, "utf-8"),
          price: input.price,
          images: {
            create: {
              path: path,
            },
          },
        },
      });
      return { msg: 200 };
    }),
});
