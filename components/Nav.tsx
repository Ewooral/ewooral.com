"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

type Theme = "light" | "default" | "dark";
const THEME_ORDER: Theme[] = ["light", "default", "dark"];
const THEME_KEY = "ewooral_theme";

type Viewer = {
  sub: string;
  name: string;
  email: string;
};

type MeResponse =
  | { success: true; data: { viewer: Viewer | null } }
  | { success: false; error?: { message?: string } };

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
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const { theme, cycle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  // Non-homepage routes (e.g. /blog, /blog/[slug]) — use the URL path rather
  // than the homepage's intersection-observer state so the right nav item
  // gets highlighted.
  const isOnHomepage = pathname === "/" || pathname === "";

  useEffect(() => {
    let alive = true;
    const refetch = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((r) => r.json() as Promise<MeResponse>)
        .then((body) => {
          if (alive && body.success) setViewer(body.data.viewer);
        })
        .catch(() => {
          if (alive) setViewer(null);
        });
    };
    refetch();
    // Re-fetch when the user returns to the tab (cross-tab auth) and when
    // the RegisterForm dispatches `ewooral:auth-changed` after a successful
    // signup — Nav lives in the layout so a soft router push doesn't
    // re-mount it, and the initial fetch fires before the cookie is set.
    const onFocus = () => refetch();
    const onAuth = () => refetch();
    window.addEventListener("focus", onFocus);
    window.addEventListener("ewooral:auth-changed", onAuth);
    return () => {
      alive = false;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("ewooral:auth-changed", onAuth);
    };
  }, []);

  const firstName = viewer?.name.trim().split(/\s+/)[0] ?? "";

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setViewer(null);
      setMenuOpen(false);
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }, [router]);

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
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-line" style={{ background: "var(--color-bg)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      <div className="max-w-[1320px] mx-auto px-6 md:px-8 py-4 md:py-[18px] flex items-center justify-between">
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
            const isAnchor = l.href.startsWith("/#");
            const isActive = isAnchor
              ? isOnHomepage && active === l.href.slice(2)
              : pathname === l.href || pathname.startsWith(l.href + "/");
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

        {/* Desktop: sign-in + theme toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {viewer ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[160px] truncate text-[12px] font-medium tracking-[0.08em] uppercase text-ink-dim">
                Hi, {firstName}
              </span>
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="text-[12px] font-medium tracking-[0.08em] uppercase text-ink-dim hover:text-accent transition-colors disabled:opacity-50"
              >
                {signingOut ? "Signing out" : "Sign out"}
              </button>
            </div>
          ) : (
            <a
              href="/register"
              className={`text-[12px] font-medium tracking-[0.08em] uppercase no-underline transition-colors ${
                pathname === "/register"
                  ? "text-accent"
                  : "text-ink-dim hover:text-ink"
              }`}
            >
              Sign in / up
            </a>
          )}
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

      {/* Mobile menu overlay.
          Tailwind v4 can't apply /alpha to plain-hex CSS vars (--color-bg is
          a hex), so `bg-bg/98` compiles but produces no fill → transparent
          sheet. Set background explicitly. */}
      <div
        className={`md:hidden fixed left-0 right-0 top-[73px] bottom-0 transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        }`}
        style={{
          background: "var(--color-bg)",
          borderTop: "1px solid var(--line)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
        }}
      >
        <div className="h-full overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5">
          <ul className="list-none space-y-2">
          {links.map((l) => {
            const isAnchor = l.href.startsWith("/#");
            const isActive = isAnchor
              ? isOnHomepage && active === l.href.slice(2)
              : pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between border px-4 py-4 text-[13px] font-semibold tracking-[0.18em] uppercase no-underline transition-colors ${
                    isActive ? "text-accent" : "text-ink hover:text-accent"
                  }`}
                  style={{
                    background: isActive ? "rgba(217, 149, 0, 0.1)" : "var(--color-bg-2)",
                    borderColor: isActive ? "var(--color-accent)" : "var(--line)",
                    borderRadius: "3px",
                  }}
                >
                  <span>{l.label}</span>
                  <span className="text-accent">→</span>
                </a>
              </li>
            );
          })}
          <li className="pt-3">
            <a
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-accent text-bg px-5 py-4 text-center font-bold text-[13px] tracking-[0.18em] uppercase no-underline"
              style={{ borderRadius: "3px" }}
            >
              Get in touch
            </a>
          </li>
          <li className="pt-2">
            {viewer ? (
              <div className="flex flex-col gap-3 border border-line bg-bg-2 p-4" style={{ borderRadius: "3px" }}>
                <span className="max-w-[240px] truncate text-[13px] font-medium tracking-[0.08em] uppercase text-ink-dim">
                  Hi, {firstName}
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="text-left text-[13px] font-medium tracking-[0.08em] uppercase text-ink hover:text-accent transition-colors disabled:opacity-50"
                >
                  {signingOut ? "Signing out" : "Sign out"}
                </button>
              </div>
            ) : (
              <a
                href="/register"
                onClick={() => setMenuOpen(false)}
                className={`block border px-4 py-4 text-[13px] font-semibold tracking-[0.14em] uppercase no-underline transition-colors ${
                  pathname === "/register"
                    ? "text-accent"
                    : "text-ink hover:text-accent"
                }`}
                style={{ background: "var(--color-bg-2)", borderColor: "var(--line)", borderRadius: "3px" }}
              >
                Sign in / Sign up
              </a>
            )}
          </li>
          <li className="pt-2">
            <button
              onClick={cycle}
              className="w-full border px-4 py-4 text-left text-[13px] font-semibold tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors"
              style={{ background: "var(--color-bg-2)", borderColor: "var(--line)", borderRadius: "3px" }}
            >
              Theme: {theme === "default" ? "Company" : theme === "light" ? "Light" : "Dark"}
            </button>
          </li>
        </ul>
        </div>
      </div>
    </nav>
  );
}
