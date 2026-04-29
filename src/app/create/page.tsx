import { CreatePostForm } from "@/components/create-post-form";

export default function CreatePostPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <section className="sketch-card -rotate-[0.5deg]">
        <h1 className="sketch-section-title text-ink">Create Match Post</h1>
        <p className="sketch-subtext mt-2 text-ink/80">Create a new session for your community.</p>
        <div className="mt-6">
          <CreatePostForm />
        </div>
      </section>
    </main>
  );
}
