// TODO(doc-131 §1.6): static fallback while platform-api seed body is empty
// (body_json.content: []). Wins over app/blog/[slug]/page.tsx by Next.js
// file-system routing precedence. Delete this folder in a 1-line PR once
// Bediako ships body_html (or a non-empty body_json) for this slug.
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import ReadingProgress from "@/components/blog/ReadingProgress";

export const metadata: Metadata = {
  title: "Why we're updating Ahofe's pricing — and what we're including",
  description:
    "Starting July 2026, Ahofe gets new prices and built-in AI features. Here's the honest read on what changes, what doesn't, and how we handle the cedi.",
  openGraph: {
    title: "Why we're updating Ahofe's pricing",
    description:
      "AI is now built into every paid Ahofe tier. Here's the honest read on what changes, what doesn't, and how we handle the cedi.",
    type: "article",
    publishedTime: "2026-05-29T09:00:00Z",
    authors: ["Elijah Owusu Boahen"],
  },
};

/** Pricing data — duplicated locally to avoid coupling the post to API state
 *  during Phase 0. Migrates to backend Blog module data in Phase 1. */
const TIERS = [
  { name: "Free",     newPrice: "0",     oldPrice: "0",   delta: null,        best: "Try-before-buy" },
  { name: "Starter",  newPrice: "150",   oldPrice: "80",  delta: "+88%",      best: "1–3 stylist salons" },
  { name: "Pro",      newPrice: "400",   oldPrice: "200", delta: "+100%",     best: "5–10 stylist salons", featured: true },
  { name: "Pro+",     newPrice: "750",   oldPrice: "350", delta: "+114%",     best: "10–20 stylists" },
  { name: "Business", newPrice: "1,500", oldPrice: "600", delta: "+150%",     best: "20–50 stylists, multi-branch" },
  { name: "Custom",   newPrice: "—",     oldPrice: "—",   delta: "Contact",   best: "50+ stylists, chains", custom: true },
];

