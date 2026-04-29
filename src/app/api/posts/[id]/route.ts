import { NextResponse } from "next/server";
import { getPostById } from "@/services/post-service";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}

export async function PUT() {
  return NextResponse.json(
    { message: "Post update endpoint scaffolded; implementation in next step." },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Post delete endpoint scaffolded; implementation in next step." },
    { status: 501 }
  );
}
