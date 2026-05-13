"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "default" | "dark";
const THEME_ORDER: Theme[] = ["light", "default", "dark"];
const THEME_KEY = "ewooral_theme";

function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored && THEME_ORDER.includes(stored)) setTheme(stored);
  }, []);
  const cycle = useCallback(() => {
    setTheme((t) => {
      const next = THEME_ORDER[(THEME_ORDER.indexOf(t) + 1) % THEME_ORDER.length];
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);
  return { theme, cycle };
}

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, cycle } = useTheme();

  useEffect(() => {
    const sections = document.querySelectorAll("section[id], header[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-bg/70 border-b border-line">
      <div className="max-w-[1320px] mx-auto px-8 py-[18px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-ink no-underline"
        >
          <span className="flex items-center justify-center h-11 w-11 rounded-full border-2 border-accent">
            <img
              src="/logo.png"
              alt="Ewooral & BFAM Holdings"
              className="h-9 w-9 rounded-full"
            />
          </span>
          <span className="font-display font-extrabold text-[16px] tracking-[-0.02em]">
            Ewooral<span className="text-accent">&amp;</span>BFAM
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-9 list-none text-[13px] font-medium tracking-[0.08em] uppercase">
          {links.map((l) => {
            const isActive = active === l.href.slice(2);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative no-underline transition-colors hover:text-ink ${
                    isActive
                      ? "text-accent nav-link-active"
                      : "text-ink-dim"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop: theme toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={cycle}
            className="w-9 h-9 flex items-center justify-center text-ink-dim hover:text-accent transition-colors"
            title={`Theme: ${theme}`}
            aria-label="Toggle theme"
          >
            {theme === "default" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 0 0 14c4 0 7-3 7-7a7 7 0 0 0-7-7z" /><path d="M2 12h2M22 12h-2M12 2V4M12 22v-2" /></svg>
            ) : theme === "light" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <a
            href="/#contact"
            className="cta-glow bg-accent text-bg px-7 py-[14px] font-bold text-[13px] tracking-[0.1em] uppercase no-underline transition-all duration-200"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[2px] bg-ink transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-ink transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-ink transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-bg/98 backdrop-blur-xl transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center gap-8 pt-16 list-none">
          {links.map((l) => {
            const isActive = active === l.href.slice(2);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[18px] font-medium tracking-[0.1em] uppercase no-underline transition-colors ${
                    isActive ? "text-accent" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
          <li className="mt-4">
            <a
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-block bg-accent text-bg px-8 py-4 font-bold text-[14px] tracking-[0.1em] uppercase no-underline"
            >
              Get in touch
            </a>
          </li>
          <li className="mt-2">
            <button
              onClick={cycle}
              className="text-[14px] font-medium tracking-[0.08em] uppercase text-ink-dim hover:text-accent transition-colors"
            >
              Theme: {theme === "default" ? "Company" : theme === "light" ? "Light" : "Dark"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
