import { Avatar } from "@/components/ui/avatar";

interface AvatarGroupUser {
  id: string;
  name: string;
}

export function AvatarGroup({
  users,
  max = 4
}: {
  users: AvatarGroupUser[];
  max?: number;
}) {
  const visibleUsers = users.slice(0, max);
  const hiddenCount = Math.max(users.length - max, 0);

  return (
    <div className="flex items-center">
      {visibleUsers.map((user, index) => (
        <div key={user.id} className={index === 0 ? "" : "-ml-3"}>
          <Avatar name={user.name} size="sm" />
        </div>
      ))}
      {hiddenCount > 0 ? (
        <span
          className="-ml-3 inline-flex h-9 w-9 items-center justify-center border-2 border-ink bg-mutedPaper text-xs font-bold text-ink"
          style={{ borderRadius: "205px 18px 198px 20px / 18px 198px 20px 205px" }}
        >
          +{hiddenCount}
        </span>
      ) : null}
    </div>
  );
}
