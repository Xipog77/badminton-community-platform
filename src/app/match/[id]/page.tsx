interface MatchDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <section className="sketch-card rotate-[0.5deg]">
        <h1 className="sketch-section-title text-ink">Match Detail</h1>
        <p className="sketch-subtext mt-2 text-ink/80">Match ID: {(await params).id}</p>
      </section>
    </main>
  );
}
