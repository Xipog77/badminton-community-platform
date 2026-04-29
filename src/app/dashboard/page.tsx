import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listProducts } from "@/services/product-service";
import { listClans } from "@/services/clan-service";
import { matchTable, postTable } from "@/mocks/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("demo_user")?.value;
  if (!user) {
    redirect("/auth/sign-in");
  }

  const [products, clans] = await Promise.all([listProducts(), listClans()]);
  const matchCount = matchTable.length;
  const postCount = postTable.length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="space-y-6">
        <div className="sketch-card rotate-[0.3deg]">
          <h1 className="sketch-section-title text-ink">Dashboard</h1>
          <p className="sketch-subtext mt-2 text-ink/80">
            Welcome, <span className="font-heading font-bold text-ink">{user}</span>. This is a demo
            environment with static demo data (products, clans, and matches).
          </p>
          <p className="mt-2 text-lg text-ink/70">
            Current posts in feed: <span className="font-heading font-bold text-ink">{postCount}</span>
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="sketch-card bg-[#fff9c4] -rotate-[0.2deg]">
            <p className="text-lg text-ink/80">Marketplace templates</p>
            <p className="sketch-section-title mt-1 text-ink">{products.length}</p>
          </div>
          <div className="sketch-card rotate-[0.3deg]">
            <p className="text-lg text-ink/80">Clans</p>
            <p className="sketch-section-title mt-1 text-ink">{clans.length}</p>
          </div>
          <div className="sketch-card -rotate-[0.1deg]">
            <p className="text-lg text-ink/80">Match records</p>
            <p className="sketch-section-title mt-1 text-ink">{matchCount}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

