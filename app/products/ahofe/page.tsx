import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ahoɔfɛ — Booking & business management for Ghana | Ewooral",
  description:
    "Ahoɔfɛ is the booking and management platform for salons, barbershops, spas and service businesses across Ghana. WhatsApp-first, Mobile Money-ready.",
};

const APK_URL = "https://cdn.ewooral.com/apps/ahofe-mobile.apk";
const REGISTER_URL = "https://ahofe.ewooral.com/register";
const WHATSAPP_URL =
  "https://wa.me/233546313876?text=Hi%2C%20I%20want%20to%20learn%20more%20about%20Aho%C9%94f%C9%9B";

const FEATURES: { icon: string; title: string; body: string }[] = [
  {
    icon: "📅",
    title: "Smart calendar",
    body: "Day, week, month views with drag-to-reschedule. Stop double-booking forever.",
  },
  {
    icon: "💬",
    title: "WhatsApp-first",
    body: "Send booking links, reminders, and receipts through the channel your customers actually use.",
  },
  {
    icon: "💳",
    title: "Mobile Money + cards",
    body: "Take deposits and tier billing with Paystack — MTN MoMo, Vodafone, AirtelTigo, Visa, Mastercard.",
  },
  {
    icon: "👥",
    title: "Customer profiles",
    body: "Tags, notes, history, no-show tracking, marketing opt-ins. Fresha-grade client management.",
  },
  {
    icon: "✨",
    title: "AI insights",
    body: "No-show risk, demand forecasts, customer lifetime value — only on the Business tier.",
  },
  {
    icon: "📲",
    title: "Mobile app",
    body: "Take bookings on the go. Android beta available now, iOS rolling out 2026.",
  },
];

