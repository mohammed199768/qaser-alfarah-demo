"use client";

import Image from "next/image";
import Link from "next/link";
import CatalogTicketBridge from "@/components/site/CatalogTicketBridge";
import type { Locale } from "@/lib/i18n";

// ─── Catalog page data ───────────────────────────────────────────────────────

interface CatalogPage {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  labelAr?: string;
  labelEn?: string;
  imageSrc: string;
  imageAltAr: string;
  imageAltEn: string;
}

function catalogPageCopy(page: CatalogPage, locale: Locale) {
  const isAr = locale === "ar";
  return {
    title: isAr ? page.titleAr : page.titleEn,
    body: isAr ? page.bodyAr : page.bodyEn,
    label: isAr ? page.labelAr : page.labelEn,
    imageAlt: isAr ? page.imageAltAr : page.imageAltEn,
  };
}

const CATALOG_COPY = {
  ar: {
    sectionLabel: "كتالوج خدمات قصر الفرح",
    interactiveLabel: "كتالوج قصر الفرح التفاعلي",
    eyebrow: "كتالوج الخدمات",
    heading: "كتالوج خدمات قصر الفرح",
    subheading: "تصفّح خدمات القصر، من الزفة والديكور إلى الضيافة والذكريات.",
    page: "صفحة",
    of: "من",
    previous: "السابق",
    next: "التالي",
    previousPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    bookNow: "تواصل معنا",
    brand: "قصر الفرح",
    brandLatin: "Qasr Al-Farah",
  },
  en: {
    sectionLabel: "Qasr Al-Farah service catalog",
    interactiveLabel: "Interactive Qasr Al-Farah catalog",
    eyebrow: "Service Catalog",
    heading: "Qasr Al-Farah Service Catalog",
    subheading: "Browse the palace services, from entrance and decor to hospitality and memories.",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    previousPage: "Previous page",
    nextPage: "Next page",
    bookNow: "Contact Us",
    brand: "Qasr Al-Farah",
    brandLatin: "Qasr Al-Farah",
  },
} satisfies Record<Locale, Record<string, string>>;

