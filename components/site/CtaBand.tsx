import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CtaBandProps {
  locale: Locale;
  title?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function CtaBand({
  locale,
  title,
  primaryCta,
  secondaryCta,
}: CtaBandProps) {
  const content = getContent(locale);
  const defaultCta = content.home.finalCta;

  const heading = title || defaultCta.heading;
  const pCta = primaryCta || { label: defaultCta.cta, href: "/contact" };

  return (
    <div
      className="relative overflow-hidden text-brand-bg py-24 md:py-36 noise-overlay"
      style={{ background: "var(--cta-gradient)" }}
    >
      {/* ── Background depth layers ── */}

      {/* Large gold orb — top start */}
      <div
        className="brand-orb absolute -top-1/3 -start-1/4 w-3/4 aspect-square animate-float opacity-30"
        style={{
          background: "radial-gradient(circle, oklch(0.88 0.08 82) 0%, transparent 60%)",
          animationDuration: "11s",
        }}
        aria-hidden="true"
      />
      {/* Blush orb — bottom end */}
      <div
        className="brand-orb absolute -bottom-1/3 -end-1/5 w-1/2 aspect-square animate-float opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.85 0.05 68) 0%, transparent 65%)",
          animationDuration: "14s",
          animationDelay: "4s",
        }}
        aria-hidden="true"
      />
      {/* Centre warm glow */}
      <div
        className="brand-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 aspect-square opacity-15"
        style={{ background: "oklch(0.95 0.06 82)" }}
        aria-hidden="true"
      />

      {/* Orbiting decorative rings */}
      <div
        className="orbit-ring animate-spin-slow absolute w-[700px] h-[700px] opacity-[0.07]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderColor: "oklch(1 0 0 / 25%)",
        }}
        aria-hidden="true"
      />
      <div
        className="orbit-ring absolute w-[1100px] h-[1100px] opacity-[0.04]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "spin-slow 35s linear infinite reverse",
          borderColor: "oklch(1 0 0 / 15%)",
        }}
        aria-hidden="true"
      />

      {/* Floating petal sparkles */}
      {[
        { top: "12%", left: "8%", size: 5, delay: "0s", dur: "8s" },
        { top: "72%", left: "5%", size: 3, delay: "2s", dur: "10s" },
        { top: "20%", right: "7%", size: 4, delay: "1.2s", dur: "9s" },
        { top: "65%", right: "10%", size: 6, delay: "3s", dur: "11s" },
        { top: "45%", left: "20%", size: 3, delay: "0.8s", dur: "12s" },
        { top: "35%", right: "22%", size: 4, delay: "4s", dur: "7s" },
        { top: "85%", left: "40%", size: 3, delay: "1.5s", dur: "9.5s" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute animate-petal pointer-events-none z-[1]"
          style={{
            top: p.top,
            left: "left" in p ? (p as { left: string }).left : undefined,
            right: "right" in p ? (p as { right: string }).right : undefined,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "oklch(1 0 0 / 60%)",
            boxShadow: `0 0 ${p.size * 3}px oklch(1 0 0 / 50%)`,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── Content ── */}
      <Container className="relative z-10 space-y-12 text-center">
        {/* Decorative top rule */}
        <div
          className="flex items-center justify-center gap-3 animate-reveal-up"
          style={{ animationDelay: "0ms" }}
          aria-hidden="true"
        >
          <span
            className="block h-px w-16 rounded-full"
            style={{ background: "oklch(1 0 0 / 35%)" }}
          />
          <span
            className="block size-2 rounded-full animate-pulse"
            style={{ background: "oklch(1 0 0 / 55%)" }}
          />
          <span
            className="block size-1 rounded-full"
            style={{ background: "oklch(1 0 0 / 35%)" }}
          />
          <span
            className="block size-2 rounded-full animate-pulse"
            style={{ background: "oklch(1 0 0 / 55%)", animationDelay: "0.5s" }}
          />
          <span
            className="block h-px w-16 rounded-full"
            style={{ background: "oklch(1 0 0 / 35%)" }}
          />
        </div>

        <h2
          className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold max-w-2xl mx-auto leading-[1.18] tracking-tight animate-reveal-up"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.98 0.010 84)",
            animationDelay: "100ms",
          }}
        >
          {heading}
        </h2>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal-up"
          style={{ animationDelay: "220ms" }}
        >
          {/* Primary CTA — white fill */}
          <Link
            href={pCta.href}
            className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full px-10 text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 w-full sm:w-auto justify-center"
            style={{
              background: "oklch(0.98 0.006 84)",
              color: "oklch(0.28 0.02 58)",
              boxShadow:
                "0 0 0 1px oklch(1 0 0 / 20%), 0 8px 30px oklch(0 0 0 / 20%)",
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, oklch(0.76 0.10 82 / 18%) 50%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <span className="relative">{pCta.label}</span>
          </Link>

          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="group inline-flex h-14 items-center gap-2 rounded-full px-10 text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              style={{
                background: "oklch(1 0 0 / 10%)",
                border: "1px solid oklch(1 0 0 / 30%)",
                color: "oklch(0.95 0.01 84)",
                backdropFilter: "blur(12px)",
              }}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>

        {/* Bottom decorative tagline */}
        <p
          className="text-[0.7rem] tracking-[0.2em] uppercase animate-reveal-up"
          style={{ color: "oklch(1 0 0 / 45%)", animationDelay: "340ms" }}
        >
          {locale === "ar" ? "قصر الفرح · اجعل يومك استثنائياً" : "Qasr Al-Farah · Make Your Day Exceptional"}
        </p>
      </Container>
    </div>
  );
}
