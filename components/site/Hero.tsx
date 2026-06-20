import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarCheck } from "lucide-react";
import { getSiteConfig, getContent } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { HeroArcScrollBridge } from "@/components/site/HeroArcScrollBridge";

const heroCards = [
  { src: "/site/gallery/hall-1.jpg", alt: "Hall detail", className: "hero-arc-card-one" },
  { src: "/site/gallery/decor-1.jpg", alt: "Decor detail", className: "hero-arc-card-two" },
  { src: "/site/gallery/food-1.jpg", alt: "Hospitality detail", className: "hero-arc-card-three" },
  { src: "/site/gallery/events-1.jpg", alt: "Event detail", className: "hero-arc-card-four" },
  { src: "/site/gallery/couple-1.jpg", alt: "Couple detail", className: "hero-arc-card-five" },
];

export default function Hero({ locale }: { locale: Locale }) {
  const config = getSiteConfig();
  const content = getContent(locale);
  const heroContent = content.home.hero;

  return (
    <section
      className="hero-awards hero-gradient-bg relative z-20 flex min-h-[76vh] w-full items-center overflow-visible lg:min-h-[82vh]"
      aria-label={heroContent.title}
    >
      {/* Cinematic scene: photo atmosphere, palace arches, light beams, gold dust */}
      <div className="hero-scene" aria-hidden="true">
        <div className="hero-scene-img" data-hero-scene-img="">
          <Image
            src="/site/hero.jpg"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 1024px) 70vw, 420px"
            className="object-cover"
          />
        </div>
        <div className="hero-scene-wash" />
        <span className="hero-scene-beam hero-scene-beam--one" />
        <span className="hero-scene-beam hero-scene-beam--two" />
        <span className="hero-scene-arch hero-scene-arch--far" />
        <span className="hero-scene-arch" />
        <span className="hero-corner hero-corner--start" />
        <span className="hero-corner hero-corner--end" />
        <div className="hero-scene-particles" data-hero-particles="">
          {[
            { x: "12%", y: "26%", s: 5 },
            { x: "22%", y: "62%", s: 3 },
            { x: "38%", y: "18%", s: 4 },
            { x: "55%", y: "70%", s: 3 },
            { x: "64%", y: "30%", s: 5 },
            { x: "78%", y: "56%", s: 4 },
            { x: "86%", y: "22%", s: 3 },
            { x: "47%", y: "44%", s: 3 },
          ].map((p) => (
            <span
              key={`${p.x}-${p.y}`}
              style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            />
          ))}
        </div>
        <div className="hero-scene-bottomfade" />
      </div>

      <Container className="relative z-10 grid w-full items-center gap-8 py-10 md:gap-12 md:py-24 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)] lg:gap-16 lg:py-32">
        <div
          className="flex max-w-3xl flex-col items-center text-center lg:items-start lg:text-start"
          data-hero-copy=""
        >
          <div className="mb-7 hero-entrance-kicker">
            <span
              className="hero-kicker inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.68rem] font-semibold uppercase"
              style={{
                background: "oklch(0.99 0.006 84 / 0.82)",
                border: "1px solid oklch(0.76 0.10 82 / 0.28)",
                boxShadow:
                  "0 12px 34px oklch(0.56 0.06 64 / 0.07), inset 0 1px 0 oklch(1 0 0 / 0.8)",
                color: "oklch(0.47 0.06 76)",
              }}
            >
              <span
                className="block h-px w-8"
                style={{
                  background:
                    "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 0.64))",
                }}
                aria-hidden="true"
              />
              {config.logo.alt[locale]}
              {" - "}
              {locale === "ar"
                ? "قاعة أفراح راقية"
                : "Wedding Hall"}
            </span>
          </div>

          <h1
            className="hero-title-premium hero-entrance-title max-w-3xl text-5xl font-bold leading-[1.03] tracking-normal sm:text-6xl md:text-7xl lg:text-[5.4rem]"
            style={{
              fontFamily: "var(--font-display-ar), var(--font-display), serif",
              textWrap: "balance",
            }}
          >
            {heroContent.title}
          </h1>

          <div className="my-8 flex items-center gap-3 hero-entrance-divider" aria-hidden="true">
            <span
              className="block h-px w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 0.68))",
              }}
            />
            <span
              className="block size-1.5 rounded-full"
              style={{ background: "oklch(0.76 0.10 82 / 0.76)" }}
            />
            <span
              className="block h-px w-16"
              style={{
                background:
                  "linear-gradient(to left, transparent, oklch(0.76 0.10 82 / 0.68))",
              }}
            />
          </div>

          <p
            className="mx-auto max-w-xl text-base leading-[1.95] md:text-lg lg:mx-0 hero-entrance-subtitle"
            style={{
              color: "oklch(0.42 0.016 58)",
              textWrap: "pretty",
            }}
          >
            {heroContent.subtitle}
          </p>

          <div className="hero-cta-aura mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row lg:justify-start hero-entrance-ctas">
            <Link
              href="/contact"
              id="hero-cta-book"
              className="hero-primary-cta group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2 sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.80 0.11 82) 0%, oklch(0.69 0.12 76) 100%)",
                color: "oklch(0.14 0.01 58)",
              }}
            >
              <span
                className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.24) 50%, transparent 100%)",
                }}
                aria-hidden="true"
              />
              <CalendarCheck className="relative size-4" aria-hidden="true" />
              <span className="relative">{heroContent.ctaBook}</span>
            </Link>

            <Link
              href="#catalog-flipbook"
              id="hero-cta-catalog"
              className="hero-secondary-cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2 sm:w-auto"
              style={{
                background: "oklch(0.99 0.006 84 / 0.88)",
                borderColor: "oklch(0.76 0.10 82 / 0.32)",
                boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.72)",
                color: "oklch(0.36 0.045 74)",
              }}
            >
              <BookOpen className="size-4" aria-hidden="true" />
              <span>
                {locale === "ar"
                  ? "استكشف الكتالوج"
                  : "Explore Catalog"}
              </span>
            </Link>
          </div>
        </div>

        <div className="hero-arc-stage hero-entrance-stage relative mx-auto min-h-[18rem] w-full max-w-[35rem] sm:min-h-[28rem] lg:min-h-[40rem] lg:max-w-none" aria-hidden="true">
          <div className="hero-arc-backdrop" />

          <div className="hero-feature-card">
            <Image
              src="/site/hero.jpg"
              alt=""
              fill
              priority
              loading="eager"
              sizes="(max-width: 1024px) 70vw, 420px"
              className="object-cover"
            />
            <div className="hero-feature-caption">
              <span>{locale === "ar" ? "قاعة قصر الفرح" : "Qasr Al-Farah Hall"}</span>
            </div>
          </div>

          <div className="hero-arc-track">
            {heroCards.map((card) => (
              <div key={card.src} className={`hero-arc-card ${card.className}`} data-hero-arc-card>
                <Image
                  src={card.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div data-hero-scroll-hint="" className="absolute inset-x-0 bottom-4 z-10 hidden justify-center md:flex" aria-hidden="true">
        <div className="hero-scroll-hint">
          <span className="hero-scroll-hint-label">
            {locale === "ar" ? "تابع الرحلة" : "Scroll"}
          </span>
          <span className="hero-scroll-hint-line" />
        </div>
      </div>

      <HeroArcScrollBridge />
    </section>
  );
}
