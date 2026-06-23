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
    <div className="flex w-full flex-col bg-brand-bg">
      {/* Hero band */}
      <section className="border-b border-brand-border bg-brand-muted/30 pt-20 pb-12 text-center md:pt-28 md:pb-16">
        <Container className="max-w-3xl space-y-7">
          <div className="space-y-4">
            <h1
              className="text-4xl font-bold text-brand-secondary md:text-5xl"
              style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
            >
              {b.title}
            </h1>
            <p className="text-lg text-brand-muted-fg">{b.chooseDate}</p>
          </div>

          <BookingHeroTimeWeather locale={locale} labels={b.widget} />
        </Container>
      </section>

      {/* Calendar + slots */}
      <section className="py-12 md:py-16">
        <BookingCalendar locale={locale} copy={copy} />
      </section>
    </div>
  );
}
