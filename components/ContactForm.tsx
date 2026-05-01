"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

const services = [
  "Website",
  "Brand Identity",
  "Social Media Management",
  "AI / Software Product",
  "Other",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://bfam-backend-api.ewooral.com";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const inputBase =
  "w-full bg-bg border border-bg/40 text-ink placeholder:text-ink/40 px-5 py-4 text-[15px] outline-none transition-colors rounded-[2px]";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

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
      setServerError(
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-[520px] mx-auto"
    >
      <div className="grid gap-5">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Your name *"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className={`${inputBase} ${errors.name ? "border-red-600" : "border-bg/30 focus:border-bg/60"}`}
          />
          {errors.name && (
            <p className="text-red-800 font-medium text-[13px] mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email address *"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className={`${inputBase} ${errors.email ? "border-red-600" : "border-bg/30 focus:border-bg/60"}`}
          />
          {errors.email && (
            <p className="text-red-800 font-medium text-[13px] mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            type="tel"
            placeholder="Phone number (optional)"
            {...register("phone", {
              pattern: {
                value: /^[+]?[\d\s()-]{7,20}$/,
                message: "Please enter a valid phone number",
              },
            })}
            className={`${inputBase} ${errors.phone ? "border-red-600" : "border-bg/30 focus:border-bg/60"}`}
          />
          {errors.phone && (
            <p className="text-red-800 font-medium text-[13px] mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <select
            {...register("service")}
            className={`${inputBase} border-bg/30 focus:border-bg/60 appearance-none`}
          >
            <option value="" className="text-ink bg-bg">
              What do you need? (optional)
            </option>
            {services.map((s) => (
              <option key={s} value={s} className="text-ink bg-bg">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <textarea
            placeholder="Tell us about your project *"
            rows={5}
            {...register("message", {
              required: "Message is required",
              minLength: { value: 10, message: "Message must be at least 10 characters" },
              maxLength: { value: 2000, message: "Message must be under 2000 characters" },
            })}
            className={`${inputBase} resize-none ${errors.message ? "border-red-600" : "border-bg/30 focus:border-bg/60"}`}
          />
          {errors.message && (
            <p className="text-red-800 font-medium text-[13px] mt-1">{errors.message.message}</p>
          )}
        </div>
      </div>

      {serverError && (
        <p className="text-red-800 font-medium text-[14px] mt-4 text-center">
          {serverError}
        </p>
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
