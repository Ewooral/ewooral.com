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
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4 text-accent">
                Ewooral · Field notes
              </div>
              <h1
                className="font-display font-display-tight leading-[0.95]"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                Things we&apos;ve been thinking about.
              </h1>
            </div>
            <p
              className="text-ink-dim leading-relaxed max-w-md text-base md:text-lg"
              style={{ marginTop: "auto" }}
            >
              Product decisions, strategy, and the engineering behind Ahofe,
              PENT-OS, ew-plug, and ewooral-icons. Written by the people who
              build them. Honest, concrete, occasionally opinionated.
            </p>
          </div>
        </section>

        {/* Category chips */}
        {categories.length > 0 && (
          <nav
            aria-label="Filter by category"
            className="px-5 md:px-10 mt-12 max-w-6xl mx-auto"
          >
            <ul className="flex flex-wrap gap-2 list-none">
              <li>
                <Link
                  href="/blog"
                  className="inline-block px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors rounded-full border"
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
                      className="inline-block px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] no-underline transition-colors rounded-full border"
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
          <section className="px-5 md:px-10 mt-12 md:mt-16 max-w-6xl mx-auto">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block"
              style={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <article
                className="grid gap-8 md:gap-12 p-7 md:p-14"
                style={{
                  gridTemplateColumns: "1fr",
                  background:
                    "linear-gradient(135deg, rgba(245, 184, 32, 0.06) 0%, rgba(245, 184, 32, 0.02) 50%, transparent 100%)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "4px",
                  transition: "border-color 200ms ease, transform 200ms ease",
                }}
              >
                <header>
                  <div className="flex items-center gap-3 mb-6 text-[11px] font-mono uppercase tracking-[0.25em]">
                    <span
                      className="px-2.5 py-1"
                      style={{
                        background: "var(--color-accent)",
                        color: "var(--color-bg)",
                        borderRadius: "2px",
                      }}
                    >
                      Featured
                    </span>
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
                      fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    className="text-ink-dim leading-relaxed max-w-2xl"
                    style={{
                      fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                      lineHeight: 1.55,
                    }}
                  >
                    {blurbOf(featured)}
                  </p>
                </header>

                {featured.cover_image_url && (
                  <figure className="overflow-hidden border border-line bg-bg-2" style={{ borderRadius: "4px" }}>
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="w-full aspect-[16/7] object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                  </figure>
                )}

                <footer
                  className="flex items-center justify-between flex-wrap gap-4 pt-6 mt-2 border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex items-center gap-3">
                    <AuthorAvatar name={featured.author_name} />
                    <div className="flex flex-col">
                      <span className="text-sm font-display">
                        {featured.author_name}
                      </span>
                      {featured.reading_minutes != null && (
                        <span className="text-[11px] font-mono text-ink-faint">
                          {featured.reading_minutes} min read
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-display group-hover:gap-3 transition-all"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Read the post
                    <ArrowRight />
                  </span>
                </footer>
              </article>
            </Link>
          </section>
        )}

        {/* Remaining posts grid */}
        {rest.length > 0 && (
          <section className="px-5 md:px-10 mt-20 max-w-6xl mx-auto">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] mb-8 text-ink-faint">
              More posts
            </div>
            <div
              className="grid gap-8 md:gap-10"
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
                  <article className="flex flex-col h-full">
                    {p.cover_image_url && (
                      <div className="mb-4 overflow-hidden border border-line bg-bg-2" style={{ borderRadius: "4px" }}>
                        <img
                          src={p.cover_image_url}
                          alt={p.title}
                          className="w-full aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-ink-faint">
                      <span>{labelOf(p.category)}</span>
                      <span>·</span>
                      <time dateTime={p.published_at}>
                        {fmtDate(p.published_at)}
                      </time>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl leading-[1.15] mb-3 group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-ink-dim text-sm leading-relaxed mb-4">
                      {blurbOf(p)}
                    </p>
                    {p.reading_minutes != null && (
                      <span className="mt-auto text-[11px] font-mono text-ink-faint">
                        {p.reading_minutes} min read
                      </span>
                    )}
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
