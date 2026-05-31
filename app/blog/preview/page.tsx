"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";

type CategoryRef = { id: string; slug: string; label: string } | null;
type TagRef = { id: string; slug: string; label: string };

type PreviewPost = {
  id: string;
  slug: string;
  title: string;
  dek?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
  author_name: string;
  category?: CategoryRef;
  tags?: TagRef[];
  published_at: string;
  body_html?: string | null;
  reading_minutes?: number | null;
};

type PreviewMessage = {
  type: "ewooral-blog-preview";
  post: PreviewPost;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function isPreviewMessage(value: unknown): value is PreviewMessage {
  if (!value || typeof value !== "object") return false;
  const maybe = value as Partial<PreviewMessage>;
  return maybe.type === "ewooral-blog-preview" && Boolean(maybe.post?.title);
}

export default function BlogPreviewPage() {
  const [post, setPost] = useState<PreviewPost | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!isTrustedOrigin(event.origin)) return;
      if (isPreviewMessage(event.data)) setPost(event.data.post);
    };
    window.addEventListener("message", handler);
    window.opener?.postMessage({ type: "ewooral-blog-preview-ready" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const blurb = post?.dek ?? post?.excerpt ?? "";

  return (
    <>
      <Nav />
      <ReadingProgress />
      <main className="min-h-screen pb-32">
        <article className="max-w-3xl mx-auto px-5 md:px-10 pt-28 md:pt-36">
          {!post ? (
            <div className="py-24 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint mb-3">
                Waiting for preview
              </div>
              <p className="text-ink-dim">Open preview from the admin editor.</p>
            </div>
          ) : (
            <>
              <header className="mb-12 md:mb-16">
                <div className="flex flex-wrap items-center gap-3 mb-6 text-[11px] font-mono uppercase tracking-[0.25em]">
                  <span
                    className="px-2.5 py-1"
                    style={{ background: "var(--color-accent)", color: "var(--color-bg)", borderRadius: "2px" }}
                  >
                    {post.category?.label ?? "Preview"}
                  </span>
                  <time dateTime={post.published_at} className="text-ink-faint">
                    {fmtDate(post.published_at)}
                  </time>
                  {post.reading_minutes != null && (
                    <>
                      <span className="text-ink-faint">·</span>
                      <span className="text-ink-faint">{post.reading_minutes} min read</span>
                    </>
                  )}
                </div>

                <h1
                  className="font-display font-display-tight mb-6"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
                >
                  {post.title}
                </h1>

                {blurb && (
                  <p className="text-ink-dim leading-relaxed" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)", lineHeight: 1.55 }}>
                    {blurb}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: "var(--line)" }}>
                  <AuthorAvatar name={post.author_name} />
                  <div className="flex flex-col">
                    <span className="text-sm font-display">{post.author_name}</span>
                    <span className="text-[11px] font-mono text-ink-faint">Preview {fmtDate(post.published_at)}</span>
                  </div>
                </div>
              </header>

              {post.cover_image_url && (
                <div className="mb-10 overflow-hidden" style={{ borderRadius: "4px" }}>
                  <img src={post.cover_image_url} alt="" className="w-full h-auto object-cover" />
                </div>
              )}

              {post.body_html?.trim() ? (
                <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.body_html }} />
              ) : (
                <div className="text-center py-10 px-6 mt-4" style={{ border: "1px dashed var(--line-strong)", borderRadius: "4px" }}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] mb-2 text-ink-faint">No body yet</div>
                  <p className="text-ink-dim max-w-md mx-auto leading-relaxed">Add article body in the admin editor to preview the full post.</p>
                </div>
              )}

              {post.tags?.length ? (
                <footer className="mt-16 pt-8 border-t" style={{ borderColor: "var(--line)" }}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] mb-3 text-ink-faint">Tagged</div>
                  <ul className="flex flex-wrap gap-2 list-none">
                    {post.tags.map((tag) => (
                      <li key={tag.id}>
                        <span
                          className="inline-block px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] rounded-full border"
                          style={{ borderColor: "var(--line-strong)", color: "var(--color-ink-dim)" }}
                        >
                          {tag.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </footer>
              ) : null}
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}

function isTrustedOrigin(origin: string): boolean {
  return origin === "https://admin.ewooral.com"
    || origin === "http://localhost:3000"
    || origin === "http://localhost:3001"
    || origin === "http://localhost:3010";
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "999px",
        background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))",
        color: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: 0.5,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
