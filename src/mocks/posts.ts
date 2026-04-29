import type { MatchPost } from "@/types/domain";

const base = Date.now();
const inHours = (h: number) => new Date(base + h * 60 * 60 * 1000).toISOString();
const createdDaysAgo = (d: number) => new Date(base - d * 24 * 60 * 60 * 1000).toISOString();

export const mockPosts: MatchPost[] = [
  {
    id: "post_1",
    owner: {
      id: "user_1",
      name: "Nhat Tran",
      email: "nhat@example.com",
      avatarUrl: "",
      skillLevel: "INTERMEDIATE"
    },
    scheduledAt: inHours(10),
    location: "District 1 Sports Center",
    skillLevel: "INTERMEDIATE",
    slots: 4,
    filledSlots: 2,
    description: "Looking for friendly doubles match after work.",
    status: "OPEN",
    createdAt: createdDaysAgo(1)
  },
  {
    id: "post_2",
    owner: {
      id: "user_2",
      name: "Linh Pham",
      email: "linh@example.com",
      avatarUrl: "",
      skillLevel: "BEGINNER"
    },
    scheduledAt: inHours(30),
    location: "Binh Thanh Arena",
    skillLevel: "BEGINNER",
    slots: 6,
    filledSlots: 6,
    description: "Weekend morning game, beginner-friendly and casual pace.",
    status: "FULL",
    createdAt: createdDaysAgo(2)
  },
  {
    id: "post_3",
    owner: {
      id: "user_3",
      name: "Duc Nguyen",
      email: "duc@example.com",
      avatarUrl: "",
      skillLevel: "ADVANCED"
    },
    scheduledAt: inHours(54),
    location: "Thu Duc Gym",
    skillLevel: "ADVANCED",
    slots: 4,
    filledSlots: 1,
    description: "Competitive training match. Bring your own shuttles.",
    status: "OPEN",
    createdAt: createdDaysAgo(3)
  },
  {
    id: "post_4",
    owner: {
      id: "user_1",
      name: "Nhat Tran",
      email: "nhat@example.com",
      avatarUrl: "",
      skillLevel: "INTERMEDIATE"
    },
    scheduledAt: inHours(18),
    location: "Cau Giay Badminton Hall",
    skillLevel: "INTERMEDIATE",
    slots: 8,
    filledSlots: 5,
    description: "Social evening game with rotation every 20 minutes. Everyone welcome.",
    status: "OPEN",
    createdAt: createdDaysAgo(0.5)
  },
  {
    id: "post_5",
    owner: {
      id: "user_2",
      name: "Linh Pham",
      email: "linh@example.com",
      avatarUrl: "",
      skillLevel: "BEGINNER"
    },
    scheduledAt: inHours(42),
    location: "Tan Binh Community Court",
    skillLevel: "BEGINNER",
    slots: 4,
    filledSlots: 3,
    description: "Casual rally session. Soft clears, friendly rallies, and quick resets.",
    status: "OPEN",
    createdAt: createdDaysAgo(1.4)
  },
  {
    id: "post_6",
    owner: {
      id: "user_3",
      name: "Duc Nguyen",
      email: "duc@example.com",
      avatarUrl: "",
      skillLevel: "ADVANCED"
    },
    scheduledAt: inHours(72),
    location: "Hai Ba Trung Sports Zone",
    skillLevel: "ADVANCED",
    slots: 6,
    filledSlots: 6,
    description: "Smash and clear drills then a short competitive set. Spots are limited.",
    status: "FULL",
    createdAt: createdDaysAgo(2.2)
  },
  {
    id: "post_7",
    owner: {
      id: "user_1",
      name: "Nhat Tran",
      email: "nhat@example.com",
      avatarUrl: "",
      skillLevel: "INTERMEDIATE"
    },
    scheduledAt: inHours(96),
    location: "District 1 Sports Center",
    skillLevel: "INTERMEDIATE",
    slots: 4,
    filledSlots: 2,
    description: "Footwork-focused drills, followed by doubles games with balanced pairs.",
    status: "OPEN",
    createdAt: createdDaysAgo(4)
  },
  {
    id: "post_8",
    owner: {
      id: "user_2",
      name: "Linh Pham",
      email: "linh@example.com",
      avatarUrl: "",
      skillLevel: "BEGINNER"
    },
    scheduledAt: inHours(120),
    location: "Thu Duc Gym",
    skillLevel: "BEGINNER",
    slots: 6,
    filledSlots: 4,
    description: "Beginner-friendly doubles. We'll teach basic rotations and serve patterns.",
    status: "OPEN",
    createdAt: createdDaysAgo(2.8)
  },
  {
    id: "post_9",
    owner: {
      id: "user_3",
      name: "Duc Nguyen",
      email: "duc@example.com",
      avatarUrl: "",
      skillLevel: "ADVANCED"
    },
    scheduledAt: inHours(140),
    location: "Binh Thanh Arena",
    skillLevel: "ADVANCED",
    slots: 8,
    filledSlots: 7,
    description: "Competitive night: structured points, quick coaching, and fast rallies.",
    status: "OPEN",
    createdAt: createdDaysAgo(1.1)
  },
  {
    id: "post_10",
    owner: {
      id: "user_1",
      name: "Nhat Tran",
      email: "nhat@example.com",
      avatarUrl: "",
      skillLevel: "INTERMEDIATE"
    },
    scheduledAt: inHours(8),
    location: "Cau Giay Badminton Hall",
    skillLevel: "INTERMEDIATE",
    slots: 4,
    filledSlots: 4,
    description: "Quick doubles session for tonight. Full team already booked.",
    status: "FULL",
    createdAt: createdDaysAgo(0.2)
  }
];
