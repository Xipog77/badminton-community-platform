import { mockUsers, productTable } from "@/mocks/db";
import type { Product } from "@/types/domain";

const createId = () => `product_${Math.random().toString(36).slice(2, 10)}`;

export async function listProducts(): Promise<Product[]> {
  return productTable;
}

export async function createProduct(input: {
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  sellerId?: string;
}): Promise<Product> {
  const product: Product = {
    id: createId(),
    name: input.name,
    price: input.price,
    imageUrl: input.imageUrl,
    description: input.description,
    sellerId: input.sellerId ?? mockUsers[0].id,
    createdAt: new Date().toISOString()
  };

  productTable.unshift(product);
  return product;
}
