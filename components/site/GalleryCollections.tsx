"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { GalleryItem, GalleryCollection, GalleryCategory } from "@/types/site-content";
import { Container } from "@/components/ui/Container";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";

interface GalleryCollectionsProps {
  locale: Locale;
  items: GalleryItem[];
  collections: GalleryCollection[];
  labels: {
    filters: Record<string, string>;
    /** Localized "photos" word for the image count, e.g. "صورة" / "photos". */
    photosLabel: string;
    /** Localized "View collection" action used as the card aria hint. */
    viewLabel: string;
  };
}

interface ResolvedCollection extends GalleryCollection {
  /** First resolved image = main, rest = preview thumbnails. */
  images: GalleryItem[];
  /** Index of this collection's main image inside the flat `items` array. */
  mainIndex: number;
}

export default function GalleryCollections({
  locale,
  items,
  collections,
  labels,
}: GalleryCollectionsProps) {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Resolve each collection's image ids → GalleryItem objects, and locate the
  // main image inside the flat items array so the lightbox opens at the right spot.
  const resolved = useMemo<ResolvedCollection[]>(() => {
    const byId = new Map(items.map((it) => [it.id, it]));
    return collections.map((col) => {
      const images = col.imageIds
        .map((id) => byId.get(id))
        .filter((it): it is GalleryItem => Boolean(it));
      const mainImage = images[0];
      const mainIndex = mainImage
        ? items.findIndex((it) => it.id === mainImage.id)
        : 0;
      return { ...col, images, mainIndex: mainIndex < 0 ? 0 : mainIndex };
    });
  }, [items, collections]);

  const filters: Array<GalleryCategory | "all"> = useMemo(
    () => ["all", ...Array.from(new Set(collections.map((c) => c.category)))],
    [collections]
  );

  const visible = resolved.filter(
    (c) => activeFilter === "all" || c.category === activeFilter
  );

  const openCollection = useCallback((mainIndex: number) => {
    setLightboxIndex(mainIndex);
  }, []);

  const handleIndexChange = useCallback((idx: number) => setLightboxIndex(idx), []);
  const handleClose = useCallback(() => setLightboxIndex(null), []);

  return (
    <>
      <Container>
        {/* Filter chips — real buttons, aria-pressed, wraps cleanly on mobile */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                aria-pressed={isActive}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "bg-brand-muted text-brand-muted-fg border border-brand-border hover:border-brand-primary/40 hover:text-brand-fg hover:bg-brand-bg"
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, oklch(0.78 0.11 82) 0%, oklch(0.68 0.10 76) 100%)`,
                        boxShadow: "var(--brand-shadow-gold)",
                      }
                    : undefined
                }
              >
                {labels.filters[f] ?? f}
              </button>
            );
          })}
        </div>

        {/* Collection cards — 1 / 2 / 3 columns, premium hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {visible.map((col, idx) => {
            const main = col.images[0];
            const thumbs = col.images.slice(1, 4);
            if (!main) return null;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => openCollection(col.mainIndex)}
                aria-label={`${col.title[locale]} — ${labels.viewLabel}`}
                className="gallery-collection group relative flex flex-col gap-3 p-3.5 rounded-3xl border border-brand-border/70 bg-brand-bg text-start cursor-pointer transition-all duration-500 hover:-translate-y-1.5 animate-reveal-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
                style={{
                  boxShadow: "0 2px 14px oklch(0 0 0 / 5%)",
                  animationDelay: `${idx * 70}ms`,
                }}
              >
                {/* Champagne glow frame on hover */}
                <span
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 1.5px oklch(0.76 0.10 82 / 45%), 0 10px 36px oklch(0.76 0.10 82 / 16%)" }}
                  aria-hidden="true"
                />

                {/* Main image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={main.src}
                    alt={main.alt[locale]}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Soft gradient + count chip */}
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "linear-gradient(to top, oklch(0.14 0.01 58 / 45%) 0%, transparent 55%)" }}
                    aria-hidden="true"
                  />
                </div>

                {/* Preview thumbnails */}
                <div className="grid grid-cols-3 gap-3">
                  {thumbs.map((t, ti) => (
                    <div
                      key={`${col.id}-thumb-${t.id}-${ti}`}
                      className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-brand-border/50 transition-all duration-500 group-hover:ring-[oklch(0.76_0.10_82_/_55%)]"
                    >
                      <Image
                        src={t.src}
                        alt={t.alt[locale]}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 30vw, (max-width: 1024px) 15vw, 10vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>

                {/* Title + count */}
                <div className="flex items-center justify-between gap-3 px-1 pt-1 pb-1">
                  <h2
                    className="text-lg font-semibold text-brand-secondary transition-colors duration-300 group-hover:text-[oklch(0.66_0.10_76)]"
                    style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
                  >
                    {col.title[locale]}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted-fg">
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {col.images.length} {labels.photosLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Container>

      <GalleryLightbox
        items={items}
        index={lightboxIndex}
        locale={locale}
        onIndexChange={handleIndexChange}
        onClose={handleClose}
      />
    </>
  );
}
