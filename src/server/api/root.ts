import { cartsRouter } from "./routers/carts";
import { exampleRouter } from "./routers/example";
import { productsRouter } from "./routers/products";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  products: productsRouter,
  carts: cartsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
