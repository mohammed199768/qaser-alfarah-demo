import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { getContent, getSiteConfig } from "@/content/site";
import { booklets } from "@/content/site/booklets";
import { Container } from "@/components/ui/Container";
import WhatAwaitsYou from "@/components/site/WhatAwaitsYou";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const w = content.whatAwaits;

  return {
    title: w.title,
    description: w.subtitle,
    alternates: { canonical: "/what-awaits-you" },
    openGraph: {
      title: w.title,
      description: w.subtitle,
      url: "/what-awaits-you",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: w.title,
      description: w.subtitle,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function WhatAwaitsYouPage() {
  const locale = await getLocale();
  const content = getContent(locale);
  const config = getSiteConfig();
  const w = content.whatAwaits;

  return (
    <div className="flex w-full flex-col bg-brand-bg">
      {/* Hero band */}
      <section className="relative overflow-hidden border-b border-brand-border bg-brand-muted/30 pt-20 pb-12 text-center md:pt-28 md:pb-16">
        <span
          aria-hidden="true"
          className="brand-orb pointer-events-none absolute -top-1/4 end-1/4 aspect-square w-1/2 opacity-[0.06] md:w-2/5"
          style={{ background: "oklch(0.80 0.10 82)" }}
        />
        <Container className="relative max-w-3xl space-y-4">
          <h1
            className="text-4xl font-bold text-brand-secondary md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
          >
            {w.title}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-brand-muted-fg md:text-lg">
            {w.subtitle}
          </p>
        </Container>
      </section>

      {/* Booklet cards */}
      <section className="py-12 md:py-16">
        <WhatAwaitsYou
          locale={locale}
          booklets={booklets}
          whatsappNumber={config.whatsappNumber}
        />
      </section>
    </div>
  );
}
