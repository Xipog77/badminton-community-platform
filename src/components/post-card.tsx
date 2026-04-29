import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MatchPost } from "@/types/domain";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(iso));

export function PostCard({ post }: { post: MatchPost }) {
  const remainingSlots = post.slots - post.filledSlots;

  return (
    <article
      className="border-[3px] border-ink bg-white p-5 shadow-sketch transition-transform duration-100 hover:-rotate-1"
      style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={post.owner.name} />
          <div>
            <p className="font-heading text-xl font-bold text-ink">{post.owner.name}</p>
            <p className="text-sm text-ink/70">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <Badge label={post.status} variant={post.status} />
      </div>

      <div className="mt-4 space-y-2 text-lg text-ink">
        <p>
          <span className="font-heading text-xl font-bold text-ink">Time:</span>{" "}
          {formatDate(post.scheduledAt)}
        </p>
        <p>
          <span className="font-heading text-xl font-bold text-ink">Location:</span> {post.location}
        </p>
        <p>{post.description}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge label={post.skillLevel} variant={post.skillLevel} />
        <span
          className="inline-flex border-2 border-ink bg-mutedPaper px-2.5 py-1 text-sm text-ink"
          style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
        >
          Slots {post.filledSlots}/{post.slots}
        </span>
        <span
          className="inline-flex border-2 border-ink bg-mutedPaper px-2.5 py-1 text-sm text-ink"
          style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
        >
          Remaining {remainingSlots}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Link
          href={`/post/${post.id}`}
          className="text-lg text-pen underline decoration-dashed underline-offset-4 hover:text-marker"
        >
          View details
        </Link>
        <Button variant={post.status === "FULL" ? "pending" : "default"}>Join match</Button>
      </div>
    </article>
  );
}
