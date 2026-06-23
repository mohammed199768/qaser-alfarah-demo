"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ───────────────────────────────────────────────────────────────────────────
 * KeyframedScrollStory
 *
 * A premium, three-section wedding-venue experience built on the generated WebP
 * frame sequence — NOT a continuous scroll scrub. The frame sequence is a
 * FIXED, full-viewport canvas background; the page scrolls through three real
 * full-screen website panels. Each panel has designed content on BOTH sides
 * (left message + CTA, right details/chips/items), a section index label, and
 * corner accents, leaving the centre clear so the cinematic subject shows.
 *
 * Motion model:
 *   - Each section targets one sequence frame (for the fast transition) AND a
 *     dedicated SHARP resting still (hero-keyframes/<id>.webp).
 *   - Entering a section tweens the canvas from the current frame to the
 *     section's target frame over ~600ms (easeOutCubic, requestAnimationFrame).
 *   - When the tween settles, the canvas swaps to the section's sharp still so
 *     the resting state is crisp — never a soft transitional frame.
 *   - Scrolling back up tweens backward to the previous section, then settles
 *     on that section's sharp still.
 *
 * Robustness:
 *   - Only keyframes + resting stills load up front; in-between frames load the
 *     moment a transition starts. nearestLoadedFrame avoids blank flashes.
 *   - Canvas is cover-fitted (subjects are centre-frame, so nothing important
 *     is cropped), DPR capped, ResizeObserver + resize repaint, all rAF /
 *     observers / listeners cleaned up.
 *   - prefers-reduced-motion snaps straight to resting stills.
 * ─────────────────────────────────────────────────────────────────────────── */

type FrameManifest = {
  frameCount: number;
  width: number;
  height: number;
  fps?: number;
  filenamePattern?: string;
};

export type StoryItem = string;

export type StorySection = {
  /** Stable id used for the section element + IntersectionObserver. */
  id: string;
  /** 1-based target frame on disk (1 … frameCount) used during transitions. */
  targetFrame: number;
  /** URL of the sharp resting still shown when the transition settles. */
  keyframeUrl: string;
  /** Small uppercase label above the title (e.g. "Wedding Story"). */
  eyebrow: string;
  title: string;
  body: string;
  /** Primary call-to-action label on the left card. */
  cta: string;
  /** Right card heading. */
  rightTitle: string;
  /** Right card body line (optional — used for the metric-style card). */
  rightBody?: string;
  /** Right card bullet items (optional). */
  rightItems?: StoryItem[];
  /** Right card chips (optional — small pill labels). */
  rightChips?: string[];
};

type KeyframedScrollStoryProps = {
  /** URL of the manifest JSON. Frame files are resolved relative to it. */
  manifestUrl: string;
  /** Exactly the three content sections, in document order. */
  sections: StorySection[];
  /** Small scroll hint shown only in section 1. */
  scrollHint: string;
  /** Reading direction for layout mirroring. Default "rtl". */
  dir?: "rtl" | "ltr";
  /** Cap on devicePixelRatio used for the canvas backing store. Default 2. */
  maxDpr?: number;
  /** Transition duration in ms (500–700 recommended). Default 600. */
  transitionMs?: number;
  /** Accessible label for the canvas. */
  ariaLabel?: string;
};

const DEFAULT_TRANSITION_MS = 600;

/* ── Warm luxury colour system ───────────────────────────────────────────── */
const C = {
  ink: "#090604",
  ivory: "#F7E8C8",
  gold: "#C9A45D",
  goldBorder: "rgba(201,164,93,0.28)", // lighter than before so cards read softer
  glass: "rgba(18,12,8,0.42)", // more transparent: the scene shows through
  text: "rgba(255,248,232,0.92)",
  muted: "rgba(255,248,232,0.68)",
} as const;

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/** easeOutCubic — fast start, gentle settle; reads as cinematic. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Resolve a frame's URL from the manifest URL + 1-based filename pattern. */
function buildFrameUrl(manifestUrl: string, frame1Based: number, pattern: string): string {
  const directory = manifestUrl.slice(0, manifestUrl.lastIndexOf("/") + 1);
  const match = /%0?(\d*)d/.exec(pattern);
  const padWidth = match && match[1] ? Number(match[1]) : 4;
  const numbered = String(frame1Based).padStart(padWidth, "0");
  const filename = pattern.replace(/%0?\d*d/, numbered);
  return `${directory}${filename}`;
}

