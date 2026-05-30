import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import LikeButton from "@/components/blog/LikeButton";
import CommentSection from "@/components/blog/CommentSection";
import { getCurrentViewer } from "@/lib/web-identity";

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ??
  "https://platform-api.ewooral.com";

type Envelope<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } };

type CategoryRef = { id: string; slug: string; label: string };
type TagRef = { id: string; slug: string; label: string };

type TiptapDoc = {
  type: string;
  content?: unknown[];
};

type BlogPostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author_id: string;
  author_name: string;
  category: CategoryRef;
  tags: TagRef[];
  published_at: string;
  view_count?: number;
  seo_meta_title?: string;
  seo_meta_description?: string;
  body_html?: string;
  body_json?: TiptapDoc;
  dek?: string;
  reading_minutes?: number;
  like_count?: number;
};

async function getPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(
      `${PLATFORM_API}/api/v1/platform/posts/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const json = (await res.json()) as Envelope<BlogPostDetail>;
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const hasBody = (p: BlogPostDetail): boolean => {
  if (p.body_html && p.body_html.trim().length > 0) return true;
  const content = p.body_json?.content;
  return Array.isArray(content) && content.length > 0;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found · Ewooral" };

  const title = post.seo_meta_title ?? post.title;
  const description =
    post.seo_meta_description ?? post.dek ?? post.excerpt ?? "";
  const url = `https://ewooral.com/blog/${post.slug}`;

  return {
    title: `${title} · Ewooral`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author_name],
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, viewer] = await Promise.all([getPost(slug), getCurrentViewer()]);
  if (!post) notFound();

  const blurb = post.dek ?? post.excerpt;
  const showBody = hasBody(post);

  return (
    <>
      <Nav />
      <ReadingProgress />
      <main className="min-h-screen pb-32">
        <article className="max-w-3xl mx-auto px-5 md:px-10 pt-28 md:pt-36">
          <header className="mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6 text-[11px] font-mono uppercase tracking-[0.25em]">
              <Link
                href={`/blog?category=${encodeURIComponent(post.category.slug)}`}
                className="px-2.5 py-1 no-underline transition-opacity hover:opacity-80"
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-bg)",
                  borderRadius: "2px",
                }}
              >
                {post.category.label}
              </Link>
              <time dateTime={post.published_at} className="text-ink-faint">
                {fmtDate(post.published_at)}
              </time>
              {post.reading_minutes != null && (
                <>
                  <span className="text-ink-faint">·</span>
                  <span className="text-ink-faint">
                    {post.reading_minutes} min read
                  </span>
                </>
              )}
            </div>

            <h1
              className="font-display font-display-tight mb-6"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {post.title}
            </h1>

            {blurb && (
              <p
                className="text-ink-dim leading-relaxed"
                style={{
                  fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                  lineHeight: 1.55,
                }}
              >
                {blurb}
              </p>
            )}

            <div
              className="flex items-center gap-3 mt-8 pt-6 border-t"
              style={{ borderColor: "var(--line)" }}
            >
              <AuthorAvatar name={post.author_name} />
              <div className="flex flex-col">
                <span className="text-sm font-display">{post.author_name}</span>
                <span className="text-[11px] font-mono text-ink-faint">
                  Published {fmtDate(post.published_at)}
                </span>
              </div>
            </div>
          </header>

          {showBody && post.body_html ? (
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.body_html }}
            />
          ) : (
            <div
              className="text-center py-10 px-6 mt-4"
              style={{
                border: "1px dashed var(--line-strong)",
                borderRadius: "4px",
              }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] mb-2 text-ink-faint">
                Coming soon
              </div>
              <p className="text-ink-dim max-w-md mx-auto leading-relaxed">
                The full post is being prepared. The summary above is the read
                for now — we&apos;ll publish the full text shortly.
              </p>
            </div>
          )}

          <div
            className="flex items-center justify-between flex-wrap gap-4 mt-12 pt-8 border-t"
            style={{ borderColor: "var(--line)" }}
          >
            <LikeButton
              postId={post.id}
              slug={post.slug}
              initialLikeCount={post.like_count ?? 0}
              initialLiked={false}
              signedIn={!!viewer}
            />
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              {(post.view_count ?? 0).toLocaleString("en-GH")} reads
            </div>
          </div>

          {post.tags.length > 0 && (
            <footer
              className="mt-16 pt-8 border-t"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] mb-3 text-ink-faint">
                Tagged
              </div>
              <ul className="flex flex-wrap gap-2 list-none">
                {post.tags.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/blog?tag=${encodeURIComponent(t.slug)}`}
                      className="inline-block px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] no-underline rounded-full border transition-colors"
                      style={{
                        borderColor: "var(--line-strong)",
                        color: "var(--color-ink-dim)",
                      }}
                    >
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}

          <CommentSection
            slug={post.slug}
            postId={post.id}
            viewer={viewer ? { sub: viewer.sub, name: viewer.name } : null}
          />

          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] no-underline text-ink-dim hover:text-accent transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
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
        background:
          "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))",
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
