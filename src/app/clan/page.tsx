import { listClans } from "@/services/clan-service";
import type { Clan } from "@/types/domain";

export const dynamic = "force-dynamic";

function ClanCard({ clan }: { clan: Clan }) {
  return (
    <article
      className="sketch-card relative bg-white transition-transform duration-100 hover:-rotate-1"
      style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
    >
      <div className="pointer-events-none absolute -left-3 -top-2 h-10 w-10 rotate-[-10deg] border-2 border-ink bg-[#fff9c4]" />
      <h2 className="text-3xl font-bold text-ink">{clan.name}</h2>
      <p className="mt-2 text-lg text-ink/80">
        Owner ID: <span className="font-heading font-bold">{clan.ownerId}</span>
      </p>
      <div className="mt-5 flex items-center justify-between">
        <span
          className="inline-flex border-2 border-ink bg-mutedPaper px-3 py-1 text-lg text-ink"
          style={{ borderRadius: "180px 15px 160px 18px / 15px 160px 18px 180px" }}
        >
          Clan
        </span>
        <span className="text-lg text-ink/70">Demo members</span>
      </div>
    </article>
  );
}

export default async function ClanPage() {
  const clans = await listClans();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="space-y-6">
        <div className="sketch-card -rotate-[0.4deg]">
          <h1 className="sketch-section-title text-ink">Clans</h1>
          <p className="sketch-subtext mt-2 text-ink/80">4–5 demo clans generated for this show case.</p>
        </div>

        {clans.length === 0 ? (
          <div className="sketch-card rotate-[0.2deg] text-lg text-ink/80">
            No clans yet. Open <span className="font-heading font-bold text-ink">Dashboard</span> and run the
            demo seed.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {clans.map((c) => (
              <ClanCard key={c.id} clan={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
