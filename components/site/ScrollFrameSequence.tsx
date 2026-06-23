"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ───────────────────────────────────────────────────────────────────────────
 * ScrollFrameSequence
 *
 * Renders a generated WebP frame sequence (see public/generated/<name>/) as a
 * scroll-scrubbed cinematic animation on a single <canvas>. Scroll progress
 * across the tall wrapper maps linearly to frame index; the nearest frame is
 * painted with object-fit: cover behaviour.
 *
 * Performance contract:
 *   - Only the first frame is fetched up front; nearby frames are preloaded
 *     progressively around the active frame (preloadRadius).
 *   - Scroll/resize work is coalesced through a single requestAnimationFrame.
 *   - devicePixelRatio is capped (default 2) so 4K/retina panels don't allocate
 *     enormous backing stores.
 *   - prefers-reduced-motion: a single key frame is shown and scroll scrubbing
 *     is disabled.
 *
 * The component exposes scroll progress to children via a render-prop overlay
 * so the page can fade story copy in sync without re-implementing the math.
 * ─────────────────────────────────────────────────────────────────────────── */

type FrameManifest = {
  frameCount: number;
  width: number;
  height: number;
  fps?: number;
  filenamePattern?: string;
};

type OverlayRenderProps = {
  /** Eased scroll progress across the section, 0 → 1. */
  progress: number;
  /** Active (nearest) frame index, 0 → frameCount - 1. */
  frame: number;
  /** Total frame count once the manifest has loaded (0 before). */
  frameCount: number;
};

type FitMode = "cover" | "contain";
type Easing = "linear" | "smoothstep";

type ScrollFrameSequenceProps = {
  /** URL of the manifest JSON. Frame files are resolved relative to it. */
  manifestUrl?: string;
  /** Total scroll length of the section, in viewport heights. Default 300. */
  heightVh?: number;
  /** How many frames on each side of the active frame to preload. Default 6. */
  preloadRadius?: number;
  /** Cap on devicePixelRatio used for the canvas backing store. Default 2. */
  maxDpr?: number;
  /**
   * How the frame is fitted into the canvas:
   *   "cover"   — fill the canvas, crop overflow (default).
   *   "contain" — show the whole frame, letterbox the gaps.
   */
  fitMode?: FitMode;
  /**
   * Scroll→frame mapping curve.
   *   "linear"     — frame = round(progress * (count-1)) (default; honest timing).
   *   "smoothstep" — eased in/out (only once timing is confirmed correct).
   */
  easing?: Easing;
  /** Accessible label for the canvas. */
  ariaLabel?: string;
  /** Overlay content rendered above the canvas, inside the sticky viewport. */
  children?: (props: OverlayRenderProps) => React.ReactNode;
  className?: string;
};

const DEFAULT_MANIFEST_URL = "/generated/hero-sequence/manifest.json";

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/** Smoothstep — softens the very start and end of the scrub. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Resolve a frame's URL from the manifest URL + 1-based filename pattern. */
function buildFrameUrl(manifestUrl: string, index: number, pattern: string): string {
  const directory = manifestUrl.slice(0, manifestUrl.lastIndexOf("/") + 1);
  // Pattern is printf-style, e.g. "frame_%04d.webp" (1-based on disk).
  const match = /%0?(\d*)d/.exec(pattern);
  const padWidth = match && match[1] ? Number(match[1]) : 4;
  const numbered = String(index + 1).padStart(padWidth, "0");
  const filename = pattern.replace(/%0?\d*d/, numbered);
  return `${directory}${filename}`;
}

