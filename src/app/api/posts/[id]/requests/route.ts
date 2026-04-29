import { NextResponse } from "next/server";
import { z } from "zod";
import { createJoinRequest } from "@/services/post-service";

const createJoinRequestSchema = z.object({
  requesterId: z.string().min(1),
  message: z.string().max(200).optional()
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = createJoinRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const joinRequest = await createJoinRequest({
    postId: (await params).id,
    requesterId: parsed.data.requesterId,
    message: parsed.data.message
  });

  return NextResponse.json({ data: joinRequest }, { status: 201 });
}
