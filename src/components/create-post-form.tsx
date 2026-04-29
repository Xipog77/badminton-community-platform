"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { SkillLevel } from "@/types/domain";

const skillOptions: SkillLevel[] = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "PROFESSIONAL"
];

export function CreatePostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: "user_1",
          scheduledAt: formData.get("scheduledAt"),
          location: formData.get("location"),
          skillLevel: formData.get("skillLevel"),
          slots: Number(formData.get("slots")),
          description: formData.get("description")
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Could not create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-lg text-ink">
          <span>Time</span>
          <input
            name="scheduledAt"
            type="datetime-local"
            required
            className="sketch-input"
          />
        </label>

        <label className="space-y-1 text-lg text-ink">
          <span>Location</span>
          <input
            name="location"
            type="text"
            required
            className="sketch-input"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-lg text-ink">
          <span>Skill level</span>
          <select
            name="skillLevel"
            defaultValue="INTERMEDIATE"
            className="sketch-input"
          >
            {skillOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-lg text-ink">
          <span>Slots</span>
          <input
            name="slots"
            type="number"
            min={2}
            max={12}
            defaultValue={4}
            required
            className="sketch-input"
          />
        </label>
      </div>

      <label className="block space-y-1 text-lg text-ink">
        <span>Description</span>
        <textarea
          name="description"
          required
          rows={4}
          className="sketch-input"
        />
      </label>

      {error ? <p className="text-base text-marker">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create post"}
      </Button>
    </form>
  );
}
