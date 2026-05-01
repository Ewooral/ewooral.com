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

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-bg/70 border-b border-line">
      <div className="max-w-[1320px] mx-auto px-8 py-[18px] flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-[6px] text-ink no-underline"
        >
          <span className="inline-block w-[10px] h-[10px] bg-accent rounded-full mr-1 -translate-y-[1px] logo-mark-glow" />
          <span className="font-display font-extrabold text-[16px] tracking-[-0.02em]">
            Ewooral<span className="text-accent">&amp;</span>BFAM
          </span>
        </a>

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

        <a
          href="#contact"
          className="cta-glow inline-block bg-accent text-bg px-7 py-[14px] font-bold text-[13px] tracking-[0.1em] uppercase no-underline transition-all duration-200"
        >
          Get in touch
        </a>
      </div>
    </nav>
  );
}
