"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, FileText } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Booklet } from "@/content/site/booklets";
import { Container } from "@/components/ui/Container";

// The viewer pulls in pdfjs-dist + the pageflip — load it only on demand,
// client-side, after a booklet is opened (keeps initial bundle/SSR clean).
const PdfFlipbookViewer = dynamic(
  () => import("@/components/site/PdfFlipbookViewer"),
  { ssr: false },
);

interface WhatAwaitsYouProps {
  locale: Locale;
  booklets: Booklet[];
  whatsappNumber?: string | undefined;
}

export default function WhatAwaitsYou({
  locale,
  booklets,
  whatsappNumber,
}: WhatAwaitsYouProps) {
  const [active, setActive] = useState<Booklet | null>(null);
  const isAr = locale === "ar";
  const openLabel = isAr ? "تصفح الدفتر" : "Open Book";

  return (
    <Container className="max-w-6xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
        {booklets.map((booklet, idx) => (
          <article
            key={booklet.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-border/70 bg-brand-bg shadow-[0_2px_14px_oklch(0_0_0_/_5%)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-primary/40 animate-reveal-up"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            {/* Cover-style visual */}
            <div
              className="relative aspect-[3/4] overflow-hidden"
              style={{
                background: `linear-gradient(160deg, ${booklet.accent.replace(")", " / 0.22)")} 0%, oklch(0.16 0.018 58) 100%)`,
              }}
            >
              {/* Champagne double frame */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 rounded-[8px] border"
                style={{ borderColor: booklet.accent.replace(")", " / 0.5)") }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[1.4rem] rounded-[6px] border"
                style={{ borderColor: booklet.accent.replace(")", " / 0.25)") }}
              />
              {/* Spine */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-0 w-3"
                style={{ background: `linear-gradient(to right, ${booklet.accent.replace(")", " / 0.4)")}, transparent)` }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <BookOpen
                  className="size-10 transition-transform duration-500 group-hover:scale-110"
                  style={{ color: booklet.accent }}
                  aria-hidden="true"
                />
                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "oklch(0.97 0.012 84)",
                    fontFamily: "var(--font-display-ar), var(--font-display), serif",
                  }}
                >
                  {booklet.title[locale]}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: booklet.accent.replace(")", " / 0.4)"),
                    color: "oklch(0.9 0.05 84)",
                  }}
                >
                  <FileText className="size-3" aria-hidden="true" />
                  {booklet.sourceLabel[locale]}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-4 p-5">
              <p className="flex-1 text-sm leading-relaxed text-brand-muted-fg">
                {booklet.description[locale]}
              </p>
              <button
                type="button"
                onClick={() => setActive(booklet)}
                aria-label={`${openLabel}: ${booklet.title[locale]}`}
                className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                style={{
                  background: "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
                  color: "oklch(0.14 0.01 58)",
                  boxShadow: "0 10px 26px oklch(0.76 0.10 82 / 0.26)",
                }}
              >
                <BookOpen className="size-4" aria-hidden="true" />
                {openLabel}
              </button>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <PdfFlipbookViewer
          booklet={active}
          locale={locale}
          whatsappNumber={whatsappNumber}
          onClose={() => setActive(null)}
        />
      )}
    </Container>
  );
}
