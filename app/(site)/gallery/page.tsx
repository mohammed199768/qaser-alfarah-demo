import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { getContent, getGallery, getGalleryCollections } from "@/content/site";
import { Container } from "@/components/ui/Container";
import GalleryCollections from "@/components/site/GalleryCollections";
import CtaBand from "@/components/site/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.gallery;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/gallery" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/gallery",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function GalleryPage() {
  const locale = await getLocale();
  const content = getContent(locale);
  const items = getGallery();
  const collections = getGalleryCollections();

  const labels = {
    filters: content.gallery.filters as Record<string, string>,
    photosLabel: locale === "ar" ? "صورة" : "photos",
    viewLabel: locale === "ar" ? "عرض المجموعة" : "View collection",
  };

  return (
    <div className="flex flex-col w-full bg-brand-bg min-h-screen">
      {/* Hero Band */}
      <section className="bg-brand-muted/30 pt-20 md:pt-28 pb-16 md:pb-24 text-center border-b border-brand-border">
        <Container className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-secondary" style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}>
            {content.gallery.heading}
          </h1>
          <p className="text-lg md:text-xl text-brand-muted-fg leading-relaxed">
            {content.gallery.subheading}
          </p>
        </Container>
      </section>

      {/* Interactive collection gallery */}
      <section className="py-16 md:py-24">
        <GalleryCollections
          locale={locale}
          items={items}
          collections={collections}
          labels={labels}
        />
      </section>

      {/* Final CTA */}
      <CtaBand 
        locale={locale} 
        title={locale === "ar" ? "أعجبتك الأجواء؟" : "Love what you see?"}
        primaryCta={{ label: content.nav.book, href: "/contact" }}
        secondaryCta={{ label: content.nav.contact, href: "/contact" }}
      />
    </div>
  );
}
