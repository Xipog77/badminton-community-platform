import { NextResponse } from "next/server";
import { z } from "zod";
import { createProduct, listProducts } from "@/services/product-service";

const createProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  description: z.string().min(10),
  sellerId: z.string().optional()
});

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const product = await createProduct(parsed.data);
  return NextResponse.json({ data: product }, { status: 201 });
}
