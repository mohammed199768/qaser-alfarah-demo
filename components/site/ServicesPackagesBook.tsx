"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  MessageCircle,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

/* ----------------------------------------------------------------------------
 * Types — the cinematic "book of packages" presentation.
 *
 * Conceptually reuses the old ServicesFlipbookExperience language:
 *  - a dark cover scene
 *  - paper-textured book pages with champagne double borders
 *  - a per-package ornament + a framed image card inside each page
 *  - a final CTA page
 * but driven by 3 package scenes (not 9 services) and a light GSAP reveal.
 * -------------------------------------------------------------------------- */

export type LocalizedText = Record<Locale, string>;
export type LocalizedLines = Record<Locale, string[]>;

export type WeddingPackage = {
  id: string;
  number: string;
  name: LocalizedText;
  tagline: LocalizedText;
  story: LocalizedText;
  bestFor: LocalizedText;
  priceHint: LocalizedText;
  includes: LocalizedLines;
  image: string;
  /** secondary images for the framed collage */
  collage: string[];
  imageAlt: LocalizedText;
  ornament: "hall" | "floral" | "crown";
  tone: "dark" | "light";
  accent: string;
  glow: string;
  popular?: boolean;
};

export type BookCopy = {
  eyebrow: LocalizedText;
  coverKicker: LocalizedText;
  coverTitle: LocalizedLines;
  coverSubtitle: LocalizedText;
  coverHint: LocalizedText;
  heroPrimary: LocalizedText;
  heroSecondary: LocalizedText;
  pageWord: LocalizedText;
  includesLabel: LocalizedText;
  bestForLabel: LocalizedText;
  popularBadge: LocalizedText;
  packageCta: LocalizedText;
  noteEyebrow: LocalizedText;
  noteBody: LocalizedText;
  finalEyebrow: LocalizedText;
  finalTitle: LocalizedLines;
  finalBody: LocalizedText;
  closingNote: LocalizedText;
  contact: LocalizedText;
  book: string;
};

function localize(text: LocalizedText, locale: Locale) {
  return text[locale] ?? text.ar;
}

function localizeLines(lines: LocalizedLines, locale: Locale) {
  return lines[locale] ?? lines.ar;
}

function alpha(color: string, value: number) {
  return color.replace(")", ` / ${value})`);
}

/* ----------------------------------------------------------------------------
 * Decorative book chrome (CSS only) — reused conceptually from the old design.
 * -------------------------------------------------------------------------- */

const paperBackground =
  "radial-gradient(oklch(0.62 0.05 78 / 0.05) 1px, transparent 1px), linear-gradient(160deg, oklch(0.985 0.012 84) 0%, oklch(0.965 0.018 82) 55%, oklch(0.975 0.014 83) 100%)";

const darkPaperBackground =
  "radial-gradient(oklch(0.80 0.08 82 / 0.05) 1px, transparent 1px), linear-gradient(160deg, oklch(0.21 0.026 64) 0%, oklch(0.14 0.018 58) 100%)";

function PageFrame({ accent, dark }: { accent: string; dark: boolean }) {
  const outer = dark ? "oklch(0.80 0.10 82 / 0.55)" : "oklch(0.74 0.09 80 / 0.5)";
  const inner = dark ? "oklch(0.80 0.10 82 / 0.22)" : "oklch(0.74 0.09 80 / 0.22)";
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[6px] border sm:inset-4"
        style={{ borderColor: outer }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1.05rem] rounded-[4px] border sm:inset-[1.4rem]"
        style={{ borderColor: inner }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 w-8"
        style={{
          background: dark
            ? `linear-gradient(to right, ${alpha(accent, 0.16)}, transparent)`
            : "linear-gradient(to right, oklch(0.40 0.03 70 / 0.14), transparent)",
        }}
      />
    </>
  );
}

