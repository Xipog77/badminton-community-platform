import { joinRequestTable, matchTable, mockUsers, postTable } from "@/mocks/db";
import type { JoinRequest, MatchPost, SkillLevel } from "@/types/domain";

interface GetPostsInput {
  q?: string;
  skillLevel?: SkillLevel | "ALL";
  time?: "UPCOMING_24H" | "UPCOMING_7D" | "ALL";
}

const sortByTime = (posts: MatchPost[]) =>
  [...posts].sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export async function getPosts(filters: GetPostsInput = {}): Promise<MatchPost[]> {
  const now = Date.now();
  let result = sortByTime(postTable);

  if (filters.q) {
    const keyword = filters.q.toLowerCase();
    result = result.filter((post) =>
      [post.location, post.description, post.owner.name]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }

  if (filters.skillLevel && filters.skillLevel !== "ALL") {
    result = result.filter((post) => post.skillLevel === filters.skillLevel);
  }

  if (filters.time === "UPCOMING_24H") {
    const next24h = now + 24 * 60 * 60 * 1000;
    result = result.filter((post) => {
      const schedule = new Date(post.scheduledAt).getTime();
      return schedule >= now && schedule <= next24h;
    });
  }

  if (filters.time === "UPCOMING_7D") {
    const next7d = now + 7 * 24 * 60 * 60 * 1000;
    result = result.filter((post) => {
      const schedule = new Date(post.scheduledAt).getTime();
      return schedule >= now && schedule <= next7d;
    });
  }

  return result;
}

export async function getPostById(id: string): Promise<MatchPost | null> {
  return postTable.find((post) => post.id === id) ?? null;
}

interface CreatePostInput {
  ownerId: string;
  scheduledAt: string;
  location: string;
  skillLevel: SkillLevel;
  slots: number;
  description: string;
}

export async function createPost(input: CreatePostInput): Promise<MatchPost> {
  const owner = mockUsers.find((user) => user.id === input.ownerId) ?? mockUsers[0];
  const post: MatchPost = {
    id: createId("post"),
    owner,
    scheduledAt: input.scheduledAt,
    location: input.location,
    skillLevel: input.skillLevel,
    slots: input.slots,
    filledSlots: 1,
    description: input.description,
    status: "OPEN",
    createdAt: new Date().toISOString()
  };
  postTable.unshift(post);
  return post;
}

export async function createJoinRequest(input: {
  postId: string;
  requesterId: string;
  message?: string;
}): Promise<JoinRequest> {
  const requester = mockUsers.find((user) => user.id === input.requesterId) ?? mockUsers[1];
  const request: JoinRequest = {
    id: createId("join"),
    postId: input.postId,
    requester,
    status: "PENDING",
    message: input.message,
    createdAt: new Date().toISOString()
  };
  joinRequestTable.unshift(request);
  return request;
}

export async function respondToJoinRequest(input: {
  requestId: string;
  status: "ACCEPTED" | "REJECTED";
}) {
  const request = joinRequestTable.find((item) => item.id === input.requestId);
  if (!request) {
    return null;
  }

  request.status = input.status;
  const post = postTable.find((item) => item.id === request.postId);
  if (!post) {
    return request;
  }

  if (input.status === "ACCEPTED" && post.filledSlots < post.slots) {
    post.filledSlots += 1;
  }

  if (post.filledSlots >= post.slots && post.status !== "FULL") {
    post.status = "FULL";
    matchTable.push({
      id: createId("match"),
      postId: post.id,
      status: "SCHEDULED",
      playerIds: [post.owner.id],
      createdAt: new Date().toISOString()
    });
  }

  return request;
}
