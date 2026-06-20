"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, MessageCircle } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";
import type { ServiceItem } from "@/types/site-content";

type BookWorld = {
  mood: Record<Locale, string>;
  accent: string;
  soft: string;
};

function alpha(color: string, value: number) {
  return color.replace(")", ` / ${value})`);
}

const bookWorlds: Record<string, BookWorld> = {
  hall: {
    mood: { ar: "بهو القصر الكبير", en: "The grand palace hall" },
    accent: "oklch(0.62 0.10 80)",
    soft: "oklch(0.90 0.06 84)",
  },
  zaffa: {
    mood: { ar: "مسار الدخلة", en: "The ceremonial path" },
    accent: "oklch(0.60 0.09 60)",
    soft: "oklch(0.88 0.05 40)",
  },
  food: {
    mood: { ar: "مائدة الضيافة", en: "The banquet table" },
    accent: "oklch(0.58 0.10 50)",
    soft: "oklch(0.90 0.05 62)",
  },
  photography: {
    mood: { ar: "داخل الإطار", en: "Inside the frame" },
    accent: "oklch(0.48 0.03 270)",
    soft: "oklch(0.88 0.02 270)",
  },
  decoration: {
    mood: { ar: "مسرح الزهور", en: "The floral stage" },
    accent: "oklch(0.62 0.08 20)",
    soft: "oklch(0.91 0.04 18)",
  },
  lighting: {
    mood: { ar: "لحظة الضوء", en: "The light cue" },
    accent: "oklch(0.62 0.12 76)",
    soft: "oklch(0.86 0.06 250)",
  },
  dj: {
    mood: { ar: "إيقاع السهرة", en: "The night's rhythm" },
    accent: "oklch(0.50 0.10 320)",
    soft: "oklch(0.88 0.05 330)",
  },
  car: {
    mood: { ar: "لحظة الوصول", en: "The arrival route" },
    accent: "oklch(0.58 0.07 84)",
    soft: "oklch(0.89 0.05 82)",
  },
  "memory-book": {
    mood: { ar: "صفحات تبقى", en: "Pages that stay" },
    accent: "oklch(0.56 0.09 76)",
    soft: "oklch(0.92 0.04 82)",
  },
};

const fallbackWorld: BookWorld = {
  mood: { ar: "بهو القصر الكبير", en: "The grand palace hall" },
  accent: "oklch(0.62 0.10 80)",
  soft: "oklch(0.90 0.06 84)",
};

const serviceFallbackImages: Record<string, string> = {
  hall: "/site/gallery/hall-1.jpg",
  zaffa: "/site/gallery/events-1.jpg",
  food: "/site/gallery/food-1.jpg",
  photography: "/site/gallery/couple-1.jpg",
  decoration: "/site/gallery/decor-1.jpg",
  lighting: "/site/hero.jpg",
  dj: "/site/gallery/events-1.jpg",
  car: "/site/gallery/hall-1.jpg",
  "memory-book": "/site/og-image.jpg",
};

const copy = {
  bookEyebrow: { ar: "قصر الفرح", en: "Qasr Al-Farah" },
  bookTitle: { ar: "كتاب الخدمات", en: "The Book of Services" },
  bookSubtitle: {
    ar: "كل خدمة صفحة من حكاية فرحكم",
    en: "Every service is a page of your celebration",
  },
  coverHint: { ar: "تابع التمرير لقلب الصفحات", en: "Keep scrolling to turn the pages" },
  pageWord: { ar: "صفحة", en: "Page" },
  ofWord: { ar: "من", en: "of" },
  prev: { ar: "السابق", en: "Previous" },
  next: { ar: "التالي", en: "Next" },
  ctaTitle: { ar: "الصفحة الأخيرة تبدأ بكم", en: "The last page begins with you" },
  ctaBody: {
    ar: "احجزوا موعد زيارة قصر الفرح وحوّلوا صفحات هذا الكتاب إلى ليلة فرح كاملة.",
    en: "Book a visit to Qasr Al-Farah and turn these pages into one complete celebration.",
  },
  ctaBook: { ar: "احجز موعدك", en: "Book a visit" },
  ctaContact: { ar: "تواصل معنا", en: "Contact us" },
  defaultServiceCta: { ar: "أضفها إلى يومك", en: "Add to your day" },
  stackedLabel: { ar: "صفحات كتاب الخدمات", en: "Service book pages" },
  bookAria: { ar: "كتاب خدمات قصر الفرح", en: "Qasr Al-Farah service book" },
};

function localize(text: Record<Locale, string>, locale: Locale) {
  return text[locale] ?? text.ar;
}

