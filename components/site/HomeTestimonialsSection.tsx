import { homeTestimonials, type HomeTestimonial } from "@/content/site/testimonials";
import { HomeTestimonialsBridge } from "@/components/site/HomeTestimonialsBridge";
import type { Locale } from "@/lib/i18n";

const TESTIMONIALS_COPY = {
  ar: {
    eyebrow: "من رسائل الضيوف",
    heading: "ردود وصلت بعد ليلة الفرح",
    body: "بعض الكلمات تصل بعد انتهاء الحفل، لكنها تختصر التجربة كاملة: راحة، تنظيم، وذكرى بقيت مع أهل الفرح والضيوف.",
    disclaimer: "نماذج من رسائل الضيوف — صياغة تجريبية قابلة للاستبدال بردود العملاء الحقيقية",
  },
  en: {
    eyebrow: "Guest Messages",
    heading: "Replies After the Celebration",
    body: "Some words arrive after the celebration ends, yet they capture the whole experience: comfort, organization, and memories that stay with families and guests.",
    disclaimer: "Sample guest messages — demo wording that can be replaced with real customer replies",
  },
} satisfies Record<Locale, Record<string, string>>;

function pickTestimonial(t: HomeTestimonial, locale: Locale) {
  const isAr = locale === "ar";

  return {
    source: isAr ? t.sourceAr : t.sourceEn,
    author: isAr ? t.authorAr : t.authorEn,
    message: isAr ? t.messageAr : t.messageEn,
    context: isAr ? t.contextAr : t.contextEn,
    reaction: isAr ? t.reactionAr : t.reactionEn,
  };
}

// ─── Gold divider ─────────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <span
        className="block h-px w-16 rounded-full"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 55%))" }}
      />
      <span className="block size-1.5 rounded-full" style={{ background: "oklch(0.76 0.10 82 / 65%)" }} />
      <span className="block size-1 rounded-full opacity-40" style={{ background: "oklch(0.76 0.10 82)" }} />
      <span className="block size-1.5 rounded-full" style={{ background: "oklch(0.76 0.10 82 / 65%)" }} />
      <span
        className="block h-px w-16 rounded-full"
        style={{ background: "linear-gradient(to left, transparent, oklch(0.76 0.10 82 / 55%))" }}
      />
    </div>
  );
}

// ─── Avatar circle with gradient ring ────────────────────────────────────────

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="relative flex-shrink-0 size-10 rounded-full p-[2px]"
      style={{
        background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      }}
      aria-hidden="true"
    >
      <div
        className="size-full rounded-full flex items-center justify-center"
        style={{ background: "oklch(0.94 0.018 82)" }}
      >
        <span
          className="text-[0.6rem] font-bold"
          style={{ color: "oklch(0.38 0.06 74)" }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
}

// ─── Source badge ─────────────────────────────────────────────────────────────

function SourceBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[0.56rem] font-bold tracking-wide"
      style={{
        background: "oklch(0.94 0.014 80 / 70%)",
        color: "oklch(0.52 0.08 76)",
        border: "1px solid oklch(0.86 0.018 80 / 45%)",
      }}
    >
      {label}
    </span>
  );
}

// ─── Featured DM card (large) ─────────────────────────────────────────────────

function FeaturedDmCard({ t, locale }: { t: HomeTestimonial; locale: Locale }) {
  const copy = pickTestimonial(t, locale);
  const initials = copy.author.slice(0, 2);

  return (
    <figure
      className="relative flex flex-col gap-5 overflow-hidden rounded-3xl p-7 sm:p-9"
      style={{
        background: "oklch(0.99 0.006 84)",
        border: "1px solid oklch(0.88 0.018 82 / 55%)",
        boxShadow:
          "0 8px 40px oklch(0.76 0.10 82 / 10%), 0 2px 8px oklch(0 0 0 / 4%), inset 0 1px 0 oklch(1 0 0 / 90%)",
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute -top-1/2 -end-1/4 w-2/3 aspect-square opacity-[0.08]"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.10 82) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Header row */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar initials={initials} />
          <div className="flex flex-col gap-0.5 text-start">
            <span className="text-sm font-bold" style={{ color: "oklch(0.26 0.02 60)" }}>
              {copy.author}
            </span>
            <span className="text-[0.62rem] font-mono" style={{ color: "oklch(0.58 0.06 76)" }}>
              {t.handle}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SourceBadge label={copy.source} />
          <span className="text-[0.55rem]" style={{ color: "oklch(0.65 0.04 74)" }}>
            {copy.context}
          </span>
        </div>
      </div>

      {/* Message bubble */}
      <blockquote
        className="relative z-10 rounded-2xl rounded-tr-sm px-5 py-4"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.96 0.022 82) 0%, oklch(0.97 0.014 80) 100%)",
          border: "1px solid oklch(0.88 0.020 80 / 45%)",
        }}
      >
        <p
          className="text-base sm:text-lg font-semibold leading-[1.8] text-start"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.24 0.02 58)",
          }}
        >
          {copy.message}
        </p>
      </blockquote>

      {/* Reaction chip */}
      {copy.reaction && (
        <figcaption className="relative z-10 flex justify-end">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.11 82) 0%, oklch(0.70 0.12 76) 100%)",
              color: "oklch(0.14 0.01 58)",
              boxShadow: "0 2px 10px oklch(0.76 0.10 82 / 25%)",
            }}
          >
            <span
              className="block size-1 rounded-full"
              style={{ background: "oklch(0.14 0.01 58 / 35%)" }}
              aria-hidden="true"
            />
            {copy.reaction}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

