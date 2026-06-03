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

const SITE_ORIGIN = "https://ewooral.com";
const SOCIAL_IMAGE_WIDTH = 1200;
const SOCIAL_IMAGE_HEIGHT = 630;

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
  category: CategoryRef | null;
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

function socialImageForPost(post: BlogPostDetail) {
  const cover = post.cover_image_url?.trim();
  const generated = `${SITE_ORIGIN}/blog/${encodeURIComponent(post.slug)}/opengraph-image`;
  if (!cover || /\.(avif|pdf)(?:[?#]|$)/i.test(cover)) {
    return {
      url: generated,
      width: SOCIAL_IMAGE_WIDTH,
      height: SOCIAL_IMAGE_HEIGHT,
      alt: post.title,
    };
  }

  return {
    url: cover,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    alt: post.title,
    type: imageTypeFromUrl(cover),
  };
}

function imageTypeFromUrl(url: string): string | undefined {
  if (/\.jpe?g(?:[?#]|$)/i.test(url)) return "image/jpeg";
  if (/\.png(?:[?#]|$)/i.test(url)) return "image/png";
  if (/\.webp(?:[?#]|$)/i.test(url)) return "image/webp";
  if (/\.gif(?:[?#]|$)/i.test(url)) return "image/gif";
  return undefined;
}

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
  const url = `${SITE_ORIGIN}/blog/${post.slug}`;
  const socialImage = socialImageForPost(post);

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
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
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
  const articleHtml = post.body_html ? renderArticleHtml(post.body_html) : "";
  const category = post.category;

  return (
    <>
      <Nav />
      <ReadingProgress />
      <main className="min-h-screen pb-32">
        <article className="max-w-4xl mx-auto px-5 md:px-10 pt-28 md:pt-36">
          <header className="blog-detail-hero mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6 text-[11px] font-mono uppercase tracking-[0.25em]">
              {category ? (
                <Link
                  href={`/blog?category=${encodeURIComponent(category.slug)}`}
                  className="px-2.5 py-1 no-underline transition-opacity hover:opacity-80"
                  style={{
                    background: "var(--color-accent)",
                    color: "var(--color-bg)",
                    borderRadius: "2px",
                  }}
                >
                  {category.label}
                </Link>
              ) : (
                <span
                  className="px-2.5 py-1"
                  style={{
                    background: "var(--color-accent)",
                    color: "var(--color-bg)",
                    borderRadius: "2px",
                  }}
                >
                  Article
                </span>
              )}
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
                letterSpacing: 0,
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

          {post.cover_image_url && (
            <figure className="blog-detail-cover mb-10 md:mb-14">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </figure>
          )}

          {showBody && articleHtml ? (
            <div
              className="prose-blog blog-detail-prose"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
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
        <style>{`
          .blog-detail-hero {
            border-bottom: 1px solid var(--line);
            padding-bottom: 2rem;
          }
          .blog-detail-cover {
            overflow: hidden;
            border: 1px solid var(--line-strong);
            border-radius: 8px;
            background: var(--color-bg-2);
            box-shadow: 0 22px 70px rgba(0, 0, 0, 0.12);
            aspect-ratio: 16 / 8.5;
          }
          .blog-detail-prose {
            padding: clamp(0rem, 1vw, 1rem) 0;
          }
          .blog-detail-prose h2,
          .blog-detail-prose h3,
          .blog-detail-prose h4 {
            font-family: var(--font-display);
            letter-spacing: 0;
            color: var(--color-ink);
          }
          .blog-detail-prose h2 {
            font-size: clamp(1.7rem, 3vw, 2.4rem);
            line-height: 1.12;
            margin: 3rem 0 1rem;
          }
          .blog-detail-prose h3 {
            font-size: clamp(1.3rem, 2vw, 1.65rem);
            line-height: 1.18;
            margin: 2.25rem 0 0.8rem;
          }
          .blog-detail-prose h4 {
            font-size: 1.08rem;
            line-height: 1.3;
            margin: 1.75rem 0 0.55rem;
          }
          .blog-detail-prose blockquote {
            border-left: 3px solid var(--color-accent);
            margin: 2rem 0;
            padding: 0.25rem 0 0.25rem 1.25rem;
            color: var(--color-ink);
            font-style: italic;
          }
          .blog-detail-prose code {
            border: 1px solid var(--line);
            border-radius: 4px;
            background: var(--color-bg-2);
            color: var(--color-accent);
            padding: 0.1rem 0.35rem;
            font-size: 0.88em;
          }
          .blog-detail-prose hr {
            border: 0;
            border-top: 1px solid var(--line);
            margin: 2.5rem 0;
          }
          [data-theme="light"] .blog-detail-cover {
            box-shadow: 0 22px 60px rgba(28, 28, 26, 0.08);
          }
        `}</style>
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

function renderArticleHtml(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  // Owner ask 2026-06-03: new posts lost their links + styling on the
  // public renderer. Root cause was this function: any body with "1." or
  // "- " hit looksLikeMarkdown(), then htmlToMarkdownText stripped EVERY
  // HTML tag via /<[^>]+>/g and re-rendered from text — anchors, styles,
  // bold, inline images all gone.
  //
  // Fix: when the input already has block-level HTML (the TipTap admin
  // editor always emits <p>/<h*>/<ul>/etc.), pass it through unchanged so
  // anchors survive. Markdown-conversion path stays for the few seed
  // posts that ship as raw markdown text (e.g. the welcome post).
  const hasBlockHtml = /<\s*(p|div|h[1-6]|ul|ol|blockquote|article|section|figure|table)\b/i.test(trimmed);
  if (hasBlockHtml) return trimmed;
  return looksLikeMarkdown(trimmed) ? markdownToHtml(htmlToMarkdownText(trimmed)) : trimmed;
}

function looksLikeMarkdown(input: string): boolean {
  const text = decodeHtmlEntities(input
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/p\s*>\s*<\s*p[^>]*>/gi, "\n\n")
    .replace(/<\s*\/div\s*>\s*<\s*div[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .trim());
  return /(^|\n)#{1,6}\s+\S/.test(text)
    || /(^|\n)\s*[-*]\s+\S/.test(text)
    || /(^|\n)\s*\d+\.\s+\S/.test(text)
    || /\[[^\]]+\]\([^\s)]+\)/.test(text);
}

function htmlToMarkdownText(input: string): string {
  return decodeHtmlEntities(input
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/p\s*>\s*<\s*p[^>]*>/gi, "\n\n")
    .replace(/<\s*\/div\s*>\s*<\s*div[^>]*>/gi, "\n\n")
    .replace(/<\s*\/li\s*>\s*<\s*li[^>]*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "- ")
    .replace(/<\s*\/h[1-6]\s*>/gi, "\n\n")
    .replace(/<\s*h([1-6])[^>]*>/gi, (_match, level: string) => `${"#".repeat(Number(level))} `)
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim());
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let orderedItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${renderInlineMarkdown(paragraph.join(" ").trim())}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) {
      blocks.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
    if (orderedItems.length) {
      blocks.push(`<ol>${orderedItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</ol>`);
      orderedItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(4, Math.max(2, heading[1].length));
      blocks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(line);
    if (unordered) {
      flushParagraph();
      orderedItems = [];
      listItems.push(unordered[1]);
      continue;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      flushParagraph();
      listItems = [];
      orderedItems.push(ordered[1]);
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push(`<blockquote>${renderInlineMarkdown(line.slice(2).trim())}</blockquote>`);
      continue;
    }

    if (/^---+$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push("<hr />");
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks.join("\n");
}

function renderInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|\s)\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|\s)_([^_]+)_/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function decodeHtmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return value.replace(/&(#\d+|#x[\da-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x"
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return named[entity] ?? match;
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