export default function PricingUpdatePost() {
  return (
    <>
      <Nav />
      <ReadingProgress />

      <article className="min-h-screen pb-32">
        {/* Hero */}
        <header
          className="px-5 md:px-10 pt-16 md:pt-28 max-w-4xl mx-auto"
          style={{ position: "relative" }}
        >
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-3 mb-10 text-[11px] font-mono uppercase tracking-[0.25em]"
          >
            <Link
              href="/blog"
              className="text-ink-faint hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Blog
            </Link>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-faint">Product updates</span>
          </nav>

          {/* Eyebrow */}
          <div className="font-mono text-[12px] uppercase tracking-[0.3em] mb-6 text-accent">
            Pricing update — effective 1 July 2026
          </div>

          {/* Headline */}
          <h1
            className="font-display font-display-tight mb-7"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
            }}
          >
            Why we&apos;re updating Ahofe&apos;s pricing
            <span style={{ color: "var(--color-accent)" }}>.</span>
          </h1>

          {/* Dek */}
          <p
            className="text-ink-dim max-w-2xl leading-relaxed"
            style={{
              fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
              lineHeight: 1.55,
            }}
          >
            AI is now built into every paid tier. Prices are going up. The cedi
            keeps moving, so we&apos;re writing down exactly how we handle it.
            An honest read — table of contents below.
          </p>

          {/* Byline */}
          <div
            className="mt-10 pt-6 flex items-center justify-between flex-wrap gap-5 border-t"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex items-center gap-3">
              <AuthorAvatar name="Elijah Owusu Boahen" />
              <div className="flex flex-col">
                <span className="text-sm font-display">
                  Elijah Owusu Boahen
                </span>
                <span className="text-[11px] font-mono text-ink-faint">
                  Founder · Ewooral &amp; BFAM Holdings
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[12px] font-mono text-ink-faint">
              <time dateTime="2026-05-29">29 May 2026</time>
              <span>·</span>
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* Body — narrow editorial column */}
        <section className="px-5 md:px-10 mt-16 md:mt-20 max-w-3xl mx-auto prose-blog">
          <p className="lead-drop-cap">
            This is a personal note from me, not a marketing announcement.
            Ahofe is updating its pricing on{" "}
            <strong>1 July 2026</strong>, and I want to walk through exactly
            why, what it includes, and what it means for you.
          </p>

          <SectionAnchor label="The short version" id="short-version" />
          <p>Three things are happening together:</p>
          <ol className="numbered-large">
            <li>
              <strong>AI is now built into every paid Ahofe tier</strong> —
              smart-reply drafts, no-show predictions, customer insights, and
              campaign-copy assist. Not as an add-on. Included.
            </li>
            <li>
              <strong>The prices are going up.</strong> Roughly 1.5× to 2.5×
              the current tier prices. This is the first price update in over
              a year.
            </li>
            <li>
              <strong>A new &ldquo;Custom for chains&rdquo; tier</strong> for
              salons running 5+ branches or 5,000+ active customers — quoted
              per opportunity.
            </li>
          </ol>

          <SectionAnchor label="What the new prices look like" id="prices" />
          <p>
            Each tier now includes a generous monthly allowance for SMS and AI
            assists. The full feature breakdown is on the{" "}
            <a
              href="https://ahofe.ewooral.com/pricing"
              target="_blank"
              rel="noreferrer"
            >
              Ahofe pricing page
            </a>
            .
          </p>
        </section>

        {/* Pricing comparison — visual treatment, breaks out of narrow column */}
        <section className="px-5 md:px-10 my-12 md:my-16 max-w-5xl mx-auto">
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {TIERS.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
          <p className="mt-6 text-[12px] font-mono text-ink-faint text-center">
            Prices in Ghana cedis (GH₵) per month. Always in cedis.
          </p>
        </section>

        <section className="px-5 md:px-10 max-w-3xl mx-auto prose-blog">
          <SectionAnchor label="Why now" id="why-now" />
          <p>Three honest reasons:</p>
          <p>
            <strong>One — AI changed what the product can do.</strong>{" "}
            Smart-reply drafts, no-show predictions, customer insights, weekly
            business digests. These features cost real money to run (we pay
            per query), and baking them into every paid tier — rather than
            charging extra — is the right product call. It&apos;s also the
            right pricing call. The tier you choose should reflect the size of
            your business, not whether you want the smart features.
          </p>
          <p>
            <strong>Two — costs went up.</strong> Hosting, SMS, API fees — all
            priced in dollars, all gradually more expensive in cedis. We&apos;ve
            absorbed it for over a year. We can keep building or we can keep
            absorbing it; both at the same time isn&apos;t sustainable.
          </p>
          <p>
            <strong>Three — the old prices undervalued the product.</strong>{" "}
            Starter at GH₵ 80 was below what a single receptionist costs. Pro
            at GH₵ 200 was below what most salons spend on no-shows in a
            month. Pricing the work at what it&apos;s worth — and what it
            saves you — is honest, not aggressive.
          </p>

          <SectionAnchor label="How we handle the cedi" id="cedi" />
        </section>

        {/* Pull quote */}
        <section className="px-5 md:px-10 my-12 max-w-4xl mx-auto">
          <blockquote className="pull-quote">
            <p>
              Ahofe is still priced in cedis. Not dollars. Not &ldquo;$10
              converted.&rdquo; <span style={{ color: "var(--color-accent)" }}>Cedis.</span>
            </p>
            <footer>You always know what you&apos;re paying.</footer>
          </blockquote>
        </section>

        <section className="px-5 md:px-10 max-w-3xl mx-auto prose-blog">
          <p>
            That said: the cedi has fallen 13% against the dollar in the past
            year, and we can&apos;t pretend that doesn&apos;t affect us.
            Here&apos;s what we&apos;re doing —{" "}
            <strong>quarterly re-peg with 60 days&apos; notice</strong>.
          </p>
          <ul>
            <li>
              Every quarter (January, April, July, October), we check the
              cedi-to-dollar rate against what it was the last time we set
              prices.
            </li>
            <li>
              If it&apos;s moved more than 5%, we publish new prices for{" "}
              <strong>60 days later</strong>. You get plenty of warning.
            </li>
            <li>
              If it hasn&apos;t moved much, nothing changes for that quarter.
            </li>
            <li>
              You&apos;ll always know about a price change at least 60 days
              before it applies to your account.
            </li>
          </ul>
          <p>
            This is the same way most Ghanaian businesses with dollar-priced
            costs (insurance, schools, even some landlords) handle it. We just
            said it out loud and put it on a calendar so there are no
            surprises.
          </p>
        </section>

        {/* Founding member band */}
        <section className="px-5 md:px-10 my-14 md:my-20 max-w-4xl mx-auto">
          <FoundingMemberBand />
        </section>

        <section className="px-5 md:px-10 max-w-3xl mx-auto prose-blog">
          <SectionAnchor label="What this means for current customers" id="current" />
          <p>
            <strong>If you signed up before today (2026-05-29)</strong>: you
            are either a founding member (price locked forever) or you&apos;ll
            be contacted directly with details about your transition. Either
            way, no surprises.
          </p>
          <p>
            <strong>If you sign up between now and 1 July 2026</strong>: you
            get the new tier features (AI, expanded quotas) immediately, but
            at the old prices for your first billing cycle.
          </p>
          <p>
            <strong>If you sign up on or after 1 July 2026</strong>: new
            prices apply.
          </p>

          <SectionAnchor label="One more thing" id="one-more" />
          <p>
            This is an unusual amount of detail for a pricing announcement,
            and that&apos;s deliberate. Pricing is one of the most important
            things a company does, and pretending it&apos;s casual or hiding
            the trade-offs is insulting. You deserve to see the math.
          </p>
          <p>
            If you have questions, reply to this post on WhatsApp (
            <a
              href="https://wa.me/447888374946"
              target="_blank"
              rel="noreferrer"
            >
              our line is here
            </a>
            ), or just email me directly. I read every message.
          </p>
          <p>Thank you, as always, for trusting us with your business.</p>

          <p className="signature">— Elijah</p>
        </section>

        {/* Author card */}
        <section className="px-5 md:px-10 mt-20 max-w-3xl mx-auto">
          <AuthorCard />
        </section>

        {/* CTA */}
        <section className="px-5 md:px-10 mt-12 max-w-3xl mx-auto">
          <CtaCard />
        </section>
      </article>
    </>
  );
}