// ─── Small DM card ────────────────────────────────────────────────────────────

function SmallDmCard({ t, locale }: { t: HomeTestimonial; locale: Locale }) {
  const copy = pickTestimonial(t, locale);
  const initials = copy.author.slice(0, 2);

  return (
    <figure
      className="flex flex-col gap-4 rounded-2xl p-5"
      style={{
        background: "oklch(0.985 0.005 84)",
        border: "1px solid oklch(0.89 0.012 82 / 55%)",
        boxShadow: "0 2px 14px oklch(0.76 0.10 82 / 6%), 0 1px 3px oklch(0 0 0 / 3%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} />
          <div className="flex flex-col gap-0.5 text-start">
            <span className="text-xs font-bold" style={{ color: "oklch(0.28 0.022 60)" }}>
              {copy.author}
            </span>
            <span className="text-[0.58rem] font-mono" style={{ color: "oklch(0.60 0.06 76)" }}>
              {t.handle}
            </span>
          </div>
        </div>
        <SourceBadge label={copy.source} />
      </div>

      {/* Message bubble */}
      <blockquote
        className="rounded-xl rounded-tr-sm px-4 py-3 flex-1"
        style={{
          background: "oklch(0.96 0.016 82 / 60%)",
          border: "1px solid oklch(0.89 0.016 80 / 40%)",
        }}
      >
        <p
          className="text-sm leading-[1.9] text-start"
          style={{
            fontFamily: "var(--font-body-ar), sans-serif",
            color: "oklch(0.36 0.018 60)",
          }}
        >
          {copy.message}
        </p>
      </blockquote>

      {/* Footer */}
      <figcaption className="flex items-center justify-between gap-2">
        <span className="text-[0.56rem]" style={{ color: "oklch(0.65 0.04 74)" }}>
          {copy.context}
        </span>
        {copy.reaction && (
          <span
            className="inline-block rounded-full px-2.5 py-1 text-[0.6rem] font-semibold"
            style={{
              background: "oklch(0.93 0.022 80 / 55%)",
              color: "oklch(0.50 0.08 76)",
            }}
          >
            {copy.reaction}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function HomeTestimonialsSection({ locale }: { locale: Locale }) {
  const featured = homeTestimonials.find((t) => t.featured) ?? homeTestimonials[0];
  const cards = homeTestimonials.filter((t) => t !== featured).slice(0, 3);
  const copy = TESTIMONIALS_COPY[locale];
  const isAr = locale === "ar";

  return (
    <section
      id="home-testimonials"
      dir={isAr ? "rtl" : "ltr"}
      aria-labelledby="testimonials-heading"
      className="scene-testimonials relative overflow-hidden"
      data-testimonials-section=""
    >
      {/* Top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 28%), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 pb-20 sm:px-6 md:py-24 md:pb-28 lg:px-8">
        {/* ── Section header ── */}
        <div
          className="text-center space-y-4 mb-14 testimonials-hidden"
          data-testimonials-header=""
        >
          <span className="scene-header-arch" aria-hidden="true" />
          <span
            className="inline-block text-[0.62rem] font-bold tracking-[0.28em] uppercase"
            style={{ color: "oklch(0.58 0.09 78)" }}
          >
            {copy.eyebrow}
          </span>

          <h2
            id="testimonials-heading"
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
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.50 0.01 58)" }}
          >
            {copy.body}
          </p>
        </div>

        {/* ── Featured DM card ── */}
        {featured && (
          <div
            className="mb-8 max-w-3xl mx-auto testimonials-hidden"
            data-testimonials-featured=""
          >
            <FeaturedDmCard t={featured} locale={locale} />
          </div>
        )}

        {/* ── Three smaller cards ── */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {cards.map((t) => (
              <div key={t.id} className="testimonials-hidden" data-testimonials-card="">
                <SmallDmCard t={t} locale={locale} />
              </div>
            ))}
          </div>
        )}

        {/* ── Demo content disclaimer strip ── */}
        <p
          className="text-center text-[0.58rem] tracking-wide"
          style={{ color: "oklch(0.70 0.03 70)" }}
        >
          {copy.disclaimer}
        </p>
      </div>

      {/* Bottom border */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 18%), transparent)" }}
        aria-hidden="true"
      />

      <HomeTestimonialsBridge />
    </section>
  );
}
