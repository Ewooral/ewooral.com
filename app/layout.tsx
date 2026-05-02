import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ewooral & BFAM Holdings — Technology for African Businesses",
  description:
    "Family-founded technology company building AI safety products, web platforms, and digital services for African businesses and communities.",
  keywords: [
    "tech company Ghana",
    "AI safety Africa",
    "web design Accra",
    "software development Ghana",
    "BFAM Holdings",
    "Ewooral",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Ewooral & BFAM Holdings — Technology for African Businesses",
    description:
      "We build products that solve real problems — from AI safety tools to digital infrastructure for African businesses.",
    type: "website",
    locale: "en_GH",
    url: "https://ewooral.com",
    images: [
      {
        url: "/logo.png",
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
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
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
      <body>{children}</body>
    </html>
  );
}
