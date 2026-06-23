import Link from "next/link";
import type { ReactNode } from "react";
import {
  Home,
  Image as ImageIcon,
  ListChecks,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { getLocale } from "@/lib/i18n";
import { getSiteConfig, getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";

type PublicNavLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

function PublicNavGlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <filter
        id="public-nav-glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.018"
          numOctaves="1"
          seed="19"
          result="turbulence"
        />
        <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="18"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

function NavGlassShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem] border border-white/55 bg-white/58 shadow-[0_10px_34px_rgba(62,52,37,0.10),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-saturate-150",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 rounded-[inherit] backdrop-blur-[18px]"
        style={{ filter: "url(#public-nav-glass-distortion)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.54),rgba(255,255,255,0.20)_48%,rgba(255,244,220,0.36))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.92),transparent)]"
      />
      {children}
    </div>
  );
}

export default async function PublicHeader() {
  const locale = await getLocale();
  const config = getSiteConfig();
  const content = getContent(locale);

  const navLinks: PublicNavLink[] = [
    { href: "/", label: content.nav.home, Icon: Home },
    { href: "/services", label: content.nav.services, Icon: ListChecks },
    { href: "/gallery", label: content.nav.gallery, Icon: ImageIcon },
    { href: "/contact", label: content.nav.contact, Icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-4">
      <PublicNavGlassFilter />

      <Container className="px-0">
        <NavGlassShell className="mx-auto flex min-h-16 items-center justify-between gap-3 px-3 py-2 md:px-4">
          <Link
            href="/"
            className="group flex min-w-0 items-center rounded-full px-3 py-2 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
            aria-label={config.logo.alt[locale]}
          >
            <span
              className="block max-w-[9rem] truncate text-[0.95rem] font-bold tracking-wide text-brand-secondary transition-colors duration-300 group-hover:text-brand-primary sm:max-w-[11rem] sm:text-[1.05rem]"
              style={{
                fontFamily: "var(--font-display-ar), var(--font-display), serif",
              }}
            >
              {config.logo.alt[locale]}
            </span>
          </Link>

          <nav
            className="hidden items-center justify-center gap-1 rounded-full lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group/navitem flex h-12 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-brand-muted-fg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/45 hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg lg:px-3.5"
              >
                <span className="flex size-8 items-center justify-center rounded-full border border-white/55 bg-brand-bg/58 text-brand-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-300 group-hover/navitem:scale-110 group-hover/navitem:bg-brand-primary group-hover/navitem:text-brand-secondary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="hidden lg:inline">{label}</span>
                <span className="sr-only lg:hidden">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <LanguageToggle currentLocale={locale} />
          </div>
        </NavGlassShell>
      </Container>
    </header>
  );
}
