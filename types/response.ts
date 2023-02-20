export type TProducts = {
  products: TDetailProduct[];
  total: number;
  skip: number;
  limit: number;
  brands?: string[];
};

export type TDetailProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  quantity?: number;
};

export type TCarts = {
  carts: TDetailCart[];
  total: number;
  skip: number;
  limit: number;
};

export type TDetailCart = {
  user:
    | {
        id: number;
        firstName: string;
        lastName: string;
      }
    | undefined;
  id: number;
  products: TDetailProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  userId: number;
};
