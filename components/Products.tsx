/**
 * Products section — backed by the bfam-platform-api products catalog.
 *
 * Owner ask 2026-06-03: make the public products list dynamic so the company
 * can flip a status (Pilot → Live) or add a card without a frontend deploy.
 * Backend at /api/v1/platform/products returns visible-only rows ordered by
 * display_order. Thumbnails come from R2 via platform.blog_media — same R2
 * pipeline blog covers use.
 *
 * Server Component — uses Next.js fetch with 5-min revalidate so the marketing
 * page stays cache-friendly. SEED_PRODUCTS is the safety fallback if the
 * platform-api is unreachable; the section never blanks.
 */

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ?? "https://platform-api.ewooral.com";

type Product = {
  id: string;
  slug: string;
  name: string;
  status: string;
  description: string;
  pricing: string | null;
  tags: string[];
  href: string | null;
  thumbnail_url: string | null;
  display_order: number;
  is_visible: boolean;
};

type Envelope<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } };

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  pilot: "Pilot",
  coming_soon: "2024+",
  paused: "Paused",
  archived: "Archived",
};

// Safety-fallback snapshot mirroring the migration's 3 rows. Used only if
// the platform-api is unreachable; the section never blanks on the public
// marketing page.
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod_ahofe",
    slug: "ahofe",
    name: "Ahoɔfɛ",
    status: "live",
    description:
      "Stop tracking 'is 2pm free?' messages in your WhatsApp DMs. Ahoɔfɛ gives salons, barbers, braiders, and clinics one link customers tap to book — and a phone-friendly dashboard to run the rest of the day. MoMo deposits, automatic reminders, AI insights on the higher tiers.",
    pricing: "From GH₵ 0/month",
    tags: ["Booking", "WhatsApp", "MoMo", "AI"],
    href: "/products/ahofe",
    thumbnail_url: null,
    display_order: 10,
    is_visible: true,
  },
  {
    id: "prod_pentos",
    slug: "pentos",
    name: "PENT-OS",
    status: "pilot",
    description:
      "Church and school management in one system — membership, attendance, giving, pastoral care. Currently being built for The Church of Pentecost (East Legon Worship Centre pilot), designed to scale to any denomination.",
    pricing: null,
    tags: ["Church", "School", "MoMo"],
    href: null,
    thumbnail_url: null,
    display_order: 20,
    is_visible: true,
  },
  {
    id: "prod_more",
    slug: "more-coming",
    name: "More coming",
    status: "coming_soon",
    description:
      "We're building tools that solve real problems for African businesses and institutions. AI safety, fintech, and communication infrastructure are on the roadmap.",
    pricing: null,
    tags: ["AI/ML", "Fintech", "Infrastructure"],
    href: null,
    thumbnail_url: null,
    display_order: 90,
    is_visible: true,
  },
];

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${PLATFORM_API}/api/v1/platform/products`, {
      // 5-minute revalidate keeps the marketing page cache-friendly. Admin
      // changes propagate within the window without us needing to fire a
      // tag-revalidation webhook for every edit.
      next: { revalidate: 300 },
    });
    if (!res.ok) return SEED_PRODUCTS;
    const json = (await res.json()) as Envelope<Product[]>;
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      return SEED_PRODUCTS;
    }
    return json.data;
  } catch {
    return SEED_PRODUCTS;
  }
}

export default async function Products() {
  const products = await fetchProducts();

  return (
    <section id="products" className="py-[120px] relative z-[2] bg-bg-2 border-y border-line">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-[60px] mb-20 items-end">
          <div>
            <div className="font-mono text-[13px] text-accent tracking-[0.1em] mb-4">
              01 / Products
            </div>
            <h2 className="font-display font-bold">
              What we&apos;re{" "}
              <span className="font-serif italic font-normal">building.</span>
            </h2>
          </div>
          <p className="text-[17px] text-ink-dim leading-[1.6] max-w-[520px]">
            We build technology products that solve real problems for African
            businesses and communities. Each product is designed to scale across
            the continent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => {
            const Card = p.href ? "a" : "div";
            const isExternal = p.href?.startsWith("http");
            return (
              <Card
                key={p.id}
                {...(p.href
                  ? isExternal
                    ? {
                        href: p.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : { href: p.href }
                  : {})}
                className={`border border-line rounded-[4px] p-8 transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.02] flex flex-col no-underline ${
                  p.href ? "hover:-translate-y-1 cursor-pointer" : ""
                }`}
              >
                {p.thumbnail_url && (
                  <div
                    className="mb-5 -mx-2 -mt-2 overflow-hidden bg-bg/40 border border-line/40"
                    style={{ borderRadius: "3px", aspectRatio: "16 / 10" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnail_url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-[22px] tracking-[-0.02em]">
                    {p.name}
                  </h3>
                  <span className="font-mono text-[10px] text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-[0.1em]">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <p className="text-ink-dim text-[15px] leading-[1.6] mb-4 flex-1">
                  {p.description}
                </p>
                {p.pricing && (
                  <div className="font-mono text-[13px] text-accent mb-4">
                    {p.pricing}
                  </div>
                )}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] text-ink-faint border border-line px-3 py-1 rounded-[2px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {p.href && (
                  <div className="mt-4 font-mono text-[12px] text-accent">
                    Try it &rarr;
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
