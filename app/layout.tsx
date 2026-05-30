import type { Metadata } from "next";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { fetchBranding, brandingStyleBlock } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Ewooral & BFAM Holdings — Technology for African Businesses",
  description:
    "Family-founded technology company building AI safety products, web platforms, and digital services for African businesses and communities.",
  keywords: [
    "tech company Ghana",
    "salon booking software Ghana",
    "Ahofe booking platform",
    "church management software Ghana",
    "web design Accra",
    "software development Ghana",
    "BFAM Holdings",
    "Ewooral",
  ],
  icons: {
    icon: "/favicon-v2.png",
    apple: "/favicon-v2.png",
  },
  other: {
    "fb:app_id": "1374403533187850",
  },
  openGraph: {
    title: "Ewooral & BFAM Holdings — Technology for African Businesses",
    description:
      "We build products that solve real problems — from AI safety tools to digital infrastructure for African businesses.",
    type: "website",
    locale: "en_GH",
    url: "https://ewooral.com",
    siteName: "Ewooral & BFAM Holdings",
    images: [
      {
        url: "https://ewooral.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Ewooral & BFAM Holdings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ewooral & BFAM Holdings — Technology for African Businesses",
    description:
      "We build products that solve real problems — from AI safety tools to digital infrastructure for African businesses.",
    images: ["https://ewooral.com/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Operator-driven branding — spec doc 116. Falls back to globals.css defaults if API errors.
  const branding = await fetchBranding();

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {branding && (
          <style
            id="branding-colors"
            dangerouslySetInnerHTML={{ __html: brandingStyleBlock(branding.colors) }}
            suppressHydrationWarning
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("ewooral_theme");if(t==="default"||t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);else document.documentElement.setAttribute("data-theme","light")}catch(e){document.documentElement.setAttribute("data-theme","light")}})()` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,500;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
