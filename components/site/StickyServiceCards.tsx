import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { ServiceItem } from "@/types/site-content";

interface StickyServiceCardsProps {
  services: ServiceItem[];
  locale: Locale;
}

export function StickyServiceCards({ services, locale }: StickyServiceCardsProps) {
  return (
    <section
      aria-label={locale === "ar" ? "خدماتنا" : "Our Services"}
      className="relative py-6 md:py-10"
    >
      {services.map((service, index) => (
        <article
          key={service.id}
          className={[
            // Card base
            "mb-5 overflow-hidden",
            "rounded-[2rem]",
            "border border-brand-border/60",
            "bg-brand-bg",
            "shadow-[var(--brand-shadow-soft)]",
            // Desktop: sticky with progressive offset
            "md:sticky",
            // Transition
            "transition-all duration-400",
            "hover:shadow-[var(--brand-shadow-warm)]",
            "hover:border-brand-primary/30",
          ].join(" ")}
          style={{
            top: `calc(5.5rem + ${index * 1.1}rem)`,
            zIndex: index + 1,
          }}
        >
          <div className="grid gap-0 md:grid-cols-2 md:items-stretch min-h-[340px]">
            {/* ── Text column ── */}
            <div className="flex flex-col gap-5 px-8 py-10 md:px-12 md:py-12 justify-center">
              {/* Counter badge */}
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center justify-center size-8 rounded-full text-xs font-bold"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.76 0.10 82 / 16%) 0%, oklch(0.76 0.10 82 / 7%) 100%)",
                    border: "1px solid oklch(0.76 0.10 82 / 22%)",
                    color: "oklch(0.60 0.09 82)",
                  }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div
                  className="h-px flex-1 max-w-[3rem] rounded-full"
                  style={{ background: "oklch(0.76 0.10 82 / 30%)" }}
                  aria-hidden="true"
                />
              </div>

              {/* Heading */}
              <h3
                className="text-2xl md:text-3xl font-bold text-brand-secondary leading-snug"
                style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
              >
                {service.name[locale]}
              </h3>

              {/* Description */}
              <p className="text-base leading-[1.8] text-brand-muted-fg max-w-sm">
                {service.description[locale]}
              </p>

              {/* Price hint */}
              {service.priceHint && (
                <span
                  className="inline-flex self-start items-center text-xs font-bold tracking-wide px-3.5 py-1.5 rounded-full"
                  style={{
                    background: "oklch(0.76 0.10 82 / 10%)",
                    border: "1px solid oklch(0.76 0.10 82 / 20%)",
                    color: "oklch(0.60 0.09 82)",
                  }}
                >
                  {service.priceHint[locale]}
                </span>
              )}

              {/* CTA */}
              {service.cta && (
                <Link
                  href={service.cta.href}
                  className="group inline-flex self-start items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.80 0.11 82) 0%, oklch(0.70 0.12 76) 100%)",
                    color: "oklch(0.16 0.01 58)",
                    boxShadow: "0 0 0 1px oklch(0.76 0.10 82 / 28%), 0 6px 20px oklch(0.76 0.10 82 / 20%)",
                  }}
                >
                  {service.cta.label[locale]}
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              )}
            </div>

            {/* ── Visual column ── */}
            <div
              className="relative min-h-[240px] md:min-h-0 overflow-hidden md:rounded-e-[2rem]"
              style={{ borderInlineStart: "1px solid oklch(0.76 0.10 82 / 10%)" }}
            >
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name[locale]}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                /* Branded placeholder */
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  style={{
                    background:
                      "linear-gradient(145deg, oklch(0.97 0.022 84) 0%, oklch(0.93 0.032 80) 100%)",
                  }}
                >
                  {/* Dot grid */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "radial-gradient(oklch(0.32 0.02 58) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Ambient orb */}
                  <div
                    className="brand-orb absolute size-32 opacity-45 animate-pulse"
                    style={{ background: "oklch(0.76 0.10 82)" }}
                    aria-hidden="true"
                  />
                  {/* Number focal point */}
                  <span
                    className="relative text-[6rem] font-bold select-none leading-none"
                    style={{
                      color: "oklch(0.76 0.10 82 / 18%)",
                      fontFamily: "var(--font-display-ar), var(--font-display), serif",
                    }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              )}

              {/* Hover shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.76 0.10 82 / 8%) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
