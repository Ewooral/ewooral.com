// components/InternshipCTA.tsx
"use client";

import Link from "next/link";

export default function InternshipCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]">
      {/* Ambient glow behind the CTA */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--color-accent)]/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[780px] mx-auto px-6 text-center relative z-10">
        {/* Eyebrow */}
        <p className="eyebrow-line flex items-center gap-3 text-[var(--color-accent)] font-mono text-[12px] tracking-[0.15em] uppercase mb-6 justify-center">
          We&apos;re hiring
        </p>

        {/* Headline */}
        <h2 className="font-display font-bold text-fluid-quote text-[var(--color-ink)] leading-[1.1] mb-6 reveal">
          Ready to build your future as{" "}
          <span className="text-[var(--color-accent)] relative">
            a resilient giant
            {/* Scribble underline */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[var(--color-accent)] opacity-70"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0 5 Q 25 0, 50 5 T 100 5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </span>
          ?
        </h2>

        {/* Subheadline */}
        <p className="text-[var(--color-ink-dim)] text-[18px] md:text-[20px] leading-relaxed mb-10 max-w-[540px] mx-auto reveal reveal-d1">
          Join{" "}
          <span className="font-serif italic text-[var(--color-ink)]">
            Ewooral & BFAM Holding&apos;s
          </span>{" "}
          internship program. Work on real products, learn from industry
          veterans, and ship code that impacts millions across Africa.
        </p>

        {/* Benefit pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal reveal-d2">
          {[
            "Real-world projects",
            "Mentorship",
            "Flexible hours",
            "Certificate",
            "Potential full-time role",
          ].map((benefit) => (
            <span
              key={benefit}
              className="px-4 py-2 text-[13px] font-medium rounded-full border border-[var(--line-strong)] text-[var(--color-ink-dim)] bg-[var(--color-bg)]/60 backdrop-blur-sm hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] transition-all duration-300"
            >
              {benefit}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <div className="reveal reveal-d3">
          <Link
            href="/apply"
            className="cta-glow group relative inline-flex items-center gap-3 bg-[var(--color-accent)] text-[var(--color-bg)] px-12 py-5 font-bold text-[15px] tracking-[0.08em] uppercase rounded-[2px] transition-all duration-300 hover:translate-y-[-2px]"
          >
            Apply Now
            {/* Animated arrow */}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <p className="text-[var(--color-ink-faint)] text-[13px] mt-4">
            Applications are open year-round &middot; Takes less than 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}