function PackageOrnament({ id, accent }: { id: WeddingPackage["ornament"]; accent: string }) {
  const base = "pointer-events-none absolute end-7 top-6 sm:end-10 sm:top-8";
  switch (id) {
    case "hall":
      return (
        <span aria-hidden="true" data-book-ornament="" className={`${base} h-24 w-20`}>
          <span
            className="absolute inset-x-0 bottom-0 top-2 rounded-t-full border border-b-0"
            style={{ borderColor: alpha(accent, 0.34) }}
          />
          <span
            className="absolute inset-x-3 bottom-0 top-6 rounded-t-full border border-b-0"
            style={{ borderColor: alpha(accent, 0.2) }}
          />
          <span
            className="absolute inset-x-6 bottom-0 top-10 rounded-t-full border border-b-0"
            style={{ borderColor: alpha(accent, 0.12) }}
          />
        </span>
      );
    case "floral":
      return (
        <span aria-hidden="true" data-book-ornament="" className={`${base} h-20 w-20`}>
          {[
            { x: 0, y: 8, r: 24, s: 15 },
            { x: 26, y: 0, r: -30, s: 12 },
            { x: 44, y: 20, r: 60, s: 13 },
            { x: 16, y: 34, r: 12, s: 11 },
          ].map((p) => (
            <span
              key={`${p.x}-${p.y}`}
              className="absolute block"
              style={{
                left: p.x,
                top: p.y,
                width: p.s,
                height: p.s,
                borderRadius: "80% 0 80% 0",
                transform: `rotate(${p.r}deg)`,
                background: alpha(accent, 0.3),
                boxShadow: `0 2px 8px ${alpha(accent, 0.18)}`,
              }}
            />
          ))}
        </span>
      );
    case "crown":
    default:
      return (
        <span aria-hidden="true" data-book-ornament="" className={`${base} h-16 w-24`}>
          <svg viewBox="0 0 96 56" fill="none" className="h-full w-full">
            <path
              d="M6 50 L16 18 L32 40 L48 10 L64 40 L80 18 L90 50 Z"
              stroke={alpha(accent, 0.5)}
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill={alpha(accent, 0.08)}
            />
            {[16, 48, 80].map((cx) => (
              <circle key={cx} cx={cx} cy={cx === 48 ? 10 : 18} r="3" fill={alpha(accent, 0.6)} />
            ))}
          </svg>
        </span>
      );
  }
}

/* ----------------------------------------------------------------------------
 * GSAP scroll reveal — light + guarded. Content is visible without it.
 * -------------------------------------------------------------------------- */

