/**
 * Sitemap for ewooral.com — the marketing site.
 *
 * Static page list mirrors what's in app/*. Add new pages here when
 * they ship so Google can crawl them. Per-business pages live on
 * ahofe.ewooral.com, NOT here — same-origin rule for sitemaps. This
 * site's role is brand + product marketing.
 */
import type { MetadataRoute } from "next";

const SITE = "https://ewooral.com";

const STATIC_ENTRIES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/",              changeFrequency: "weekly",  priority: 1.0 },
  { path: "/products/ahofe", changeFrequency: "weekly", priority: 0.9 },
  { path: "/apply",         changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy",       changeFrequency: "yearly",  priority: 0.3 },
  { path: "/terms",         changeFrequency: "yearly",  priority: 0.3 },
];


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ENTRIES.map((s) => ({
    url: `${SITE}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));
}
