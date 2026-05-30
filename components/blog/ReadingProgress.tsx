"use client";

import { useEffect, useState } from "react";

/** Thin accent-coloured bar that grows across the top as the reader scrolls.
 *  Works on any vertically-scrolling page; auto-resizes via the document
 *  height observer. Respects prefers-reduced-motion (no easing transform). */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min(1, Math.max(0, scrollY / docH)) : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background:
            "linear-gradient(90deg, var(--color-accent), var(--color-accent-deep))",
          transition: "width 80ms linear",
          boxShadow: progress > 0 ? "0 1px 8px rgba(245, 184, 32, 0.6)" : "none",
        }}
      />
    </div>
  );
}
