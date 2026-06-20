import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getServices, getContent } from "@/content/site";
import type { ServiceItem } from "@/types/site-content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import ServiceCard from "./ServiceCard";
import { Button } from "@/components/ui/Button";

interface ServicesGridProps {
  locale: Locale;
  variant?: "home" | "all";
  services?: ServiceItem[];
}

export default function ServicesGrid({ locale, variant = "home", services }: ServicesGridProps) {
  const content = getContent(locale);

  const displayServices = services || (
    variant === "home"
      ? getServices().filter(s => s.featured).slice(0, 3)
      : getServices()
  );

  return (
    <Section className={variant === "home" ? "bg-brand-bg relative overflow-hidden" : "bg-transparent py-0 md:py-0"}>
      {/* Background decorative blob */}
      {variant === "home" && (
        <div
          className="brand-orb absolute -end-1/4 top-1/4 w-1/2 aspect-square opacity-[0.06] pointer-events-none"
          style={{ background: "oklch(0.76 0.10 82)" }}
          aria-hidden="true"
        />
      )}

      <Container>
        {variant === "home" && (
          <div className="text-center mb-16 space-y-5">
            {/* Eyebrow label */}
            <span
              className="inline-block text-[0.65rem] font-bold tracking-[0.25em] uppercase animate-reveal-up"
              style={{ color: "oklch(0.76 0.10 82)", animationDelay: "0ms" }}
            >
              {locale === "ar" ? "ما نقدمه لك" : "What We Offer"}
            </span>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-secondary tracking-tight animate-reveal-up"
              style={{
                fontFamily: "var(--font-display-ar), var(--font-display), serif",
                animationDelay: "80ms",
              }}
            >
              {content.home.servicesSection.heading}
            </h2>

            {/* Animated gold divider */}
            <div
              className="flex items-center justify-center gap-2 animate-reveal-up"
              style={{ animationDelay: "160ms" }}
              aria-hidden="true"
            >
              <span
                className="block h-px w-12 rounded-full"
                style={{
                  background: "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 55%))",
                }}
              />
              <span
                className="block size-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.76 0.10 82 / 65%)" }}
              />
              <span
                className="block size-1 rounded-full opacity-40"
                style={{ background: "oklch(0.76 0.10 82)" }}
              />
              <span
                className="block size-1.5 rounded-full animate-pulse"
                style={{
                  background: "oklch(0.76 0.10 82 / 65%)",
                  animationDelay: "0.4s",
                }}
              />
              <span
                className="block h-px w-12 rounded-full"
                style={{
                  background: "linear-gradient(to left, transparent, oklch(0.76 0.10 82 / 55%))",
                }}
              />
            </div>

            <p
              className="text-brand-muted-fg text-base md:text-lg max-w-xl mx-auto leading-relaxed animate-reveal-up"
              style={{ animationDelay: "240ms" }}
            >
              {content.home.servicesSection.subheading}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {displayServices.map((service, i) => (
            <div key={service.id} className="animate-reveal-up" style={{ animationDelay: `${i * 80}ms` }}>
              <ServiceCard item={service} locale={locale} />
            </div>
          ))}
        </div>

        {variant === "home" && (
          <div className="mt-14 flex justify-center animate-reveal-up" style={{ animationDelay: "400ms" }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group rounded-full px-9 border-brand-border text-brand-fg hover:bg-brand-muted hover:border-brand-primary/35 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/services">
                <span>{content.home.servicesSection.viewAll}</span>
                <span
                  className="inline-block ms-2 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
