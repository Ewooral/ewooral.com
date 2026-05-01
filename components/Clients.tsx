const clients = [
  { name: "Lawyers & law firms", tag: "\u2192 trust + authority" },
  { name: "Doctors & clinics", tag: "\u2192 booking + credibility" },
  { name: "Churches & ministries", tag: "\u2192 community + outreach" },
  { name: "Schools & institutions", tag: "\u2192 enrollment + presence" },
  { name: "Salons & spas", tag: "\u2192 portfolio + bookings" },
  { name: "Real estate agents", tag: "\u2192 listings + leads" },
  { name: "Consultants & coaches", tag: "\u2192 positioning + reach" },
  { name: "Restaurants & caf\u00e9s", tag: "\u2192 menu + delivery" },
];

export default function Clients() {
  return (
    <section id="about" className="py-[120px] relative z-[2]">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-[60px] mb-20 items-end">
          <div>
            <div className="font-mono text-[13px] text-accent tracking-[0.1em] mb-4">
              03 / About
            </div>
            <h2 className="font-display font-bold">
              Family-founded.{" "}
              <span className="font-serif italic font-normal">
                Mission-driven.
              </span>
            </h2>
          </div>
          <p className="text-[17px] text-ink-dim leading-[1.6] max-w-[520px]">
            Ewooral &amp; BFAM Holdings is a technology company founded by the
            Boahen family. We build products that solve real problems for African
            businesses and communities, and we help professionals establish
            serious digital presence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left — who we serve */}
          <div>
            <h3 className="font-display font-bold text-[20px] mb-6">
              Who we serve
            </h3>
            <ul className="list-none border-t border-line">
              {clients.map((c) => (
                <li
                  key={c.name}
                  className="py-6 border-b border-line flex justify-between items-center text-[18px] transition-[padding] duration-200 hover:pl-3"
                >
                  <span>{c.name}</span>
                  <span className="font-mono text-[12px] text-ink-faint">
                    {c.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — founder statement */}
          <div>
            <p className="quote-mark text-fluid-quote-sm font-serif italic mb-10">
              We started BFAM because we saw a gap: Ghanaian businesses deserve
              world-class technology without paying world-class agency prices.
              We&apos;re a family that builds together &mdash; two founders,
              seven board members, one mission.
            </p>
            <div className="text-[14px] text-ink-dim tracking-[0.05em] mb-8">
              &mdash;{" "}
              <strong className="text-ink font-medium">
                Elijah Owusu Boahen &amp; John Oduro Boateng
              </strong>
              , Co-Founders
            </div>
            <div className="border-t border-line pt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display font-extrabold text-[32px] text-accent">
                  2
                </div>
                <div className="font-mono text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                  Founders
                </div>
              </div>
              <div>
                <div className="font-display font-extrabold text-[32px] text-accent">
                  7
                </div>
                <div className="font-mono text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                  Board Members
                </div>
              </div>
              <div>
                <div className="font-display font-extrabold text-[32px] text-accent">
                  2026
                </div>
                <div className="font-mono text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                  Est.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
