const products = [
  {
    name: "Aho\u0254f\u025B",
    status: "Live",
    description:
      "Booking and business management platform for salons, barbershops, and spas in Ghana. Customers book online, owners manage everything from their phone.",
    tags: ["Booking", "SaaS", "WhatsApp"],
    href: "https://ahofe.ewooral.com",
  },
  {
    name: "BFAM Safety",
    status: "In Development",
    description:
      "AI-powered misinformation detection platform. Helps media houses, governments, and organisations identify and flag false narratives before they spread.",
    tags: ["AI/ML", "NLP", "B2B SaaS"],
    href: null,
  },
  {
    name: "More coming",
    status: "2025\u2013Q4",
    description:
      "We\u2019re building tools that solve real problems for African businesses. Payments, logistics, and communication infrastructure are on the roadmap.",
    tags: ["Fintech", "Logistics", "Comms"],
    href: null,
  },
];

export default function Products() {
  return (
    <section id="products" className="py-[120px] relative z-[2] bg-bg-2 border-y border-line">
      <div className="max-w-[1320px] mx-auto px-8">
        {/* Section head */}
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

        {/* Product cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => {
            const Card = p.href ? "a" : "div";
            return (
              <Card
                key={p.name}
                {...(p.href ? { href: p.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`border border-line rounded-[4px] p-8 transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.02] flex flex-col no-underline ${
                  p.href ? "hover:-translate-y-1 cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-[22px] tracking-[-0.02em]">
                    {p.name}
                  </h3>
                  <span className="font-mono text-[10px] text-accent bg-accent/10 px-3 py-1 rounded-full uppercase tracking-[0.1em]">
                    {p.status}
                  </span>
                </div>
                <p className="text-ink-dim text-[15px] leading-[1.6] mb-6 flex-1">
                  {p.description}
                </p>
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
