"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, subtitle, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-4 py-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "var(--color-bg-2)",
          border: "1px solid var(--line-strong)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.36)",
          maxHeight: "92vh",
          overflowY: "auto",
          animation: "fadeUp 0.32s cubic-bezier(0.2,0.8,0.2,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-[18px] font-semibold text-[var(--color-ink)] leading-tight">{title}</h3>
              {subtitle && (
                <p className="text-sm text-[var(--color-ink-dim)] mt-1 leading-relaxed">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