function WorldOrnament({ id, accent }: { id: string; accent: string }) {
  const base = "pointer-events-none absolute";

  switch (id) {
    case "hall":
      return (
        <span aria-hidden="true" className={`${base} -top-5 inline-end-6 end-6 h-24 w-20`}>
          <span
            className="absolute inset-x-0 bottom-0 top-2 rounded-t-full border border-b-0"
            style={{ borderColor: alpha(accent, 0.30) }}
          />
          <span
            className="absolute inset-x-3 bottom-0 top-6 rounded-t-full border border-b-0"
            style={{ borderColor: alpha(accent, 0.18) }}
          />
        </span>
      );
    case "zaffa":
      return (
        <span aria-hidden="true" className={`${base} end-8 top-6 h-20 w-16`}>
          {["0%", "34%", "68%"].map((left, i) => (
            <span
              key={left}
              className="absolute top-0 h-full w-px"
              style={{
                left,
                transform: "skewX(-12deg)",
                background: `linear-gradient(180deg, ${alpha(accent, 0.34 - i * 0.08)}, transparent)`,
              }}
            />
          ))}
        </span>
      );
    case "food":
      return (
        <span aria-hidden="true" className={`${base} end-8 top-8`}>
          <span className="block size-14 rounded-full border" style={{ borderColor: alpha(accent, 0.26) }} />
          <span className="absolute inset-2 rounded-full border" style={{ borderColor: alpha(accent, 0.16) }} />
        </span>
      );
    case "photography":
      return (
        <span aria-hidden="true" className={`${base} end-8 top-8 size-14`}>
          <span className="absolute left-0 top-0 size-4 border-l-2 border-t-2" style={{ borderColor: alpha(accent, 0.34) }} />
          <span className="absolute right-0 top-0 size-4 border-r-2 border-t-2" style={{ borderColor: alpha(accent, 0.34) }} />
          <span className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2" style={{ borderColor: alpha(accent, 0.34) }} />
          <span className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2" style={{ borderColor: alpha(accent, 0.34) }} />
        </span>
      );
    case "decoration":
      return (
        <span aria-hidden="true" className={`${base} end-8 top-7 h-16 w-16`}>
          {[
            { x: 0, y: 6, r: 24, s: 13 },
            { x: 22, y: 0, r: -30, s: 10 },
            { x: 38, y: 18, r: 60, s: 12 },
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
                background: alpha(accent, 0.26),
              }}
            />
          ))}
        </span>
      );
    case "lighting":
      return (
        <span
          aria-hidden="true"
          className={`${base} end-9 top-0 h-24 w-14`}
          style={{
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            background: `linear-gradient(180deg, ${alpha(accent, 0.26)}, transparent 80%)`,
          }}
        />
      );
    case "dj":
      return (
        <span aria-hidden="true" className={`${base} end-8 top-9 flex items-end gap-1`}>
          {[14, 26, 18, 32, 12].map((h, i) => (
            <span
              key={i}
              className="block w-1 rounded-full"
              style={{ height: h, background: alpha(accent, 0.32) }}
            />
          ))}
        </span>
      );
    case "car":
      return (
        <span
          aria-hidden="true"
          className={`${base} end-6 top-12 h-px w-24 rotate-[-14deg]`}
          style={{ borderTop: `2px dashed ${alpha(accent, 0.34)}` }}
        />
      );
    case "memory-book":
      return (
        <span aria-hidden="true" className={`${base} end-8 top-7 h-16 w-14`}>
          <span
            className="absolute inset-0 rotate-3 rounded-sm border"
            style={{ borderColor: alpha(accent, 0.30), background: alpha(accent, 0.05) }}
          />
          <span
            className="absolute inset-0 -rotate-2 rounded-sm border"
            style={{ borderColor: alpha(accent, 0.18) }}
          />
        </span>
      );
    default:
      return null;
  }
}

const paperBackground =
  "radial-gradient(oklch(0.62 0.05 78 / 0.05) 1px, transparent 1px), linear-gradient(160deg, oklch(0.985 0.012 84) 0%, oklch(0.965 0.018 82) 55%, oklch(0.975 0.014 83) 100%)";