const PLANS: {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  popular?: boolean;
}[] = [
  {
    name: "Free",
    price: "GH₵ 0",
    period: "forever",
    blurb: "For new businesses just getting started.",
    features: [
      "5 bookings/month",
      "1 staff member",
      "5 services",
      "Booking link to share on WhatsApp",
    ],
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "GH₵ 80",
    period: "/ month",
    blurb: "Single-location salons doing 1–2 stylists.",
    features: [
      "30 bookings/month",
      "3 staff members",
      "10 services",
      "50 SMS + WhatsApp / month",
      "Email notifications",
      "Dashboard & stats",
    ],
    cta: "Choose Starter",
  },
  {
    name: "Pro",
    price: "GH₵ 200",
    period: "/ month",
    blurb: "Growing salons that want analytics + segmentation.",
    features: [
      "Unlimited bookings",
      "Unlimited staff",
      "Unlimited services",
      "100 SMS + WhatsApp / month",
      "Customer segments (VIP, at-risk, new)",
      "Stylist performance leaderboard",
      "Revenue analytics + CSV export",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "GH₵ 600",
    period: "/ month",
    blurb: "Multi-stylist shops + AI-powered insights.",
    features: [
      "Everything in Pro",
      "Unlimited SMS + WhatsApp",
      "No-show risk predictor",
      "Revenue forecasting",
      "Customer lifetime value",
      "Weekly AI digest",
      "AI booking suggestions",
      "24/7 priority support",
    ],
    cta: "Choose Business",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do my customers need to download an app to book?",
    a: "No. Customers book through a simple web link you share on WhatsApp, Instagram, or anywhere else. They just open the link, pick a time, and confirm.",
  },
  {
    q: "Can I take deposits to reduce no-shows?",
    a: "Yes. Toggle deposits on per business, set a percentage (e.g. 20%), and customers pay through Paystack — Mobile Money or card — before the booking is confirmed.",
  },
  {
    q: "How do reminders work?",
    a: "Ahofe sends automatic 24-hour and 2-hour reminders via SMS, WhatsApp, and email — whichever channels you've enabled. Customers also get a confirmation when they book.",
  },
  {
    q: "Can my whole team use the dashboard?",
    a: "Yes. The Pro and Business tiers support unlimited staff. Each stylist can have their own availability, services, and performance stats.",
  },
  {
    q: "Does it work for businesses other than salons?",
    a: "Yes. Ahofe powers salons, barbershops, spas, nail studios, makeup studios, clinics, photography studios and tutoring services. The terminology adapts (e.g. 'stylist' becomes 'barber' or 'practitioner') based on what you select.",
  },
  {
    q: "What about my existing customer list?",
    a: "Import a CSV with name, phone, and email. We deduplicate on phone number so re-imports won't create duplicates.",
  },
  {
    q: "How do payments work?",
    a: "We use Paystack for both deposits (per booking) and your subscription. Paystack supports MTN Mobile Money, Vodafone Cash, AirtelTigo Money, Visa, Mastercard and Verve. You receive payouts to your bank or mobile wallet on Paystack's normal cycle.",
  },
  {
    q: "Is there an Android or iPhone app?",
    a: "An Android beta is available now — direct APK download. iOS App Store and Google Play releases are rolling out in 2026. The web dashboard works perfectly on phone browsers in the meantime.",
  },
  {
    q: "How is my data protected?",
    a: "Booking and customer data is hosted on encrypted servers in compliance with Ghana's Data Protection Act. Photos and uploads sit on Cloudflare R2. We never sell or share your data with third parties.",
  },
  {
    q: "What if I need help getting set up?",
    a: "Reach us on WhatsApp (link below) — typical response under an hour during business hours. Business tier customers get 24/7 priority support.",
  },
];

export default function AhofeProductPage() {
  return (
    <>
      <Nav />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pt-[100px] pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(245,184,32,0.10)",
                border: "1px solid rgba(245,184,32,0.30)",
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                For salons, barbers, spas in Ghana
              </span>
            </div>
            <h1 className="font-display font-bold text-[44px] sm:text-[60px] md:text-[78px] leading-[0.96] mb-5">
              Ahoɔfɛ —{" "}
              <span className="font-serif italic text-accent">beauty</span>,
              booked.
            </h1>
            <p className="text-lg md:text-xl text-ink-dim mb-8 max-w-xl">
              The all-in-one booking and business management platform built for
              salons across Ghana. WhatsApp reminders, Mobile Money deposits,
              and AI insights — in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={REGISTER_URL}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-[12px] uppercase tracking-[0.18em] font-medium transition-all"
                style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}
              >
                Start free →
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-[12px] uppercase tracking-[0.18em]"
                style={{
                  border: "1px solid var(--line-strong)",
                  color: "var(--color-ink)",
                }}
              >
                Talk on WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 font-mono text-[11px] text-ink-faint">
              <span>✓ No card to start</span>
              <span>✓ Free forever tier</span>
              <span>✓ 2-minute setup</span>
            </div>
          </div>

          {/* Right: phone mockups */}
          <div className="relative h-[480px]">
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, rgba(245,184,32,0.20), transparent 65%)",
              }}
            />
            <PhoneMockup variant="confirmation" offset={-30} rotate={-6} z={1} />
            <PhoneMockup variant="schedule" offset={30} rotate={6} z={2} />
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
              What's inside
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl leading-tight max-w-2xl mx-auto">
              Everything you need to run a busy salon — in your phone.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl"
                style={{
                  background: "var(--color-bg-2)",
                  border: "1px solid var(--line)",
                }}
              >
                <div className="text-[28px] mb-3">{f.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-16 md:py-24 border-t border-line"
        id="pricing"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
              Pricing
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
              Pay only when you grow.
            </h2>
            <p className="text-ink-dim">
              Start free. Upgrade when you need more bookings, staff, or AI features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className="p-6 rounded-2xl flex flex-col relative"
                style={{
                  background: p.popular
                    ? "linear-gradient(180deg, rgba(245,184,32,0.06), var(--color-bg-2))"
                    : "var(--color-bg-2)",
                  border: `1px solid ${p.popular ? "rgba(245,184,32,0.40)" : "var(--line)"}`,
                }}
              >
                {p.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.18em]"
                    style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}
                  >
                    Most popular
                  </div>
                )}
                <div className="font-display text-lg font-bold mb-1">{p.name}</div>
                <div className="text-[11px] text-ink-faint mb-4">{p.blurb}</div>
                <div className="mb-5">
                  <span className="font-display font-bold text-[32px] text-accent leading-none">
                    {p.price}
                  </span>
                  <span className="text-sm text-ink-dim ml-2">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <span style={{ color: "var(--color-accent)" }}>✓</span>
                      <span className="text-ink-dim leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={REGISTER_URL}
                  className="block text-center px-4 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-[0.18em] transition-all"
                  style={
                    p.popular
                      ? { background: "var(--color-accent)", color: "var(--color-bg)" }
                      : { border: "1px solid var(--line-strong)", color: "var(--color-ink)" }
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 font-mono text-[11px] text-ink-faint">
            All prices in GH₵. Switch tiers any time. No long-term contracts.
          </div>
        </div>
      </section>

      {/* ─── App download strip ───────────────────────────── */}
      <section className="px-6 md:px-10 py-16 border-t border-line">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
            Mobile app
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Take Ahoɔfɛ with you.
          </h2>
          <p className="text-ink-dim max-w-xl mx-auto mb-7">
            Download the Android beta now. Google Play and App Store releases
            rolling out 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={APK_URL}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}
            >
              ⬇ Android beta
            </a>
            <span
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[11px] uppercase tracking-[0.18em] opacity-60"
              style={{ border: "1px solid var(--line-strong)" }}
            >
              Google Play — coming soon
            </span>
            <span
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[11px] uppercase tracking-[0.18em] opacity-60"
              style={{ border: "1px solid var(--line-strong)" }}
            >
              App Store — coming soon
            </span>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-20 border-t border-line">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
              FAQ
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Common questions.
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group p-5 rounded-2xl cursor-pointer"
                style={{
                  background: "var(--color-bg-2)",
                  border: "1px solid var(--line)",
                }}
              >
                <summary className="font-display text-base md:text-lg font-semibold list-none flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <span
                    className="font-mono text-[20px] text-accent transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="text-sm text-ink-dim mt-3 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-24 border-t border-line text-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4">
          Ready to take{" "}
          <span className="font-serif italic text-accent">smarter bookings?</span>
        </h2>
        <p className="text-ink-dim mb-8 max-w-md mx-auto">
          Open your business account in under two minutes. No card required to start.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={REGISTER_URL}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-mono text-[12px] uppercase tracking-[0.18em] font-medium"
            style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}
          >
            Create business account
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-mono text-[12px] uppercase tracking-[0.18em]"
            style={{ border: "1px solid var(--line-strong)", color: "var(--color-ink)" }}
          >
            Ask on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

