export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL";

export type PostStatus = "OPEN" | "FULL" | "CLOSED" | "CANCELLED";

export type JoinRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type MatchStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type ClanRole = "OWNER" | "ADMIN" | "MEMBER";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  skillLevel: SkillLevel;
}

export interface MatchPost {
  id: string;
  owner: UserProfile;
  scheduledAt: string;
  location: string;
  skillLevel: SkillLevel;
  slots: number;
  filledSlots: number;
  description: string;
  status: PostStatus;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  postId: string;
  requester: UserProfile;
  status: JoinRequestStatus;
  message?: string;
  createdAt: string;
}

export interface MatchRecord {
  id: string;
  postId: string;
  status: MatchStatus;
  result?: string;
  playerIds: string[];
  createdAt: string;
}

export interface Clan {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  createdAt: string;
}
