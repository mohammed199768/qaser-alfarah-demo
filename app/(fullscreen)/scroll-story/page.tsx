import type { Metadata } from "next";
import { getLocale, getDirection } from "@/lib/i18n";
import { KeyframedScrollStory, type StorySection } from "@/components/site/KeyframedScrollStory";

/* ───────────────────────────────────────────────────────────────────────────
 * /scroll-story
 *
 * A premium three-section wedding-venue experience — NOT a continuous scrub.
 * The frame sequence is a FIXED, full-viewport canvas background; the page
 * scrolls through three real website panels with content on both sides.
 *
 * Each section targets one sequence frame for its fast cinematic transition,
 * then settles on a dedicated SHARP resting still (public/generated/
 * hero-keyframes/<id>.webp) so the landing image is crisp. Selected frames
 * (chosen by visual inspection for clarity):
 *
 *   Section 1 ("memory")  → frame 4  (book/hall; frames 1–3 were softer)
 *   Section 2 ("details") → frame 27 (cake; sharpest balanced composition)
 *   Section 3 ("promise") → frame 48 (rings; sharpest, most prominent)
 *
 * Lives in the (fullscreen) group so it renders edge-to-edge with NO site
 * header/footer. Uses the 4-second WebP sequence; no MP4.
 * ─────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Cinematic Scroll Story",
  description:
    "A three-act cinematic glimpse into the moments your guests will remember.",
  alternates: { canonical: "/scroll-story" },
};

// Locale-independent: id, transition target frame, and the sharp resting still.
const SECTION_MEDIA: Array<Pick<StorySection, "id" | "targetFrame" | "keyframeUrl">> = [
  { id: "memory", targetFrame: 4, keyframeUrl: "/generated/hero-keyframes/memory.webp" },
  { id: "details", targetFrame: 27, keyframeUrl: "/generated/hero-keyframes/details.webp" },
  { id: "promise", targetFrame: 48, keyframeUrl: "/generated/hero-keyframes/promise.webp" },
];

type SectionCopy = Omit<StorySection, "id" | "targetFrame" | "keyframeUrl">;

const COPY: Record<"ar" | "en", [SectionCopy, SectionCopy, SectionCopy]> = {
  ar: [
    {
      eyebrow: "قصة الزفاف",
      title: "كل احتفال يبدأ بذكرى",
      body: "نحوّل لحظة الحجز الأولى إلى تجربة واضحة تبدأ من القاعة وتنتهي بانطباع يبقى.",
      cta: "استكشف التجربة",
      rightTitle: "ما يشعر به الضيوف",
      rightItems: [
        "مشهد واضح من اللحظة الأولى",
        "تنظيم بصري يرفع الثقة",
        "تجربة تحفظ التفاصيل",
      ],
    },
    {
      eyebrow: "تفاصيل المناسبة",
      title: "تفاصيل تصنع الأمسية",
      body: "من تنسيق الطاولات إلى الكعكة، كل تفصيلة تُعرض بطريقة تجعل القاعة أقرب وأسهل للفهم.",
      cta: "شاهد التفاصيل",
      rightTitle: "مصمم للوضوح",
      rightBody: "الطاولات والمقاعد والأجواء وتفاصيل الخدمة، معروضة في تدفق واحد أنيق.",
      rightChips: ["عرض القاعة", "حركة الضيوف", "مسار الحجز"],
    },
    {
      eyebrow: "الوعد",
      title: "ويبقى الوعد",
      body: "حين تختفي التفاصيل، يبقى القرار الأهم: تجربة زفاف واضحة، راقية، وسهلة الوصول.",
      cta: "احجز موعد مشاهدة",
      rightTitle: "الانطباع الأخير",
      rightItems: ["ثقة قبل التواصل", "قرار أسرع", "صورة أرقى للقاعة"],
    },
  ],
  en: [
    {
      eyebrow: "Wedding Story",
      title: "Every celebration begins with a memory",
      body: "We turn the very first booking moment into a clear experience — from the hall to an impression that lasts.",
      cta: "Explore the experience",
      rightTitle: "What guests feel",
      rightItems: [
        "A clear scene from the first moment",
        "Visual order that builds confidence",
        "An experience that keeps the details",
      ],
    },
    {
      eyebrow: "Event Details",
      title: "Details shape the evening",
      body: "From table arrangements to the cake, every detail is presented in a way that makes the hall closer and easier to understand.",
      cta: "See the details",
      rightTitle: "Designed for clarity",
      rightBody: "Tables, seats, mood, and service details presented in one elegant flow.",
      rightChips: ["Hall View", "Guest Flow", "Booking Path"],
    },
    {
      eyebrow: "The Promise",
      title: "The promise remains",
      body: "When the details fade, the most important decision stays: a clear, refined, easy-to-reach wedding experience.",
      cta: "Book a viewing",
      rightTitle: "Final impression",
      rightItems: ["Confidence before contact", "A faster decision", "A finer image of the hall"],
    },
  ],
};

export default async function ScrollStoryPage() {
  const locale = await getLocale();
  const direction = getDirection(locale);
  const copy = COPY[locale];
  const scrollHint = locale === "ar" ? "مرّر للأسفل" : "Scroll";

  const sections: StorySection[] = SECTION_MEDIA.map((media, index) => {
    // Both arrays are fixed length 3, so the copy entry always exists.
    const text = copy[index] as SectionCopy;
    return { ...media, ...text };
  });

  return (
    <KeyframedScrollStory
      manifestUrl="/generated/hero-sequence-4s/manifest.json"
      sections={sections}
      scrollHint={scrollHint}
      dir={direction}
      ariaLabel={sections[0]?.title ?? "Cinematic scroll story"}
    />
  );
}
