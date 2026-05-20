/**
 * robots.txt for ewooral.com — the marketing site.
 *
 * Everything is public, so we just point crawlers at the sitemap.
 * The backend API host (bfam-backend-api.ewooral.com) carries its
 * own Disallow:/ robots.txt so SEO juice consolidates here +
 * ahofe.ewooral.com.
 */
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://ewooral.com/sitemap.xml",
    host: "https://ewooral.com",
  };
}
