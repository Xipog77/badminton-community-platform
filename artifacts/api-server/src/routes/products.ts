import { Router, type IRouter } from "express";
import {
  CreateProductBody,
  GetProductParams,
  GetProductResponse,
  ListProductsResponse,
} from "@workspace/api-zod";
import { mutate, newId, readAll, type StoredProduct } from "../lib/storage";

const router: IRouter = Router();

router.get("/products", async (_req, res): Promise<void> => {
  const products = await readAll("products");
  res.json(ListProductsResponse.parse(products));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const body = parsed.data;
  const product = await mutate("products", (products) => {
    const created: StoredProduct = {
      id: newId("i"),
      name: body.name,
      price: body.price,
      condition: body.condition,
      location: body.location,
      sellerName: body.sellerName,
      sellerAvatar: body.sellerAvatar,
      image: body.image,
      category: body.category,
    };
    return { next: [...products, created], result: created };
  });
  res.status(201).json(GetProductResponse.parse(product));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const products = await readAll("products");
  const product = products.find((p) => p.id === params.data.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(GetProductResponse.parse(product));
});

export default router;
