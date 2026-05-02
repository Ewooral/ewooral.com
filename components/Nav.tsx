"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#products", label: "Products" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

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
          href="#"
          className="flex items-center gap-2 text-ink no-underline"
        >
          <img
            src="/logo.png"
            alt="Ewooral & BFAM Holdings"
            className="h-10 w-10 rounded-full"
          />
          <span className="font-display font-extrabold text-[16px] tracking-[-0.02em]">
            Ewooral<span className="text-accent">&amp;</span>BFAM
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-9 list-none text-[13px] font-medium tracking-[0.08em] uppercase">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
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

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden md:inline-block cta-glow bg-accent text-bg px-7 py-[14px] font-bold text-[13px] tracking-[0.1em] uppercase no-underline transition-all duration-200"
        >
          Get in touch
        </a>

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
            const isActive = active === l.href.slice(1);
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
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-block bg-accent text-bg px-8 py-4 font-bold text-[14px] tracking-[0.1em] uppercase no-underline"
            >
              Get in touch
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
