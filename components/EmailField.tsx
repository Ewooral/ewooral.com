"use client";

import { forwardRef, useMemo, type InputHTMLAttributes } from "react";

const COMMON_DOMAINS = [
  "gmail.com", "yahoo.com", "yahoo.co.uk", "outlook.com", "hotmail.com",
  "icloud.com", "live.com", "aol.com", "protonmail.com", "proton.me",
];

function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) m[i][0] = i;
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + cost);
    }
  }
  return m[a.length][b.length];
}

export function suggestDomain(email: string): string | null {
  if (!email || !email.includes("@")) return null;
  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1).toLowerCase().trim();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  let best: string | null = null;
  let bestDistance = 3;
  for (const known of COMMON_DOMAINS) {
    const d = levenshtein(domain, known);
    if (d > 0 && d < bestDistance) {
      bestDistance = d;
      best = known;
    }
  }
  return best ? email.slice(0, at + 1) + best : null;
}

type Props = InputHTMLAttributes<HTMLInputElement> & {
  verified?: boolean;
  hasError?: boolean;
  onApplySuggestion?: (corrected: string) => void;
};

const EmailField = forwardRef<HTMLInputElement, Props>(function EmailField(
  { verified, hasError, onApplySuggestion, value, className = "", ...rest },
  ref
) {
  const stringValue = typeof value === "string" ? value : "";
  const suggestion = useMemo(() => suggestDomain(stringValue), [stringValue]);

  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          type="email"
          value={value}
          {...rest}
          className={className}
          autoComplete="email"
          spellCheck={false}
          inputMode="email"
          style={{ paddingRight: verified ? "5.5rem" : undefined, ...(rest.style || {}) }}
        />
        {verified && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-wider pointer-events-none"
            style={{ color: "var(--color-accent)" }}
            title="Email verified"
          >
            ✓ verified
          </span>
        )}
      </div>
      {suggestion && !verified && !hasError && (
        <button
          type="button"
          onClick={() => onApplySuggestion?.(suggestion)}
          className="font-mono text-[11px] mt-1.5 text-left hover:underline"
          style={{ color: "var(--color-accent)" }}
        >
          Did you mean <strong>{suggestion}</strong>?
        </button>
      )}
    </div>
  );
});

export default EmailField;
