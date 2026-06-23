import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { getLocale, getDirection } from "@/lib/i18n";

/* ───────────────────────────────────────────────────────────────────────────
 * Fullscreen route group — a minimal root layout for clean, chrome-free pages
 * (cinematic scroll story + diagnostic tooling). It supplies <html>/<body> and
 * the same self-hosted display/body fonts as the marketing site, but renders
 * NO header, footer, or floating rails. This keeps the site shell untouched.
 * ─────────────────────────────────────────────────────────────────────────── */

const cormorant = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/cormorant-latin-400.woff2", weight: "400", style: "normal" },
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

export const metadata: Metadata = {
  // These are internal/visual-test surfaces — keep them out of search indexes.
  robots: { index: false, follow: false },
};

export default async function FullscreenLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction}>
      {/* No overflow on <body>: setting overflow-x:hidden here makes the body a
          scroll container, which breaks `position: sticky` inside the page (the
          sticky hero would no longer pin to the viewport). Horizontal overflow
          is contained on each page's inner wrapper instead. */}
      <body
        className={`${jost.variable} ${cormorant.variable} ${arefRuqaa.variable} ${tajawal.variable} antialiased ${direction === "rtl" ? "font-body-ar" : "font-body-latin"}`}
        style={{ margin: 0, background: "#000", color: "#fff" }}
      >
        {children}
      </body>
    </html>
  );
}
