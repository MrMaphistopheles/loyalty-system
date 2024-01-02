import { adminRouter } from "@/server/api/routers/admin";
import { managerRouter } from "@/server/api/routers/manager";

import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { waiterRouter } from "./routers/waiter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  manager: managerRouter,
  user: userRouter,
  waiter: waiterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
