"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function JoinEwooralCTA() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }
    router.push(`/register?email=${encodeURIComponent(trimmed)}&source=newsletter`);
  };

  return (
    <section
      id="join"
      className="px-5 md:px-10 py-24 md:py-32"
      style={{
        background:
          "linear-gradient(135deg, rgba(245, 184, 32, 0.04) 0%, transparent 60%)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5 text-accent">
          Join Ewooral
        </div>
        <h2
          className="font-display font-display-tight mb-5"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Get Ewooral updates without the noise.
        </h2>
        <p
          className="text-ink-dim leading-relaxed max-w-xl mx-auto mb-10"
          style={{ fontSize: "clamp(1rem, 1.4vw, 1.1rem)" }}
        >
          Product launches, opportunities, and events that fit your interests.
          Nothing else.
        </p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <label htmlFor="join-email" className="sr-only">
            Email address
          </label>
          <input
            id="join-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@business.com"
            autoComplete="email"
            className="flex-1 bg-[var(--color-bg)] border text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] px-5 py-3.5 text-[14px] outline-none transition-colors rounded-xl"
            style={{
              borderColor: error
                ? "rgba(239,68,68,0.6)"
                : "var(--line-strong)",
            }}
          />
          <button
            type="submit"
            className="px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.18em] font-medium rounded-xl transition-opacity hover:opacity-90"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            Join Ewooral →
          </button>
        </form>
        {error && (
          <p className="mt-3 text-red-400 text-[12px] text-center" role="alert">
            {error}
          </p>
        )}
        <p className="mt-5 text-[11px] font-mono text-ink-faint tracking-[0.05em]">
          We&apos;ll send a one-step welcome to your inbox. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
