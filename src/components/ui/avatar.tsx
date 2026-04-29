export function Avatar({
  name,
  size = "md"
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizing = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";

  return (
    <div
      className={`${sizing} inline-flex items-center justify-center border-2 border-ink bg-[#fff9c4] font-heading font-bold text-ink`}
      style={{ borderRadius: "205px 18px 198px 20px / 18px 198px 20px 205px" }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