export function KeyframedScrollStory({
  manifestUrl,
  sections,
  scrollHint,
  dir = "rtl",
  maxDpr = 2,
  transitionMs = DEFAULT_TRANSITION_MS,
  ariaLabel = "Cinematic scroll story",
}: KeyframedScrollStoryProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  // Image caches. Sequence frames keyed by 1-based frame number; resting stills
  // keyed by section index. Both persist across renders.
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const requestedRef = useRef<Set<number>>(new Set());
  const stillsRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const stillRequestedRef = useRef<Set<number>>(new Set());
  const manifestRef = useRef<FrameManifest | null>(null);
  const patternRef = useRef<string>("frame_%04d.webp");

  // The exact (fractional) frame currently shown, the last integer frame
  // actually painted, and whether we're currently resting on a still.
  const currentFrameRef = useRef<number>(sections[0]?.targetFrame ?? 1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const restingStillRef = useRef<number>(-1); // section index of the painted still, or -1
  const animRafRef = useRef<number | null>(null);
  const transitionMsRef = useRef<number>(transitionMs);
  const settleSectionRef = useRef<number>(0); // section to settle onto when the tween ends

  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [error, setError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  // Debug HUD — OFF by default; only shown when the URL contains ?debug=1.
  // Read once in a lazy initialiser (the value is fixed for the page's life).
  const [debugEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return new URLSearchParams(window.location.search).get("debug") === "1";
    } catch {
      return false;
    }
  });
  const [debugFrame, setDebugFrame] = useState(sections[0]?.targetFrame ?? 1);
  const [debugResting, setDebugResting] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [hudOpen, setHudOpen] = useState(true);

  useEffect(() => {
    transitionMsRef.current = transitionMs;
  }, [transitionMs]);

  // ── Loading: sequence frames ─────────────────────────────────────────────
  const requestFrame = useCallback(
    (frame1Based: number, onReady?: () => void) => {
      const m = manifestRef.current;
      if (!m || frame1Based < 1 || frame1Based > m.frameCount) return;
      if (requestedRef.current.has(frame1Based)) {
        if (onReady && framesRef.current.has(frame1Based)) onReady();
        return;
      }
      requestedRef.current.add(frame1Based);
      const img = new Image();
      img.decoding = "async";
      img.src = buildFrameUrl(manifestUrl, frame1Based, patternRef.current);
      img.onload = () => {
        framesRef.current.set(frame1Based, img);
        setLoadedCount(framesRef.current.size + stillsRef.current.size);
        onReady?.();
      };
      img.onerror = () => {
        requestedRef.current.delete(frame1Based);
      };
    },
    [manifestUrl],
  );

  // ── Loading: sharp resting stills ────────────────────────────────────────
  const requestStill = useCallback(
    (sectionIndex: number, onReady?: () => void) => {
      const section = sections[sectionIndex];
      if (!section) return;
      if (stillRequestedRef.current.has(sectionIndex)) {
        if (onReady && stillsRef.current.has(sectionIndex)) onReady();
        return;
      }
      stillRequestedRef.current.add(sectionIndex);
      const img = new Image();
      img.decoding = "async";
      img.src = section.keyframeUrl;
      img.onload = () => {
        stillsRef.current.set(sectionIndex, img);
        setLoadedCount(framesRef.current.size + stillsRef.current.size);
        onReady?.();
      };
      img.onerror = () => {
        stillRequestedRef.current.delete(sectionIndex);
      };
    },
    [sections],
  );

  const preloadRange = useCallback(
    (a: number, b: number) => {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let f = lo; f <= hi; f += 1) requestFrame(f);
    },
    [requestFrame],
  );

  const nearestLoadedFrame = useCallback((target: number): HTMLImageElement | null => {
    const cache = framesRef.current;
    const direct = cache.get(target);
    if (direct) return direct;
    const max = manifestRef.current?.frameCount ?? 0;
    for (let radius = 1; radius <= max; radius += 1) {
      const lower = cache.get(target - radius);
      if (lower) return lower;
      const upper = cache.get(target + radius);
      if (upper) return upper;
    }
    return null;
  }, []);

  // ── Canvas sizing + drawing ──────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const nextW = Math.round(rect.width * dpr);
    const nextH = Math.round(rect.height * dpr);
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
      return true;
    }
    return false;
  }, [maxDpr]);

  /** Paint any image with object-fit: cover geometry (subject stays centred). */
  const drawImageCover = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  /** Paint a 1-based sequence frame (used during transitions). */
  const drawFrame = useCallback(
    (frame1Based: number) => {
      const img = nearestLoadedFrame(frame1Based);
      if (!img) return;
      drawImageCover(img);
      lastDrawnFrameRef.current = frame1Based;
      restingStillRef.current = -1;
      setDebugFrame(frame1Based);
      setDebugResting(false);
    },
    [nearestLoadedFrame, drawImageCover],
  );

  /** Paint a section's sharp resting still; falls back to the sequence frame. */
  // Holds the latest drawStill so the deferred onReady callback can re-invoke
  // it without referencing the binding before it's declared.
  const drawStillRef = useRef<(sectionIndex: number) => boolean>(() => false);
  const drawStill = useCallback(
    (sectionIndex: number): boolean => {
      const still = stillsRef.current.get(sectionIndex);
      const section = sections[sectionIndex];
      if (still) {
        drawImageCover(still);
        restingStillRef.current = sectionIndex;
        lastDrawnFrameRef.current = section?.targetFrame ?? lastDrawnFrameRef.current;
        setDebugResting(true);
        if (section) setDebugFrame(section.targetFrame);
        return true;
      }
      // Still not loaded yet — keep the (already-drawn) sequence frame, and load
      // the still so a later paint can settle on it.
      requestStill(sectionIndex, () => {
        // Only settle if we're still meant to be resting on this section.
        if (settleSectionRef.current === sectionIndex && animRafRef.current === null) {
          drawStillRef.current(sectionIndex);
        }
      });
      return false;
    },
    [sections, drawImageCover, requestStill],
  );
  useEffect(() => {
    drawStillRef.current = drawStill;
  }, [drawStill]);

  // ── Frame tweening ────────────────────────────────────────────────────────
  const animateToSection = useCallback(
    (sectionIndex: number) => {
      const m = manifestRef.current;
      const section = sections[sectionIndex];
      if (!m || !section) return;
      const target = clamp(section.targetFrame, 1, m.frameCount);
      settleSectionRef.current = sectionIndex;

      if (animRafRef.current !== null) {
        window.cancelAnimationFrame(animRafRef.current);
        animRafRef.current = null;
      }

      const startFrame = currentFrameRef.current;
      preloadRange(startFrame, target);
      requestStill(sectionIndex);

      // Reduced motion / zero duration / already there → snap to the still.
      if (reducedMotion || transitionMsRef.current <= 0 || startFrame === target) {
        currentFrameRef.current = target;
        if (!drawStill(sectionIndex)) drawFrame(target);
        return;
      }

      const startTime =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const duration = transitionMsRef.current;

      const step = (now: number) => {
        const t = clamp((now - startTime) / duration, 0, 1);
        const eased = easeOutCubic(t);
        const exact = startFrame + (target - startFrame) * eased;
        currentFrameRef.current = exact;

        const rounded = clamp(Math.round(exact), 1, m.frameCount);
        if (rounded !== lastDrawnFrameRef.current || restingStillRef.current !== -1) {
          drawFrame(rounded);
        }

        if (t < 1) {
          animRafRef.current = window.requestAnimationFrame(step);
        } else {
          animRafRef.current = null;
          currentFrameRef.current = target;
          // Settle on the sharp still (or the crisp target frame if not loaded).
          if (!drawStill(sectionIndex)) drawFrame(target);
        }
      };

      animRafRef.current = window.requestAnimationFrame(step);
    },
    [sections, preloadRange, requestStill, reducedMotion, drawStill, drawFrame],
  );

  // ── Load the manifest ─────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    fetch(manifestUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
        return response.json() as Promise<FrameManifest>;
      })
      .then((data) => {
        manifestRef.current = data;
        if (data.filenamePattern) patternRef.current = data.filenamePattern;
        setManifest(data);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(true);
      });
    return () => controller.abort();
  }, [manifestUrl]);

  // ── Track later prefers-reduced-motion changes ────────────────────────────
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // ── Preload keyframes + stills; settle section 1's still immediately ──────
  useEffect(() => {
    if (!manifest) return;
    const firstFrame = sections[0]?.targetFrame ?? 1;
    currentFrameRef.current = firstFrame;
    settleSectionRef.current = 0;

    // All target frames + all resting stills up front (small + high value).
    sections.forEach((s, i) => {
      requestFrame(s.targetFrame);
      requestStill(i);
    });

    const paintFirst = () => {
      resizeCanvas();
      if (!drawStill(0)) drawFrame(firstFrame);
    };
    // Whichever lands first (still preferred) triggers the first paint; the
    // other simply repaints in place.
    requestStill(0, paintFirst);
    requestFrame(firstFrame, paintFirst);
  }, [manifest, sections, requestFrame, requestStill, resizeCanvas, drawStill, drawFrame]);

  // ── Canvas resize handling ────────────────────────────────────────────────
  useEffect(() => {
    if (!manifest) return;

    const repaint = () => {
      resizeCanvas();
      const resting = restingStillRef.current;
      if (resting !== -1 && stillsRef.current.has(resting)) {
        const still = stillsRef.current.get(resting);
        if (still) drawImageCover(still);
      } else {
        const frame = clamp(Math.round(currentFrameRef.current), 1, manifest.frameCount);
        lastDrawnFrameRef.current = -1;
        drawFrame(frame);
      }
    };

    repaint();
    const resizeObserver = new ResizeObserver(repaint);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    window.addEventListener("resize", repaint);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", repaint);
    };
  }, [manifest, resizeCanvas, drawFrame, drawImageCover]);

  // ── Section detection (IntersectionObserver) ──────────────────────────────
  useEffect(() => {
    if (!manifest) return;
    const els = sectionRefs.current.filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const ratios = new Map<Element, number>();
    let frameSchedule: number | null = null;

    const recompute = () => {
      frameSchedule = null;
      let bestIndex = -1;
      let bestRatio = 0.45; // activation threshold
      els.forEach((el, index) => {
        const ratio = ratios.get(el) ?? 0;
        if (ratio >= bestRatio) {
          bestRatio = ratio;
          bestIndex = index;
        }
      });
      if (bestIndex === -1) return;
      setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        if (frameSchedule === null) {
          frameSchedule = window.requestAnimationFrame(recompute);
        }
      },
      { threshold: [0, 0.25, 0.45, 0.5, 0.75, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (frameSchedule !== null) window.cancelAnimationFrame(frameSchedule);
    };
  }, [manifest]);

  // ── Drive the tween whenever the active section changes ───────────────────
  useEffect(() => {
    if (!manifest) return;
    animateToSection(activeIndex);
  }, [activeIndex, manifest, animateToSection]);

  // ── Cancel any in-flight tween on unmount ─────────────────────────────────
  useEffect(() => {
    return () => {
      if (animRafRef.current !== null) {
        window.cancelAnimationFrame(animRafRef.current);
        animRafRef.current = null;
      }
    };
  }, []);

  const frameCount = manifest?.frameCount ?? 0;
  // HUD never shows by default — only with ?debug=1 in the URL.
  const showDebug = debugEnabled;
  const totalAssets = frameCount + sections.length;
  const rtl = dir === "rtl";
  const start = rtl ? "right" : "left";
  const end = rtl ? "left" : "right";

  return (
    <div style={{ position: "relative", width: "100%", background: C.ink }}>
      {/* ── Fixed full-viewport canvas background ──────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100svh",
          zIndex: 0,
          background: C.ink,
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label={ariaLabel}
          role="img"
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Warm readability overlay: darker top/bottom + slight side vignette,
            kept light in the centre so the cinematic subject stays visible. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(120% 80% at 50% 45%, rgba(9,6,4,0) 38%, rgba(9,6,4,0.45) 100%), linear-gradient(180deg, rgba(9,6,4,0.55) 0%, rgba(9,6,4,0.12) 26%, rgba(9,6,4,0.12) 60%, rgba(9,6,4,0.78) 100%)",
          }}
        />

        {/* No loading text is ever shown over the cinematic frame: the canvas
            simply rests on the warm ink background until the first still paints
            (a fraction of a second). Only a genuine load failure surfaces a
            quiet, subtle message — never centred shouting text. */}
        {error && (
          <div role="alert" style={{ ...centeredMsg("rgba(255,248,232,0.5)"), pointerEvents: "none" }}>
            <span style={{ fontSize: "0.82rem", textAlign: "center", padding: "0 1.5rem" }}>
              {dir === "rtl" ? "تعذّر تحميل المشهد." : "The scene could not be loaded."}
            </span>
          </div>
        )}
      </div>

      {/* ── Scrollable content layer ───────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {sections.map((section, index) => {
          const active = index === activeIndex;
          const indexLabel = `${String(index + 1).padStart(2, "0")} / ${String(
            sections.length,
          ).padStart(2, "0")}`;
          return (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              aria-label={section.title}
              dir={dir}
              style={{
                position: "relative",
                minHeight: "100svh",
                display: "flex",
                alignItems: "center",
                padding: "clamp(4.5rem, 9vh, 7rem) clamp(1.1rem, 5vw, 4rem)",
              }}
            >
              {/* Section index label — pinned to the start-top corner. */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "clamp(1.5rem, 5vh, 3rem)",
                  [start]: "clamp(1.1rem, 5vw, 4rem)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  opacity: active ? 0.9 : 0.4,
                  transition: "opacity 500ms ease",
                }}
              >
                <span style={{ height: 1, width: "2.2rem", background: C.gold, opacity: 0.7 }} />
                <span
                  dir="ltr"
                  style={{
                    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
                    fontSize: "0.72rem",
                    letterSpacing: "0.32em",
                    color: C.ivory,
                    // Force "01 / 03" order regardless of page direction.
                    unicodeBidi: "isolate",
                  }}
                >
                  {indexLabel}
                </span>
              </div>

              {/* Content grid: [left card] · [clear centre] · [right card]. */}
              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr)",
                  gap: "clamp(1rem, 3vh, 2rem)",
                  alignItems: "stretch",
                }}
                className="kss-grid"
              >
                {/* LEFT: message + CTA */}
                <article
                  className="kss-card kss-card-left"
                  style={{
                    ...glassCard,
                    alignSelf: "center",
                    opacity: active ? 1 : 0,
                    transform: active
                      ? "translateY(0)"
                      : `translateY(22px)`,
                    transition:
                      "opacity 620ms cubic-bezier(0.22,1,0.36,1), transform 620ms cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: active ? "60ms" : "0ms",
                  }}
                >
                  <CornerAccents />
                  <span style={eyebrowStyle(rtl)}>{section.eyebrow}</span>
                  <h2 style={titleStyle}>{section.title}</h2>
                  <p style={bodyStyle}>{section.body}</p>
                  <button type="button" style={ctaStyle} className="kss-cta">
                    <span>{section.cta}</span>
                    <span aria-hidden="true" style={{ display: "inline-flex" }}>
                      {dir === "rtl" ? "←" : "→"}
                    </span>
                  </button>
                </article>

                {/* RIGHT: supporting details / items / chips */}
                <aside
                  className="kss-card kss-card-right"
                  style={{
                    ...glassCard,
                    alignSelf: "center",
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(22px)",
                    transition:
                      "opacity 620ms cubic-bezier(0.22,1,0.36,1), transform 620ms cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: active ? "160ms" : "0ms",
                  }}
                >
                  <CornerAccents />
                  <h3 style={rightTitleStyle(rtl)}>{section.rightTitle}</h3>
                  {section.rightBody && <p style={rightBodyStyle}>{section.rightBody}</p>}
                  {section.rightItems && section.rightItems.length > 0 && (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.7rem" }}>
                      {section.rightItems.map((item) => (
                        <li key={item} style={itemRow}>
                          <span aria-hidden="true" style={itemDot} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.rightChips && section.rightChips.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.2rem" }}>
                      {section.rightChips.map((chip) => (
                        <span key={chip} style={chipStyle(rtl)}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </aside>
              </div>

              {/* Scroll hint — section 1 only. */}
              {index === 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "clamp(1.4rem, 4vh, 2.4rem)",
                    [end]: "clamp(1.1rem, 5vw, 4rem)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.55rem",
                    opacity: activeIndex === 0 ? 1 : 0,
                    transition: "opacity 320ms ease",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: rtl
                        ? "var(--font-body-ar), var(--font-geist-sans), system-ui"
                        : "var(--font-geist-sans), ui-sans-serif, system-ui",
                      fontSize: rtl ? "0.72rem" : "0.6rem",
                      fontWeight: 600,
                      textTransform: rtl ? "none" : "uppercase",
                      letterSpacing: rtl ? "0" : "0.3em",
                      color: "rgba(201,164,93,0.9)",
                    }}
                  >
                    {scrollHint}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      height: "2rem",
                      width: 1,
                      background: "linear-gradient(to bottom, rgba(201,164,93,0.8), transparent)",
                    }}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Dev-only toggleable HUD ────────────────────────────────────────── */}
      {showDebug && (
        <div style={{ position: "fixed", bottom: "0.75rem", left: "0.75rem", zIndex: 9 }}>
          {hudOpen ? (
            <div style={hudPanel}>
              <button type="button" onClick={() => setHudOpen(false)} style={hudClose} aria-label="Hide debug HUD">
                ×
              </button>
              active section {activeIndex + 1}/{sections.length} ({sections[activeIndex]?.id})
              <br />
              current frame {debugFrame}/{frameCount || "…"}
              <br />
              selected keyframe {sections[activeIndex]?.targetFrame} → {sections[activeIndex]?.id}.webp
              <br />
              loaded {loadedCount}/{totalAssets || "…"}
              <br />
              fit cover · resting {debugResting ? "yes" : "no"}
              {reducedMotion ? " · reduced-motion" : ""}
            </div>
          ) : (
            <button type="button" onClick={() => setHudOpen(true)} style={hudToggle}>
              debug
            </button>
          )}
        </div>
      )}

      {/* Responsive layout: stack cards on mobile, split on desktop. The wide
          centre column keeps the cinematic subject (book / cake / rings) clear,
          and the side cards hug the edges so they read as supporting panels. */}
      <style>{`
        @media (min-width: 860px) {
          .kss-grid {
            grid-template-columns: minmax(0, 0.78fr) minmax(34%, 1.7fr) minmax(0, 0.78fr) !important;
            gap: clamp(1rem, 3vw, 2.25rem) !important;
            align-items: center !important;
          }
          .kss-card-left { grid-column: 1; justify-self: start; }
          .kss-card-right { grid-column: 3; justify-self: end; }
        }
        @media (max-width: 859px) {
          .kss-grid { max-width: 26rem; margin-inline: auto; }
          /* On mobile, the cards sit in the lower third so the subject reads. */
          .kss-grid { align-content: end; }
        }
        .kss-cta:hover { background: rgba(201,164,93,0.16) !important; border-color: rgba(201,164,93,0.55) !important; }
        .kss-cta:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 3px; }
      `}</style>
    </div>
  );
}

/* ── Decorative corner accents for the glass cards ───────────────────────── */
function CornerAccents() {
  const len = "14px";
  const common: React.CSSProperties = {
    position: "absolute",
    width: len,
    height: len,
    borderColor: "rgba(201,164,93,0.55)",
    pointerEvents: "none",
  };
  return (
    <>
      <span aria-hidden="true" style={{ ...common, top: 8, left: 8, borderTop: "1px solid", borderLeft: "1px solid" }} />
      <span aria-hidden="true" style={{ ...common, top: 8, right: 8, borderTop: "1px solid", borderRight: "1px solid" }} />
      <span aria-hidden="true" style={{ ...common, bottom: 8, left: 8, borderBottom: "1px solid", borderLeft: "1px solid" }} />
      <span aria-hidden="true" style={{ ...common, bottom: 8, right: 8, borderBottom: "1px solid", borderRight: "1px solid" }} />
    </>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const glassCard: React.CSSProperties = {
  position: "relative",
  background: C.glass,
  border: `1px solid ${C.goldBorder}`,
  borderRadius: 14,
  // Reduced vertical padding so the card is more compact.
  padding: "clamp(1rem, 1.7vw, 1.45rem) clamp(1.1rem, 1.9vw, 1.6rem)",
  display: "flex",
  flexDirection: "column",
  gap: "0.7rem",
  // Lighter blur keeps the scene from going muddy behind the card.
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  boxShadow: "0 16px 48px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,248,232,0.05)",
  // ~17% narrower than before (26rem → 21.5rem) so it dominates less.
  maxWidth: "21.5rem",
};

// Eyebrow / small-caps label. Arabic is cursive, so we DON'T letter-space it
// (that breaks letter joining) and use the Arabic display font.
function eyebrowStyle(rtl: boolean): React.CSSProperties {
  return {
    fontFamily: rtl
      ? "var(--font-display-ar), var(--font-body-ar), system-ui"
      : "var(--font-geist-sans), ui-sans-serif, system-ui",
    fontSize: rtl ? "0.82rem" : "0.66rem",
    fontWeight: 600,
    textTransform: rtl ? "none" : "uppercase",
    letterSpacing: rtl ? "0" : "0.28em",
    color: C.gold,
  };
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-display-ar), var(--font-display), serif",
  fontWeight: 500,
  lineHeight: 1.15,
  fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
  color: C.ivory,
  textShadow: "0 2px 24px rgba(9,6,4,0.55)",
};

const bodyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-body-ar), var(--font-geist-sans), system-ui",
  fontWeight: 300,
  lineHeight: 1.7,
  fontSize: "clamp(0.92rem, 1.2vw, 1.05rem)",
  color: C.text,
};

const ctaStyle: React.CSSProperties = {
  marginTop: "0.35rem",
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.7rem 1.3rem",
  borderRadius: 999,
  border: `1px solid ${C.goldBorder}`,
  background: "rgba(201,164,93,0.10)",
  color: C.ivory,
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
  fontSize: "0.82rem",
  fontWeight: 500,
  letterSpacing: "0.04em",
  cursor: "pointer",
  transition: "background 240ms ease, border-color 240ms ease",
};

function rightTitleStyle(rtl: boolean): React.CSSProperties {
  return {
    margin: 0,
    fontFamily: rtl
      ? "var(--font-display-ar), var(--font-body-ar), system-ui"
      : "var(--font-geist-sans), ui-sans-serif, system-ui",
    fontSize: rtl ? "0.95rem" : "0.78rem",
    fontWeight: 600,
    textTransform: rtl ? "none" : "uppercase",
    letterSpacing: rtl ? "0" : "0.18em",
    color: C.gold,
  };
}

const rightBodyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-body-ar), var(--font-geist-sans), system-ui",
  fontWeight: 300,
  lineHeight: 1.6,
  fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
  color: C.text,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.65rem",
  fontFamily: "var(--font-body-ar), var(--font-geist-sans), system-ui",
  fontSize: "0.92rem",
  color: C.text,
};

