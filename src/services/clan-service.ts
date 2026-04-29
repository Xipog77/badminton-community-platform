import { clanTable, mockUsers } from "@/mocks/db";
import type { Clan } from "@/types/domain";

const createId = () => `clan_${Math.random().toString(36).slice(2, 10)}`;

export async function listClans(): Promise<Clan[]> {
  return clanTable;
}

export async function createClan(name: string, ownerId = mockUsers[0].id): Promise<Clan> {
  const clan: Clan = {
    id: createId(),
    name,
    ownerId,
    createdAt: new Date().toISOString()
  };
  clanTable.unshift(clan);
  return clan;
}
