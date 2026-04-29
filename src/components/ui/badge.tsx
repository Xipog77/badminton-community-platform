import type { PostStatus, SkillLevel } from "@/types/domain";

type BadgeVariant = SkillLevel | PostStatus;

const styleByVariant: Record<BadgeVariant, string> = {
  BEGINNER: "bg-white text-ink",
  INTERMEDIATE: "bg-mutedPaper text-ink",
  ADVANCED: "bg-[#fff9c4] text-ink",
  PROFESSIONAL: "bg-pen text-white",
  OPEN: "bg-[#fff9c4] text-ink",
  FULL: "bg-marker text-white",
  CLOSED: "bg-mutedPaper text-ink",
  CANCELLED: "bg-ink text-white"
};

export function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span
      className={`inline-flex border-2 border-ink px-2.5 py-1 text-sm ${styleByVariant[variant]}`}
      style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
    >
      {label}
    </span>
  );
}
