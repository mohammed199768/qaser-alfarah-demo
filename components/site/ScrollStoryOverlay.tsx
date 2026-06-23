"use client";

import { ScrollFrameSequence } from "@/components/site/ScrollFrameSequence";

/* ───────────────────────────────────────────────────────────────────────────
 * ScrollStoryOverlay
 *
 * Client host for the scroll-story page: wraps <ScrollFrameSequence/> and
 * cross-fades three editorial phases of copy based on scroll progress. The
 * page (server component) resolves the locale-aware copy and hands it down so
 * this stays presentational + reactive.
 * ─────────────────────────────────────────────────────────────────────────── */

export type StoryPhase = {
  title: string;
  subtitle: string;
};

type ScrollStoryOverlayProps = {
  phases: [StoryPhase, StoryPhase, StoryPhase];
  scrollHint: string;
  manifestUrl?: string;
  heightVh?: number;
};

/**
 * Opacity for a phase given overall progress. Each phase owns a third of the
 * scroll, with short cross-fades at the boundaries so only one phase is fully
 * legible at a time and transitions feel smooth rather than abrupt.
 */
function phaseOpacity(progress: number, index: number): number {
  // Phase centres at ~1/6, 1/2, 5/6. Full opacity within ±band of the centre,
  // fading to 0 at ±(band + fade).
  const centre = (index + 0.5) / 3;
  const band = 0.11; // fully visible half-width
  const fade = 0.07; // cross-fade half-width
  const distance = Math.abs(progress - centre);
  if (distance <= band) return 1;
  if (distance >= band + fade) return 0;
  return 1 - (distance - band) / fade;
}

export function ScrollStoryOverlay({
  phases,
  scrollHint,
  manifestUrl = "/generated/hero-sequence/manifest.json",
  heightVh = 300,
}: ScrollStoryOverlayProps) {
  return (
    <ScrollFrameSequence
      manifestUrl={manifestUrl}
      heightVh={heightVh}
      ariaLabel={phases[0].title}
    >
      {({ progress }) => (
        <div
          className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center"
          style={{ pointerEvents: "none" }}
        >
          {/* Stacked phases — absolutely positioned so they cross-fade in place. */}
          <div className="relative w-full max-w-3xl">
            {phases.map((phase, index) => {
              const opacity = phaseOpacity(progress, index);
              return (
                <div
                  key={phase.title}
                  aria-hidden={opacity < 0.5}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                  style={{
                    opacity,
                    transform: `translateY(${(1 - opacity) * 14}px)`,
                    transition: "opacity 120ms linear, transform 120ms linear",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-12"
                    style={{ background: "oklch(0.82 0.10 82 / 0.8)" }}
                  />
                  <h2
                    className="text-balance text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                    style={{
                      fontFamily:
                        "var(--font-display-ar), var(--font-display), serif",
                      color: "oklch(0.97 0.02 84)",
                      textShadow: "0 2px 30px oklch(0.10 0.02 60 / 0.6)",
                    }}
                  >
                    {phase.title}
                  </h2>
                  <p
                    className="max-w-xl text-pretty text-base font-light leading-relaxed sm:text-lg md:text-xl"
                    style={{
                      color: "oklch(0.90 0.02 84 / 0.92)",
                      textShadow: "0 1px 18px oklch(0.10 0.02 60 / 0.55)",
                    }}
                  >
                    {phase.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Scroll hint — fades out once the journey has begun. */}
          <div
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
            style={{
              opacity: progress < 0.04 ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
          >
            <span
              className="text-[0.6rem] font-semibold uppercase tracking-[0.3em]"
              style={{ color: "oklch(0.85 0.08 82 / 0.85)" }}
            >
              {scrollHint}
            </span>
            <span
              aria-hidden="true"
              className="h-8 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.82 0.10 82 / 0.7), transparent)",
              }}
            />
          </div>
        </div>
      )}
    </ScrollFrameSequence>
  );
}

export default ScrollStoryOverlay;
