import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import BookingCalendar from "@/components/site/BookingCalendar";
import BookingHeroTimeWeather from "@/components/site/BookingHeroTimeWeather";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.booking;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/booking" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/booking",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function BookingPage() {
  const locale = await getLocale();
  const content = getContent(locale);
  const b = content.booking;

  const copy = {
    title: b.title,
    chooseDate: b.chooseDate,
    chooseTime: b.chooseTime,
    selectDateFirst: b.selectDateFirst,
    continue: b.continue,
    disclaimer: b.disclaimer,
    slotsHeading: b.slotsHeading,
  };

  return (
    // Single flex column so the ONE ambient widget instance can be re-ordered
    // responsively (after the date controls on mobile, beside the copy on desktop).
    <div className="relative flex w-full flex-col bg-brand-bg">
      {/* Hero band — copy is the focus. On desktop the widget is absolutely
          placed into the side; on mobile/tablet it drops below the calendar. */}
      <section className="relative overflow-hidden border-b border-brand-border bg-brand-muted/30 pt-16 pb-10 md:pt-24 md:pb-12">
        {/* Soft champagne atmosphere */}
        <span
          aria-hidden="true"
          className="brand-orb pointer-events-none absolute -top-1/4 end-0 aspect-square w-1/2 opacity-[0.06] md:w-2/5"
          style={{ background: "oklch(0.80 0.10 82)" }}
        />

        <Container className="relative">
          {/* Reserve side space on desktop for the absolutely-placed widget. */}
          <div className="space-y-4 text-center lg:max-w-[58%] lg:text-start">
            <h1
              className="text-4xl font-bold text-brand-secondary md:text-5xl"
              style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
            >
              {b.heroTitle}
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-brand-muted-fg md:text-lg lg:mx-0">
              {b.heroSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Calendar + slots — kept near the top so dates are visible quickly */}
      <section className="order-2 py-8 md:py-12">
        <BookingCalendar locale={locale} copy={copy} />
      </section>

      {/* Ambient time/weather dashboard — ONE instance.
          Mobile/tablet: flows here (order-3, after the date controls).
          Desktop (lg): absolutely positioned into the hero's end side. */}
      <section className="order-3 pb-12 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:order-none lg:pb-0 lg:pt-24">
        <Container className="lg:flex lg:justify-end">
          <div className="relative flex justify-center lg:pointer-events-auto lg:justify-end">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 m-auto aspect-square w-3/4 rounded-full opacity-40 blur-3xl"
              style={{ background: "oklch(0.80 0.10 82 / 0.35)" }}
            />
            <div className="relative w-full max-w-[15rem] scale-[0.94] opacity-95 sm:max-w-[16rem] lg:max-w-[17rem] lg:scale-100 xl:max-w-[18rem]">
              <BookingHeroTimeWeather locale={locale} labels={b.widget} />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
