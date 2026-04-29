import { FeedFilterForm } from "@/components/feed-filter-form";
import { PostCard } from "@/components/post-card";
import { getPosts } from "@/services/post-service";
import type { SkillLevel } from "@/types/domain";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams?: Promise<{
    q?: string;
    skill?: SkillLevel | "ALL";
    time?: "UPCOMING_24H" | "UPCOMING_7D" | "ALL";
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sp = (await searchParams) ?? {};
  const q = sp.q ?? "";
  const skill = sp.skill ?? "ALL";
  const time = sp.time ?? "ALL";
  const posts = await getPosts({ q, skillLevel: skill, time });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="space-y-6">
        <section className="relative">
          <h1 className="sketch-section-title -rotate-1 text-ink">Match Feed</h1>
          <p className="sketch-subtext mt-1 max-w-2xl -rotate-[0.5deg] text-ink/80">
            Discover badminton sessions and send join requests.
          </p>
          <span className="absolute -right-2 -top-2 hidden h-7 w-7 animate-bob border-2 border-ink bg-[#fff9c4] md:block" style={{ borderRadius: "205px 18px 198px 20px / 18px 198px 20px 205px" }} />
        </section>

        <FeedFilterForm q={q} skill={skill} time={time} />

        <section className="grid gap-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div
              className="border-[3px] border-dashed border-ink bg-white p-8 text-center text-lg text-ink/80"
              style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
            >
              No posts match your current filters.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
