import { promises as fs } from "node:fs";
import path from "node:path";
import { logger } from "./logger";

const DATA_DIR = path.resolve(process.cwd(), ".data");

// skillLevel: one of 'new', 'weak', 'average', 'good', 'very_good', 'pro'
export interface StoredUser {
  id: string;
  username: string;
  avatar: string;
  skillLevel: string;
}

// level: one of 'new', 'weak', 'average', 'good', 'very_good', 'pro'
export interface StoredPlayer {
  name: string;
  avatar: string;
  level: string;
  confirmed?: boolean;
}

export interface StoredMatch {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  date: string;
  time: string;
  location: string;
  court: string;
  skillLevel: string;
  playersJoined: number;
  playersNeeded: number;
  fee: number;
  status: string;
  description: string;
  players: StoredPlayer[];
}

export interface StoredJoinRequest {
  id: string;
  postId: string;
  username: string;
  status: "pending" | "accepted";
  createdAt: string;
}

export interface StoredProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  condition: string;
  location: string;
  sellerName: string;
  sellerAvatar: string;
  image: string;
  category: string;
  isNewArrival?: boolean;
  isOnSale?: boolean;
}

export interface StoredClan {
  id: string;
  name: string;
  members: number;
  location: string;
  level: string;
  description: string;
  image: string;
  tags: string[];
  memberNames: string[];
}

interface SeedData {
  users: StoredUser[];
  posts: StoredMatch[];
  joinRequests: StoredJoinRequest[];
  matches: StoredMatch[];
  products: StoredProduct[];
  clans: StoredClan[];
}

const SEED: SeedData = {
  users: [
    { id: "u1", username: "Marcus", avatar: "/avatar1.png", skillLevel: "Advanced" },
    { id: "u2", username: "Sarah", avatar: "/avatar2.png", skillLevel: "Intermediate" },
  ],
  posts: [
    {
      id: "m3",
      title: "Advanced Singles Practice",
      hostName: "Marcus T.",
      hostAvatar: "/avatar1.png",
      date: "2024-10-24",
      time: "18:00",
      location: "Elite Sports Arena",
      court: "Court 4",
      skillLevel: "Intermediate",
      playersJoined: 2,
      playersNeeded: 4,
      fee: 12,
      status: "Open",
      description:
        "Looking for 2 competitive players to join a high-intensity singles practice session.",
      players: [
        { name: "Marcus T.", avatar: "/avatar1.png", level: "Advanced" },
        { name: "Sarah C.", avatar: "/avatar2.png", level: "Intermediate" },
      ],
    },
    {
      id: "m4",
      title: "Sunday Doubles Open",
      hostName: "David K.",
      hostAvatar: "/avatar1.png",
      date: "2024-11-03",
      time: "10:00",
      location: "Riverside Sports Hall",
      court: "Court 2",
      skillLevel: "Beginner",
      playersJoined: 1,
      playersNeeded: 4,
      fee: 8,
      status: "Open",
      description: "Casual doubles - all welcome.",
      players: [
        { name: "David K.", avatar: "/avatar1.png", level: "Beginner" },
      ],
    },
  ],
  joinRequests: [],
  matches: [
    {
      id: "m1",
      title: "Friday Morning Smash - Singles",
      hostName: "Marcus Chen",
      hostAvatar: "/avatar1.png",
      date: "2024-10-12",
      time: "09:00 AM",
      location: "Active Arena",
      court: "Court 4",
      skillLevel: "Advanced",
      playersJoined: 2,
      playersNeeded: 2,
      fee: 12,
      status: "Completed",
      description: "High intensity singles practice.",
      players: [
        { name: "Marcus Chen", avatar: "/avatar1.png", level: "Advanced", confirmed: true },
        { name: "David Tan", avatar: "/avatar1.png", level: "Advanced", confirmed: true },
      ],
    },
    {
      id: "m2",
      title: "Corporate Cup Finals - Doubles",
      hostName: "Sarah Jenkins",
      hostAvatar: "/avatar2.png",
      date: "2024-10-08",
      time: "07:30 PM",
      location: "Grand Hall Sports Complex",
      court: "Court 1",
      skillLevel: "Advanced",
      playersJoined: 4,
      playersNeeded: 4,
      fee: 15,
      status: "Completed",
      description: "Competitive doubles match.",
      players: [
        { name: "Sarah Jenkins", avatar: "/avatar2.png", level: "Advanced", confirmed: true },
      ],
    },
  ],
  products: [
    {
      id: "i1",
      name: "Yonex Astrox 88D Pro",
      price: 219,
      originalPrice: 259,
      condition: "Like New",
      location: "London, UK",
      sellerName: "David K.",
      sellerAvatar: "/avatar1.png",
      image: "/racket1.png",
      category: "Rackets",
      isNewArrival: true,
    },
    {
      id: "i2",
      name: "Victor SH-P9200",
      price: 145,
      condition: "New",
      location: "London, UK",
      sellerName: "Sarah L.",
      sellerAvatar: "/avatar2.png",
      image: "/shoes1.png",
      category: "Shoes",
    },
    {
      id: "i3",
      name: "Yonex AS-30 Tube (12)",
      price: 32,
      condition: "New",
      location: "Online",
      sellerName: "Smash Pro Shop",
      sellerAvatar: "/avatar1.png",
      image: "/shuttlecocks1.png",
      category: "Shuttlecocks",
      isOnSale: true,
    },
  ],
  clans: [
    {
      id: "c1",
      name: "Olympic Smashers Elite",
      members: 42,
      location: "Seattle National Center",
      level: "Elite Level",
      description:
        "The most competitive clan in North London. High-intensity drills and league matches every Tuesday.",
      image: "/clan1.png",
      tags: ["TRENDING", "PRO LEVEL"],
      memberNames: ["Marcus", "Sarah", "David"],
    },
    {
      id: "c2",
      name: "Court Kings",
      members: 42,
      location: "Central District",
      level: "Social",
      description: "Casual games and social meetups.",
      image: "/clan2.png",
      tags: ["SOCIAL", "BEGINNER FRIENDLY"],
      memberNames: ["Alex", "Jamie"],
    },
    {
      id: "c3",
      name: "Shuttle Rockets",
      members: 128,
      location: "East Side",
      level: "Intermediate",
      description:
        "A diverse community of badminton enthusiasts focusing on improving technique.",
      image: "/clan2.png",
      tags: ["LARGE GROUP", "DAILY GAMES"],
      memberNames: ["Priya", "Tom", "Mei"],
    },
  ],
};

