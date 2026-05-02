export default function Hero() {
  return (
    <header
      id="home"
      className="relative pt-[140px] pb-[120px] min-h-screen flex items-center"
    >
      <div className="max-w-[1320px] mx-auto px-8 relative z-[2] w-full">
        <div className="grid md:grid-cols-2 gap-[60px] items-center w-full">
          {/* Left column */}
          <div>
            <div className="reveal reveal-d1 eyebrow-line flex items-center gap-[14px] text-[12px] font-medium tracking-[0.2em] uppercase text-ink-dim mb-8">
              Accra &middot; Ghana &middot; Est. 2026
            </div>

            <h1 className="reveal reveal-d2 font-display font-extrabold mb-8">
              Technology that
              <br />
              <span className="text-accent">builds wealth</span>
              <br />
              <span className="font-serif italic font-normal tracking-[-0.02em]">
                &mdash; for African businesses.
              </span>
            </h1>

            <p className="reveal reveal-d3 text-[18px] text-ink-dim max-w-[480px] mb-11 leading-[1.6]">
              We build products that solve real problems &mdash; from AI safety
              tools to digital infrastructure. We also help Ghanaian
              professionals and businesses establish serious online presence
              through our agency arm.
            </p>

            <div className="reveal reveal-d4 flex gap-5 items-center flex-wrap">
              <a
                href="#contact"
                className="cta-glow inline-block bg-accent text-bg px-7 py-[14px] font-bold text-[13px] tracking-[0.1em] uppercase no-underline transition-all duration-200"
              >
                Work with us
              </a>
              <a
                href="#products"
                className="text-ink no-underline text-[13px] font-medium tracking-[0.1em] uppercase py-[14px] border-b border-line-strong hover:border-accent transition-colors"
              >
                See our products &rarr;
              </a>
            </div>
          </div>

          {/* Right column — poster visual */}
          <div className="reveal reveal-d5 relative aspect-[1/1.1] max-w-[540px] w-full md:justify-self-end mx-auto">
            {/* Floating badge */}
            <div className="badge-tilt absolute top-10 -right-[30px] md:-right-[30px] bg-accent text-bg px-[22px] py-[14px] font-bold text-[11px] tracking-[0.15em] uppercase z-[3]">
              &uarr; Now Live
            </div>

            {/* Poster */}
            <div className="poster-shadow absolute inset-0 border border-line-strong rounded-[4px] overflow-hidden p-8 flex flex-col justify-between bg-gradient-to-br from-[#1e3f2e] to-[#0a1a10]">
              {/* Tag */}
              <div className="flex justify-between font-mono text-[11px] text-ink-faint tracking-[0.05em]">
                <span>BFAM / Holdings</span>
                <span className="text-accent">&bull; LIVE</span>
              </div>

              {/* Headline */}
              <div className="font-serif text-fluid-headline text-ink">
                Built
                <br />
                in <em className="text-accent">Accra,</em>
                <br />
                shipped
                <br />
                worldwide.
              </div>

              {/* Mini grid */}
              <div className="grid grid-cols-3 gap-[1px] bg-line border border-line -mt-3">
                {[
                  { label: "01" },
                  { label: "02", fill: true },
                  { dot: true },
                  { dot: true },
                  { label: "05" },
                  { label: "06", fill: true },
                  { label: "07", fill: true },
                  { label: "08" },
                  { dot: true },
                ].map((cell, i) => (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center font-mono text-[10px] relative ${
                      cell.fill
                        ? "bg-accent text-bg"
                        : "bg-[#142a1e] text-ink-faint"
                    }`}
                  >
                    {cell.dot ? (
                      <span className="block w-2 h-2 rounded-full bg-ink-dim" />
                    ) : (
                      cell.label
                    )}
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="flex justify-between items-end font-mono text-[11px] text-ink-faint">
                <span>Products &middot; Agency &middot; AI</span>
                <span className="font-display font-extrabold text-[48px] text-accent leading-none tracking-[-0.04em]">
                  26&apos;
                </span>
              </div>
            </div>

            {/* Scribble — hidden on mobile */}
            <div className="scribble-tilt hidden lg:flex absolute -left-20 -bottom-8 text-accent font-serif italic text-2xl items-center gap-2 pointer-events-none">
              family-built
              <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                <path
                  d="M2 25 Q 20 5, 45 15 L 38 8 M 45 15 L 38 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
