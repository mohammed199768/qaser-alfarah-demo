import { getLocale } from "@/lib/i18n";
import { ScrollStoryOverlay, type StoryPhase } from "@/components/site/ScrollStoryOverlay";

/* ───────────────────────────────────────────────────────────────────────────
 * /scroll-story-test
 *
 * Isolated, chrome-free visual test of the scroll story: full viewport, dark
 * cinematic background, minimal overlay text, NO header/footer. Append ?seq=4s
 * to test the trimmed 4-second sequence instead of the production one.
 * ─────────────────────────────────────────────────────────────────────────── */

const STORY: Record<"ar" | "en", [StoryPhase, StoryPhase, StoryPhase]> = {
  en: [
    {
      title: "Every celebration begins with a memory",
      subtitle: "A cinematic glimpse into the moments your guests will remember.",
    },
    {
      title: "Details that shape the evening",
      subtitle: "From the hall to the cake, every scene becomes part of the story.",
    },
    {
      title: "When everything fades, the promise remains",
      subtitle: "A wedding experience designed around emotion, clarity, and elegance.",
    },
  ],
  ar: [
    { title: "كل احتفال يبدأ بذكرى", subtitle: "لمحة سينمائية للحظات التي سيتذكرها ضيوفكم." },
    { title: "تفاصيل تصنع ملامح الأمسية", subtitle: "من القاعة إلى الكعكة، كل مشهد يصبح جزءًا من القصة." },
    { title: "حين يتلاشى كل شيء، يبقى الوعد", subtitle: "تجربة زفاف مصممة حول المشاعر والوضوح والأناقة." },
  ],
};

export default async function ScrollStoryTestPage({
  searchParams,
}: {
  searchParams: Promise<{ seq?: string }>;
}) {
  const { seq } = await searchParams;
  const locale = await getLocale();
  const phases = STORY[locale];
  const scrollHint = locale === "ar" ? "مرّر للأسفل" : "Scroll";
  const dir = seq === "4s" ? "hero-sequence-4s" : "hero-sequence";

  return (
    // No overflow on the sticky viewport's ancestors — it would break pinning.
    <main style={{ background: "#000", width: "100%" }}>
      <ScrollStoryOverlay
        phases={phases}
        scrollHint={scrollHint}
        manifestUrl={`/generated/${dir}/manifest.json`}
        heightVh={300}
      />
    </main>
  );
}
