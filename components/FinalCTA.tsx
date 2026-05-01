import ContactForm from "./ContactForm";

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
        <h2 className="font-display font-bold text-bg mb-4">
          Ready to build{" "}
          <span className="font-serif italic font-normal">something</span>{" "}
          great?
        </h2>
        <p className="text-[18px] max-w-[540px] mx-auto mb-12 text-bg/75">
          Tell us about your project. We&apos;ll get back to you within
          24 hours.
        </p>
        <ContactForm />
        <div className="mt-10 text-bg/50 text-[13px]">
          or email us directly at{" "}
          <a
            href="mailto:admin@ewooral.com"
            className="text-bg/80 underline hover:text-bg transition-colors"
          >
            admin@ewooral.com
          </a>
        </div>
      </div>
    </section>
  );
}
