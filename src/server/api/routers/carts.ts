import { z } from "zod";
import type { TCarts } from "../../../../types/response";
import type { TDetailCart } from "./../../../../types/response";

import { createTRPCRouter, publicProcedure } from "../trpc";

const LIMIT = 10;
const SKIP = 0;

export const cartsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllCarts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        // search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`https://dummyjson.com/carts`);
      url.searchParams.append("limit", `${input.limit ?? LIMIT}`);
      url.searchParams.append("skip", `${input.skip ?? SKIP}`);

      const cartsFetch = await fetch(url)
        .then((res) => res.json())
        .then((data: TCarts) => {
          return data;
        });

      const users = await Promise.all(
        cartsFetch.carts.map(async (cart) => {
          const user = await fetch(
            `https://dummyjson.com/users/${cart.userId}/`
          )
            .then((res) => res.json())
            .then(
              (data: { id: number; firstName: string; lastName: string }) => {
                return data;
              }
            );
          return user;
        })
      );

      cartsFetch.carts = cartsFetch.carts.map((cart, index) => {
        cart.user = users[index];
        return {
          ...cart,
        };
      });

      return cartsFetch;
    }),

  getSingleCart: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const cartsFetch = await fetch(`https://dummyjson.com/carts/${input.id}`)
        .then((res) => res.json())
        .then((data: TDetailCart) => {
          return data;
        });

      const user = await fetch(
        `https://dummyjson.com/users/${cartsFetch.userId}/`
      )
        .then((res) => res.json())
        .then((data: { id: number; firstName: string; lastName: string }) => {
          return data;
        });

      cartsFetch.user = user;

      return cartsFetch;
    }),
});
