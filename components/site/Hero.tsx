import Link from "next/link";
import { BookOpen, CalendarCheck } from "lucide-react";
import { getSiteConfig, getContent } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import HeroBubbleField from "@/components/site/HeroBubbleField";

export default function Hero({ locale }: { locale: Locale }) {
  const config = getSiteConfig();
  const content = getContent(locale);
  const heroContent = content.home.hero;

  return (
    <section className="hero-editorial" aria-labelledby="home-hero-title">
      <HeroBubbleField />

      <Container className="hero-editorial-shell">
        <div className="hero-editorial-copy">
          <p className="hero-editorial-eyebrow">
            <span aria-hidden="true" />
            {config.logo.alt[locale]}
            <span aria-hidden="true" />
          </p>

          <h1 id="home-hero-title" className="hero-editorial-title">
            {locale === "ar" ? "\u0642\u0635\u0631 \u0627\u0644\u0641\u0631\u062d" : "Qasr Al-Farah"}
          </h1>

          <p className="hero-editorial-heading">{heroContent.title}</p>
          <p className="hero-editorial-subtitle">{heroContent.subtitle}</p>

          <div className="hero-editorial-actions">
            <Link href="/booking" className="hero-editorial-primary">
              <CalendarCheck aria-hidden="true" className="size-4" />
              <span>{heroContent.ctaBook}</span>
            </Link>
            <Link href="/gallery" className="hero-editorial-secondary">
              <BookOpen aria-hidden="true" className="size-4" />
              <span>{heroContent.ctaGallery}</span>
            </Link>
          </div>
        </div>

      </Container>
    </section>
  );
}
