const steps = [
  {
    num: "01",
    title: "Discovery call",
    body: "30 minutes. We learn your business, your customers, and what success looks like for you. Free, no pressure.",
  },
  {
    num: "02",
    title: "Proposal",
    body: "Within 48 hours you get a fixed-price proposal with timeline, deliverables, and what we need from you.",
  },
  {
    num: "03",
    title: "Design & build",
    body: "You see drafts early and often. Two rounds of revisions baked in, so you never feel locked out of the process.",
  },
  {
    num: "04",
    title: "Launch & support",
    body: "We ship it, train you on updates, and stick around for 30 days of free support. Then you decide if you want a retainer.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="py-[120px] relative z-[2] bg-bg-2 border-y border-line"
    >
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-[60px] mb-20 items-end">
          <div>
            <div className="font-mono text-[13px] text-accent tracking-[0.1em] mb-4">
              02 / Process
            </div>
            <h2 className="font-display font-bold">
              From{" "}
              <span className="font-serif italic font-normal">brief</span> to
              launch in four steps.
            </h2>
          </div>
          <p className="text-[17px] text-ink-dim leading-[1.6] max-w-[520px]">
            We keep it simple, document everything, and over-communicate.
            You&apos;ll always know what&apos;s happening and what&apos;s next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`pt-8 pb-8 pr-6 pl-8 relative ${
                i === 0 ? "border-l border-l-accent" : "border-l border-line"
              }`}
            >
              <div className="font-serif italic text-[64px] text-accent leading-none mb-5">
                {s.num}
              </div>
              <h4 className="text-[20px] font-bold tracking-[-0.01em] mb-[10px]">
                {s.title}
              </h4>
              <p className="text-[14px] text-ink-dim leading-[1.6]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
