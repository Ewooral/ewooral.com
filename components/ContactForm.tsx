"use client";

import { useState } from "react";

const services = [
  "Website",
  "Brand Identity",
  "Social Media Management",
  "AI / Software Product",
  "Other",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ewooral.com";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Something went wrong");
      }

      setStatus("sent");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-16">
        <div className="text-accent text-[48px] mb-4">&#10003;</div>
        <h3 className="font-display font-bold text-[24px] text-bg mb-3">
          Message sent!
        </h3>
        <p className="text-bg/75 text-[16px] mb-8">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-[13px] font-bold tracking-[0.1em] uppercase text-bg/60 hover:text-bg transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[520px] mx-auto">
      <div className="grid gap-5">
        {/* Name */}
        <div>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name *"
            required
            className="w-full bg-bg/20 border border-bg/30 text-bg placeholder:text-bg/40 px-5 py-4 text-[15px] outline-none focus:border-bg/60 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address *"
            required
            className="w-full bg-bg/20 border border-bg/30 text-bg placeholder:text-bg/40 px-5 py-4 text-[15px] outline-none focus:border-bg/60 transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number (optional)"
            className="w-full bg-bg/20 border border-bg/30 text-bg placeholder:text-bg/40 px-5 py-4 text-[15px] outline-none focus:border-bg/60 transition-colors"
          />
        </div>

        {/* Service */}
        <div>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full bg-bg/20 border border-bg/30 text-bg px-5 py-4 text-[15px] outline-none focus:border-bg/60 transition-colors appearance-none"
          >
            <option value="" className="text-bg bg-[#1a1a2e]">
              What do you need? (optional)
            </option>
            {services.map((s) => (
              <option key={s} value={s} className="text-bg bg-[#1a1a2e]">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your project *"
            required
            rows={5}
            className="w-full bg-bg/20 border border-bg/30 text-bg placeholder:text-bg/40 px-5 py-4 text-[15px] outline-none focus:border-bg/60 transition-colors resize-none"
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-red-300 text-[14px] mt-4 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="cta-dark-lift w-full mt-6 bg-bg text-accent px-10 py-5 font-bold text-[14px] tracking-[0.1em] uppercase transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
