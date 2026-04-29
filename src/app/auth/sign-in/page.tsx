"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/demo-auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Sign in failed");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <section className="sketch-card -rotate-[0.5deg]">
        <h1 className="sketch-section-title text-ink">Sign in</h1>
        <p className="sketch-subtext mt-2 text-ink/80">Demo login with username and password.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="space-y-1 text-lg text-ink">
            <span>Username</span>
            <input
              className="sketch-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. nhat"
              autoComplete="username"
              required
            />
          </label>

          <label className="space-y-1 text-lg text-ink">
            <span>Password</span>
            <input
              className="sketch-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="text-base text-marker">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Log in"}
            </Button>
            <button
              type="button"
              onClick={() => router.push("/auth/sign-up")}
              className="text-lg text-pen underline decoration-dashed underline-offset-4 hover:text-marker"
            >
              Create account
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

