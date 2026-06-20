import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import Hero from "@/components/site/Hero";
import HomeStoriesSection from "@/components/site/HomeStoriesSection";
import HomeCatalogFlipbook from "@/components/site/HomeCatalogFlipbook";
import HomeTestimonialsSection from "@/components/site/HomeTestimonialsSection";
import CtaBand from "@/components/site/CtaBand";
import HomeJourneyBridge from "@/components/site/HomeJourneyBridge";

/**
 * Champagne journey connector between homepage scenes: a gold path line
 * that draws downward into a diamond node and a direction chevron, over a
 * warm wash. The line/node are scrubbed by HomeJourneyBridge on desktop and
 * render fully visible without JS / with reduced motion.
 */
function JourneyGap() {
  return (
    <div aria-hidden="true" className="journey-gap" data-journey-gap="">
      <div className="journey-wash" />
      <span className="journey-line" data-journey-line="" />
      <span className="journey-node" data-journey-node="" />
      <span className="journey-chevron" />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.home;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div
      className="relative isolate flex w-full flex-col overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse 74% 48% at 50% -10%, oklch(0.92 0.046 80 / 0.42) 0%, transparent 68%), radial-gradient(ellipse 52% 42% at 100% 88%, oklch(0.95 0.024 22 / 0.24) 0%, transparent 72%), oklch(0.99 0.006 84)",
      }}
    >
      <Hero locale={locale} />
      <HomeStoriesSection locale={locale} />
      <JourneyGap />
      <HomeCatalogFlipbook locale={locale} />
      <JourneyGap />
      <HomeTestimonialsSection locale={locale} />
      <JourneyGap />
      <CtaBand
        locale={locale}
        secondaryCta={{
          label: locale === "ar" ? "تواصل معنا" : "Contact us",
          href: "/contact",
        }}
      />
      <HomeJourneyBridge />
    </div>
  );
}
