"use client";

import { useState, useTransition, FormEvent } from "react";
import { useRouter } from "next/navigation";

export type Comment = {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  author_id: string;
  author_name: string;
  author_product_origin: string;
  body: string;
  status: "visible" | "hidden" | "removed";
  created_at: string;
};

type Viewer = { sub: string; name: string } | null;

type Props = {
  slug: string;
  postId: string;
  initialComments: Comment[];
  viewer: Viewer;
};

const REPORT_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "off_topic", label: "Off-topic" },
  { value: "other", label: "Other" },
] as const;

export default function CommentThread({
  slug,
  postId,
  initialComments,
  viewer,
}: Props) {
  const [comments, setComments] = useState(initialComments);

  const addComment = (c: Comment) => {
    setComments((prev) => [...prev, c]);
  };

  // Group: top-level first, then replies under their parent.
  const topLevel = comments.filter((c) => !c.parent_comment_id);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parent_comment_id) {
      const list = repliesByParent.get(c.parent_comment_id) ?? [];
      list.push(c);
      repliesByParent.set(c.parent_comment_id, list);
    }
  }

  return (
    <section
      id="comments"
      className="mt-16 pt-10 border-t"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display text-2xl">
          {topLevel.length === 0
            ? "Be the first to respond"
            : `${comments.length} ${comments.length === 1 ? "response" : "responses"}`}
        </h2>
      </div>

      <CommentInput
        slug={slug}
        viewer={viewer}
        onCreate={addComment}
        kind="top"
      />

      <ul className="list-none mt-10 space-y-8">
        {topLevel.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={repliesByParent.get(c.id) ?? []}
            slug={slug}
            viewer={viewer}
            onReplyCreate={addComment}
          />
        ))}
      </ul>
    </section>
  );
}

