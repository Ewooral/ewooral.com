# Agency Website — Next.js 16 + Tailwind v4

A landing page for a Ghana-based digital agency. Built with **Next.js 16**, **React 19.2**, **Tailwind CSS v4**, **TypeScript**, managed with **pnpm**.

## Stack

- **Next.js 16.2.3** (App Router, Turbopack by default)
- **React 19.2**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **TypeScript 5.7+**
- **pnpm** for package management
- **Google Fonts** (Bricolage Grotesque, Instrument Serif, JetBrains Mono)

## How styling works

Tailwind v4 uses a **CSS-first config**. All design tokens live in `app/globals.css` inside an `@theme` block:

```css
@theme {
  --color-bg: #15151f;
  --color-accent: #f5b820;
  --font-display: "Bricolage Grotesque", sans-serif;
  /* ... */
}
```

This auto-generates utility classes: `bg-bg`, `text-accent`, `font-display`, `border-line`, etc. No `tailwind.config.js` needed.

The handful of effects Tailwind can't easily produce (warm gradient glow, noise textures, `clamp()` fluid typography, staggered reveal animations, marquee scroll) live as custom utility classes in `@layer utilities` — also in `globals.css`.

## Requirements

- **Node.js 20.9+** — Next.js 16 dropped Node 18. Run `nvm use` if you have nvm (`.nvmrc` is included).
- **pnpm 9+** — install with `npm install -g pnpm`.

## Getting started

```bash
pnpm install
pnpm dev
```

Open **http://localhost:3000**.

## Available scripts

```bash
pnpm dev       # Dev server (Turbopack)
pnpm build     # Production build
pnpm start     # Run production build
pnpm lint      # ESLint
```

## Project structure

```
agency-site/
├── app/
│   ├── globals.css        # Tailwind import + @theme tokens + custom utilities
│   ├── layout.tsx         # Root layout, fonts, SEO metadata
│   └── page.tsx           # Main page composition
├── components/
│   ├── Nav.tsx            # Sticky nav (client component for scroll observer)
│   ├── Hero.tsx           # Hero with poster visual
│   ├── Marquee.tsx        # Scrolling services strip
│   ├── Services.tsx       # 3 pricing cards
│   ├── Process.tsx        # 4-step workflow
│   ├── Clients.tsx        # Target verticals + testimonial
│   ├── FinalCTA.tsx       # Email CTA
│   └── Footer.tsx
├── postcss.config.mjs     # @tailwindcss/postcss plugin
├── eslint.config.mjs      # Flat ESLint config
├── next.config.ts
├── tsconfig.json
├── package.json
├── .nvmrc                 # Node version pin
└── .npmrc                 # pnpm config
```

## Placeholders to replace

| Placeholder | Found in | Replace with |
|---|---|---|
| `[Your Brand Name]` | layout.tsx, Nav, Clients, Footer | Your actual brand |
| `[Your.Brand]` | Hero (poster tag) | Brand in dotted style |
| `[Your Name]` | Clients (testimonial) | Your real name |
| `hello@yourbrand.gh` | FinalCTA | Your real email |
| `wa.me/233000000000` | Footer | Your real WhatsApp number |

VS Code → Ctrl/Cmd+Shift+H for project-wide find & replace.

## Deploy

### Vercel (recommended)
Push to GitHub → import on https://vercel.com → Deploy. Free, ~60 seconds, auto-detects pnpm + Next.js.

### Netlify
Push to GitHub → import on https://app.netlify.com → build command `pnpm build`, publish `.next`.

## Custom domain
Register a `.com.gh` domain via a NITA-accredited registrar (~GH₵150/year), then point DNS at Vercel/Netlify.

## SEO notes
- Metadata is in `app/layout.tsx` (title, description, keywords, OG tags)
- Tweak keywords for your target cities
- After deploy, submit URL to [Google Search Console](https://search.google.com/search-console)
