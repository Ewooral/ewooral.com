const items = [
  "AI Safety",
  "Web Platforms",
  "Branding",
  "Backend Systems",
  "Social Media",
  "Product Design",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-line overflow-hidden py-6 bg-bg-2">
      <div className="marquee-track flex gap-[60px] whitespace-nowrap font-serif italic text-[28px] text-ink-dim items-center">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-[60px]">
            <span>{item}</span>
            <span className="w-[6px] h-[6px] bg-accent rounded-full shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
