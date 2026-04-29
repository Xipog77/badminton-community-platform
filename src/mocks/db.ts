import { mockPosts } from "@/mocks/posts";
import type { Clan, JoinRequest, MatchPost, MatchRecord, Product, UserProfile } from "@/types/domain";

export const mockUsers: UserProfile[] = [
  {
    id: "user_1",
    name: "Nhat Tran",
    email: "nhat@example.com",
    skillLevel: "INTERMEDIATE"
  },
  {
    id: "user_2",
    name: "Linh Pham",
    email: "linh@example.com",
    skillLevel: "BEGINNER"
  },
  {
    id: "user_3",
    name: "Duc Nguyen",
    email: "duc@example.com",
    skillLevel: "ADVANCED"
  }
];

export const postTable: MatchPost[] = [...mockPosts];
export const joinRequestTable: JoinRequest[] = [];

export const matchTable: MatchRecord[] = [
  {
    id: "match_1",
    postId: "post_2",
    status: "SCHEDULED",
    result: undefined,
    playerIds: ["user_2", "user_1"],
    createdAt: new Date().toISOString()
  },
  {
    id: "match_2",
    postId: "post_3",
    status: "SCHEDULED",
    result: undefined,
    playerIds: ["user_3", "user_2"],
    createdAt: new Date().toISOString()
  },
  {
    id: "match_3",
    postId: "post_6",
    status: "SCHEDULED",
    result: undefined,
    playerIds: ["user_3", "user_1"],
    createdAt: new Date().toISOString()
  }
];

export const clanTable: Clan[] = [
  {
    id: "clan_1",
    name: "Wobble Smashers",
    ownerId: mockUsers[0].id,
    createdAt: new Date().toISOString()
  },
  {
    id: "clan_2",
    name: "Paper Shuttle Co.",
    ownerId: mockUsers[1].id,
    createdAt: new Date().toISOString()
  },
  {
    id: "clan_3",
    name: "Ink & Racket",
    ownerId: mockUsers[2].id,
    createdAt: new Date().toISOString()
  },
  {
    id: "clan_4",
    name: "Tape Tower",
    ownerId: mockUsers[0].id,
    createdAt: new Date().toISOString()
  },
  {
    id: "clan_5",
    name: "Sketch Sprinters",
    ownerId: mockUsers[1].id,
    createdAt: new Date().toISOString()
  }
];

export const productTable: Product[] = [
  {
    id: "product_tpl_1",
    sellerId: mockUsers[0].id,
    name: "Template: Beginner Doubles",
    price: 29,
    imageUrl: "/img/v1.png",
    description: "A ready-to-post beginner doubles session plan with flexible timings.",
    createdAt: new Date().toISOString()
  },
  {
    id: "product_tpl_2",
    sellerId: mockUsers[1].id,
    name: "Template: Precision Training",
    price: 39,
    imageUrl: "/img/v1.png",
    description: "Focused training session template designed for better control and footwork.",
    createdAt: new Date().toISOString()
  },
  {
    id: "product_tpl_3",
    sellerId: mockUsers[2].id,
    name: "Template: Competitive Night",
    price: 49,
    imageUrl: "/img/v1.png",
    description: "High-energy competitive match template for players ready to challenge.",
    createdAt: new Date().toISOString()
  }
];
