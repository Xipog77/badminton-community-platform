import { NextResponse } from "next/server";
import { z } from "zod";
import { createClan, listClans } from "@/services/clan-service";

const createClanSchema = z.object({
  name: z.string().min(3),
  ownerId: z.string().optional()
});

export async function GET() {
  const clans = await listClans();
  return NextResponse.json({ data: clans });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createClanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const clan = await createClan(parsed.data.name, parsed.data.ownerId);
  return NextResponse.json({ data: clan }, { status: 201 });
}
