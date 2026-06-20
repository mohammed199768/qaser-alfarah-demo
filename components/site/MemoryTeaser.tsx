import type { Locale } from "@/lib/i18n";
import { getSiteConfig, getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MemoryBookShowcase } from "@/components/site/MemoryBookShowcase";

export default function MemoryTeaser({ locale }: { locale: Locale }) {
  const config = getSiteConfig();
  if (!config.features.showMemoryBookTeaser) return null;

  const content = getContent(locale);
  const teaser = content.home.memoryTeaser;

  return (
    <Section className="bg-brand-bg">
      <Container className="max-w-5xl">
        <MemoryBookShowcase
          heading={teaser.heading}
          body={teaser.body}
          ctaLabel={teaser.cta}
          ctaHref="/services"
          // No real asset yet — placeholder renders automatically
        />
      </Container>
    </Section>
  );
}