function PageFrame() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[4px] border"
        style={{ borderColor: "oklch(0.74 0.09 80 / 0.45)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1.05rem] rounded-[2px] border"
        style={{ borderColor: "oklch(0.74 0.09 80 / 0.20)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 w-7"
        style={{
          background: "linear-gradient(to right, oklch(0.40 0.03 70 / 0.16), transparent)",
        }}
      />
    </>
  );
}

function CoverBookPage({ locale, total }: { locale: Locale; total: number }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{ background: "linear-gradient(150deg, oklch(0.22 0.028 64) 0%, oklch(0.14 0.018 58) 100%)" }}
    >
      <Image
        src="/site/hero.jpg"
        alt=""
        fill
        sizes="(max-width: 768px) 92vw, 416px"
        className="object-cover opacity-45"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, oklch(0.12 0.015 60 / 0.55) 0%, oklch(0.16 0.02 58 / 0.82) 100%)",
        }}
        aria-hidden="true"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[4px] border"
        style={{ borderColor: "oklch(0.78 0.10 82 / 0.55)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-[2px] border"
        style={{ borderColor: "oklch(0.78 0.10 82 / 0.25)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 text-center">
        <span
          className="text-[0.6rem] font-bold uppercase tracking-[0.3em]"
          style={{ color: "oklch(0.80 0.10 82)" }}
        >
          {localize(copy.bookEyebrow, locale)}
        </span>
        <span
          aria-hidden="true"
          className="block h-px w-20"
          style={{ background: "linear-gradient(to right, transparent, oklch(0.78 0.10 82 / 0.8), transparent)" }}
        />
        <h3
          className="text-4xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.97 0.012 84)",
          }}
        >
          {localize(copy.bookTitle, locale)}
        </h3>
        <p className="max-w-[16rem] text-sm leading-relaxed" style={{ color: "oklch(0.88 0.04 82)" }}>
          {localize(copy.bookSubtitle, locale)}
        </p>
        <span
          aria-hidden="true"
          className="block h-px w-20"
          style={{ background: "linear-gradient(to right, transparent, oklch(0.78 0.10 82 / 0.5), transparent)" }}
        />
        <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "oklch(0.72 0.06 80)" }}>
          {localize(copy.coverHint, locale)} · {total}
        </p>
      </div>
    </div>
  );
}

