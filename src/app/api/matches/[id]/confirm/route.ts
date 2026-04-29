import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmMatchResult } from "@/services/match-service";

const confirmSchema = z.object({
  userId: z.string().min(1)
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const match = await confirmMatchResult(id, parsed.data.userId);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  return NextResponse.json({ data: match });
}
