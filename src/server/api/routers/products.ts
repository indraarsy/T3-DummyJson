import { z } from "zod";
import type { TProducts } from "./../../../../types/response";

import { createTRPCRouter, publicProcedure } from "../trpc";

const LIMIT = 10;
const SKIP = 0;
const SEARCH = "";

export const productsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        search: z.string().optional(),
        min: z.number(),
        max: z.number(),
      })
    )
    .query(async ({ input }) => {
      let url;
      if (input.search) {
        url = new URL(`https://dummyjson.com/products/search`);
        url.searchParams.append("q", `${input.search ?? SEARCH}`);
      } else {
        url = new URL(`https://dummyjson.com/products`);
        url.searchParams.append("limit", `${input.limit ?? LIMIT}`);
        url.searchParams.append("skip", `${input.skip ?? SKIP}`);
      }

      const productsFetch = await fetch(url)
        .then((res) => res.json())
        .then((data: TProducts) => {
          return data;
        });

      const allProducts = await fetch(
        "https://dummyjson.com/products?limit=100"
      )
        .then((res) => res.json())
        .then((data: TProducts) => {
          return data;
        });

      // get all brand names from products
      const brands = allProducts.products.map((product) => product.brand);

      // remove duplicates
      const uniqueBrands = [...new Set(brands)];

      productsFetch.brands = uniqueBrands;

      if (input.min && input.max) {
        const filterPrice = productsFetch.products.filter((product) => {
          return product.price >= input.min && product.price <= input.max;
        });

        productsFetch.products = filterPrice;
      }

      return productsFetch;
    }),

  getProductsByCategory: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
        category: z.string(),
        search: z.string().optional(),
        brand: z.string().optional(),
        min: z.number(),
        max: z.number(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(
        `https://dummyjson.com/products/category/${input.category}`
      );
      url.searchParams.append("limit", `${input.limit ?? LIMIT}`);
      url.searchParams.append("skip", `${input.skip ?? SKIP}`);

      const productsFetch = await fetch(url)
        .then((res) => res.json())
        .then((data: TProducts) => {
          return data;
        });

      if (input.brand) {
        const filterBrand = productsFetch.products.filter((product) =>
          product.brand
            .toLowerCase()
            .includes(input?.brand?.toLowerCase() || "")
        );
        productsFetch.products = filterBrand;
      }

      if (input.search) {
        const filterSearch = productsFetch.products.filter((product) =>
          product.title
            .toLowerCase()
            .includes(input?.search?.toLowerCase() || "")
        );

        productsFetch.products = filterSearch;
      }

      if (input.min && input.max) {
        const filterPrice = productsFetch.products.filter((product) => {
          return product.price >= input.min && product.price <= input.max;
        });

        productsFetch.products = filterPrice;
      }

      return productsFetch;
    }),

  getProductsByBrand: publicProcedure
    .input(
      z.object({
        brand: z.string(),
        limit: z.number().optional(),
        skip: z.number().optional(),
        search: z.string().optional(),
        category: z.string().optional().nullish(),
        min: z.number(),
        max: z.number(),
      })
    )
    .query(async ({ input }) => {
      const url = new URL(`https://dummyjson.com/products`);
      url.searchParams.append("limit", `${input.limit ?? LIMIT}`);
      url.searchParams.append("skip", `${input.skip ?? SKIP}`);

      const productsFetch = await fetch(url)
        .then((res) => res.json())
        .then((data: TProducts) => {
          return data;
        });

      const filterBrand = productsFetch.products.filter((product) =>
        product.brand.toLowerCase().includes(input?.brand?.toLowerCase() || "")
      );

      productsFetch.products = filterBrand;

      if (input.category) {
        const filterCategory = productsFetch.products.filter((product) =>
          product.category
            .toLowerCase()
            .includes(input?.category?.toLowerCase() || "")
        );

        productsFetch.products = filterCategory;
      }

      if (input.search) {
        const filterSearch = productsFetch.products.filter((product) =>
          product.title
            .toLowerCase()
            .includes(input?.search?.toLowerCase() || "")
        );

        productsFetch.products = filterSearch;
      }

      if (input.min && input.max) {
        const filterPrice = productsFetch.products.filter((product) => {
          return product.price >= input.min && product.price <= input.max;
        });

        productsFetch.products = filterPrice;
      }

      return productsFetch;
    }),

  getAllCategories: publicProcedure.query(async () => {
    const categoriesFetch = await fetch(
      "https://dummyjson.com/products/categories"
    )
      .then((res) => res.json())
      .then((data: string[]) => {
        return data;
      });

    return categoriesFetch;
  }),

  getSingleProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const productFetch = await fetch(
        `https://dummyjson.com/products/${input.id}`
      )
        .then((res) => res.json())
        .then((data: TProducts) => {
          return data;
        });

      return productFetch;
    }),

  searchProduct: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      {
        const productFetch = await fetch(
          `https://dummyjson.com/products?q=${input.query}`
        )
          .then((res) => res.json())
          .then((data: TProducts) => {
            return data;
          });

        return productFetch;
      }
    }),
});
