import { NextResponse } from "next/server";

function signOutResponse(requestUrl: string) {
  const res = NextResponse.redirect(new URL("/auth/sign-in", requestUrl));
  res.cookies.set("demo_user", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return res;
}

export async function POST(request: Request) {
  return signOutResponse(request.url);
}

export async function GET(request: Request) {
  return signOutResponse(request.url);
}