function CommentItem({
  comment,
  replies,
  slug,
  viewer,
  onReplyCreate,
}: {
  comment: Comment;
  replies: Comment[];
  slug: string;
  viewer: Viewer;
  onReplyCreate: (c: Comment) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (comment.status !== "visible") {
    return (
      <li
        className="text-[12px] font-mono text-ink-faint italic px-4 py-3 rounded-lg"
        style={{ background: "var(--color-bg-2)", border: "1px solid var(--line)" }}
      >
        [Comment {comment.status} by moderator]
      </li>
    );
  }

  return (
    <li>
      <CommentBubble
        comment={comment}
        onReply={() => setReplyOpen((v) => !v)}
        onReport={() => setReportOpen(true)}
        viewer={viewer}
      />

      {replyOpen && (
        <div className="mt-3 ml-6">
          <CommentInput
            slug={slug}
            viewer={viewer}
            onCreate={(c) => {
              onReplyCreate(c);
              setReplyOpen(false);
            }}
            kind="reply"
            parentCommentId={comment.id}
          />
        </div>
      )}

      {reportOpen && (
        <ReportPopover
          commentId={comment.id}
          slug={slug}
          viewer={viewer}
          onClose={() => setReportOpen(false)}
        />
      )}

      {replies.length > 0 && (
        <ul className="list-none mt-4 ml-6 space-y-4 border-l pl-5" style={{ borderColor: "var(--line)" }}>
          {replies.map((r) =>
            r.status !== "visible" ? (
              <li key={r.id} className="text-[12px] font-mono text-ink-faint italic">
                [Reply {r.status} by moderator]
              </li>
            ) : (
              <li key={r.id}>
                <CommentBubble
                  comment={r}
                  onReply={null}
                  onReport={() => setReportOpen(true)}
                  viewer={viewer}
                />
              </li>
            )
          )}
        </ul>
      )}
    </li>
  );
}

function CommentBubble({
  comment,
  onReply,
  onReport,
  viewer,
}: {
  comment: Comment;
  onReply: (() => void) | null;
  onReport: () => void;
  viewer: Viewer;
}) {
  const isOwn = viewer?.sub === comment.author_id;
  return (
    <article>
      <header className="flex items-baseline gap-3 mb-2">
        <span className="font-display font-semibold text-[14px] text-[var(--color-ink)]">
          {comment.author_name}
        </span>
        {isOwn && (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
            you
          </span>
        )}
        <time
          dateTime={comment.created_at}
          className="font-mono text-[11px] text-ink-faint"
        >
          {new Date(comment.created_at).toLocaleString("en-GH", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </header>
      <p className="text-ink-dim text-[15px] leading-relaxed whitespace-pre-wrap">
        {comment.body}
      </p>
      <div className="flex items-center gap-4 mt-2 text-[11px] font-mono uppercase tracking-[0.15em]">
        {onReply && (
          <button
            type="button"
            onClick={onReply}
            className="text-ink-faint hover:text-accent transition-colors"
          >
            Reply
          </button>
        )}
        {!isOwn && (
          <button
            type="button"
            onClick={onReport}
            className="text-ink-faint hover:text-red-400 transition-colors"
          >
            Report
          </button>
        )}
      </div>
    </article>
  );
}

function CommentInput({
  slug,
  viewer,
  onCreate,
  kind,
  parentCommentId,
}: {
  slug: string;
  viewer: Viewer;
  onCreate: (c: Comment) => void;
  kind: "top" | "reply";
  parentCommentId?: string;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!viewer) {
    return (
      <div
        className="p-5 rounded-xl border text-center"
        style={{
          background: "var(--color-bg-2)",
          borderColor: "var(--line-strong)",
        }}
      >
        <p className="text-ink-dim text-[14px] mb-3">
          {kind === "top"
            ? "Sign in with Ewooral to join the conversation."
            : "Sign in to reply."}
        </p>
        <a
          href={`/register?next=${encodeURIComponent(`/blog/${slug}#comments`)}&action=comment&source=blog_comment_gate`}
          className="inline-block px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] no-underline rounded-full"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-bg)",
          }}
        >
          Sign in / Sign up
        </a>
      </div>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) {
      setError("Write something first.");
      return;
    }
    if (body.length < 2) {
      setError("Comment is too short.");
      return;
    }
    setError("");

    startTransition(async () => {
      try {
        const url =
          kind === "top"
            ? `/api/blog/posts/${slug}/comments`
            : `/api/blog/comments/${parentCommentId}/reply`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        });
        const json = await res.json().catch(() => null);

        if (res.status === 401) {
          router.push(
            `/register?next=${encodeURIComponent(`/blog/${slug}#comments`)}&action=comment&source=blog_comment_gate`
          );
          return;
        }
        if (!res.ok || !json?.success) {
          const code = json?.error?.code;
          if (code === "ENGAGEMENT_SUSPENDED") {
            setError("You're currently suspended from commenting.");
          } else if (code === "RATE_LIMITED" || res.status === 429) {
            setError("Slow down — too many comments in a short time.");
          } else if (res.status === 413) {
            setError("Comment is too long.");
          } else {
            setError(json?.error?.message ?? "Couldn't post your comment. Try again.");
          }
          return;
        }

        onCreate(json.data as Comment);
        setText("");
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <form
      onSubmit={submit}
      className="p-4 rounded-xl"
      style={{
        background: "var(--color-bg-2)",
        border: "1px solid var(--line-strong)",
      }}
    >
      <label htmlFor={`c-${parentCommentId ?? "top"}`} className="sr-only">
        {kind === "top" ? "Add a comment" : "Reply"}
      </label>
      <textarea
        id={`c-${parentCommentId ?? "top"}`}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError("");
        }}
        placeholder={
          kind === "top"
            ? `Hi ${viewer.name.split(" ")[0]} — share your take…`
            : "Write a reply…"
        }
        rows={kind === "top" ? 4 : 3}
        maxLength={2000}
        className="w-full bg-[var(--color-bg)] border border-white/10 focus:border-[var(--color-accent)]/50 text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] px-4 py-3 text-[14px] outline-none rounded-lg resize-none transition-colors"
      />
      <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
        <p className="text-[11px] font-mono text-ink-faint">
          Posting as {viewer.name} · {text.length}/2000
        </p>
        <div className="flex items-center gap-3">
          {error && (
            <p className="text-red-400 text-[12px]" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] font-medium rounded-full transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            {pending ? "Posting…" : kind === "top" ? "Post" : "Reply"}
          </button>
        </div>
      </div>
    </form>
  );
}

function ReportPopover({
  commentId,
  slug,
  viewer,
  onClose,
}: {
  commentId: string;
  slug: string;
  viewer: Viewer;
  onClose: () => void;
}) {
  const router = useRouter();
  const [reason, setReason] = useState<string>("spam");
  const [detail, setDetail] = useState("");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  if (!viewer) {
    router.push(
      `/register?next=${encodeURIComponent(`/blog/${slug}#comments`)}&action=comment&source=blog_comment_gate`
    );
    return null;
  }

  const submit = () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/blog/comments/${commentId}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason,
            detail: detail.trim() || null,
          }),
        });
        const json = await res.json().catch(() => null);
        if (res.status === 401) {
          router.push(
            `/register?next=${encodeURIComponent(`/blog/${slug}#comments`)}&action=comment&source=blog_comment_gate`
          );
          return;
        }
        if (!res.ok || !json?.success) {
          setStatus("error");
          setError(json?.error?.message ?? "Couldn't send your report. Try again.");
          return;
        }
        setStatus("sent");
        setTimeout(onClose, 1500);
      } catch {
        setStatus("error");
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div
      className="mt-3 ml-6 p-4 rounded-xl"
      style={{
        background: "var(--color-bg-2)",
        border: "1px solid var(--line-strong)",
      }}
      role="dialog"
      aria-label="Report this comment"
    >
      {status === "sent" ? (
        <p className="text-[13px] text-ink-dim">
          Thanks — our team will review.
        </p>
      ) : (
        <>
          <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-ink-faint mb-3">
            Report this comment
          </p>
          <div className="grid gap-2 mb-3">
            {REPORT_REASONS.map((r) => (
              <label
                key={r.value}
                className="flex items-center gap-2 text-[13px] text-ink-dim cursor-pointer"
              >
                <input
                  type="radio"
                  name={`report-${commentId}`}
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                />
                {r.label}
              </label>
            ))}
          </div>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Add detail (optional)"
            rows={2}
            maxLength={500}
            className="w-full bg-[var(--color-bg)] border border-white/10 focus:border-[var(--color-accent)]/50 text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] px-3 py-2 text-[13px] outline-none rounded-lg resize-none mb-3"
          />
          {error && (
            <p className="text-red-400 text-[12px] mb-2" role="alert">
              {error}
            </p>
          )}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-dim hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] rounded-full transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: "rgba(239,68,68,0.85)",
                color: "var(--color-bg)",
              }}
            >
              {pending ? "Sending…" : "Submit report"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
