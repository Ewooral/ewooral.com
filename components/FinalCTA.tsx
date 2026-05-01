export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="cta-noise relative overflow-hidden py-[120px] text-center text-bg bg-gradient-to-br from-accent to-accent-deep"
    >
      <div className="max-w-[1320px] mx-auto px-8 relative">
        <div className="font-mono text-[13px] text-bg/60 tracking-[0.1em] mb-4">
          05 / Let&apos;s talk
        </div>
        <h2 className="font-display font-bold text-bg mb-8">
          Ready to build{" "}
          <span className="font-serif italic font-normal">something</span>{" "}
          great?
        </h2>
        <p className="text-[18px] max-w-[540px] mx-auto mb-12 text-bg/75">
          Whether you need a product built, a website launched, or a brand
          identity that commands respect &mdash; let&apos;s talk. Book a free
          30-minute discovery call.
        </p>
        <a
          href="mailto:admin@ewooral.com"
          className="cta-dark-lift inline-block bg-bg text-accent px-10 py-5 font-bold text-[14px] tracking-[0.1em] uppercase no-underline transition-transform duration-200"
        >
          admin@ewooral.com &rarr;
        </a>
      </div>
    </section>
  );
}