function useBookMotion(rootRef: React.RefObject<HTMLDivElement | null>) {
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
          // Scene-by-scene cinematic reveal.
          gsap.utils.toArray<HTMLElement>("[data-book-reveal]").forEach((el) => {
            const items = el.querySelectorAll<HTMLElement>("[data-book-stagger]");
            gsap.from(el, {
              autoAlpha: 0,
              y: 48,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 82%" },
            });
            if (items.length) {
              gsap.from(items, {
                autoAlpha: 0,
                y: 24,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 78%" },
              });
            }
          });

          // Gentle parallax on framed images.
          gsap.utils.toArray<HTMLElement>("[data-book-parallax]").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -6 },
              {
                yPercent: 6,
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

          // Floating ornaments.
          gsap.utils.toArray<HTMLElement>("[data-book-ornament]").forEach((el, i) => {
            gsap.to(el, {
              y: i % 2 ? 10 : -10,
              rotation: i % 2 ? 3 : -3,
              duration: 4 + (i % 3),
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
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

/* ----------------------------------------------------------------------------
 * Cover scene
 * -------------------------------------------------------------------------- */

function CoverScene({
  copy,
  brandName,
  locale,
  firstPackageId,
}: {
  copy: BookCopy;
  brandName: string;
  locale: Locale;
  firstPackageId: string;
}) {
  return (
    <section
      data-book-reveal=""
      aria-label={localizeLines(copy.coverTitle, locale).join(" ")}
      className="relative overflow-hidden rounded-[1.75rem] border md:rounded-[2.5rem]"
      style={{
        background: "linear-gradient(150deg, oklch(0.22 0.028 64) 0%, oklch(0.13 0.018 58) 100%)",
        borderColor: "oklch(0.80 0.10 82 / 0.30)",
        boxShadow: "0 30px 80px oklch(0.18 0.024 60 / 0.40)",
      }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div data-book-parallax="" className="absolute inset-0 scale-110">
          <Image
            src="/site/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, oklch(0.12 0.015 60 / 0.62) 0%, oklch(0.15 0.02 58 / 0.86) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "repeating-linear-gradient(112deg, oklch(0.80 0.10 82 / 0.05) 0 1px, transparent 1px 22px)",
          }}
        />
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[10px] border sm:inset-6"
        style={{ borderColor: "oklch(0.80 0.10 82 / 0.5)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-[6px] border sm:inset-8"
        style={{ borderColor: "oklch(0.80 0.10 82 / 0.22)" }}
      />

      <div className="relative z-10 flex min-h-[28rem] flex-col items-center justify-center gap-5 px-6 py-20 text-center sm:min-h-[34rem] sm:py-28 lg:min-h-[40rem]">
        <span
          data-book-stagger=""
          className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.3em]"
          style={{ color: "oklch(0.84 0.10 82)" }}
        >
          {brandName}
        </span>
        <span
          data-book-stagger=""
          aria-hidden="true"
          className="block h-px w-24"
          style={{ background: "linear-gradient(to right, transparent, oklch(0.84 0.10 82 / 0.8), transparent)" }}
        />
        <h1
          data-book-stagger=""
          className="text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-[5rem]"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.98 0.012 84)",
            textWrap: "balance",
            textShadow: "0 20px 54px oklch(0 0 0 / 0.40)",
          }}
        >
          {localizeLines(copy.coverTitle, locale).map((line, i) => (
            <span key={line} className={i === 0 ? "block" : "block"} style={i === 1 ? { color: "oklch(0.86 0.09 82)" } : undefined}>
              {line}
            </span>
          ))}
        </h1>
        <p
          data-book-stagger=""
          className="mx-auto max-w-2xl text-base leading-[1.95] sm:text-lg"
          style={{ color: "oklch(0.90 0.04 82)", textWrap: "pretty" }}
        >
          {localize(copy.coverSubtitle, locale)}
        </p>

        <div data-book-stagger="" className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/booking"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{
              background: "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
              color: "oklch(0.14 0.01 58)",
              boxShadow: "0 16px 42px oklch(0.76 0.10 82 / 0.34)",
            }}
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            {localize(copy.heroPrimary, locale)}
          </Link>
          <Link
            href={`#package-${firstPackageId}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              borderColor: "oklch(1 0 0 / 0.3)",
              background: "oklch(1 0 0 / 0.08)",
              color: "oklch(0.95 0.015 84)",
            }}
          >
            {localize(copy.heroSecondary, locale)}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>

        <p
          data-book-stagger=""
          className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em]"
          style={{ color: "oklch(0.74 0.06 80)" }}
        >
          {localize(copy.coverHint, locale)}
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Package page scene
 * -------------------------------------------------------------------------- */

function PackageScene({
  pkg,
  index,
  total,
  copy,
  locale,
}: {
  pkg: WeddingPackage;
  index: number;
  total: number;
  copy: BookCopy;
  locale: Locale;
}) {
  const dark = pkg.tone === "dark";
  const mediaFirst = index % 2 === 1;
  const textMain = dark ? "oklch(0.98 0.012 84)" : "var(--brand-secondary)";
  const textSoft = dark ? "oklch(0.98 0.012 84 / 0.80)" : "oklch(0.42 0.020 64)";
  const chipBg = dark ? "oklch(1 0 0 / 0.10)" : alpha(pkg.accent, 0.1);
  const chipBorder = dark ? "oklch(1 0 0 / 0.22)" : alpha(pkg.accent, 0.34);
  const primaryImage = pkg.image;
  const collage: Array<string | undefined> = [primaryImage, pkg.collage[0], pkg.collage[1]];

  return (
    <section
      id={`package-${pkg.id}`}
      data-book-reveal=""
      aria-labelledby={`package-${pkg.id}-title`}
      className="relative overflow-hidden rounded-[1.75rem] border md:rounded-[2.5rem]"
      style={{
        background: dark ? darkPaperBackground : paperBackground,
        backgroundSize: "24px 24px, 100% 100%",
        borderColor: dark ? alpha(pkg.accent, 0.3) : "oklch(0.82 0.05 82 / 0.5)",
        boxShadow: "0 26px 70px oklch(0.30 0.035 68 / 0.18)",
      }}
    >
      <PageFrame accent={pkg.accent} dark={dark} />
      <PackageOrnament id={pkg.ornament} accent={pkg.accent} />

      {/* page number, like a book */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold tracking-[0.24em]"
        style={{ color: dark ? "oklch(0.76 0.06 80)" : "oklch(0.62 0.04 74)" }}
      >
        — {localize(copy.pageWord, locale)} {index + 1} / {total} —
      </span>

      <div className="relative z-10 px-5 py-10 sm:px-9 sm:py-14 lg:px-14 lg:py-20">
        <div
          className={`grid items-center gap-8 lg:gap-14 ${
            mediaFirst
              ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
              : "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
          }`}
        >
          {/* Copy */}
          <div className={`min-w-0 text-start ${mediaFirst ? "lg:order-2" : ""}`}>
            <div data-book-stagger="" className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.22em]"
                style={{ background: chipBg, border: `1px solid ${chipBorder}`, color: textMain }}
              >
                <span>{pkg.number}</span>
                <span className="h-px w-8" style={{ background: pkg.accent }} aria-hidden="true" />
                {localize(copy.eyebrow, locale)}
              </span>
              {pkg.popular && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.18em]"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.84 0.10 82), oklch(0.70 0.12 76))",
                    color: "oklch(0.16 0.01 58)",
                    boxShadow: "0 10px 26px oklch(0.74 0.12 76 / 0.32)",
                  }}
                >
                  {localize(copy.popularBadge, locale)}
                </span>
              )}
            </div>

            <h2
              id={`package-${pkg.id}-title`}
              data-book-stagger=""
              className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.7rem]"
              style={{
                fontFamily: "var(--font-display-ar), var(--font-display), serif",
                color: textMain,
                textWrap: "balance",
                textShadow: dark ? "0 18px 48px oklch(0 0 0 / 0.30)" : "none",
              }}
            >
              {localize(pkg.name, locale)}
            </h2>

            <p
              data-book-stagger=""
              className="mt-3 text-lg font-semibold"
              style={{ color: dark ? "oklch(0.86 0.08 82)" : pkg.accent, textWrap: "balance" }}
            >
              {localize(pkg.tagline, locale)}
            </p>

            <span
              data-book-stagger=""
              aria-hidden="true"
              className="mt-5 block h-px w-16"
              style={{ background: `linear-gradient(to right, ${alpha(pkg.accent, 0.8)}, transparent)` }}
            />

            <p
              data-book-stagger=""
              className="mt-5 max-w-xl text-base leading-[2] md:text-lg"
              style={{ color: textSoft, textWrap: "pretty" }}
            >
              {localize(pkg.story, locale)}
            </p>

            {/* Includes as elegant chips */}
            <p
              data-book-stagger=""
              className="mt-7 text-[0.7rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: dark ? "oklch(0.82 0.07 82)" : "oklch(0.50 0.05 76)" }}
            >
              {localize(copy.includesLabel, locale)}
            </p>
            <ul data-book-stagger="" className="mt-3 flex flex-wrap gap-2">
              {localizeLines(pkg.includes, locale).map((line) => (
                <li
                  key={line}
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm"
                  style={{
                    background: dark ? "oklch(1 0 0 / 0.06)" : alpha(pkg.accent, 0.06),
                    borderColor: dark ? "oklch(1 0 0 / 0.16)" : alpha(pkg.accent, 0.26),
                    color: textMain,
                  }}
                >
                  <Check
                    className="size-3.5 shrink-0"
                    style={{ color: dark ? "oklch(0.86 0.08 82)" : pkg.accent }}
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>

            <div data-book-stagger="" className="mt-7 flex flex-wrap gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: chipBg, border: `1px solid ${chipBorder}`, color: textMain }}
              >
                <CalendarCheck className="size-4" aria-hidden="true" />
                {localize(pkg.priceHint, locale)}
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  background: dark ? "oklch(1 0 0 / 0.05)" : alpha(pkg.accent, 0.05),
                  border: `1px solid ${dark ? "oklch(1 0 0 / 0.12)" : alpha(pkg.accent, 0.2)}`,
                  color: textSoft,
                }}
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em]">
                  {localize(copy.bestForLabel, locale)}
                </span>
                {localize(pkg.bestFor, locale)}
              </span>
            </div>

            <div data-book-stagger="" className="mt-8">
              <Link
                href="/booking"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2"
                style={{
                  background: "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
                  color: "oklch(0.14 0.01 58)",
                  boxShadow: "0 16px 42px oklch(0.76 0.10 82 / 0.32)",
                }}
              >
                {localize(copy.packageCta, locale)}
                <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Framed image collage inside the book page */}
          <div data-book-stagger="" className={`relative min-w-0 ${mediaFirst ? "lg:order-1" : ""}`}>
            <div className="relative">
              <figure
                className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-2xl border sm:aspect-[5/6] lg:aspect-[4/5]"
                style={{
                  borderColor: dark ? "oklch(1 0 0 / 0.22)" : alpha(pkg.accent, 0.32),
                  boxShadow: `0 30px 70px oklch(0.20 0.026 60 / 0.30), 0 0 0 1px ${alpha(pkg.accent, 0.14)}`,
                }}
              >
                <div data-book-parallax="" className="absolute inset-0 scale-110">
                  <Image
                    src={primaryImage}
                    alt={localize(pkg.imageAlt, locale)}
                    fill
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                <span
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, oklch(1 0 0 / 0.06), transparent 42%, oklch(0.12 0.018 58 / 0.44)), linear-gradient(135deg, transparent 0%, ${alpha(pkg.accent, 0.16)} 100%)`,
                  }}
                  aria-hidden="true"
                />
                <figcaption
                  className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]"
                  style={{
                    background: "oklch(0.12 0.018 58 / 0.48)",
                    color: "oklch(0.98 0.012 84)",
                    border: "1px solid oklch(1 0 0 / 0.18)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span>{localize(pkg.name, locale)}</span>
                  <span style={{ color: "oklch(0.86 0.08 82)" }}>Qasr Al-Farah</span>
                </figcaption>
              </figure>

              {/* small framed accent photos (collage), hidden on the smallest screens */}
              {collage[1] && (
                <figure
                  aria-hidden="true"
                  className="absolute -bottom-6 end-[-1.25rem] z-20 hidden h-28 w-24 overflow-hidden rounded-xl border-4 sm:block lg:h-36 lg:w-28"
                  style={{
                    borderColor: "oklch(0.98 0.01 84)",
                    boxShadow: "0 18px 40px oklch(0.20 0.026 60 / 0.30)",
                    transform: "rotate(5deg)",
                  }}
                >
                  <Image src={collage[1]} alt="" fill sizes="120px" className="object-cover" loading="lazy" />
                </figure>
              )}
              {collage[2] && (
                <figure
                  aria-hidden="true"
                  className="absolute -top-6 start-[-1rem] z-0 hidden h-24 w-20 overflow-hidden rounded-xl border-4 lg:block"
                  style={{
                    borderColor: "oklch(0.98 0.01 84)",
                    boxShadow: "0 16px 34px oklch(0.20 0.026 60 / 0.26)",
                    transform: "rotate(-6deg)",
                  }}
                >
                  <Image src={collage[2]} alt="" fill sizes="100px" className="object-cover" loading="lazy" />
                </figure>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Final CTA page
 * -------------------------------------------------------------------------- */

function FinalScene({ copy, locale }: { copy: BookCopy; locale: Locale }) {
  return (
    <section
      data-book-reveal=""
      className="relative overflow-hidden rounded-[1.75rem] border md:rounded-[2.5rem]"
      style={{
        borderColor: "oklch(0.80 0.10 82 / 0.28)",
        boxShadow: "0 30px 80px oklch(0.18 0.024 60 / 0.40)",
      }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div data-book-parallax="" className="absolute inset-0 scale-110">
          <Image src="/site/gallery/couple-1.jpg" alt="" fill sizes="100vw" className="object-cover" loading="lazy" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.018 58 / 0.88) 0%, oklch(0.25 0.035 58 / 0.76) 48%, oklch(0.55 0.08 76 / 0.70) 100%)",
          }}
        />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[10px] border sm:inset-6"
        style={{ borderColor: "oklch(0.80 0.10 82 / 0.45)" }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 py-20 text-center sm:py-24">
        <span
          data-book-stagger=""
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em]"
          style={{ background: "oklch(1 0 0 / 0.10)", border: "1px solid oklch(1 0 0 / 0.24)", color: "oklch(0.98 0.012 84)" }}
        >
          <MessageCircle className="size-3.5" aria-hidden="true" />
          {localize(copy.finalEyebrow, locale)}
        </span>

        <h2
          data-book-stagger=""
          className="mt-7 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[4rem]"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.98 0.012 84)",
            textWrap: "balance",
          }}
        >
          {localizeLines(copy.finalTitle, locale).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <span
          data-book-stagger=""
          aria-hidden="true"
          className="my-7 block h-px w-24"
          style={{ background: "linear-gradient(to right, transparent, oklch(0.84 0.10 82 / 0.8), transparent)" }}
        />

        <p
          data-book-stagger=""
          className="max-w-2xl text-base leading-[1.95] md:text-lg"
          style={{ color: "oklch(0.98 0.012 84 / 0.82)", textWrap: "pretty" }}
        >
          {localize(copy.finalBody, locale)}
        </p>

        <div
          data-book-stagger=""
          className="mt-7 rounded-full border px-4 py-2 text-sm font-semibold"
          style={{ borderColor: "oklch(1 0 0 / 0.20)", background: "oklch(1 0 0 / 0.10)", color: "oklch(0.98 0.012 84)" }}
        >
          {localize(copy.closingNote, locale)}
        </div>

        <div data-book-stagger="" className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/booking"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            style={{ background: "oklch(0.98 0.006 84)", color: "oklch(0.28 0.02 58)" }}
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            {copy.book}
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: "oklch(1 0 0 / 0.10)", border: "1px solid oklch(1 0 0 / 0.30)", color: "oklch(0.95 0.01 84)" }}
          >
            {localize(copy.contact, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * Root
 * -------------------------------------------------------------------------- */

export default function ServicesPackagesBook({
  packages,
  copy,
  brandName,
  locale,
}: {
  packages: WeddingPackage[];
  copy: BookCopy;
  brandName: string;
  locale: Locale;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useBookMotion(rootRef);
  const isArabic = locale === "ar";

  return (
    <div
      ref={rootRef}
      dir={isArabic ? "rtl" : "ltr"}
      className="relative isolate w-full overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse 74% 46% at 50% -8%, oklch(0.92 0.046 80 / 0.40) 0%, transparent 66%), radial-gradient(ellipse 50% 42% at 100% 86%, oklch(0.95 0.024 22 / 0.22) 0%, transparent 72%), var(--brand-bg)",
      }}
    >
      {/* Without JS / with reduced motion, GSAP never hides anything; content is visible. */}
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-12 lg:space-y-14 lg:px-8">
        <CoverScene copy={copy} brandName={brandName} locale={locale} firstPackageId={packages[0]?.id ?? ""} />
        {packages.map((pkg, index) => (
          <PackageScene
            key={pkg.id}
            pkg={pkg}
            index={index}
            total={packages.length}
            copy={copy}
            locale={locale}
          />
        ))}
        <FinalScene copy={copy} locale={locale} />
      </div>
    </div>
  );
}
