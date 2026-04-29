import type { SkillLevel } from "@/types/domain";

const skillOptions: Array<SkillLevel | "ALL"> = [
  "ALL",
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "PROFESSIONAL"
];

const timeOptions = [
  { label: "Any time", value: "ALL" },
  { label: "Next 24h", value: "UPCOMING_24H" },
  { label: "Next 7 days", value: "UPCOMING_7D" }
] as const;

export function FeedFilterForm({
  q,
  skill,
  time
}: {
  q: string;
  skill: SkillLevel | "ALL";
  time: "UPCOMING_24H" | "UPCOMING_7D" | "ALL";
}) {
  return (
    <form
      className="grid gap-3 border-[3px] border-ink bg-white p-4 shadow-sketch md:grid-cols-4"
      style={{ borderRadius: "225px 18px 210px 22px / 18px 210px 22px 225px" }}
    >
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder="Search location, description, host"
        className="sketch-input"
      />

      <select
        name="skill"
        defaultValue={skill}
        className="sketch-input"
      >
        {skillOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        name="time"
        defaultValue={time}
        className="sketch-input"
      >
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="min-h-12 border-[3px] border-ink bg-white px-4 py-2 text-lg text-ink shadow-sketch transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-marker hover:text-white hover:shadow-sketch-press active:translate-x-1 active:translate-y-1 active:shadow-none"
        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      >
        Apply filters
      </button>
    </form>
  );
}
