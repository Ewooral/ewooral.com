const services = [
  {
    num: "01",
    title: "Websites that convert",
    body: "Fast, mobile-first websites with copy written to turn visitors into enquiries. Hosted, secure, and easy to update. Delivered in 2\u20133 weeks.",
    price: "GH\u20B5 3,500",
  },
  {
    num: "02",
    title: "Brand identity",
    body: "Logo, colours, typography, and a brand guide your future-self will thank you for. Looks sharp on a billboard, on Instagram, and on a business card.",
    price: "GH\u20B5 4,500",
  },
  {
    num: "03",
    title: "Social media management",
    body: "Monthly retainer covering content calendar, post design, captions, and engagement. We don\u2019t just post \u2014 we build a presence customers take seriously.",
    price: "GH\u20B5 1,800 / month",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-[120px] relative z-[2]">
      <div className="max-w-[1320px] mx-auto px-8">
        {/* Section head */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-[60px] mb-20 items-end">
          <div>
            <div className="font-mono text-[13px] text-accent tracking-[0.1em] mb-4">
              02 / Services
            </div>
            <h2 className="font-display font-bold">
              Our agency{" "}
              <span className="font-serif italic font-normal">arm.</span>
            </h2>
          </div>
          <p className="text-[17px] text-ink-dim leading-[1.6] max-w-[520px]">
            We help Ghanaian professionals and businesses look serious online.
            Three core packages. Pick what you need today, layer on the rest as
            you grow. No long contracts, no hidden fees.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 border-t border-l border-line">
          {services.map((s) => (
            <div
              key={s.num}
              className="p-[48px_36px] border-r border-b border-line transition-colors duration-300 hover:bg-accent/[0.04]"
            >
              <span className="block font-mono text-[11px] text-ink-faint mb-8">
                / {s.num}
              </span>
              <h3 className="font-display font-bold text-[28px] tracking-[-0.02em] mb-4 leading-[1.1]">
                {s.title}
              </h3>
              <p className="text-ink-dim text-[15px] leading-[1.6] mb-6">
                {s.body}
              </p>
              <div className="font-mono text-[13px] text-accent pt-5 border-t border-line">
                <span className="text-ink-faint">FROM</span> &nbsp; {s.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
