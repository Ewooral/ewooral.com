"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneField from "@/components/PhoneField";

const services = [
  "Website",
  "Brand Identity",
  "Social Media Management",
  "AI / Software Product",
  "Other",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://bfam-backend-api.ewooral.com";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const inputBase =
  "w-full bg-[var(--color-bg)] border text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] px-4 py-3 text-[14px] outline-none transition-colors rounded-xl";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-faint)] mb-1.5">
      {children}
      {required && <span className="text-[var(--color-accent)] ml-1">*</span>}
    </label>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || "Something went wrong");
      }
      setStatus("sent");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--color-bg-2)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 8px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)",
    textAlign: "left",
  };

  if (status === "sent") {
    return (
      <div className="max-w-[520px] mx-auto" style={cardStyle}>
        <div className="px-8 py-12 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: "rgba(245,184,32,0.12)", border: "2px solid rgba(245,184,32,0.4)" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l5 5 11-11" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-display font-bold text-[22px] text-[var(--color-ink)] mb-2">
            Message sent!
          </h3>
          <p className="text-[var(--color-ink-dim)] text-[15px] mb-8">
            We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-accent)] hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[520px] mx-auto" style={cardStyle}>
      {/* Card header */}
      <div
        className="px-7 pt-6 pb-5 flex items-center gap-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(245,184,32,0.1)", border: "1px solid rgba(245,184,32,0.22)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="3.5" width="15" height="11" rx="1.5" stroke="var(--color-accent)" strokeWidth="1.4"/>
            <path d="M1.5 6l7.5 5 7.5-5" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] mb-0.5">
            Ewooral & BFAM Holdings
          </p>
          <h3 className="font-display text-[17px] font-semibold text-[var(--color-ink)]">
            Start a conversation
          </h3>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-7 py-6">
        <div className="grid gap-4">
          {/* Name */}
          <div>
            <Label required>Your name</Label>
            <input
              type="text"
              placeholder="Ama Mensah"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              className={`${inputBase} ${errors.name ? "border-red-500" : "border-white/10 focus:border-[var(--color-accent)]/50"}`}
            />
            {errors.name && <p className="text-red-400 text-[12px] mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label required>Email address</Label>
            <input
              type="email"
              placeholder="ama@business.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
              className={`${inputBase} ${errors.email ? "border-red-500" : "border-white/10 focus:border-[var(--color-accent)]/50"}`}
            />
            {errors.email && <p className="text-red-400 text-[12px] mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label>Phone number</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneField value={field.value ?? ""} onChange={field.onChange} error={!!errors.phone} />
              )}
            />
            {errors.phone && <p className="text-red-400 text-[12px] mt-1">{errors.phone.message}</p>}
          </div>

          {/* Service */}
          <div>
            <Label>What do you need?</Label>
            <select
              {...register("service")}
              className={`${inputBase} border-white/10 focus:border-[var(--color-accent)]/50 appearance-none`}
            >
              <option value="" style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
                Select a service (optional)
              </option>
              {services.map((s) => (
                <option key={s} value={s} style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <Label required>Tell us about your project</Label>
            <textarea
              placeholder="Give us a brief overview..."
              rows={4}
              {...register("message", {
                required: "Message is required",
                minLength: { value: 10, message: "At least 10 characters" },
                maxLength: { value: 2000, message: "Under 2000 characters" },
              })}
              className={`${inputBase} resize-none ${errors.message ? "border-red-500" : "border-white/10 focus:border-[var(--color-accent)]/50"}`}
            />
            {errors.message && <p className="text-red-400 text-[12px] mt-1">{errors.message.message}</p>}
          </div>
        </div>

        {serverError && (
          <p className="text-red-400 text-[13px] mt-4 text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full mt-5 px-8 py-3.5 font-mono text-[12px] uppercase tracking-[0.18em] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-bg)",
          }}
        >
          {status === "sending" ? "Sending..." : "Send message →"}
        </button>
      </form>
    </div>
  );
}
