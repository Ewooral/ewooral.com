"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  slug: string;
  initialLikeCount: number;
  initialLiked: boolean;
  signedIn: boolean;
};

export default function LikeButton({
  postId,
  slug,
  initialLikeCount,
  initialLiked,
  signedIn,
}: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const onClick = () => {
    if (!signedIn) {
      router.push(
        `/register?next=${encodeURIComponent(`/blog/${slug}`)}&action=like&source=blog_like_gate`
      );
      return;
    }

    const wasLiked = liked;
    const optimisticCount = count + (wasLiked ? -1 : 1);
    setLiked(!wasLiked);
    setCount(optimisticCount);
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch(`/api/blog/posts/${postId}/like`, {
          method: wasLiked ? "DELETE" : "POST",
        });
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.success) {
          // Revert optimistic update
          setLiked(wasLiked);
          setCount(count);
          if (res.status === 401) {
            router.push(
              `/register?next=${encodeURIComponent(`/blog/${slug}`)}&action=like&source=blog_like_gate`
            );
            return;
          }
          if (res.status === 403 && body?.error?.code === "ENGAGEMENT_SUSPENDED") {
            setError("You're currently suspended from posting reactions.");
            return;
          }
          setError("Couldn't save your like. Please try again.");
          return;
        }
        // Sync with server truth
        setLiked(body.data.liked);
        setCount(body.data.like_count);
      } catch {
        setLiked(wasLiked);
        setCount(count);
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-150 disabled:opacity-60"
        style={{
          background: liked ? "var(--color-accent)" : "transparent",
          color: liked ? "var(--color-bg)" : "var(--color-ink-dim)",
          borderColor: liked ? "var(--color-accent)" : "var(--line-strong)",
        }}
      >
        <Heart filled={liked} />
        <span className="font-mono text-[12px] tracking-[0.05em]">
          {count}
        </span>
      </button>
      {error && (
        <p className="text-[11px] text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
