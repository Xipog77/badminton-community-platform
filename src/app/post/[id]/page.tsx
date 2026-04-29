import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPostById } from "@/services/post-service";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(iso));

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <section className="sketch-card -rotate-[0.5deg]">
        <h1 className="sketch-section-title text-ink">Post Detail</h1>
        <p className="sketch-subtext mt-2 text-ink/80">{post.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge label={post.skillLevel} variant={post.skillLevel} />
          <Badge label={post.status} variant={post.status} />
        </div>

        <div className="mt-4 space-y-2 text-lg text-ink">
          <p>
            <span className="font-heading text-xl font-bold">Time:</span> {formatDate(post.scheduledAt)}
          </p>
          <p>
            <span className="font-heading text-xl font-bold">Location:</span> {post.location}
          </p>
          <p>
            <span className="font-heading text-xl font-bold">Slots:</span> {post.filledSlots}/{post.slots}
          </p>
        </div>
      </section>
    </main>
  );
}