const CATALOG_PAGES: CatalogPage[] = [
  {
    id: "cover",
    titleAr: "كتالوج الفرح",
    titleEn: "Celebration Catalog",
    bodyAr: "كل تفاصيل يومك في صفحات واحدة",
    bodyEn: "Every detail of your day in one elegant set of pages",
    labelAr: "قصر الفرح · كتالوج الخدمات",
    labelEn: "Qasr Al-Farah · Service Catalog",
    imageSrc: "/site/hero.jpg",
    imageAltAr: "قصر الفرح — قاعة الأفراح",
    imageAltEn: "Qasr Al-Farah wedding hall",
  },
  {
    id: "zaffa",
    titleAr: "زفات ملكية",
    titleEn: "Royal Entrances",
    bodyAr: "لحظة دخولك تُوقف القلوب. نُصمّم زفّتك بأبهة استثنائية، توليفة من الأنغام والنور والبريق تجعل دخولك إلى القاعة لحظةً لا تُنسى.",
    bodyEn: "Your entrance should stop the room. We design it with music, light, and presence so the first moment becomes unforgettable.",
    labelAr: "زفة ملكية",
    labelEn: "Royal Wedding Entrance",
    imageSrc: "/site/gallery/events-1.jpg",
    imageAltAr: "زفة ملكية — مدخل العروسين",
    imageAltEn: "Royal wedding entrance",
  },
  {
    id: "hospitality",
    titleAr: "الضيافة والطعام",
    titleEn: "Hospitality & Dining",
    bodyAr: "موائد تُشبع الأذواق الرفيعة. من المشهيات إلى حلوى العرس، نُقدّم ضيافةً تليق بضيوفكم الكرام في أجواء تفوق التوقعات.",
    bodyEn: "Refined tables for generous celebrations, from appetizers to wedding sweets, served with care for every guest.",
    labelAr: "الضيافة والطعام",
    labelEn: "Hospitality & Fine Dining",
    imageSrc: "/site/gallery/food-1.jpg",
    imageAltAr: "ضيافة وطعام — موائد العرس",
    imageAltEn: "Wedding hospitality and dining tables",
  },
  {
    id: "decor",
    titleAr: "الكوشة والديكور",
    titleEn: "Stage & Decor",
    bodyAr: "مسرحكم المثالي. كوشة تعكس شخصيتكم، وإضاءة تُرسم بعناية لكل زاوية، وزهور أنيقة تُكمل صورة يومكم الاستثنائي.",
    bodyEn: "A stage that reflects your style, with carefully planned lighting and floral details that complete the scene.",
    labelAr: "الكوشة والديكور",
    labelEn: "Stage Design & Floral Décor",
    imageSrc: "/site/gallery/decor-1.jpg",
    imageAltAr: "كوشة وديكور — تصميم القاعة",
    imageAltEn: "Wedding stage and hall decor",
  },
  {
    id: "bridal",
    titleAr: "فساتين وإطلالة العروس",
    titleEn: "Bridal Look",
    bodyAr: "إطلالتك تستحق الكمال. نُنسّق مع أفضل مصممي الأزياء لتكوني في أبهى صورة، من الفستان إلى آخر تفصيل يُكمل أناقتك.",
    bodyEn: "Your bridal look deserves careful coordination, from the dress to the final detail that completes your elegance.",
    labelAr: "إطلالة العروس",
    labelEn: "Bridal Look & Style Coordination",
    imageSrc: "/site/gallery/couple-1.jpg",
    imageAltAr: "إطلالة العروس — فساتين الزفاف",
    imageAltEn: "Bridal look and wedding styling",
  },
  {
    id: "photography",
    titleAr: "التصوير والذكريات",
    titleEn: "Photography & Memories",
    bodyAr: "لحظاتكم تستحق أن تخلد للأبد. فريق تصوير محترف يلتقط كل ابتسامة وكل نظرة، ويُحوّلها إلى ذكريات رقمية لا تزول.",
    bodyEn: "Your moments deserve to last. Professional coverage turns smiles, glances, and details into lasting digital memories.",
    labelAr: "التصوير والذكريات",
    labelEn: "Photography & Memory Book",
    imageSrc: "/site/gallery/hall-1.jpg",
    imageAltAr: "تصوير وذكريات — البوم الزفاف",
    imageAltEn: "Wedding photography and memory book",
  },
  {
    id: "planning",
    titleAr: "تنظيم كامل للحفل",
    titleEn: "Full Event Planning",
    bodyAr: "راحة بالكم هي أولويتنا. فريقنا يتولى كل تفاصيل التنسيق من التوقيت إلى استقبال الضيوف، لتستمتعوا بيومكم دون أي قلق.",
    bodyEn: "Peace of mind comes first. Our team manages timing, coordination, and guest flow so you can enjoy the day.",
    labelAr: "تنظيم كامل",
    labelEn: "Full Event Planning",
    imageSrc: "/site/gallery/events-1.jpg",
    imageAltAr: "تنظيم حفل — تنسيق كامل",
    imageAltEn: "Full wedding planning and coordination",
  },
  {
    id: "cta",
    titleAr: "ابدأ تخطيط فرحك معنا",
    titleEn: "Start Planning With Us",
    bodyAr: "يومكم الأجمل في انتظاركم. تواصلوا معنا اليوم لحجز موعد استشارة مجانية والبدء في رسم تفاصيل حفلة أحلامكم.",
    bodyEn: "Your most beautiful day is waiting. Contact us to book a consultation and begin shaping your celebration.",
    labelAr: "ابدأ رحلتك",
    labelEn: "Begin Your Journey",
    imageSrc: "/site/og-image.jpg",
    imageAltAr: "قصر الفرح — ابدأ رحلتك",
    imageAltEn: "Qasr Al-Farah start your journey",
  },
];

function GoldDivider() {
  return (
    <div
      className="flex items-center justify-center gap-2"
      aria-hidden="true"
    >
      <span
        className="block h-px w-12 rounded-full"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 55%))" }}
      />
      <span
        className="block size-1.5 rounded-full"
        style={{ background: "oklch(0.76 0.10 82 / 65%)" }}
      />
      <span
        className="block size-1 rounded-full opacity-40"
        style={{ background: "oklch(0.76 0.10 82)" }}
      />
      <span
        className="block size-1.5 rounded-full"
        style={{ background: "oklch(0.76 0.10 82 / 65%)" }}
      />
      <span
        className="block h-px w-12 rounded-full"
        style={{ background: "linear-gradient(to left, transparent, oklch(0.76 0.10 82 / 55%))" }}
      />
    </div>
  );
}