// ─── Phone mockups (CSS art, no external images) ──────────────────────────

function PhoneMockup({
  variant,
  offset,
  rotate,
  z,
}: {
  variant: "confirmation" | "schedule";
  offset: number;
  rotate: number;
  z: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        width: 240,
        height: 480,
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${offset}px), -50%) rotate(${rotate}deg)`,
        zIndex: z,
      }}
    >
      <div
        className="absolute inset-0 rounded-[36px] overflow-hidden"
        style={{
          background: "var(--color-bg)",
          border: "8px solid #0f2017",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full"
          style={{ background: "#0f2017" }}
        />
        <div className="flex items-center justify-between px-5 pt-3 pb-2 font-mono text-[9px] text-ink-faint">
          <span>9:41</span>
          <span>•••• 5G</span>
        </div>
        {variant === "confirmation" ? <ScreenConfirmation /> : <ScreenSchedule />}
      </div>
    </div>
  );
}

function ScreenConfirmation() {
  return (
    <div className="px-5 pt-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-accent mb-2">
        Booking confirmed
      </div>
      <div className="font-display font-bold text-[18px] leading-tight mb-1">
        See you soon, <span className="font-serif italic">Akua</span>.
      </div>
      <div className="text-[11px] text-ink-dim mb-5">
        Your <span className="font-serif italic text-ink">Box Braids</span> is held for{" "}
        <span className="text-accent">Thu, 22 May</span>.
      </div>
      <div
        className="p-3 rounded-xl mb-3 text-[10px]"
        style={{ background: "var(--color-bg-2)", border: "1px solid var(--line)" }}
      >
        <div className="flex justify-between py-1">
          <span className="text-ink-faint">Reference</span>
          <span className="font-mono">#09279C</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-ink-faint">Salon</span>
          <span>Gofe Barbershop</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-ink-faint">Time</span>
          <span>2:30 pm → 4:00 pm</span>
        </div>
      </div>
      <button
        className="w-full py-2.5 rounded-md font-mono text-[9px] uppercase tracking-[0.18em]"
        style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}
      >
        Add to calendar
      </button>
    </div>
  );
}

function ScreenSchedule() {
  const rows = [
    { time: "9:00 am", name: "Ama Serwaa", service: "Skin Fade", status: "Confirmed" },
    { time: "10:30 am", name: "Kojo Mensah", service: "Beard Trim", status: "Pending" },
    { time: "1:00 pm", name: "Yaa Asantewaa", service: "Box Braids", status: "Confirmed" },
    { time: "3:30 pm", name: "Kwame Boateng", service: "Kids Cut", status: "Confirmed" },
  ];
  return (
    <div className="px-4 pt-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-accent mb-1">
        Today
      </div>
      <div className="font-display font-bold text-[18px] mb-3">04 bookings</div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.time}
            className="p-2.5 flex items-center gap-2 rounded-md"
            style={{ background: "var(--color-bg-2)", border: "1px solid var(--line)" }}
          >
            <div className="flex-shrink-0 w-12">
              <div className="font-display font-bold text-[12px] text-accent leading-none">
                {r.time.split(" ")[0]}
              </div>
              <div className="font-mono text-[7px] uppercase text-ink-faint">
                {r.time.split(" ")[1]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-[10px] truncate">{r.name}</div>
              <div className="font-serif italic text-[9px] text-ink-dim truncate">
                {r.service}
              </div>
            </div>
            <span
              className="font-mono text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                background:
                  r.status === "Confirmed"
                    ? "rgba(143,184,154,0.14)"
                    : "rgba(245,184,32,0.14)",
                color:
                  r.status === "Confirmed" ? "#5cb87a" : "var(--color-accent)",
              }}
            >
              {r.status === "Confirmed" ? "Conf." : "Pend."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
