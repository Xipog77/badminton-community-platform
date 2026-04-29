import { NextResponse } from "next/server";
import { z } from "zod";

const signInSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(1).max(100)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Vercel-friendly demo auth:
  // We don't persist users server-side; we only validate input shape and set a cookie.
  const { username } = parsed.data;
  const canonicalUsername = username.trim().toLowerCase();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("demo_user", canonicalUsername, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}