type FileMap = {
  users: StoredUser[];
  posts: StoredMatch[];
  joinRequests: StoredJoinRequest[];
  matches: StoredMatch[];
  products: StoredProduct[];
  clans: StoredClan[];
};

type FileKey = keyof FileMap;

const writeLocks = new Map<FileKey, Promise<unknown>>();

function filePath(key: FileKey): string {
  return path.join(DATA_DIR, `${key}.json`);
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readFileOrSeed<K extends FileKey>(key: K): Promise<FileMap[K]> {
  await ensureDir();
  const fp = filePath(key);
  try {
    const raw = await fs.readFile(fp, "utf-8");
    return JSON.parse(raw) as FileMap[K];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const seed = SEED[key] as FileMap[K];
    await fs.writeFile(fp, JSON.stringify(seed, null, 2), "utf-8");
    logger.info({ file: key }, "Seeded data file");
    return seed;
  }
}

export async function readAll<K extends FileKey>(key: K): Promise<FileMap[K]> {
  return readFileOrSeed(key);
}

export async function writeAll<K extends FileKey>(
  key: K,
  data: FileMap[K],
): Promise<void> {
  await ensureDir();
  await fs.writeFile(filePath(key), JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Serialize read-modify-write operations per file to avoid lost updates
 * when concurrent requests touch the same JSON file.
 */
export async function mutate<K extends FileKey, R>(
  key: K,
  fn: (current: FileMap[K]) => Promise<{ next: FileMap[K]; result: R }> | { next: FileMap[K]; result: R },
): Promise<R> {
  const previous = writeLocks.get(key) ?? Promise.resolve();
  const run = previous.then(async () => {
    const current = await readAll(key);
    const { next, result } = await fn(current);
    await writeAll(key, next);
    return result;
  });
  writeLocks.set(
    key,
    run.catch(() => undefined),
  );
  return run;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function ensureSeeded(): Promise<void> {
  await Promise.all(
    (Object.keys(SEED) as FileKey[]).map((k) => readFileOrSeed(k)),
  );
}
