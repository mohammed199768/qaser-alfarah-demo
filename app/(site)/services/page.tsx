import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { getContent, getSiteConfig } from "@/content/site";
import ServicesPackagesBook, {
  type BookCopy,
  type WeddingPackage,
} from "@/components/site/ServicesPackagesBook";

/* ----------------------------------------------------------------------------
 * "باقاتنا" / "Our Packages" — presented as a premium wedding book/catalog.
 *
 * Three package scenes (not nine services). Each package bundles the relevant
 * services as inclusions. All CTAs route to /contact. The cinematic book
 * presentation + light GSAP scroll motion lives in ServicesPackagesBook.
 * -------------------------------------------------------------------------- */

const bookCopy: BookCopy = {
  eyebrow: { ar: "باقاتنا", en: "Our Packages" },
  coverKicker: { ar: "باقاتنا", en: "Our Packages" },
  coverTitle: {
    ar: ["باقاتنا", "كتاب فرحكم"],
    en: ["Our Packages", "The book of your day"],
  },
  coverSubtitle: {
    ar: "ثلاث باقات زفاف متكاملة، كل واحدة مشهد كامل يجمع القاعة والزفة والضيافة والديكور والتوثيق في تجربة واحدة منسّقة تحت سقف قصر الفرح.",
    en: "Three complete wedding packages — each a full scene bringing the hall, zaffa, hospitality, decor, and memories into one orchestrated experience under the roof of Qasr Al-Farah.",
  },
  coverHint: { ar: "تابعوا التمرير لتصفّح الباقات", en: "Scroll to turn the pages" },
  heroPrimary: { ar: "احجز موعد زيارة", en: "Book a hall visit" },
  heroSecondary: { ar: "تصفّح الباقات", en: "Explore the packages" },
  pageWord: { ar: "باقة", en: "Package" },
  includesLabel: { ar: "تشمل الباقة", en: "What's included" },
  bestForLabel: { ar: "مناسبة لـ", en: "Best for" },
  popularBadge: { ar: "الأكثر اختياراً", en: "Most chosen" },
  packageCta: { ar: "اطلب هذه الباقة", en: "Request this package" },
  noteEyebrow: { ar: "ملاحظة", en: "Note" },
  noteBody: {
    ar: "كل باقة قابلة للتخصيص حسب عدد الضيوف وطابع المناسبة. تواصلوا معنا لتفصيل باقة تناسب يومكم تماماً.",
    en: "Every package can be tailored to your guest count and the style of your celebration. Reach out and we'll shape one that fits your day exactly.",
  },
  finalEyebrow: { ar: "الخطوة التالية", en: "Next step" },
  finalTitle: {
    ar: ["لنحوّل الباقة", "إلى ليلة فرح كاملة"],
    en: ["Turn your package", "into one complete night"],
  },
  finalBody: {
    ar: "احجزوا موعد زيارة قصر الفرح، وسنرتّب لكم الباقة المناسبة من أول استقبال حتى آخر ذكرى.",
    en: "Book a visit to Qasr Al-Farah, and we'll arrange the right package for you — from the first welcome to the final memory.",
  },
  closingNote: {
    ar: "تنظيم هادئ، حضور فاخر، وذكريات تبقى.",
    en: "Calm planning, luxurious presence, lasting memories.",
  },
  contact: { ar: "تواصل معنا", en: "Contact us" },
  book: "", // filled from content.nav.book per locale below
};