/* ── Components ───────────────────────────────────────────────────────── */

function SectionAnchor({ label, id }: { label: string; id: string }) {
  return (
    <h2 id={id} className="section-heading">
      <span className="section-heading-mark" aria-hidden="true">§</span>
      {label}
    </h2>
  );
}

function TierCard({
  tier,
}: {
  tier: (typeof TIERS)[number];
}) {
  const featured = "featured" in tier && tier.featured;
  const custom = "custom" in tier && tier.custom;

  return (
    <div
      className="tier-card"
      style={{
        position: "relative",
        padding: "1.5rem 1.25rem 1.25rem",
        borderRadius: "4px",
        border: featured
          ? "1px solid var(--color-accent)"
          : "1px solid var(--line)",
        background: featured
          ? "linear-gradient(180deg, rgba(245, 184, 32, 0.06), transparent)"
          : "var(--color-bg-2)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      {featured && (
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--color-accent)",
            color: "var(--color-bg)",
            padding: "3px 10px",
            borderRadius: "2px",
            whiteSpace: "nowrap",
          }}
        >
          Most popular
        </span>
      )}
      <div className="font-display text-lg mb-1">{tier.name}</div>
      <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-ink-faint mb-4">
        {tier.best}
      </div>

      {custom ? (
        <div className="my-4">
          <div className="text-xl font-display">Contact sales</div>
          <div className="text-[12px] text-ink-dim mt-1">From ₵3,000/mo</div>
        </div>
      ) : (
        <div className="my-4">
          <div className="flex items-baseline gap-2">
            <span
              className="font-display"
              style={{
                fontSize: "1.85rem",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              GH₵{tier.newPrice}
            </span>
            <span className="text-[12px] text-ink-faint font-mono">/mo</span>
          </div>
          {tier.oldPrice !== "0" && tier.oldPrice !== "—" && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-[12px] font-mono text-ink-faint line-through"
              >
                was ₵{tier.oldPrice}
              </span>
              {tier.delta && (
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5"
                  style={{
                    background: "color-mix(in oklab, var(--color-accent) 14%, transparent)",
                    color: "var(--color-accent)",
                    borderRadius: "2px",
                  }}
                >
                  {tier.delta}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FoundingMemberBand() {
  return (
    <div
      style={{
        position: "relative",
        padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)",
        borderRadius: "4px",
        border: "1px solid var(--color-accent)",
        background:
          "linear-gradient(135deg, rgba(245, 184, 32, 0.08), rgba(245, 184, 32, 0.02))",
        overflow: "hidden",
      }}
    >
      <div
        className="font-mono uppercase tracking-[0.3em] mb-3"
        style={{
          fontSize: "11px",
          color: "var(--color-accent)",
        }}
      >
        ★ Founding member promise
      </div>
      <h2
        className="font-display mb-5"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        Founding members are protected. Forever.
      </h2>
      <div className="grid gap-5 md:gap-7 md:grid-cols-3 mt-7">
        <PromiseItem
          n="01"
          title="Your tier stays at your current price."
          body="Forever. Not for a year. Not until we get bigger. Forever."
        />
        <PromiseItem
          n="02"
          title="New features at the same price."
          body="As we add to your tier, you get them automatically. No upgrade required."
        />
        <PromiseItem
          n="03"
          title="Future price changes don't apply."
          body="This one, and every one after. Unless you choose to upgrade tiers."
        />
      </div>
      <p
        className="mt-8 leading-relaxed max-w-2xl text-ink-dim"
        style={{ fontSize: "0.95rem" }}
      >
        If you signed up early — back when there wasn&apos;t much reason to
        trust us yet — you&apos;re a founding member. That status is
        permanent. I&apos;ll be in touch personally over the next two weeks.
        You don&apos;t need to do anything.
      </p>
    </div>
  );
}

function PromiseItem({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div
        className="font-mono text-[11px] tracking-[0.2em] mb-2"
        style={{ color: "var(--color-accent)" }}
      >
        {n}
      </div>
      <div className="font-display text-base mb-1.5" style={{ lineHeight: 1.25 }}>
        {title}
      </div>
      <div className="text-sm text-ink-dim leading-relaxed">{body}</div>
    </div>
  );
}

function AuthorCard() {
  return (
    <div
      className="flex flex-col md:flex-row gap-6 items-start p-6 md:p-8"
      style={{
        border: "1px solid var(--line-strong)",
        borderRadius: "4px",
        background: "var(--color-bg-2)",
      }}
    >
      <AuthorAvatar name="Elijah Owusu Boahen" size={68} />
      <div className="flex-1">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] mb-1.5 text-ink-faint">
          Written by
        </div>
        <h3 className="font-display text-xl mb-2 leading-tight">
          Elijah Owusu Boahen
        </h3>
        <p className="text-ink-dim leading-relaxed text-sm mb-3 max-w-prose">
          Co-founder of Ewooral &amp; BFAM Holdings. Senior AI/ML engineer,
          former Google. Based in Accra. Builds Ahofe and writes about
          pricing, product, and what works in Ghanaian software.
        </p>
        <div className="flex gap-4 text-[13px] font-mono">
          <a
            href="https://wa.me/447888374946"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            WhatsApp →
          </a>
          <a
            href="https://ewooral.com"
            className="hover:underline text-ink-dim"
          >
            ewooral.com
          </a>
        </div>
      </div>
    </div>
  );
}

function CtaCard() {
  return (
    <div
      className="grid gap-6 md:gap-10 items-center p-7 md:p-10"
      style={{
        gridTemplateColumns: "1fr",
        background:
          "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))",
        color: "var(--color-bg)",
        borderRadius: "4px",
      }}
    >
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] mb-3 opacity-80">
          Try before deciding
        </div>
        <h3
          className="font-display mb-3"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Want to see Ahofe before you commit?
        </h3>
        <p
          className="leading-relaxed mb-6 max-w-xl"
          style={{ opacity: 0.85, fontSize: "0.95rem" }}
        >
          Free tier is free forever. No card required. Drops to Free
          automatically if you don&apos;t upgrade after the 7-day Business-tier
          trial. Sign up takes under two minutes.
        </p>
        <Link
          href="https://ahofe.ewooral.com/register"
          className="inline-flex items-center gap-2 px-5 py-3 font-display text-sm transition-transform hover:translate-x-0.5"
          style={{
            background: "var(--color-bg)",
            color: "var(--color-ink)",
            borderRadius: "3px",
          }}
        >
          Try Ahofe free
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function AuthorAvatar({ name, size = 36 }: { name: string; size?: number }) {
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
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "999px",
        background:
          "linear-gradient(135deg, var(--color-accent), var(--color-accent-deep))",
        color: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.38),
        letterSpacing: 0.5,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
