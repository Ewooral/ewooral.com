import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog · Ewooral & BFAM Holdings",
  description:
    "Updates, strategy, and engineering notes from the team building Ahofe, PENT-OS, ew-plug, and ewooral-icons.",
  alternates: { canonical: "https://ewooral.com/blog" },
};

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ??
  "https://platform-api.ewooral.com";

type Envelope<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } };

type Category = {
  id: string;
  slug: string;
  label: string;
  description?: string;
  display_order: number;
  post_count: number;
};

type Tag = { id: string; slug: string; label: string; post_count: number };

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author_id: string;
  author_name: string;
  category: { id: string; slug: string; label: string; tint?: string };
  tags: { id: string; slug: string; label: string }[];
  published_at: string;
  dek?: string;
  body_html?: string;
  reading_minutes?: number;
  view_count?: number;
  like_count?: number;
};

type PostsPage = {
  items: BlogPost[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
};

async function getPosts(qs: URLSearchParams): Promise<PostsPage | null> {
  try {
    const res = await fetch(
      `${PLATFORM_API}/api/v1/platform/posts?${qs.toString()}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as Envelope<PostsPage>;
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${PLATFORM_API}/api/v1/platform/categories`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as Envelope<Category[]>;
    if (!json.success) return [];
    return [...json.data]
      .filter((c) => c.post_count > 0)
      .sort((a, b) => a.display_order - b.display_order);
  } catch {
    return [];
  }
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const labelOf = (
  o: { label?: string; name?: string } | undefined | null
): string => o?.label ?? o?.name ?? "";

const blurbOf = (p: BlogPost): string => p.dek ?? p.excerpt ?? "";

type SearchParams = Promise<{
  category?: string;
  tag?: string;
  q?: string;
  offset?: string;
}>;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  qs.set("limit", "20");
  if (sp.offset) qs.set("offset", sp.offset);
  if (sp.category) qs.set("category", sp.category);
  if (sp.tag) qs.set("tag", sp.tag);
  if (sp.q) qs.set("q", sp.q);

  const [page, categories] = await Promise.all([
    getPosts(qs),
    getCategories(),
  ]);

  const items = page?.items ?? [];
  const featured = items[0];
  const rest = items.slice(1);

  const activeCategory = sp.category ?? null;

  return (
    <>
      <Nav />
      <main className="min-h-screen pb-32">
        {/* Masthead */}
        <section className="px-5 md:px-10 pt-20 md:pt-28 max-w-6xl mx-auto">
          <div
            className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end pb-10 md:pb-14"
            style={{ borderBottom: "1px solid var(--line)" }}
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] mb-5 text-accent">
                Ewooral · Field notes
              </div>
              <h1
                className="font-display font-display-tight leading-[0.95]"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  letterSpacing: 0,
                }}
              >
                Things we&apos;ve been thinking about.
              </h1>
            </div>
            <div className="md:pl-8">
              <p className="text-ink-dim leading-relaxed max-w-md text-base md:text-lg">
                Product decisions, strategy, and engineering notes from the
                people building Ahofe, PENT-OS, ew-plug, and ewooral-icons.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                <span className="blog-signal-chip">Product</span>
                <span className="blog-signal-chip">Engineering</span>
                <span className="blog-signal-chip">Strategy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category chips */}
        {categories.length > 0 && (
          <nav
            aria-label="Filter by category"
            className="px-5 md:px-10 mt-8 max-w-6xl mx-auto"
          >
            <ul className="flex flex-wrap gap-2 list-none">
              <li>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors rounded-full border hover:border-accent"
                  style={{
                    background: !activeCategory
                      ? "var(--color-accent)"
                      : "transparent",
                    color: !activeCategory
                      ? "var(--color-bg)"
                      : "var(--color-ink-dim)",
                    borderColor: !activeCategory
                      ? "var(--color-accent)"
                      : "var(--line-strong)",
                  }}
                >
                  All
                </Link>
              </li>
              {categories.map((c) => {
                const isActive = activeCategory === c.slug;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(c.slug)}`}
                      className="inline-flex items-center px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors rounded-full border hover:border-accent"
                      style={{
                        background: isActive
                          ? "var(--color-accent)"
                          : "transparent",
                        color: isActive
                          ? "var(--color-bg)"
                          : "var(--color-ink-dim)",
                        borderColor: isActive
                          ? "var(--color-accent)"
                          : "var(--line-strong)",
                      }}
                    >
                      {c.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* Featured post */}
        {featured && (
          <section className="px-5 md:px-10 mt-12 md:mt-14 max-w-6xl mx-auto">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="blog-featured-card grid overflow-hidden md:grid-cols-[0.95fr_1.05fr]">
                <div className="flex flex-col p-6 md:p-10 lg:p-12">
                  <header>
                    <div className="flex flex-wrap items-center gap-3 mb-6 text-[11px] font-mono uppercase tracking-[0.22em]">
                      <span className="blog-featured-label">Featured</span>
                      <span className="text-ink-faint">
                        {labelOf(featured.category)}
                      </span>
                      <span className="text-ink-faint">·</span>
                      <time
                        dateTime={featured.published_at}
                        className="text-ink-faint"
                      >
                        {fmtDate(featured.published_at)}
                      </time>
                    </div>
                    <h2
                      className="font-display font-display-tight mb-5"
                      style={{
                        fontSize: "clamp(2rem, 4vw, 3.35rem)",
                        lineHeight: 1.04,
                        letterSpacing: 0,
                      }}
                    >
                      {featured.title}
                    </h2>
                    <p
                      className="text-ink-dim leading-relaxed max-w-2xl"
                      style={{
                        fontSize: "clamp(1rem, 1.4vw, 1.16rem)",
                        lineHeight: 1.6,
                      }}
                    >
                      {blurbOf(featured)}
                    </p>
                  </header>

                  <footer className="blog-author-strip mt-8 md:mt-auto">
                    <div className="flex items-center gap-3 min-w-0">
                      <AuthorAvatar name={featured.author_name} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-display truncate">
                          {featured.author_name}
                        </span>
                        {featured.reading_minutes != null && (
                          <span className="text-[11px] font-mono text-ink-faint">
                            {featured.reading_minutes} min read
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="blog-read-link">
                      Read the post
                      <ArrowRight />
                    </span>
                  </footer>
                </div>

                {featured.cover_image_url && (
                  <figure className="blog-featured-media">
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  </figure>
                )}
              </article>
            </Link>
          </section>
        )}

        {/* Remaining posts grid */}
        {rest.length > 0 && (
          <section className="px-5 md:px-10 mt-16 md:mt-20 max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-ink-faint">
                More posts
              </div>
              <div className="hidden md:block h-px flex-1 bg-line" />
            </div>
            <div
              className="grid gap-6 md:gap-7"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              {rest.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group block"
                >
                  <article className="blog-post-card flex h-full flex-col overflow-hidden">
                    {p.cover_image_url && (
                      <div className="blog-post-media">
                        <img
                          src={p.cover_image_url}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint">
                        <span className="blog-category-chip">
                          {labelOf(p.category)}
                        </span>
                        <time dateTime={p.published_at}>
                          {fmtDate(p.published_at)}
                        </time>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl leading-[1.15] mb-3 group-hover:text-accent transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-ink-dim text-sm leading-relaxed mb-5">
                        {blurbOf(p)}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-line">
                        {p.reading_minutes != null && (
                          <span className="text-[11px] font-mono text-ink-faint">
                            {p.reading_minutes} min read
                          </span>
                        )}
                        <span className="blog-read-link text-xs">
                          Read
                          <ArrowRight />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* "Load more" — only when more pages exist */}
        {page?.has_more && (
          <section className="px-5 md:px-10 mt-16 max-w-6xl mx-auto text-center">
            <Link
              href={`/blog?${(() => {
                const next = new URLSearchParams(qs);
                next.set("offset", String((page.offset ?? 0) + (page.limit ?? 20)));
                return next.toString();
              })()}`}
              className="inline-block px-7 py-3 font-mono text-[12px] uppercase tracking-[0.18em] no-underline rounded-full border transition-colors"
              style={{
                borderColor: "var(--line-strong)",
                color: "var(--color-ink-dim)",
              }}
            >
              Load more
            </Link>
          </section>
        )}

        {/* Empty state: no posts at all yet (cold-start scenario) */}
        {items.length === 0 && (
          <section className="px-5 md:px-10 mt-20 max-w-6xl mx-auto">
            <div
              className="text-center py-12 px-6"
              style={{
                border: "1px dashed var(--line-strong)",
                borderRadius: "4px",
              }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] mb-2 text-ink-faint">
                More writing coming
              </div>
              <p className="text-ink-dim max-w-md mx-auto leading-relaxed">
                {activeCategory
                  ? "No posts in this category yet. Try another filter or check back soon."
                  : "We're getting the press warm. New posts land here regularly — product updates, strategy notes, and the engineering behind what we build."}
              </p>
            </div>
          </section>
        )}

      <style>{`
        .blog-signal-chip {
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 0.45rem 0.75rem;
          background: color-mix(in oklab, var(--color-bg-2) 60%, transparent);
        }
        .blog-featured-card,
        .blog-post-card {
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          background:
            linear-gradient(135deg, color-mix(in oklab, var(--color-accent) 8%, transparent), transparent 42%),
            color-mix(in oklab, var(--color-bg-2) 78%, var(--color-bg));
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.08);
          transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
        }
        .blog-featured-card:hover,
        .blog-post-card:hover {
          border-color: color-mix(in oklab, var(--color-accent) 45%, var(--line-strong));
          transform: translateY(-2px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.12);
        }
        .blog-featured-label,
        .blog-category-chip {
          border-radius: 999px;
          background: color-mix(in oklab, var(--color-accent) 16%, transparent);
          color: var(--color-accent);
          border: 1px solid color-mix(in oklab, var(--color-accent) 32%, transparent);
        }
        .blog-featured-label {
          padding: 0.45rem 0.7rem;
        }
        .blog-category-chip {
          padding: 0.35rem 0.6rem;
        }
        .blog-featured-media,
        .blog-post-media {
          position: relative;
          overflow: hidden;
          background: var(--color-bg-2);
        }
        .blog-featured-media {
          min-height: 320px;
          border-left: 1px solid var(--line);
        }
        .blog-featured-media::after,
        .blog-post-media::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }
        .blog-post-media {
          aspect-ratio: 16 / 10;
          border-bottom: 1px solid var(--line);
        }
        .blog-author-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid var(--line);
          padding-top: 1.25rem;
        }
        .blog-read-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-accent);
          font-family: var(--font-display);
          white-space: nowrap;
          transition: gap 180ms ease;
        }
        .group:hover .blog-read-link {
          gap: 0.75rem;
        }
        [data-theme="light"] .blog-featured-card,
        [data-theme="light"] .blog-post-card {
          background:
            linear-gradient(135deg, rgba(217, 149, 0, 0.08), transparent 44%),
            #fffdfa;
          box-shadow: 0 18px 50px rgba(28, 28, 26, 0.07);
        }
        [data-theme="light"] .blog-author-strip {
          background: transparent;
          color: var(--color-ink);
        }
        @media (max-width: 767px) {
          .blog-featured-media {
            min-height: 240px;
            border-left: 0;
            border-top: 1px solid var(--line);
          }
          .blog-author-strip {
            align-items: flex-start;
            flex-direction: column;
          }
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
        width: 36,
        height: 36,
        borderRadius: "999px",
        background:
          "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))",
        color: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: 0.5,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