function ServiceBookPage({
  service,
  index,
  total,
  locale,
}: {
  service: ServiceItem;
  index: number;
  total: number;
  locale: Locale;
}) {
  const world = bookWorlds[service.id] ?? fallbackWorld;
  const imageSrc = service.image ?? serviceFallbackImages[service.id] ?? "/site/hero.jpg";
  const ctaHref = "/contact";
  const ctaLabel = service.cta
    ? localize(service.cta.label, locale)
    : localize(copy.defaultServiceCta, locale);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{ background: paperBackground, backgroundSize: "22px 22px, 100% 100%" }}
    >
      <PageFrame />
      <WorldOrnament id={service.id} accent={world.accent} />

      <div className="relative z-10 flex h-full flex-col px-8 pb-7 pt-8">
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: world.accent }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            <span aria-hidden="true" className="block h-px w-6" style={{ background: alpha(world.accent, 0.6) }} />
            {localize(world.mood, locale)}
          </span>
          <span
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center rounded-full border"
            style={{ borderColor: alpha(world.accent, 0.35), color: world.accent }}
          >
            <Icon name={service.icon ?? "Sparkles"} className="size-4" />
          </span>
        </div>

        <div
          className="relative mt-4 h-[38%] shrink-0 overflow-hidden rounded-[3px] border"
          style={{
            borderColor: "oklch(0.74 0.09 80 / 0.5)",
            boxShadow: `0 10px 26px ${alpha(world.accent, 0.16)}, inset 0 0 0 1px oklch(1 0 0 / 0.6)`,
          }}
        >
          <Image
            src={imageSrc}
            alt={service.name[locale]}
            fill
            sizes="(max-width: 768px) 80vw, 352px"
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, oklch(1 0 0 / 0.08), transparent 40%, ${alpha(world.accent, 0.14)})`,
            }}
          />
        </div>

        <h3
          className="mt-5 text-2xl font-bold leading-snug"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.24 0.02 58)",
            textWrap: "balance",
          }}
        >
          {service.name[locale]}
        </h3>

        <span
          aria-hidden="true"
          className="mt-3 block h-px w-14"
          style={{ background: `linear-gradient(to right, ${alpha(world.accent, 0.7)}, transparent)` }}
        />

        <p className="mt-3 flex-1 text-[0.84rem] leading-[1.95]" style={{ color: "oklch(0.42 0.015 58)" }}>
          {service.description[locale]}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {service.priceHint ? (
            <span
              className="inline-flex items-center rounded-full border px-3 py-1 text-[0.66rem] font-semibold"
              style={{
                borderColor: alpha(world.accent, 0.35),
                background: alpha(world.soft, 0.4),
                color: "oklch(0.36 0.03 64)",
              }}
            >
              {service.priceHint[locale]}
            </span>
          ) : (
            <span />
          )}
          <Link
            href={ctaHref}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)]"
            style={{
              background: "linear-gradient(135deg, oklch(0.82 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
              color: "oklch(0.14 0.01 58)",
              boxShadow: "0 8px 20px oklch(0.76 0.10 82 / 0.3)",
            }}
          >
            {ctaLabel}
            <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>

        <span
          className="mt-4 self-center text-[0.58rem] font-semibold tracking-[0.24em]"
          style={{ color: "oklch(0.62 0.04 74)" }}
          aria-hidden="true"
        >
          — {index + 2} —
        </span>
      </div>
    </div>
  );
}

function CtaBookPage({ locale }: { locale: Locale }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={{ background: "linear-gradient(160deg, oklch(0.24 0.03 66) 0%, oklch(0.14 0.018 58) 100%)" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/4 left-1/2 aspect-square w-3/4 -translate-x-1/2 opacity-25"
        style={{ background: "radial-gradient(circle, oklch(0.80 0.10 82) 0%, transparent 65%)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[4px] border"
        style={{ borderColor: "oklch(0.78 0.10 82 / 0.45)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-9 text-center">
        <span
          className="inline-flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.28em]"
          style={{ color: "oklch(0.80 0.10 82)" }}
        >
          <MessageCircle className="size-3.5" aria-hidden="true" />
          {localize(copy.bookEyebrow, locale)}
        </span>
        <h3
          className="text-3xl font-bold leading-snug"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.97 0.012 84)",
            textWrap: "balance",
          }}
        >
          {localize(copy.ctaTitle, locale)}
        </h3>
        <p className="max-w-[18rem] text-sm leading-[1.9]" style={{ color: "oklch(0.84 0.03 80)" }}>
          {localize(copy.ctaBody, locale)}
        </p>
        <div className="mt-2 flex flex-col gap-3">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              background: "linear-gradient(135deg, oklch(0.82 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
              color: "oklch(0.14 0.01 58)",
              boxShadow: "0 10px 28px oklch(0.76 0.10 82 / 0.35)",
            }}
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            {localize(copy.ctaBook, locale)}
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border px-7 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              borderColor: "oklch(1 0 0 / 0.3)",
              background: "oklch(1 0 0 / 0.08)",
              color: "oklch(0.94 0.015 84)",
            }}
          >
            {localize(copy.ctaContact, locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StackedBookPages({ services, locale }: { services: ServiceItem[]; locale: Locale }) {
  const total = services.length;

  return (
    <div
      className="mx-auto flex w-full flex-col md:flex-row md:overflow-x-auto md:snap-x md:snap-mandatory items-center md:items-stretch gap-8 px-4 py-12 pb-8 md:pb-16 hide-scrollbar"
      role="list"
      aria-label={localize(copy.stackedLabel, locale)}
    >
      <div
        role="listitem"
        className="relative md:snap-center md:shrink-0 aspect-[3/4] w-[min(92vw,26rem)] overflow-hidden rounded-xl"
        style={{ boxShadow: "0 22px 50px oklch(0.25 0.03 60 / 0.25)" }}
      >
        <CoverBookPage locale={locale} total={total} />
      </div>

      {services.map((service, index) => (
        <div
          key={service.id}
          role="listitem"
          id={`service-${service.id}`}
          className="relative md:snap-center md:shrink-0 aspect-[3/4] w-[min(92vw,26rem)] overflow-hidden rounded-xl"
          style={{
            boxShadow: "0 18px 40px oklch(0.35 0.035 68 / 0.18), 0 0 0 1px oklch(0.86 0.03 80 / 0.5)",
          }}
        >
          <ServiceBookPage service={service} index={index} total={total} locale={locale} />
        </div>
      ))}

      <div
        role="listitem"
        className="relative md:snap-center md:shrink-0 aspect-[3/4] w-[min(92vw,26rem)] overflow-hidden rounded-xl"
        style={{ boxShadow: "0 22px 50px oklch(0.25 0.03 60 / 0.25)" }}
      >
        <CtaBookPage locale={locale} />
      </div>
    </div>
  );
}

export default function ServicesFlipbookExperience({ services, locale }: { services: ServiceItem[]; locale: Locale }) {
  return (
    <section
      id="services-book"
      className="scene-services relative overflow-hidden"
      aria-label={localize(copy.bookAria, locale)}
    >
      <div className="relative z-10 w-full max-w-[100vw] overflow-hidden">
        <StackedBookPages services={services} locale={locale} />
      </div>
    </section>
  );
}