function StaticCatalog({ locale }: { locale: Locale }) {
  const copy = CATALOG_COPY[locale];
  const isCoverPage = (page: CatalogPage) => page.id === "cover";
  const isCtaPage = (page: CatalogPage) => page.id === "cta";
  const ctaPage = CATALOG_PAGES.find((p) => p.id === "cta");
  const ctaCopy = ctaPage ? catalogPageCopy(ctaPage, locale) : null;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      role="list"
      aria-label={copy.sectionLabel}
    >
      {CATALOG_PAGES.filter((p) => !isCoverPage(p) && !isCtaPage(p)).map(
        (page) => {
          const pageCopy = catalogPageCopy(page, locale);

          return (
          <article
            key={page.id}
            role="listitem"
            className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-400 hover:-translate-y-1 hover:shadow-md"
            style={{
              background: "oklch(0.98 0.008 83)",
              border: "1px solid oklch(0.88 0.012 82)",
              boxShadow: "0 2px 12px oklch(0.76 0.10 82 / 8%), 0 1px 3px oklch(0 0 0 / 4%)",
            }}
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden flex-shrink-0">
              <Image
                src={page.imageSrc}
                alt={pageCopy.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.98 0.008 83 / 90%) 0%, transparent 55%)",
                }}
              />
              {pageCopy.label && (
                <span
                  className="absolute bottom-3 start-3 text-[0.58rem] font-bold tracking-[0.22em] uppercase"
                  style={{ color: "oklch(0.76 0.10 82)" }}
                >
                  {pageCopy.label}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-3 p-5">
              <div
                className="h-px w-10 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, oklch(0.76 0.10 82 / 80%), transparent)",
                }}
                aria-hidden="true"
              />
              <h3
                className="text-lg font-bold leading-snug"
                style={{
                  fontFamily: "var(--font-display-ar), var(--font-display), serif",
                  color: "oklch(0.22 0.02 58)",
                }}
              >
                {pageCopy.title}
              </h3>
              <p
                className="text-sm leading-[1.9] flex-1"
                style={{ color: "oklch(0.50 0.01 58)" }}
              >
                {pageCopy.body}
              </p>
            </div>
          </article>
          );
        }
      )}

      {/* CTA card */}
      <article
        role="listitem"
        className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-6 text-center sm:col-span-2 xl:col-span-4 min-h-[220px]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.95 0.030 80) 0%, oklch(0.97 0.018 82) 100%)",
          border: "1px solid oklch(0.82 0.06 80 / 40%)",
          boxShadow:
            "0 4px 24px oklch(0.76 0.10 82 / 12%), inset 0 1px 0 oklch(1 0 0 / 70%)",
        }}
      >
        <div
          className="absolute -top-1/3 -start-1/4 w-2/3 aspect-square opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.76 0.10 82) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div
            className="h-px w-20"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 70%), transparent)",
            }}
            aria-hidden="true"
          />
          <p
            className="text-[0.6rem] font-bold tracking-[0.3em] uppercase"
            style={{ color: "oklch(0.58 0.09 78)" }}
          >
            {copy.brandLatin}
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold leading-snug max-w-sm"
            style={{
              fontFamily: "var(--font-display-ar), var(--font-display), serif",
              color: "oklch(0.22 0.02 58)",
            }}
          >
            {ctaCopy?.title}
          </h3>
          <p
            className="text-sm leading-relaxed max-w-md"
            style={{ color: "oklch(0.46 0.01 58)" }}
          >
            {ctaCopy?.body}
          </p>
          <Link
            href="/booking"
            id="catalog-cta-static"
            className="group/btn relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-8 text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.11 82) 0%, oklch(0.70 0.12 76) 100%)",
              color: "oklch(0.14 0.01 58)",
              boxShadow:
                "0 0 0 1px oklch(0.76 0.10 82 / 30%), 0 8px 28px oklch(0.76 0.10 82 / 28%)",
            }}
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <span className="relative">{copy.bookNow}</span>
            <span
              className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5"
              aria-hidden="true"
            >
              ←
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}

export default function HomeCatalogFlipbook({ locale }: { locale: Locale }) {
  const copy = CATALOG_COPY[locale];

  return (
    <section
      id="catalog-flipbook"
      className="scene-catalog relative overflow-hidden"
      aria-label={copy.sectionLabel}
      data-catalog-section=""
    >
      <CatalogTicketBridge />
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-20 w-[min(42vw,15rem)] -translate-x-1/2 sm:w-[min(26vw,18rem)]"
        aria-hidden="true"
        data-catalog-ticket=""
      >
        <Image
          src="/site/qr-ticket-removebg-preview.png"
          alt=""
          width={640}
          height={640}
          sizes="(max-width: 640px) 42vw, 26vw"
          className="h-auto w-full"
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:px-8">
        <div className="text-center mb-14 space-y-5" data-catalog-header="">
          <span className="scene-header-arch" aria-hidden="true" />
          <span
            className="inline-block text-[0.65rem] font-bold tracking-[0.25em] uppercase"
            style={{ color: "oklch(0.58 0.09 78)" }}
          >
            {copy.eyebrow}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display-ar), var(--font-display), serif",
              color: "oklch(0.22 0.02 58)",
            }}
          >
            {copy.heading}
          </h2>
          <div className="flex items-center justify-center">
            <GoldDivider />
          </div>
          <p
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.50 0.01 58)" }}
          >
            {copy.subheading}
          </p>
        </div>

        <div data-catalog-stage="">
          <StaticCatalog locale={locale} />
        </div>
      </div>
    </section>
  );
}
