"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, Check, ChevronDown, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import type { BookCopy, WeddingPackage } from "@/components/site/ServicesPackagesBook";

/* ----------------------------------------------------------------------------
 * "باقاتنا" / "Our Packages" — a cinematic, editorial scroll story.
 *
 * Adapted (concept only) from the pasted alternating image/story reference:
 *  - alternating large framed image panels (left / right by index)
 *  - an oversized editorial title that overlaps the image
 *  - a faint giant scene number behind each package
 *  - subtle image parallax + scroll reveal (GSAP ScrollTrigger, already installed)
 *  - an animated scroll cue and generous vertical rhythm
 *
 * Intentionally NOT adapted: the reference's SmoothScroll system (no fixed main,
 * no body.style.height, no rAF scroll loop, no scroll hijacking), imagesLoaded,
 * remote images, and Google Fonts. Normal page scrolling only. Reduced-motion
 * and no-GSAP both fall back to fully visible, static content.
 * -------------------------------------------------------------------------- */

function localize(text: Record<Locale, string>, locale: Locale) {
  return text[locale] ?? text.ar;
}
function localizeLines(lines: Record<Locale, string[]>, locale: Locale) {
  return lines[locale] ?? lines.ar;
}
function alpha(color: string, value: number) {
  return color.replace(")", ` / ${value})`);
}

interface ServicesPackagesStoryProps {
  packages: WeddingPackage[];
  copy: BookCopy;
  brandName: string;
  locale: Locale;
}

/**
 * Scoped scroll motion. Mirrors the project's existing safe pattern: dynamic
 * import, reduced-motion guard, gsap.context bound to the root, ctx.revert() on
 * unmount. No global scroll behavior is touched.
 */
function useStoryMotion(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled || !root) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          // Per-scene reveal (title + body + chips stagger).
          gsap.utils.toArray<HTMLElement>("[data-story-scene]").forEach((scene) => {
            const reveals = scene.querySelectorAll<HTMLElement>("[data-story-reveal]");
            if (reveals.length) {
              gsap.from(reveals, {
                autoAlpha: 0,
                y: 36,
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.09,
                scrollTrigger: { trigger: scene, start: "top 78%" },
              });
            }
          });

          // Subtle parallax on the framed image (inner overflow image moves).
          gsap.utils.toArray<HTMLElement>("[data-story-parallax]").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        }, root);

        ScrollTrigger.refresh();
        cleanup = () => ctx.revert();
      } catch {
        // GSAP unavailable — content stays visible, no enhancement.
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [rootRef]);
}

