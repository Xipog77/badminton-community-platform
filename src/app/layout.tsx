import type { Metadata } from "next";
import Link from "next/link";
import { Kalam, Patrick_Hand } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Badminton Community Platform",
  description: "Find badminton matches, join clans, and trade gear."
};

const headingFont = Kalam({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body"
});

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const user = cookieStore.get("demo_user")?.value;
  const isAuthed = Boolean(user);

  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-body`}>
        <div className="min-h-screen">
          <header className="px-4 pb-3 pt-5 md:px-6">
            <nav
              className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-[3px] border-ink bg-white px-5 py-4 shadow-sketch"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <Link href="/" className="-rotate-1 font-heading text-3xl font-bold text-ink">
                ShuttleHub
              </Link>
              <div className="flex items-center gap-4 text-lg text-ink md:text-xl">
                <Link href="/" className="underline decoration-dashed underline-offset-4 hover:text-marker">
                  Feed
                </Link>
                <Link
                  href="/create"
                  className="-rotate-1 underline decoration-dashed underline-offset-4 hover:text-marker"
                >
                  Create Post
                </Link>
                <Link href="/clan" className="underline decoration-dashed underline-offset-4 hover:text-marker">
                  Clan
                </Link>
                <Link
                  href="/marketplace"
                  className="rotate-1 underline decoration-dashed underline-offset-4 hover:text-marker"
                >
                  Marketplace
                </Link>
                {isAuthed ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="-rotate-1 underline decoration-dashed underline-offset-4 hover:text-marker"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/api/demo-auth/sign-out"
                      className="rotate-1 underline decoration-dashed underline-offset-4 hover:text-marker"
                    >
                      Sign out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="-rotate-1 underline decoration-dashed underline-offset-4 hover:text-marker"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="rotate-1 underline decoration-dashed underline-offset-4 hover:text-marker"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
