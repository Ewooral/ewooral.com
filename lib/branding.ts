/**
 * Operator-driven branding-colors API client (spec doc 116).
 *
 * Server-side fetched at request time in app/layout.tsx; result is
 * inlined as a <style> block in <head> so there's no flash of unstyled
 * brand. Falls back to the baked-in defaults in app/globals.css if the
 * API errors (network down, backend down, etc.) — the site keeps
 * working with the developer-default palette.
 *
 * Backend endpoint shipped 2026-05-28, commit 7623143 on bfam-backend.
 */

export interface BrandingColors {
  bg: string;
  bg_2: string;
  bg_3: string;
  ink: string;
  ink_dim: string;
  ink_faint: string;
  accent: string;
  accent_soft: string;
  line: string;
  sage: string;
  rose: string;
  info: string;
}

export interface BrandingPayload {
  colors: BrandingColors;
  version: string;
  updated_at: string | null;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://bfam-backend-api.ewooral.com";

/** SSR-fetched. 60s revalidate so admin changes propagate within a minute. */
export async function fetchBranding(): Promise<BrandingPayload | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/branding/colors`, {
      next: { revalidate: 60, tags: ["branding"] },
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (!body?.success || !body?.data?.colors) return null;
    return {
      colors: body.data.colors,
      version: body.data.version,
      updated_at: body.data.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Render the inline <style> block that overrides defaults from globals.css.
 *
 * Selector is scoped to the unthemed state — `html:not([data-theme="light"]):not([data-theme="dark"])`
 * — so the existing light + dark theme palettes (which users may have
 * explicitly selected) keep winning the cascade. Only the "default"
 * theme (the original warm-green Ewooral brand) absorbs the operator
 * palette from admin.
 *
 * If you want the operator palette to apply to light/dark too, change
 * the selector back to `:root` here AND remove the [data-theme="light"]
 * + [data-theme="dark"] overrides from globals.css. That's a deliberate
 * separate decision per audit-agent + owner sign-off.
 */
export function brandingStyleBlock(colors: BrandingColors): string {
  return [
    `html:not([data-theme="light"]):not([data-theme="dark"]) {`,
    `  --color-bg: ${colors.bg};`,
    `  --color-bg-2: ${colors.bg_2};`,
    `  --color-bg-3: ${colors.bg_3};`,
    `  --color-ink: ${colors.ink};`,
    `  --color-ink-dim: ${colors.ink_dim};`,
    `  --color-ink-faint: ${colors.ink_faint};`,
    `  --color-accent: ${colors.accent};`,
    `  --color-accent-soft: ${colors.accent_soft};`,
    `  --color-line: ${colors.line};`,
    `  --color-sage: ${colors.sage};`,
    `  --color-rose: ${colors.rose};`,
    `  --color-info: ${colors.info};`,
    `}`,
  ].join("\n");
}
