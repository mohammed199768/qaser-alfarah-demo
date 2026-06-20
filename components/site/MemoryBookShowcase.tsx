import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface MemoryBookShowcaseProps {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc?: string;
}

export function MemoryBookShowcase({
  heading,
  body,
  ctaLabel,
  ctaHref,
  imageSrc,
}: MemoryBookShowcaseProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] noise-overlay"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.24 0.02 58) 0%, oklch(0.18 0.01 58) 60%, oklch(0.22 0.02 65) 100%)",
        boxShadow:
          "0 24px 80px oklch(0 0 0 / 30%), inset 0 1px 0 oklch(1 0 0 / 10%)",
      }}
    >
      {/* ── Decorative background orbs ── */}
      <div
        className="brand-orb absolute -top-1/3 -start-1/4 w-2/3 aspect-square animate-float opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.76 0.10 82) 0%, transparent 65%)",
          animationDuration: "10s",
        }}
        aria-hidden="true"
      />
      <div
        className="brand-orb absolute -bottom-1/4 -end-1/5 w-1/2 aspect-square animate-float opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.04 18) 0%, transparent 60%)",
          animationDuration: "14s",
          animationDelay: "3s",
        }}
        aria-hidden="true"
      />

      {/* Orbiting rings */}
      <div
        className="orbit-ring animate-spin-slow absolute w-64 h-64 opacity-[0.08]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderColor: "oklch(0.76 0.10 82 / 40%)",
        }}
        aria-hidden="true"
      />
      <div
        className="orbit-ring absolute w-96 h-96 opacity-[0.04]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "spin-slow 28s linear infinite reverse",
          borderColor: "oklch(0.76 0.10 82 / 25%)",
        }}
        aria-hidden="true"
      />

      {/* Floating sparkle dots */}
      {[
        { top: "15%", left: "10%", size: 4, delay: "0s" },
        { top: "70%", left: "6%", size: 3, delay: "1.5s" },
        { top: "20%", right: "12%", size: 5, delay: "0.8s" },
        { top: "65%", right: "8%", size: 3, delay: "2.5s" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute animate-twinkle pointer-events-none z-[1]"
          style={{
            top: p.top,
            left: "left" in p ? (p as { left: string }).left : undefined,
            right: "right" in p ? (p as { right: string }).right : undefined,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "oklch(0.90 0.08 82)",
            boxShadow: `0 0 ${p.size * 2}px oklch(0.76 0.10 82 / 80%)`,
            animationDelay: p.delay,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 px-8 pt-12 pb-8 md:px-14 md:pt-16 text-center">
        {/* Icon badge with pulse glow */}
        <div
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full animate-pulse-glow"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.76 0.10 82 / 25%) 0%, oklch(0.76 0.10 82 / 10%) 100%)",
            border: "1px solid oklch(0.76 0.10 82 / 35%)",
          }}
          aria-hidden="true"
        >
          <Icon name="BookHeart" className="size-8" style={{ color: "oklch(0.82 0.09 82)" }} />
        </div>

        {/* Eyebrow */}
        <span
          className="inline-block mb-4 text-[0.65rem] font-bold tracking-[0.25em] uppercase animate-reveal-up"
          style={{ color: "oklch(0.76 0.10 82)", animationDelay: "0ms" }}
        >
          Memory Book
        </span>

        <h2
          className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug mb-4 animate-reveal-up"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.97 0.010 84)",
            animationDelay: "80ms",
          }}
        >
          {heading}
        </h2>

        <p
          className="mx-auto mt-3 max-w-lg text-base leading-relaxed animate-reveal-up"
          style={{ color: "oklch(0.68 0.01 58)", animationDelay: "160ms" }}
        >
          {body}
        </p>

        <Link
          href={ctaHref}
          className="group mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 animate-reveal-up"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.80 0.11 82) 0%, oklch(0.70 0.12 76) 100%)",
            color: "oklch(0.16 0.01 58)",
            boxShadow:
              "0 0 0 1px oklch(0.76 0.10 82 / 30%), 0 8px 28px oklch(0.76 0.10 82 / 28%)",
            animationDelay: "240ms",
          }}
        >
          {ctaLabel}
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>

      {/* ── Perspective showcase card ── */}
      <div
        className="relative z-10 px-6 pb-12 md:px-14 md:pb-16"
        style={{ perspective: "1200px" }}
        aria-hidden="true"
      >
        <div
          className="group relative mx-auto max-w-3xl rounded-[1.75rem] border shadow-[0_24px_64px_oklch(0_0_0_/_40%)] transition-transform duration-500"
          style={{
            transform: "perspective(1200px) rotateX(5deg)",
            borderColor: "oklch(1 0 0 / 10%)",
            background: "oklch(0.14 0.01 58)",
          }}
        >
          {/* Gold top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-[1.5px] rounded-t-[1.75rem]"
            style={{
              background:
                "linear-gradient(to right, transparent 5%, oklch(0.76 0.10 82 / 65%) 40%, oklch(0.76 0.10 82 / 65%) 60%, transparent 95%)",
            }}
          />

          {imageSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt={heading}
              className="w-full rounded-[1.75rem] object-cover aspect-[16/9]"
              loading="lazy"
            />
          ) : (
            <div
              className="aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] relative"
              role="img"
              aria-label={heading}
              style={{ background: "oklch(0.16 0.01 58)" }}
            >
              {/* Ambient warm orb */}
              <div
                className="brand-orb absolute inset-0 m-auto size-48 opacity-20 animate-pulse"
                style={{ background: "oklch(0.76 0.10 82)" }}
              />

              {/* Simulated memory-book layout */}
              <div className="relative h-full flex items-center justify-center gap-5 p-8 md:gap-10 md:p-14">
                {/* Left page */}
                <div
                  className="hidden sm:flex flex-col flex-1 gap-3 rounded-2xl p-5 shadow-lg max-w-[15rem] animate-float"
                  style={{
                    background: "oklch(0.20 0.015 58)",
                    border: "1px solid oklch(1 0 0 / 8%)",
                    animationDuration: "7s",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="size-7 rounded-full"
                      style={{ background: "oklch(0.76 0.10 82 / 25%)" }}
                    />
                    <div
                      className="h-2 w-24 rounded-full"
                      style={{ background: "oklch(1 0 0 / 10%)" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 rounded-full" style={{ background: "oklch(1 0 0 / 9%)" }} />
                    <div className="h-1.5 w-4/5 rounded-full" style={{ background: "oklch(1 0 0 / 7%)" }} />
                    <div className="h-1.5 w-3/5 rounded-full" style={{ background: "oklch(1 0 0 / 6%)" }} />
                  </div>
                  <div
                    className="h-14 rounded-xl"
                    style={{ background: "oklch(0.76 0.10 82 / 12%)" }}
                  />
                  <div className="space-y-1">
                    <div className="h-1 rounded-full" style={{ background: "oklch(1 0 0 / 6%)" }} />
                    <div className="h-1 w-2/3 rounded-full" style={{ background: "oklch(1 0 0 / 5%)" }} />
                  </div>
                </div>

                {/* Centre — icon focal point */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div
                    className="flex size-20 md:size-24 items-center justify-center rounded-full animate-pulse-glow"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.76 0.10 82 / 30%) 0%, oklch(0.76 0.10 82 / 12%) 100%)",
                      border: "1.5px solid oklch(0.76 0.10 82 / 40%)",
                    }}
                  >
                    <Icon
                      name="BookHeart"
                      className="size-10 md:size-12"
                      style={{ color: "oklch(0.76 0.10 82 / 70%)" }}
                    />
                  </div>
                  {/* QR hint */}
                  <div className="grid grid-cols-3 gap-0.5 opacity-25">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="size-2.5 rounded-[3px]"
                        style={{
                          background: [0, 2, 6, 8].includes(i)
                            ? "oklch(0.92 0.08 82)"
                            : i === 4
                            ? "oklch(0.76 0.10 82)"
                            : "oklch(0.60 0.01 58)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Right page */}
                <div
                  className="hidden sm:flex flex-col flex-1 gap-3 rounded-2xl p-5 shadow-lg max-w-[15rem] animate-float"
                  style={{
                    background: "oklch(0.20 0.015 58)",
                    border: "1px solid oklch(1 0 0 / 8%)",
                    animationDuration: "8s",
                    animationDelay: "1s",
                  }}
                >
                  <div
                    className="h-16 rounded-xl"
                    style={{ background: "oklch(0.88 0.04 18 / 15%)" }}
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="size-7 rounded-full"
                      style={{ background: "oklch(0.88 0.04 18 / 25%)" }}
                    />
                    <div
                      className="h-2 w-20 rounded-full"
                      style={{ background: "oklch(1 0 0 / 10%)" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 rounded-full" style={{ background: "oklch(1 0 0 / 9%)" }} />
                    <div className="h-1.5 w-3/4 rounded-full" style={{ background: "oklch(1 0 0 / 7%)" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom gold accent */}
          <div
            className="absolute inset-x-0 bottom-0 h-px rounded-b-[1.75rem]"
            style={{
              background:
                "linear-gradient(to right, transparent 5%, oklch(0.76 0.10 82 / 40%) 40%, oklch(0.76 0.10 82 / 40%) 60%, transparent 95%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
