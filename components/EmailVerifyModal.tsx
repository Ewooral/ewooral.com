"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { sendEmailVerification, verifyEmailCode } from "@/lib/emailVerify";

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
};

const CODE_LENGTH = 6;
const COOLDOWN_SECONDS = 30;

export default function EmailVerifyModal({ open, email, onClose, onVerified }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    setDigits(Array(CODE_LENGTH).fill(""));
    setError(null);
    setSuccess(false);
    sendCode(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (open && !success) {
      const t = setTimeout(() => inputsRef.current[0]?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open, success]);

  async function sendCode(silent = false) {
    setSending(true);
    setError(null);
    try {
      await sendEmailVerification(email);
      setCooldown(COOLDOWN_SECONDS);
    } catch (e) {
      if (!silent) setError((e as Error).message);
      else setError("Couldn't send a code. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function tryVerify(code: string) {
    setVerifying(true);
    setError(null);
    try {
      await verifyEmailCode(email, code);
      setSuccess(true);
      setTimeout(onVerified, 700);
    } catch (e) {
      setError((e as Error).message || "That code didn't work.");
      setDigits(Array(CODE_LENGTH).fill(""));
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } finally {
      setVerifying(false);
    }
  }

  function setDigit(i: number, raw: string) {
    const next = [...digits];
    const v = raw.replace(/\D/g, "");
    if (v.length > 1) {
      const chars = v.slice(0, CODE_LENGTH - i).split("");
      chars.forEach((c, idx) => { next[i + idx] = c; });
      setDigits(next);
      const filled = next.findIndex((d) => !d);
      const focusAt = filled === -1 ? CODE_LENGTH - 1 : filled;
      inputsRef.current[focusAt]?.focus();
      if (next.every((d) => d)) tryVerify(next.join(""));
      return;
    }
    next[i] = v;
    setDigits(next);
    if (v && i < CODE_LENGTH - 1) inputsRef.current[i + 1]?.focus();
    if (next.every((d) => d)) tryVerify(next.join(""));
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={success ? "Email verified" : "Verify your email"}
      subtitle={success ? "Thanks — we're submitting your form." : `We sent a 6-digit code to ${email}`}
    >
      {success ? (
        <div className="flex flex-col items-center py-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(245,184,32,0.12)", border: "2px solid rgba(245,184,32,0.35)" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l5 5 11-11" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-serif italic text-[var(--color-ink-dim)] text-sm">Continuing…</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-center mb-5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(245,184,32,0.10)", color: "var(--color-accent)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="flex gap-2 justify-center mb-4" onPaste={(e) => {
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
            if (pasted.length > 0) {
              e.preventDefault();
              const filled = pasted.padEnd(CODE_LENGTH, "").split("").slice(0, CODE_LENGTH);
              setDigits(filled);
              const idx = pasted.length >= CODE_LENGTH ? CODE_LENGTH - 1 : pasted.length;
              inputsRef.current[idx]?.focus();
              if (pasted.length === CODE_LENGTH) tryVerify(pasted);
            }
          }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={CODE_LENGTH}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                disabled={verifying}
                className="w-11 h-12 text-center font-display text-lg font-bold outline-none transition-colors rounded-lg"
                style={{
                  background: "var(--color-bg)",
                  border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "var(--line-strong)"}`,
                  color: "var(--color-ink)",
                }}
              />
            ))}
          </div>

          <div className="text-center mb-4 min-h-[20px]">
            {verifying ? (
              <span className="font-mono text-[11px] text-[var(--color-ink-dim)]">Verifying…</span>
            ) : error ? (
              <span className="font-mono text-[11px]" style={{ color: "#f87171" }}>{error}</span>
            ) : sending ? (
              <span className="font-mono text-[11px] text-[var(--color-ink-dim)]">Sending code…</span>
            ) : (
              <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">
                Check your inbox. The code expires in 10 minutes.
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => sendCode(false)}
              disabled={cooldown > 0 || sending}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-dim)] hover:text-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
            <span className="text-[var(--color-ink-faint)]">·</span>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
            >
              Change email
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
