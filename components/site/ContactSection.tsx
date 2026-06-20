import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getSiteConfig, getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export default function ContactSection({
  locale,
  variant = "teaser",
}: {
  locale: Locale;
  variant?: "teaser" | "full";
}) {
  const config = getSiteConfig();
  const content = getContent(locale);
  const teaser = content.home.contactTeaser;
  const labels = content.contact.labels;

  if (variant === "teaser") {
    return (
      <Section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.99 0.006 84) 0%, oklch(0.97 0.012 82) 100%)",
        }}
      >
        {/* Subtle decorative orb */}
        <div
          className="brand-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 aspect-square opacity-[0.06] pointer-events-none"
          style={{ background: "oklch(0.76 0.10 82)" }}
          aria-hidden="true"
        />

        <Container className="relative z-10 max-w-4xl text-center space-y-10">
          {/* Eyebrow */}
          <span
            className="inline-block text-[0.65rem] font-bold tracking-[0.25em] uppercase animate-reveal-up"
            style={{ color: "oklch(0.76 0.10 82)", animationDelay: "0ms" }}
          >
            {locale === "ar" ? "تواصل معنا" : "Get In Touch"}
          </span>

          <div className="space-y-4">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-secondary tracking-tight animate-reveal-up"
              style={{
                fontFamily: "var(--font-display-ar), var(--font-display), serif",
                animationDelay: "80ms",
              }}
            >
              {teaser.heading}
            </h2>

            {/* Gold divider */}
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
                className="block h-px w-12 rounded-full"
                style={{
                  background: "linear-gradient(to left, transparent, oklch(0.76 0.10 82 / 55%))",
                }}
              />
            </div>

            <p
              className="text-base text-brand-muted-fg max-w-xl mx-auto leading-loose animate-reveal-up"
              style={{ animationDelay: "200ms" }}
            >
              {teaser.body}
            </p>
          </div>

          {/* Contact pills */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 stagger">
            <a
              href={`tel:${config.phone}`}
              className="group inline-flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--brand-shadow-warm)] animate-reveal-up"
              style={{
                background: "oklch(1 0 0 / 80%)",
                border: "1px solid oklch(0.76 0.10 82 / 20%)",
                backdropFilter: "blur(12px)",
                animationDelay: "280ms",
              }}
            >
              <div
                className="flex items-center justify-center size-9 rounded-full text-brand-primary transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, oklch(0.76 0.10 82 / 16%) 0%, oklch(0.76 0.10 82 / 7%) 100%)",
                }}
              >
                <Icon name="Phone" className="size-4" />
              </div>
              <span className="font-semibold text-sm text-brand-fg group-hover:text-brand-primary transition-colors duration-300" dir="ltr">
                {config.phone}
              </span>
            </a>

            <a
              href={`https://wa.me/${config.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--brand-shadow-warm)] animate-reveal-up"
              style={{
                background: "oklch(1 0 0 / 80%)",
                border: "1px solid oklch(0.76 0.10 82 / 20%)",
                backdropFilter: "blur(12px)",
                animationDelay: "360ms",
              }}
            >
              <div
                className="flex items-center justify-center size-9 rounded-full text-brand-primary transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, oklch(0.76 0.10 82 / 16%) 0%, oklch(0.76 0.10 82 / 7%) 100%)",
                }}
              >
                <Icon name="MessageCircle" className="size-4" />
              </div>
              <span className="font-semibold text-sm text-brand-fg group-hover:text-brand-primary transition-colors duration-300" dir="ltr">
                +{config.whatsappNumber}
              </span>
            </a>

            <a
              href={config.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--brand-shadow-warm)] animate-reveal-up"
              style={{
                background: "oklch(1 0 0 / 80%)",
                border: "1px solid oklch(0.76 0.10 82 / 20%)",
                backdropFilter: "blur(12px)",
                animationDelay: "440ms",
              }}
            >
              <div
                className="flex items-center justify-center size-9 rounded-full text-brand-primary transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, oklch(0.76 0.10 82 / 16%) 0%, oklch(0.76 0.10 82 / 7%) 100%)",
                }}
              >
                <Icon name="MapPin" className="size-4" />
              </div>
              <span className="font-semibold text-sm text-brand-fg group-hover:text-brand-primary transition-colors duration-300">
                {content.contact.address}
              </span>
            </a>
          </div>

          <div className="pt-4 flex justify-center animate-reveal-up" style={{ animationDelay: "520ms" }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group rounded-full px-9 border-brand-border text-brand-fg hover:bg-brand-muted hover:border-brand-primary/35 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/contact">
                {teaser.cta}
                <span className="inline-block ms-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  // Full variant
  return (
    <Section className="py-12 md:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact detail cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.phone && (
                <Card className="p-6 flex flex-col items-start gap-4 hover:border-brand-primary/40 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-400">
                  <div
                    className="flex items-center justify-center size-11 rounded-full text-brand-primary ring-1 ring-brand-primary/12"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.76 0.10 82 / 14%) 0%, oklch(0.76 0.10 82 / 6%) 100%)",
                    }}
                  >
                    <Icon name="Phone" className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-fg mb-1.5 text-sm">
                      {labels.phone}
                    </h3>
                    <a
                      href={`tel:${config.phone}`}
                      className="text-brand-muted-fg hover:text-brand-primary transition-colors text-sm"
                      dir="ltr"
                    >
                      {config.phone}
                    </a>
                  </div>
                </Card>
              )}

              {config.whatsappNumber && (
                <Card className="p-6 flex flex-col items-start gap-4 hover:border-brand-primary/40 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-400">
                  <div
                    className="flex items-center justify-center size-11 rounded-full text-brand-primary ring-1 ring-brand-primary/12"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.76 0.10 82 / 14%) 0%, oklch(0.76 0.10 82 / 6%) 100%)",
                    }}
                  >
                    <Icon name="MessageCircle" className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-fg mb-1.5 text-sm">
                      {labels.whatsapp}
                    </h3>
                    <a
                      href={`https://wa.me/${config.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-muted-fg hover:text-brand-primary transition-colors text-sm"
                      dir="ltr"
                    >
                      +{config.whatsappNumber}
                    </a>
                  </div>
                </Card>
              )}

              {config.email && (
                <Card className="p-6 flex flex-col items-start gap-4 hover:border-brand-primary/40 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-400 sm:col-span-2">
                  <div
                    className="flex items-center justify-center size-11 rounded-full text-brand-primary ring-1 ring-brand-primary/12"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.76 0.10 82 / 14%) 0%, oklch(0.76 0.10 82 / 6%) 100%)",
                    }}
                  >
                    <Icon name="Mail" className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-fg mb-1.5 text-sm">
                      {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                    </h3>
                    <a
                      href={`mailto:${config.email}`}
                      className="text-brand-muted-fg hover:text-brand-primary transition-colors text-sm"
                    >
                      {config.email}
                    </a>
                  </div>
                </Card>
              )}
            </div>

            {/* Address + hours card */}
            <Card className="p-8 hover:border-brand-primary/40 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-400">
              <div className="flex items-start gap-5">
                <div
                  className="flex items-center justify-center size-11 rounded-full text-brand-primary ring-1 ring-brand-primary/12 shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.76 0.10 82 / 14%) 0%, oklch(0.76 0.10 82 / 6%) 100%)",
                  }}
                >
                  <Icon name="MapPin" className="size-5" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-brand-fg mb-1 text-sm">
                      {labels.address}
                    </h3>
                    <p className="text-brand-muted-fg text-sm leading-relaxed">
                      {content.contact.address}
                    </p>
                  </div>
                  {content.contact.hours && (
                    <div>
                      <h3 className="font-semibold text-brand-fg mb-1 text-sm">
                        {labels.hours}
                      </h3>
                      <p className="text-brand-muted-fg text-sm">
                        {content.contact.hours}
                      </p>
                    </div>
                  )}
                  {config.mapUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-1"
                    >
                      <a
                        href={config.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {labels.directions}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Social links */}
            {(config.social.instagram || config.social.facebook) && (
              <div className="pt-2">
                <h3 className="font-semibold text-brand-fg mb-4 text-sm">
                  {locale === "ar" ? "تابعونا" : "Follow Us"}
                </h3>
                <div className="flex gap-3">
                  {config.social.instagram && (
                    <a
                      href={config.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-brand-border bg-brand-bg text-brand-fg hover:text-brand-primary hover:border-brand-primary/45 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-300"
                    >
                      <Icon name="Instagram" className="size-4" />
                      Instagram
                    </a>
                  )}
                  {config.social.facebook && (
                    <a
                      href={config.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-brand-border bg-brand-bg text-brand-fg hover:text-brand-primary hover:border-brand-primary/45 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-300"
                    >
                      <Icon name="Facebook" className="size-4" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Map / location placeholder */}
          <div className="flex flex-col gap-5 h-full">
            <div
              className="w-full flex-grow min-h-[320px] rounded-[var(--brand-radius)] border border-brand-border flex flex-col items-center justify-center text-brand-muted-fg p-10 text-center relative overflow-hidden group hover:border-brand-primary/35 hover:shadow-[var(--brand-shadow-warm)] transition-all duration-400"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.97 0.018 82) 0%, oklch(0.95 0.025 80) 100%)",
              }}
            >
              {/* Dot grid */}
              <div
                className="absolute inset-0 opacity-[0.055]"
                style={{
                  backgroundImage:
                    "radial-gradient(oklch(0.32 0.02 58) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Ambient glow */}
              <div
                className="brand-orb absolute inset-0 m-auto size-24 opacity-35 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: "oklch(0.76 0.10 82)" }}
                aria-hidden="true"
              />

              <Icon
                name="MapPin"
                className="size-12 mb-4 text-brand-primary/35 group-hover:text-brand-primary/55 transition-colors duration-500 relative z-10"
              />
              <p className="max-w-xs text-sm leading-relaxed relative z-10">
                {content.contact.address}
              </p>

              {config.mapUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-6 relative z-10"
                >
                  <a
                    href={config.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {labels.directions}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