export function ScrollFrameSequence({
  manifestUrl = DEFAULT_MANIFEST_URL,
  heightVh = 300,
  preloadRadius = 6,
  maxDpr = 2,
  fitMode = "cover",
  easing = "linear",
  ariaLabel = "Cinematic scroll sequence",
  children,
  className,
}: ScrollFrameSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Image cache keyed by frame index. Lives across renders without re-allocating.
  const framesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  // Indices we've already started loading (in-flight or done) — avoids dupes.
  const requestedRef = useRef<Set<number>>(new Set());
  const manifestRef = useRef<FrameManifest | null>(null);
  const patternRef = useRef<string>("frame_%04d.webp");
  const rafRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);
  // Live copies of fit/easing so the stable draw/loop callbacks see prop changes
  // (e.g. from the debug page toggles) without being re-created.
  const fitModeRef = useRef<FitMode>(fitMode);
  const easingRef = useRef<Easing>(easing);

  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [error, setError] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  // Initialise from the media query directly (lazy initialiser runs once, and
  // matchMedia is unavailable during SSR so we fall back to false there). The
  // effect below only subscribes to later changes.
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  // Overlay-facing state. Updated only when the active frame changes so we
  // don't re-render on every scroll tick.
  const [progress, setProgress] = useState(0);
  const [activeFrame, setActiveFrame] = useState(0);

  /** Start loading a frame if we haven't already; resolves into the cache. */
  const requestFrame = useCallback(
    (index: number, onReady?: () => void) => {
      const m = manifestRef.current;
      if (!m || index < 0 || index >= m.frameCount) return;
      if (requestedRef.current.has(index)) {
        if (onReady && framesRef.current.has(index)) onReady();
        return;
      }
      requestedRef.current.add(index);
      const img = new Image();
      img.decoding = "async";
      img.src = buildFrameUrl(manifestUrl, index, patternRef.current);
      img.onload = () => {
        framesRef.current.set(index, img);
        onReady?.();
      };
      img.onerror = () => {
        // Allow a later retry for this index rather than poisoning it forever.
        requestedRef.current.delete(index);
      };
    },
    [manifestUrl],
  );

  /** Find the loaded frame nearest to `target` (so we never paint blank). */
  const nearestLoadedFrame = useCallback((target: number): HTMLImageElement | null => {
    const cache = framesRef.current;
    const direct = cache.get(target);
    if (direct) return direct;
    const max = manifestRef.current?.frameCount ?? 0;
    for (let radius = 1; radius < max; radius += 1) {
      const lower = cache.get(target - radius);
      if (lower) return lower;
      const upper = cache.get(target + radius);
      if (upper) return upper;
    }
    return null;
  }, []);

  /** Size the canvas backing store to its CSS box × capped DPR. */
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

  /** Paint a frame onto the canvas using object-fit: cover geometry. */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = nearestLoadedFrame(index);
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;

    // cover  → fill the canvas, crop overflow (max scale).
    // contain → show the whole frame, letterbox the gaps (min scale).
    const scale =
      fitModeRef.current === "contain"
        ? Math.min(cw / iw, ch / ih)
        : Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [nearestLoadedFrame]);

  // ── Keep fit/easing refs in sync; redraw immediately on fitMode change ───
  useEffect(() => {
    fitModeRef.current = fitMode;
    // Repaint the current frame with the new fit (cover ↔ contain).
    if (lastDrawnFrameRef.current >= 0) drawFrame(lastDrawnFrameRef.current);
  }, [fitMode, drawFrame]);

  useEffect(() => {
    easingRef.current = easing;
  }, [easing]);

  // ── Load the manifest ────────────────────────────────────────────────────
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

  // ── Track later prefers-reduced-motion changes ───────────────────────────
  // (The initial value is read in the useState initialiser above.)
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // ── Preload the first frame immediately once the manifest is in ──────────
  useEffect(() => {
    if (!manifest) return;
    requestFrame(0, () => {
      setFirstFrameReady(true);
      // Draw straight away so there's no blank canvas flash.
      resizeCanvas();
      drawFrame(0);
    });
  }, [manifest, requestFrame, resizeCanvas, drawFrame]);

  // ── Main scroll / resize / draw loop ─────────────────────────────────────
  useEffect(() => {
    if (!manifest) return;
    const frameCount = manifest.frameCount;

    const computeProgress = (): number => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return 0;
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      // rect.top goes from 0 (top reaches viewport top) to -scrollable (bottom).
      return clamp01(-rect.top / scrollable);
    };

    const update = () => {
      rafRef.current = null;

      const raw = reducedMotion ? 0 : computeProgress();
      // Linear by default — honest 1:1 scroll→time mapping. Smoothstep is
      // opt-in (only once the underlying sequence timing is confirmed good).
      const mapped = easingRef.current === "smoothstep" ? smoothstep(raw) : raw;
      const target = Math.min(frameCount - 1, Math.round(mapped * (frameCount - 1)));

      // Progressive preload: active frame + a radius around it, in the scroll
      // direction first so the next frames are ready before they're needed.
      requestFrame(target, () => {
        if (target === lastDrawnFrameRef.current) drawFrame(target);
      });
      for (let offset = 1; offset <= preloadRadius; offset += 1) {
        requestFrame(target + offset);
        requestFrame(target - offset);
      }

      if (target !== lastDrawnFrameRef.current) {
        lastDrawnFrameRef.current = target;
        drawFrame(target);
        // Surface to overlays only on a real frame change (cheap re-render).
        setActiveFrame(target);
        setProgress(mapped);
      }
    };

    const requestUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      resizeCanvas();
      // Force a repaint even if the frame index is unchanged.
      lastDrawnFrameRef.current = -1;
      requestUpdate();
    };

    resizeCanvas();
    requestUpdate();

    const resizeObserver = new ResizeObserver(onResize);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);

    if (!reducedMotion) {
      window.addEventListener("scroll", requestUpdate, { passive: true });
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
    };
  }, [manifest, reducedMotion, preloadRadius, requestFrame, drawFrame, resizeCanvas]);

  const frameCount = manifest?.frameCount ?? 0;
  const showDebug = process.env.NODE_ENV === "development";

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", height: `${heightVh}vh` }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label={ariaLabel}
          role="img"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            // Hint to the browser; cover math is done manually in drawImage.
            objectFit: "cover",
          }}
        />

        {/* Dark cinematic gradient for text readability. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, oklch(0.12 0.02 60 / 0.55) 0%, oklch(0.12 0.02 60 / 0.10) 28%, oklch(0.12 0.02 60 / 0.10) 62%, oklch(0.10 0.02 60 / 0.78) 100%)",
          }}
        />

        {/* Loading state — only until the first frame can be painted. */}
        {!firstFrameReady && !error && (
          <div
            aria-live="polite"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "oklch(0.92 0.03 84)",
              letterSpacing: "0.18em",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Loading…
          </div>
        )}

        {/* Error state. */}
        {error && (
          <div
            role="alert"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "oklch(0.92 0.03 84)",
              fontSize: "0.9rem",
              padding: "0 1.5rem",
              textAlign: "center",
            }}
          >
            The cinematic sequence could not be loaded.
          </div>
        )}

        {/* Story overlay (render-prop) — sits above canvas + gradient. */}
        {children && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {children({ progress, frame: activeFrame, frameCount })}
          </div>
        )}

        {/* Dev-only frame/progress indicator. */}
        {showDebug && (
          <div
            style={{
              position: "absolute",
              bottom: "0.75rem",
              left: "0.75rem",
              padding: "0.4rem 0.6rem",
              borderRadius: "0.5rem",
              background: "oklch(0.12 0.02 60 / 0.7)",
              color: "oklch(0.95 0.02 84)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "0.7rem",
              lineHeight: 1.4,
              pointerEvents: "none",
            }}
          >
            frame {activeFrame + 1}/{frameCount || "…"}
            <br />
            progress {(progress * 100).toFixed(1)}%
            {reducedMotion ? " · reduced-motion" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScrollFrameSequence;
