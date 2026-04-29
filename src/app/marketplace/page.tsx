import Image from "next/image";
import { listProducts } from "@/services/product-service";
import type { Product } from "@/types/domain";

export const dynamic = "force-dynamic";

function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className="relative border-[3px] border-ink bg-[#fff9c4] p-5 shadow-sketch transition-transform duration-100 hover:-rotate-1"
      style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-5 w-32 -translate-x-1/2 -translate-y-1 rotate-[2deg] bg-black/5" />

      <div className="relative h-44 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{
              objectFit: "cover",
              borderRadius: "210px 18px 198px 20px / 18px 198px 20px 210px"
            }}
          />
        ) : (
          <div className="h-full bg-white" />
        )}
      </div>

      <h2 className="mt-4 text-2xl font-bold text-ink">{product.name}</h2>
      <p className="mt-1 text-lg text-ink/80">${product.price}</p>
      <p className="mt-2 text-lg text-ink/80">{product.description}</p>

      <div className="mt-5 flex items-center justify-between">
        <span
          className="inline-flex border-2 border-ink bg-white px-3 py-1 text-lg text-ink"
          style={{ borderRadius: "180px 15px 160px 18px / 15px 160px 18px 180px" }}
        >
          Template
        </span>
        <span className="text-lg text-ink/70">Ready to sell</span>
      </div>
    </article>
  );
}

export default async function MarketplacePage() {
  const products = await listProducts();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="space-y-6">
        <div className="sketch-card -rotate-[0.4deg]">
          <h1 className="sketch-section-title text-ink">Marketplace</h1>
          <p className="sketch-subtext mt-2 text-ink/80">3 demo templates generated using your photo.</p>
        </div>

        {products.length === 0 ? (
          <div className="sketch-card rotate-[0.2deg] text-lg text-ink/80">
            No products yet. Open <span className="font-heading font-bold text-ink">Dashboard</span> and run
            the demo seed.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
