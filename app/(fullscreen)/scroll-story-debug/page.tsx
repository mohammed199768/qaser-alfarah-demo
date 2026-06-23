import { ScrollStoryDebug } from "@/components/site/ScrollStoryDebug";

/* ───────────────────────────────────────────────────────────────────────────
 * /scroll-story-debug
 *
 * Full-screen frame diagnostics (no site header/footer). Defaults to the
 * production sequence; append ?seq=4s to point at public/generated/
 * hero-sequence-4s/ for an A/B comparison of timing.
 * ─────────────────────────────────────────────────────────────────────────── */

export default async function ScrollStoryDebugPage({
  searchParams,
}: {
  searchParams: Promise<{ seq?: string }>;
}) {
  const { seq } = await searchParams;
  const dir = seq === "4s" ? "hero-sequence-4s" : "hero-sequence";
  const manifestUrl = `/generated/${dir}/manifest.json`;

  return <ScrollStoryDebug manifestUrl={manifestUrl} />;
}
