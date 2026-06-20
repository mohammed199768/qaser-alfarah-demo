"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";
import type { GalleryItem } from "@/types/site-content";

interface GalleryLightboxProps {
  items: GalleryItem[];
  index: number | null;
  locale: Locale;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function GalleryLightbox({
  items,
  index,
  locale,
  onIndexChange,
  onClose,
}: GalleryLightboxProps) {
  const isOpen = index !== null;
  const current = index !== null ? items[index] : null;
  const total = items.length;

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (locale === "ar") goPrev(); else goNext();
      } else if (e.key === "ArrowLeft") {
        if (locale === "ar") goNext(); else goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, locale, goNext, goPrev]);

  const closeLabel = locale === "ar" ? "إغلاق" : "Close";
  const prevLabel = locale === "ar" ? "التالي" : "Previous";
  const nextLabel = locale === "ar" ? "السابق" : "Next";

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Dark overlay — Radix handles scroll lock and focus trap */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[100]"
          style={{ background: "oklch(0.12 0.01 60 / 94%)" }}
        />

        <DialogPrimitive.Content
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 outline-none"
          aria-label={current?.alt[locale]}
          onInteractOutside={onClose}
        >
          {/* Visually hidden title satisfies Radix DialogContent a11y requirement */}
          <DialogPrimitive.Title className="sr-only">
            {current?.alt[locale]}
          </DialogPrimitive.Title>

          {/* Close button */}
          <DialogPrimitive.Close
            className="absolute top-5 end-5 flex items-center justify-center size-10 rounded-full border border-white/15 bg-white/8 text-white/70 hover:text-white hover:bg-white/15 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label={closeLabel}
          >
            <Icon name="Plus" className="size-5 rotate-45" />
          </DialogPrimitive.Close>

          {/* Prev button — start side */}
          <button
            className="absolute start-4 flex items-center justify-center size-11 rounded-full border border-white/12 bg-white/8 text-white/65 hover:text-white hover:bg-white/15 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            onClick={goPrev}
            aria-label={prevLabel}
          >
            <span className="text-2xl font-thin leading-none">‹</span>
          </button>

          {/* Image area */}
          <div className="max-w-4xl w-full flex flex-col items-center gap-5">
            <div className="w-full relative overflow-hidden rounded-[var(--brand-radius)] border border-white/10">
              {current && (
                <Image
                  key={current.id}
                  src={current.src}
                  alt={current.alt[locale]}
                  width={current.width ?? 1600}
                  height={current.height ?? 900}
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="w-full h-auto object-cover"
                />
              )}
              {/* Caption overlay */}
              {current && (
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wide px-5 py-2 rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/10 whitespace-nowrap">
                  {current.alt[locale]}
                </span>
              )}
            </div>

            {/* Counter */}
            {index !== null && (
              <p className="text-white/35 text-xs tracking-widest">
                {index + 1} / {total}
              </p>
            )}
          </div>

          {/* Next button — end side */}
          <button
            className="absolute end-4 flex items-center justify-center size-11 rounded-full border border-white/12 bg-white/8 text-white/65 hover:text-white hover:bg-white/15 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            onClick={goNext}
            aria-label={nextLabel}
          >
            <span className="text-2xl font-thin leading-none">›</span>
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
