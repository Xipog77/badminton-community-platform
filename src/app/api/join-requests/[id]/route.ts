import { NextResponse } from "next/server";
import { z } from "zod";
import { respondToJoinRequest } from "@/services/post-service";

const responseSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"])
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const updated = await respondToJoinRequest({
    requestId: id,
    status: parsed.data.status
  });

  if (!updated) {
    return NextResponse.json({ error: "Join request not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
