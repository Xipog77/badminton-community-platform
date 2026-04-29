import { NextResponse } from "next/server";
import { z } from "zod";
import { createPost, getPosts } from "@/services/post-service";

const createPostSchema = z.object({
  ownerId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  location: z.string().min(3),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"]),
  slots: z.number().int().min(2).max(12),
  description: z.string().min(10)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const posts = await getPosts({
    q: searchParams.get("q") ?? undefined,
    skillLevel: (searchParams.get("skill") as
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED"
      | "PROFESSIONAL"
      | "ALL"
      | null) ?? undefined,
    time: (searchParams.get("time") as "UPCOMING_24H" | "UPCOMING_7D" | "ALL" | null) ?? undefined
  });

  return NextResponse.json({ data: posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const post = await createPost(parsed.data);
  return NextResponse.json({ data: post }, { status: 201 });
}
