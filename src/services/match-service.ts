import { matchTable } from "@/mocks/db";

export async function confirmMatchResult(matchId: string, userId: string) {
  const match = matchTable.find((item) => item.id === matchId);
  if (!match) {
    return null;
  }

  if (!match.playerIds.includes(userId)) {
    match.playerIds.push(userId);
  }

  if (match.playerIds.length >= 2 && match.status === "SCHEDULED") {
    match.status = "COMPLETED";
  }

  return match;
}