const itemDot: React.CSSProperties = {
  flex: "0 0 auto",
  width: 6,
  height: 6,
  borderRadius: 999,
  background: C.gold,
  boxShadow: "0 0 0 3px rgba(201,164,93,0.18)",
};

function chipStyle(rtl: boolean): React.CSSProperties {
  return {
    fontFamily: rtl
      ? "var(--font-body-ar), var(--font-geist-sans), system-ui"
      : "var(--font-geist-sans), ui-sans-serif, system-ui",
    fontSize: rtl ? "0.82rem" : "0.74rem",
    letterSpacing: rtl ? "0" : "0.04em",
    color: C.ivory,
    padding: "0.36rem 0.78rem",
    borderRadius: 999,
    border: `1px solid ${C.goldBorder}`,
    background: "rgba(247,232,200,0.05)",
  };
}

function centeredMsg(color: string): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color,
  };
}

const hudPanel: React.CSSProperties = {
  position: "relative",
  padding: "0.6rem 1.4rem 0.6rem 0.7rem",
  borderRadius: 10,
  background: "rgba(9,6,4,0.82)",
  border: "1px solid rgba(201,164,93,0.3)",
  color: "rgba(255,248,232,0.92)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.7rem",
  lineHeight: 1.55,
  pointerEvents: "auto",
};

const hudClose: React.CSSProperties = {
  position: "absolute",
  top: 2,
  right: 4,
  background: "transparent",
  border: "none",
  color: "rgba(255,248,232,0.7)",
  fontSize: "0.9rem",
  cursor: "pointer",
  lineHeight: 1,
};

const hudToggle: React.CSSProperties = {
  padding: "0.35rem 0.7rem",
  borderRadius: 8,
  background: "rgba(9,6,4,0.82)",
  border: "1px solid rgba(201,164,93,0.3)",
  color: "rgba(255,248,232,0.8)",
  fontFamily: "ui-monospace, Menlo, monospace",
  fontSize: "0.68rem",
  cursor: "pointer",
};

export default KeyframedScrollStory;
