"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import PhoneField from "@/components/PhoneField";
import EmailField from "@/components/EmailField";

type Props = {
  prefillEmail?: string;
  nextPath?: string | null;
  signupSource?: string;
};

type RegisterFormData = {
  full_name: string;
  email: string;
  phone: string;
};

type RegisterUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  signup_source: string;
  is_new: boolean;
  created_at: string;
  last_login_at: string;
};

type RegisterResponse =
  | { success: true; data: { user: RegisterUser } }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: {
          fields?: {
            loc: (string | number)[];
            error?: string;
            msg?: string;
            type?: string;
          }[];
          max_per_hour?: number;
        };
      };
    };

const inputBase =
  "w-full bg-[var(--color-bg)] border text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] px-4 py-3 text-[14px] outline-none transition-colors rounded-xl";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-faint)] mb-1.5">
      {children}
      {required && <span className="text-[var(--color-accent)] ml-1">*</span>}
    </label>
  );
}

export default function RegisterForm({
  prefillEmail = "",
  nextPath = null,
  signupSource = "general",
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [serverError, setServerError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [user, setUser] = useState<RegisterUser | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: { full_name: "", email: prefillEmail, phone: "" },
  });

  const emailValue = watch("email");

  useEffect(() => {
    if (prefillEmail) setValue("email", prefillEmail);
  }, [prefillEmail, setValue]);

  // When success state is reached AND a next path is present, the user was
  // mid-flow (clicked like / comment, hit register-gate). Auto-redirect them
  // back so they can finish what they came for. When there's no next path,
  // they signed up cold — let them read the confirmation and click through.
  useEffect(() => {
    if (status !== "sent" || !nextPath) return;
    const t = setTimeout(() => router.push(nextPath), 1500);
    return () => clearTimeout(t);
  }, [status, nextPath, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setStatus("sending");
    setServerError("");
    setRateLimited(false);

    let res: Response;
    try {
      res = await fetch("/api/auth/register-web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.full_name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          signup_source: signupSource,
        }),
      });
    } catch {
      setStatus("error");
      setServerError("Network error — please check your connection and try again.");
      return;
    }

    const body: RegisterResponse | null = await res.json().catch(() => null);

    if (res.ok && body?.success) {
      setUser(body.data.user);
      setStatus("sent");
      return;
    }

    setStatus("error");
    const code = body && !body.success ? body.error.code : "INTERNAL_ERROR";

    if (code === "VALIDATION_ERROR" && body && !body.success) {
      const fields = body.error.details?.fields ?? [];
      let mapped = 0;
      for (const f of fields) {
        const fieldName = f.loc[1];
        if (
          fieldName === "full_name" ||
          fieldName === "email" ||
          fieldName === "phone"
        ) {
          setError(fieldName, {
            type: "server",
            message: f.error ?? f.msg ?? "Please correct this field",
          });
          mapped += 1;
        }
      }
      if (mapped === 0) {
        setServerError(body.error.message || "Please check your details and try again.");
      }
      return;
    }

    if (code === "RATE_LIMITED") {
      setRateLimited(true);
      setServerError(
        "Too many sign-up attempts from this network. Please try again in an hour."
      );
      return;
    }

    setServerError(
      (body && !body.success && body.error.message) ||
        "Something went wrong on our side. Please try again in a moment."
    );
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--color-bg-2)",
    border: "1px solid var(--line-strong)",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 8px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)",
    textAlign: "left",
  };

  if (status === "sent" && user) {
    const firstName = user.full_name.trim().split(/\s+/)[0] || user.full_name;
    const greeting = user.is_new
      ? `Welcome to Ewooral, ${firstName}.`
      : `Welcome back, ${firstName}.`;
    const subcopy = user.is_new
      ? "Check your inbox — we've sent a welcome from Ewooral."
      : "Your sign-up details are updated. Good to see you again.";

    return (
      <div className="max-w-[560px] mx-auto" style={cardStyle}>
        <div className="px-8 py-14 text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{
              background: "rgba(245,184,32,0.12)",
              border: "2px solid rgba(245,184,32,0.4)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 14l5 5 11-11"
                stroke="var(--color-accent)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="font-display font-bold text-[24px] text-[var(--color-ink)] mb-3">
            {greeting}
          </h3>
          <p className="text-[var(--color-ink-dim)] text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
            {subcopy}
          </p>
          {nextPath ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-faint)]">
              Taking you back…
            </p>
          ) : (
            <a
              href="/"
              className="inline-block px-7 py-3 font-mono text-[12px] uppercase tracking-[0.18em] font-medium rounded-xl"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              Back to home
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto" style={cardStyle}>
      <div
        className="px-7 pt-6 pb-5 flex items-center gap-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(245,184,32,0.1)",
            border: "1px solid rgba(245,184,32,0.22)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1.5l2.18 4.42 4.88.71-3.53 3.44.83 4.86L9 12.65l-4.36 2.29.83-4.86L1.94 6.63l4.88-.71L9 1.5z"
              fill="var(--color-accent)"
              fillOpacity="0.9"
            />
          </svg>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] mb-0.5">
            Ewooral Identity
          </p>
          <h3 className="font-display text-[17px] font-semibold text-[var(--color-ink)]">
            Join Ewooral
          </h3>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="px-7 py-6"
      >
        <div className="grid gap-4">
          <div>
            <Label required>Full name</Label>
            <input
              type="text"
              placeholder="Ama Mensah"
              autoComplete="name"
              {...register("full_name", {
                required: "Please enter your full name",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: 120, message: "Under 120 characters" },
              })}
              className={`${inputBase} ${
                errors.full_name
                  ? "border-red-500"
                  : "border-white/10 focus:border-[var(--color-accent)]/50"
              }`}
            />
            {errors.full_name && (
              <p className="text-red-400 text-[12px] mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <Label required>Email address</Label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
              render={({ field }) => (
                <EmailField
                  {...field}
                  placeholder="ama@business.com"
                  autoComplete="email"
                  hasError={!!errors.email}
                  onApplySuggestion={(c) =>
                    setValue("email", c, { shouldValidate: true })
                  }
                  className={`${inputBase} ${
                    errors.email
                      ? "border-red-500"
                      : "border-white/10 focus:border-[var(--color-accent)]/50"
                  }`}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-400 text-[12px] mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label>Phone (optional)</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneField
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={!!errors.phone}
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-400 text-[12px] mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <div
            className={`mt-5 px-4 py-3 rounded-xl text-[13px] leading-relaxed ${
              rateLimited ? "text-[var(--color-ink)]" : "text-red-400"
            }`}
            style={{
              background: rateLimited
                ? "rgba(245,184,32,0.08)"
                : "rgba(239,68,68,0.08)",
              border: `1px solid ${
                rateLimited
                  ? "rgba(245,184,32,0.35)"
                  : "rgba(239,68,68,0.35)"
              }`,
            }}
            role="alert"
          >
            {serverError}
          </div>
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
          {status === "sending" ? "Joining…" : "Join Ewooral →"}
        </button>

        <p className="mt-4 text-center text-[11px] font-mono text-ink-faint tracking-[0.05em]">
          We&apos;ll never share your email. Unsubscribe in one click.
        </p>
      </form>
    </div>
  );
}