export default function ServicesPackagesStory({
  packages,
  copy,
  brandName,
  locale,
}: ServicesPackagesStoryProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useStoryMotion(rootRef);

  return (
    <div ref={rootRef} className="services-story bg-brand-bg">
      {/* ── Intro / cover ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-12 text-center md:pt-28 md:pb-16">
        <span
          aria-hidden="true"
          className="brand-orb pointer-events-none absolute -top-1/4 start-1/4 aspect-square w-1/2 opacity-[0.08]"
          style={{ background: "oklch(0.80 0.10 82)" }}
        />
        <Container className="relative max-w-3xl space-y-5">
          <span
            className="inline-block text-[0.7rem] font-bold uppercase tracking-[0.28em]"
            style={{ color: "oklch(0.66 0.10 78)" }}
          >
            {localize(copy.eyebrow, locale)}
          </span>
          <h1
            className="text-4xl font-bold text-brand-secondary md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
          >
            {localizeLines(copy.coverTitle, locale)[0]}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-brand-muted-fg md:text-lg">
            {localize(copy.coverSubtitle, locale)}
          </p>

          {/* Animated scroll cue (CSS keyframes, redrawn — not copied). */}
          <div className="flex justify-center pt-4" aria-hidden="true">
            <ChevronDown className="services-story-cue size-7 text-brand-primary" />
          </div>
        </Container>
      </section>

      {/* ── Alternating package scenes ─────────────────────────────────── */}
      <div className="space-y-24 pb-8 md:space-y-36 lg:space-y-44">
        {packages.map((pkg, idx) => {
          const reversed = idx % 2 === 1;
          const includes = localizeLines(pkg.includes, locale);
          return (
            <section
              key={pkg.id}
              data-story-scene
              aria-labelledby={`pkg-${pkg.id}-title`}
              className="relative overflow-hidden"
            >
              {/* Faint giant scene number behind the scene. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-10 select-none text-[26vw] font-bold leading-none opacity-[0.04] md:text-[16vw] ${
                  reversed ? "start-2" : "end-2"
                }`}
                style={{
                  color: pkg.accent,
                  fontFamily: "var(--font-display), serif",
                }}
              >
                {pkg.number}
              </span>

              <Container className="max-w-6xl">
                <div
                  className={`grid items-center gap-8 md:gap-10 lg:gap-14 lg:grid-cols-[1.05fr_0.95fr] ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Framed image with parallax + overlapping title */}
                  <div className="relative">
                    {pkg.popular && (
                      <span
                        data-story-reveal
                        className="absolute -top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] shadow-[0_10px_26px_oklch(0.74_0.12_76_/_0.32)] ltr:right-4 rtl:left-4"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.84 0.10 82), oklch(0.70 0.12 76))",
                          color: "oklch(0.16 0.01 58)",
                        }}
                      >
                        {localize(copy.popularBadge, locale)}
                      </span>
                    )}

                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--brand-radius)] border shadow-[0_24px_60px_oklch(0.22_0.02_60_/_0.22)] sm:aspect-[5/6]"
                      style={{ borderColor: alpha(pkg.accent, 0.4) }}
                    >
                      {/* Inner image is taller than the frame so it can parallax. */}
                      <div data-story-parallax className="absolute inset-x-0 -inset-y-[8%]">
                        <Image
                          src={pkg.image}
                          alt={localize(pkg.imageAlt, locale)}
                          fill
                          sizes="(max-width: 1024px) 92vw, 46vw"
                          className="object-cover"
                          priority={idx === 0}
                        />
                      </div>
                      {/* Warm gradient for title legibility. */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, oklch(0.14 0.01 58 / 0.55) 0%, transparent 55%)",
                        }}
                      />
                      {/* Champagne inner frame. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-3 rounded-[6px] border"
                        style={{ borderColor: alpha(pkg.accent, 0.45) }}
                      />
                    </div>

                    {/* Oversized editorial title overlapping the image base. */}
                    <h2
                      id={`pkg-${pkg.id}-title`}
                      data-story-reveal
                      className={`relative z-10 -mt-7 px-3 text-3xl font-bold leading-tight text-brand-secondary drop-shadow-sm sm:text-4xl md:-mt-9 md:text-5xl ${
                        reversed ? "lg:text-end" : "lg:text-start"
                      }`}
                      style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
                    >
                      {localize(pkg.name, locale)}
                    </h2>
                  </div>

                  {/* Text column: tagline, story, chips, CTA */}
                  <div className={reversed ? "lg:text-end" : "lg:text-start"}>
                    <p
                      data-story-reveal
                      className="text-sm font-semibold uppercase tracking-[0.16em]"
                      style={{ color: pkg.accent }}
                    >
                      {localize(pkg.tagline, locale)}
                    </p>

                    <p
                      data-story-reveal
                      className="mt-4 text-base leading-[1.95] text-brand-muted-fg md:text-lg"
                      style={{ textWrap: "pretty" }}
                    >
                      {localize(pkg.story, locale)}
                    </p>

                    {/* Included services as refined chips */}
                    <div data-story-reveal className="mt-6">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-muted-fg">
                        {localize(copy.includesLabel, locale)}
                      </p>
                      <ul
                        className={`flex flex-wrap gap-2 ${
                          reversed ? "lg:justify-end" : "lg:justify-start"
                        }`}
                      >
                        {includes.map((inc) => (
                          <li
                            key={inc}
                            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-brand-fg"
                            style={{
                              background: "oklch(1 0 0 / 0.5)",
                              borderColor: alpha(pkg.accent, 0.3),
                            }}
                          >
                            <Check
                              className="size-3.5 shrink-0"
                              style={{ color: pkg.accent }}
                              aria-hidden="true"
                            />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      data-story-reveal
                      className={`mt-8 flex ${reversed ? "lg:justify-end" : "lg:justify-start"}`}
                    >
                      <Link
                        href="/booking"
                        className="group inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
                          color: "oklch(0.14 0.01 58)",
                          boxShadow: "0 14px 36px oklch(0.76 0.10 82 / 0.30)",
                        }}
                      >
                        <CalendarCheck className="size-4" aria-hidden="true" />
                        {localize(copy.packageCta, locale)}
                        <ArrowUpRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section
        className="relative mt-8 overflow-hidden py-20 text-center md:py-28"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.21 0.026 64) 0%, oklch(0.14 0.018 58) 100%)",
        }}
      >
        <Container className="relative max-w-2xl space-y-5">
          <p
            className="text-[0.7rem] font-bold uppercase tracking-[0.28em]"
            style={{ color: "oklch(0.80 0.09 82)" }}
          >
            {localize(copy.finalEyebrow, locale)}
          </p>
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{
              fontFamily: "var(--font-display-ar), var(--font-display), serif",
              color: "oklch(0.97 0.012 84)",
            }}
          >
            {localizeLines(copy.finalTitle, locale).join(" ")}
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed" style={{ color: "oklch(0.84 0.03 82)" }}>
            {localize(copy.finalBody, locale)}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ background: "oklch(0.98 0.006 84)", color: "oklch(0.28 0.02 58)" }}
            >
              <CalendarCheck className="size-4" aria-hidden="true" />
              {copy.book}
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                background: "oklch(1 0 0 / 0.10)",
                border: "1px solid oklch(1 0 0 / 0.30)",
                color: "oklch(0.95 0.01 84)",
              }}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {localize(copy.contact, locale)}
            </Link>
          </div>
          <p className="pt-3 text-xs" style={{ color: "oklch(0.74 0.04 82)" }}>
            {brandName} · {localize(copy.closingNote, locale)}
          </p>
        </Container>
      </section>
    </div>
  );
}
