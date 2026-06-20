import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { getSiteConfig, getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export default async function PublicFooter() {
  const locale = await getLocale();
  const config = getSiteConfig();
  const content = getContent(locale);

  return (
    <footer
      className="relative overflow-hidden border-t border-brand-border"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.26 0.015 58) 0%, oklch(0.20 0.012 58) 100%)",
      }}
    >
      {/* Gold top accent line */}
      <div
        className="h-[1.5px] w-full"
        style={{
          background:
            "linear-gradient(to right, transparent 5%, oklch(0.76 0.10 82 / 55%) 50%, transparent 95%)",
        }}
        aria-hidden="true"
      />

      {/* Background orbs */}
      <div
        className="brand-orb absolute -top-1/2 -start-1/4 w-2/3 aspect-square opacity-[0.07] pointer-events-none"
        style={{ background: "oklch(0.76 0.10 82)" }}
        aria-hidden="true"
      />
      <div
        className="brand-orb absolute -bottom-1/3 -end-1/5 w-1/2 aspect-square opacity-[0.05] pointer-events-none"
        style={{ background: "oklch(0.88 0.04 18)" }}
        aria-hidden="true"
      />

      <Container className="relative z-10 py-16 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          {/* Brand column */}
          <div className="md:col-span-2 space-y-6 text-start">
            {/* Brand name with gold shimmer on hover */}
            <div className="space-y-1">
              <h3
                className="text-2xl font-bold tracking-wide"
                style={{
                  fontFamily: "var(--font-display-ar), var(--font-display), serif",
                  color: "oklch(0.92 0.06 82)",
                }}
              >
                {config.logo.alt[locale]}
              </h3>
              {/* Micro gold underline */}
              <div
                className="h-0.5 w-10 rounded-full"
                style={{ background: "oklch(0.76 0.10 82 / 60%)" }}
                aria-hidden="true"
              />
            </div>

            <p
              className="max-w-xs leading-relaxed"
              style={{ color: "oklch(0.60 0.01 58)" }}
            >
              {content.footer.blurb}
            </p>

            {/* Social links */}
            {(config.social.instagram || config.social.facebook) && (
              <div className="flex items-center gap-3 pt-1">
                {config.social.instagram && (
                  <a
                    href={config.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group flex items-center justify-center size-10 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_oklch(0.76_0.10_82_/_25%)]"
                    style={{
                      background: "oklch(1 0 0 / 8%)",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      color: "oklch(0.62 0.01 58)",
                    }}
                  >
                    <Icon
                      name="Instagram"
                      className="size-4 group-hover:text-[oklch(0.82_0.09_82)] transition-colors duration-300"
                      style={{ color: "inherit" }}
                    />
                  </a>
                )}
                {config.social.facebook && (
                  <a
                    href={config.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="group flex items-center justify-center size-10 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_oklch(0.76_0.10_82_/_25%)]"
                    style={{
                      background: "oklch(1 0 0 / 8%)",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      color: "oklch(0.62 0.01 58)",
                    }}
                  >
                    <Icon
                      name="Facebook"
                      className="size-4 group-hover:text-[oklch(0.82_0.09_82)] transition-colors duration-300"
                      style={{ color: "inherit" }}
                    />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="space-y-6 text-start">
            <h4
              className="text-sm font-bold tracking-wider uppercase"
              style={{ color: "oklch(0.76 0.10 82)" }}
            >
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            {/* Gold micro rule */}
            <div
              className="h-px w-6 rounded-full"
              style={{ background: "oklch(0.76 0.10 82 / 40%)" }}
              aria-hidden="true"
            />
            <nav
              className="flex flex-col gap-3"
              aria-label="Footer navigation"
            >
              {[
                { href: "/", label: content.nav.home },
                { href: "/services", label: content.nav.services },
                { href: "/gallery", label: content.nav.gallery },
                { href: "/contact", label: content.nav.contact },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-2 transition-colors duration-300"
                  style={{ color: "oklch(0.56 0.01 58)" }}
                >
                  <span
                    className="inline-block h-px w-3 rounded-full transition-all duration-300 group-hover:w-5"
                    style={{ background: "oklch(0.76 0.10 82 / 50%)" }}
                    aria-hidden="true"
                  />
                  <span className="group-hover:text-[oklch(0.82_0.08_82)] transition-colors duration-300">
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="space-y-6 text-start">
            <h4
              className="text-sm font-bold tracking-wider uppercase"
              style={{ color: "oklch(0.76 0.10 82)" }}
            >
              {content.contact.heading}
            </h4>
            {/* Gold micro rule */}
            <div
              className="h-px w-6 rounded-full"
              style={{ background: "oklch(0.76 0.10 82 / 40%)" }}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${config.phone}`}
                className="group flex items-center gap-3 transition-colors duration-300"
                style={{ color: "oklch(0.56 0.01 58)" }}
              >
                <Icon
                  name="Phone"
                  className="size-4 shrink-0 group-hover:text-[oklch(0.82_0.08_82)] transition-colors duration-300"
                  style={{ color: "oklch(0.76 0.10 82 / 60%)" }}
                />
                <span
                  dir="ltr"
                  className="group-hover:text-[oklch(0.82_0.08_82)] transition-colors duration-300"
                >
                  {config.phone}
                </span>
              </a>
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 transition-colors duration-300"
                style={{ color: "oklch(0.56 0.01 58)" }}
              >
                <Icon
                  name="MessageCircle"
                  className="size-4 shrink-0"
                  style={{ color: "oklch(0.76 0.10 82 / 60%)" }}
                />
                <span
                  dir="ltr"
                  className="group-hover:text-[oklch(0.82_0.08_82)] transition-colors duration-300"
                >
                  +{config.whatsappNumber}
                </span>
              </a>
              <a
                href={config.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 transition-colors duration-300"
                style={{ color: "oklch(0.56 0.01 58)" }}
              >
                <Icon
                  name="MapPin"
                  className="size-4 shrink-0"
                  style={{ color: "oklch(0.76 0.10 82 / 60%)" }}
                />
                <span className="group-hover:text-[oklch(0.82_0.08_82)] transition-colors duration-300">
                  {content.contact.address}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          className="mt-14 pt-7 flex flex-col md:flex-row justify-between items-center gap-3 text-xs"
          style={{
            borderTop: "1px solid oklch(1 0 0 / 8%)",
            color: "oklch(0.44 0.01 58)",
          }}
        >
          <p>
            © {new Date().getFullYear()} {config.logo.alt[locale]}.{" "}
            {content.footer.rightsLine}.
          </p>
          {config.features.showPoweredBy && content.footer.poweredBy && (
            <p style={{ color: "oklch(0.38 0.01 58)" }}>
              {content.footer.poweredBy}
            </p>
          )}
        </div>
      </Container>
    </footer>
  );
}
