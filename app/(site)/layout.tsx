import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { getLocale, getDirection } from "@/lib/i18n";
import { getContent } from "@/content/site";
import PublicHeader from "@/components/site/PublicHeader";
import PublicFooter from "@/components/site/PublicFooter";
import FloatingContactRail from "@/components/site/FloatingContactRail";

/* ───────────────────────────────────────────────────────────────────────────
 * Self-hosted premium typography (served from /public/fonts).
 *   Latin display → Cormorant Garamond   (--font-display)
 *   Latin body    → Jost                  (--font-geist-sans)
 *   Arabic display → Aref Ruqaa           (--font-display-ar)
 *   Arabic body    → Tajawal              (--font-body-ar)
 * ─────────────────────────────────────────────────────────────────────────── */

const cormorant = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/cormorant-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/cormorant-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/cormorant-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/cormorant-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/cormorant-latin-700.woff2", weight: "700", style: "normal" },
  ],
});

const jost = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    { path: "../../public/fonts/jost-latin-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/jost-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/jost-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/jost-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/jost-latin-700.woff2", weight: "700", style: "normal" },
  ],
});

const arefRuqaa = localFont({
  variable: "--font-display-ar",
  display: "swap",
  src: [
    { path: "../../public/fonts/aref-ruqaa-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/aref-ruqaa-arabic-700.woff2", weight: "700", style: "normal" },
  ],
});

const tajawal = localFont({
  variable: "--font-body-ar",
  display: "swap",
  src: [
    { path: "../../public/fonts/tajawal-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/tajawal-arabic-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/tajawal-arabic-700.woff2", weight: "700", style: "normal" },
  ],
});

// TODO: replace with verified production domain before launch
const SITE_URL = "https://qasralfarah.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${content.seo.home.title}`,
      default: content.seo.home.title,
    },
    description: content.seo.home.description,
    openGraph: {
      siteName: content.seo.home.title,
      locale: locale === "ar" ? "ar_JO" : "en_US",
      type: "website",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`${jost.variable} ${cormorant.variable} ${arefRuqaa.variable} ${tajawal.variable} antialiased min-h-screen flex flex-col bg-brand-bg text-brand-fg ${direction === "rtl" ? "font-body-ar" : "font-body-latin"}`}
      >
        <PublicHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <PublicFooter />
        <FloatingContactRail />
      </body>
    </html>
  );
}
