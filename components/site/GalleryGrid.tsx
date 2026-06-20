"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { GalleryItem } from "@/types/site-content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";

interface GalleryGridProps {
  locale: Locale;
  variant?: "home" | "all";
  items: GalleryItem[];
  labels: {
    heading: string;
    subheading: string;
    viewAll: string;
    filters?: Record<string, string>;
  };
  showFilters?: boolean;
}

export default function GalleryGrid({
  locale,
  variant = "home",
  items,
  labels,
  showFilters,
}: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayItems = items.filter(
    (item) =>
      variant === "home" ||
      activeFilter === "all" ||
      item.category === activeFilter
  );

  const filters = ["all", ...Array.from(new Set(items.map((i) => i.category)))];

  const handleIndexChange = useCallback((idx: number) => {
    setLightboxIndex(idx);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <Section
        className={
          variant === "home"
            ? "relative overflow-hidden"
            : "bg-transparent py-0 md:py-0"
        }
        style={
          variant === "home"
            ? { background: "linear-gradient(180deg, oklch(0.97 0.012 82) 0%, oklch(0.99 0.006 84) 100%)" }
            : undefined
        }
      >
        {/* Decorative background orbs */}
        {variant === "home" && (
          <>
            <div
              className="brand-orb absolute -start-1/4 bottom-0 w-2/5 aspect-square opacity-[0.07] pointer-events-none"
              style={{ background: "oklch(0.76 0.10 82)" }}
              aria-hidden="true"
            />
            <div
              className="brand-orb absolute -end-1/5 top-1/4 w-1/3 aspect-square opacity-[0.05] pointer-events-none"
              style={{ background: "oklch(0.88 0.04 18)" }}
              aria-hidden="true"
            />
          </>
        )}

        <Container>
          {variant === "home" && (
            <div className="text-center mb-14 space-y-5">
              {/* Eyebrow */}
              <span
                className="inline-block text-[0.65rem] font-bold tracking-[0.25em] uppercase animate-reveal-up"
                style={{ color: "oklch(0.76 0.10 82)", animationDelay: "0ms" }}
              >
                {locale === "ar" ? "معرض الصور" : "Photo Gallery"}
              </span>

              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-secondary tracking-tight animate-reveal-up"
                style={{
                  fontFamily: "var(--font-display-ar), var(--font-display), serif",
                  animationDelay: "80ms",
                }}
              >
                {labels.heading}
              </h2>

              {/* Animated gold divider */}
              <div
                className="flex items-center justify-center gap-2 animate-reveal-up"
                style={{ animationDelay: "160ms" }}
                aria-hidden="true"
              >
                <span
                  className="block h-px w-12 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 55%))",
                  }}
                />
                <span
                  className="block size-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.76 0.10 82 / 65%)" }}
                />
                <span
                  className="block size-1 rounded-full opacity-40"
                  style={{ background: "oklch(0.76 0.10 82)" }}
                />
                <span
                  className="block size-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.76 0.10 82 / 65%)", animationDelay: "0.4s" }}
                />
                <span
                  className="block h-px w-12 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, oklch(0.76 0.10 82 / 55%))",
                  }}
                />
              </div>

              <p
                className="text-brand-muted-fg text-base md:text-lg max-w-xl mx-auto leading-relaxed animate-reveal-up"
                style={{ animationDelay: "240ms" }}
              >
                {labels.subheading}
              </p>
            </div>
          )}

          {/* Filter chips — refined pill style */}
          {showFilters && labels.filters && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`group relative px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 overflow-hidden ${
                    activeFilter === f
                      ? "text-white"
                      : "bg-brand-muted text-brand-muted-fg border border-brand-border hover:border-brand-primary/40 hover:text-brand-fg hover:bg-brand-bg"
                  }`}
                  style={
                    activeFilter === f
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.78 0.11 82) 0%, oklch(0.68 0.10 76) 100%)",
                          boxShadow: "var(--brand-shadow-gold)",
                        }
                      : undefined
                  }
                >
                  {labels.filters![f] || f}
                </button>
              ))}
            </div>
          )}

          {/* Gallery grid — staggered mosaic layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {displayItems.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => variant === "all" && setLightboxIndex(idx)}
                className={`gallery-item group relative overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-bg hover:border-brand-primary/40 transition-all duration-500 text-start animate-reveal-up ${
                  variant === "all" ? "cursor-pointer" : "cursor-default"
                } ${
                  /* Alternate tall items for visual rhythm on home variant */
                  variant === "home" && idx === 0 ? "sm:row-span-2 sm:col-span-1" : ""
                }`}
                style={{
                  aspectRatio: variant === "home" && idx === 0 ? "3/4" : "4/3",
                  animationDelay: `${idx * 60}ms`,
                  boxShadow: "0 2px 10px oklch(0 0 0 / 5%)",
                }}
                aria-label={img.alt[locale]}
                disabled={variant !== "all"}
              >
                <Image
                  src={img.src}
                  alt={img.alt[locale]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-107"
                  style={{ transform: "scale(1)" }}
                />

                {/* Hover overlay with label */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-400"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.14 0.01 58 / 65%) 0%, transparent 55%)",
                  }}
                >
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "oklch(0.90 0.06 82)" }}
                  >
                    {img.alt[locale]}
                  </span>
                </div>

                {/* Thin gold frame on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 0 1.5px oklch(0.76 0.10 82 / 40%)",
                  }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          {variant === "home" && (
            <div
              className="mt-14 flex justify-center animate-reveal-up"
              style={{ animationDelay: "480ms" }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group rounded-full px-9 border-brand-border text-brand-fg hover:bg-brand-muted hover:border-brand-primary/35 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/gallery">
                  <span>{labels.viewAll}</span>
                  <span
                    className="inline-block ms-2 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </Button>
            </div>
          )}
        </Container>
      </Section>

      {variant === "all" && (
        <GalleryLightbox
          items={displayItems}
          index={lightboxIndex}
          locale={locale}
          onIndexChange={handleIndexChange}
          onClose={handleClose}
        />
      )}
    </>
  );
}