const packages: WeddingPackage[] = [
  {
    id: "essential",
    number: "01",
    name: { ar: "الباقة الأساسية", en: "Essential Package" },
    tagline: { ar: "أساس أنيق ليوم لا يُنسى", en: "An elegant foundation for an unforgettable day" },
    story: {
      ar: "كل ما تحتاجونه لإطار فرح متكامل: قاعة فاخرة مجهّزة، استقبال منظّم، وإضاءة وضيافة تليق بضيوفكم، دون تعقيد أو قرارات كثيرة.",
      en: "Everything you need for a complete celebration: a fully prepared luxury hall, a calm reception, and lighting and hospitality worthy of your guests — without complexity or endless decisions.",
    },
    bestFor: { ar: "الأفراح العائلية الهادئة", en: "Intimate family weddings" },
    priceHint: { ar: "زيارة القاعة متاحة", en: "Hall visits available" },
    includes: {
      ar: [
        "حجز قاعة الأفراح وتجهيزها",
        "تنظيم الاستقبال ومسار الضيوف",
        "إضاءة ناعمة للقاعة",
        "باقة ضيافة أساسية",
      ],
      en: [
        "Wedding hall booking and setup",
        "Reception and guest flow",
        "Soft ambient lighting",
        "Essential hospitality",
      ],
    },
    image: "/site/gallery/hall-1.jpg",
    collage: ["/site/gallery/events-1.jpg", "/site/gallery/food-1.jpg"],
    imageAlt: { ar: "قاعة أفراح قصر الفرح", en: "Qasr Al-Farah wedding hall" },
    ornament: "hall",
    tone: "dark",
    accent: "oklch(0.80 0.11 82)",
    glow: "oklch(0.90 0.06 84)",
  },
  {
    id: "signature",
    number: "02",
    name: { ar: "الباقة المميزة", en: "Signature Package" },
    tagline: { ar: "تجربة فرح متكاملة بكل تفاصيلها", en: "A full celebration, detail by detail" },
    story: {
      ar: "تجربة الزفاف الأكثر طلباً: زفة ودخلة منسّقة، كوشة وديكور وزهور، ضيافة موسّعة، وتوثيق للحظات الأهم، حتى تبدأ ليلتكم بحضور وتنتهي بذكرى.",
      en: "Our most requested wedding experience: a choreographed zaffa and grand entrance, styled stage and florals, a richer hospitality spread, and photography for the moments that matter most.",
    },
    bestFor: { ar: "حفلات الزفاف الكاملة", en: "Full wedding celebrations" },
    priceHint: { ar: "تنسيق حسب الباقة", en: "Package based" },
    includes: {
      ar: [
        "كل ما في الباقة الأساسية",
        "الزفة ودخلة العروسين",
        "الكوشة والديكور وتنسيق الزهور",
        "باقة ضيافة موسّعة",
        "تصوير وتوثيق اللحظات",
      ],
      en: [
        "Everything in Essential",
        "Zaffa and grand entrance",
        "Stage, decor and florals",
        "Expanded hospitality",
        "Photography coverage",
      ],
    },
    image: "/site/gallery/decor-1.jpg",
    collage: ["/site/gallery/couple-1.jpg", "/site/gallery/events-1.jpg"],
    imageAlt: { ar: "كوشة وديكور حفل الزفاف في قصر الفرح", en: "Wedding stage and decor at Qasr Al-Farah" },
    ornament: "floral",
    tone: "dark",
    accent: "oklch(0.82 0.09 60)",
    glow: "oklch(0.90 0.05 40)",
    popular: true,
  },
  {
    id: "royal",
    number: "03",
    name: { ar: "الباقة الملكية", en: "Royal Package" },
    tagline: { ar: "أرقى ما يمكن أن تكون عليه ليلة العمر", en: "The grandest a once-in-a-lifetime night can be" },
    story: {
      ar: "تجربتنا الأكمل والأكثر فخامة: إضاءة مسرحية، صوتيات ودي جي، مسار وصول واستقبال مميّز، وسجل ذكريات رقمي يبقى معكم، مع تنسيق كامل لكل لحظة من ليلتكم.",
      en: "Our most complete and luxurious experience: theatrical lighting, full audio and DJ, a distinguished arrival and reception route, and a digital memory book — with every moment of your night fully coordinated.",
    },
    bestFor: { ar: "المناسبات الكبرى الفاخرة", en: "Grand luxury celebrations" },
    priceHint: { ar: "تجربة فاخرة متكاملة", en: "Complete luxury experience" },
    includes: {
      ar: [
        "كل ما في الباقة المميزة",
        "إضاءة مسرحية للحظات المهمة",
        "صوتيات ودي جي لكامل السهرة",
        "مسار وصول واستقبال مميّز",
        "سجل ذكريات رقمي للعروسين",
      ],
      en: [
        "Everything in Signature",
        "Theatrical lighting",
        "Full audio and DJ",
        "Distinguished arrival",
        "Digital memory book",
      ],
    },
    image: "/site/gallery/couple-1.jpg",
    collage: ["/site/og-image.jpg", "/site/gallery/decor-1.jpg"],
    imageAlt: { ar: "لحظة العروسين في قصر الفرح", en: "Wedding couple moment at Qasr Al-Farah" },
    ornament: "crown",
    tone: "light",
    accent: "oklch(0.62 0.10 80)",
    glow: "oklch(0.88 0.06 82)",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.services;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/services",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const content = getContent(locale);
  const config = getSiteConfig();
  const brandName = config.logo.alt[locale];

  const copy: BookCopy = { ...bookCopy, book: content.nav.book };

  return (
    <ServicesPackagesBook packages={packages} copy={copy} brandName={brandName} locale={locale} />
  );
}
