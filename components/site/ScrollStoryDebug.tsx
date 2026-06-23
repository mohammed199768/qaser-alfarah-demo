"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollFrameSequence } from "@/components/site/ScrollFrameSequence";

/* ───────────────────────────────────────────────────────────────────────────
 * ScrollStoryDebug — a full-screen diagnostic surface for the frame sequence.
 *
 * Lets you isolate WHERE a "wrong-looking" result comes from:
 *   • Raw viewer + slider   → are the source frames / order correct?
 *   • 12fps autoplay        → does the sequence read as the intended motion?
 *   • Scroll-scrub preview  → is the scroll→frame mapping right?
 *   • cover/contain toggle  → is important content being cropped?
 *   • linear/smoothstep     → is the easing distorting timing?
 *   • live readouts         → frame index, filename, canvas px, source px.
 * ─────────────────────────────────────────────────────────────────────────── */

type FrameManifest = {
  frameCount: number;
  width: number;
  height: number;
  fps?: number;
  filenamePattern?: string;
};

type FitMode = "cover" | "contain";
type Easing = "linear" | "smoothstep";

function buildFrameUrl(manifestUrl: string, index: number, pattern: string): string {
  const directory = manifestUrl.slice(0, manifestUrl.lastIndexOf("/") + 1);
  const match = /%0?(\d*)d/.exec(pattern);
  const padWidth = match && match[1] ? Number(match[1]) : 4;
  const numbered = String(index + 1).padStart(padWidth, "0");
  return `${directory}${pattern.replace(/%0?\d*d/, numbered)}`;
}

function frameFilename(pattern: string, index: number): string {
  const match = /%0?(\d*)d/.exec(pattern);
  const padWidth = match && match[1] ? Number(match[1]) : 4;
  return pattern.replace(/%0?\d*d/, String(index + 1).padStart(padWidth, "0"));
}

export function ScrollStoryDebug({
  manifestUrl = "/generated/hero-sequence/manifest.json",
}: {
  manifestUrl?: string;
}) {
  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fitMode, setFitMode] = useState<FitMode>("cover");
  const [easing, setEasing] = useState<Easing>("linear");
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);
  // Bumped whenever a frame image finishes loading, to re-trigger the draw effect.
  const [loadTick, setLoadTick] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const playTimerRef = useRef<number | null>(null);

  const frameCount = manifest?.frameCount ?? 0;
  // Derived purely from state — no ref read during render.
  const pattern = manifest?.filenamePattern ?? "frame_%04d.webp";

  // Load manifest.
  useEffect(() => {
    const controller = new AbortController();
    fetch(manifestUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Manifest ${r.status}`);
        return r.json() as Promise<FrameManifest>;
      })
      .then(setManifest)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Failed to load manifest");
      });
    return () => controller.abort();
  }, [manifestUrl]);

  // Draw the raw viewer canvas for the active frame, honouring fit mode.
  // Kicks off a load (bumping loadTick on completion) when the frame is absent,
  // rather than calling itself — the effect below re-runs on loadTick.
  const drawRaw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !manifest) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cache = imgCacheRef.current;
      let img = cache.get(index);
      if (!img) {
        const next = new Image();
        next.decoding = "async";
        next.src = buildFrameUrl(manifestUrl, index, pattern);
        cache.set(index, next);
        next.onload = () => setLoadTick((t) => t + 1);
        img = next;
      }
      if (!img.complete || img.naturalWidth === 0) return;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(rect.width * dpr);
      const ch = Math.round(rect.height * dpr);
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== ch) canvas.height = ch;
      setCanvasSize({ w: cw, h: ch });

      const iw = img.naturalWidth || 1;
      const ih = img.naturalHeight || 1;
      const scale =
        fitMode === "contain" ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    },
    [manifest, manifestUrl, pattern, fitMode],
  );

  // Redraw raw viewer whenever frame / fit / a newly loaded image changes.
  useEffect(() => {
    drawRaw(frame);
  }, [frame, drawRaw, loadTick]);

  // 12fps linear autoplay.
  useEffect(() => {
    if (!playing || !frameCount) return;
    playTimerRef.current = window.setInterval(() => {
      setFrame((f) => (f + 1) % frameCount);
    }, 1000 / 12);
    return () => {
      if (playTimerRef.current !== null) window.clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    };
  }, [playing, frameCount]);

  const canvasPx = canvasSize ? `${canvasSize.w}×${canvasSize.h}` : "—";

  if (error) {
    return (
      <div style={panelMessage} role="alert">
        Manifest error: {error}
        <br />
        <code style={{ opacity: 0.7 }}>{manifestUrl}</code>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100svh", background: "#0a0a0c", color: "#e8e8ea" }}>
      {/* ── Controls + raw viewer ───────────────────────────────────────── */}
      <section style={{ padding: "1rem 1.25rem 1.5rem", borderBottom: "1px solid #222" }}>
        <h1 style={{ font: "600 1.1rem/1.2 ui-sans-serif, system-ui", margin: "0 0 0.75rem" }}>
          Scroll Story — Frame Diagnostics
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.9rem" }}>
          <button type="button" onClick={() => setPlaying((p) => !p)} style={btn}>
            {playing ? "⏸ Pause" : "▶ Play 12fps"}
          </button>
          <button
            type="button"
            onClick={() => setFitMode((m) => (m === "cover" ? "contain" : "cover"))}
            style={btn}
          >
            fit: {fitMode}
          </button>
          <button
            type="button"
            onClick={() => setEasing((e) => (e === "linear" ? "smoothstep" : "linear"))}
            style={btn}
          >
            easing: {easing}
          </button>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 960,
            aspectRatio: "16 / 9",
            background: "#000",
            border: "1px solid #222",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0, frameCount - 1)}
          value={frame}
          onChange={(e) => {
            setPlaying(false);
            setFrame(Number(e.target.value));
          }}
          aria-label="Frame"
          style={{ width: "100%", maxWidth: 960, marginTop: "0.75rem" }}
        />

        {/* ── Live readouts ─────────────────────────────────────────────── */}
        <dl style={readoutGrid}>
          <Readout label="Frame index" value={`${frame} / ${Math.max(0, frameCount - 1)}`} />
          <Readout label="Frame #" value={`${frame + 1} / ${frameCount}`} />
          <Readout label="Filename" value={frameCount ? frameFilename(pattern, frame) : "—"} />
          <Readout
            label="Source frame px"
            value={naturalSize ? `${naturalSize.w}×${naturalSize.h}` : "—"}
          />
          <Readout label="Canvas backing px" value={canvasPx} />
          <Readout
            label="Manifest px"
            value={manifest ? `${manifest.width}×${manifest.height}` : "—"}
          />
          <Readout label="Manifest fps" value={manifest?.fps != null ? String(manifest.fps) : "—"} />
          <Readout label="fit / easing" value={`${fitMode} / ${easing}`} />
        </dl>
        <p style={{ opacity: 0.6, fontSize: "0.8rem", marginTop: "0.6rem" }}>
          Source: <code>{manifestUrl}</code>
        </p>
      </section>

      {/* ── Scroll-scrub preview (uses the real component) ──────────────── */}
      <section>
        <p style={scrollHint}>↓ Scroll-scrub preview below (uses the production component) ↓</p>
        <ScrollFrameSequence
          manifestUrl={manifestUrl}
          heightVh={300}
          fitMode={fitMode}
          easing={easing}
          ariaLabel="Scroll scrub preview"
        >
          {({ progress, frame: f, frameCount: fc }) => (
            <div style={scrubHud}>
              <div>scroll progress: {(progress * 100).toFixed(1)}%</div>
              <div>
                frame: {f + 1} / {fc}
              </div>
              <div>
                fit: {fitMode} · easing: {easing}
              </div>
            </div>
          )}
        </ScrollFrameSequence>
      </section>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <dt style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.55 }}>
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: "0.85rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </dd>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "0.4rem 0.8rem",
  background: "#1c1c22",
  color: "#e8e8ea",
  border: "1px solid #33333d",
  borderRadius: 7,
  font: "500 0.85rem ui-sans-serif, system-ui",
  cursor: "pointer",
};

const readoutGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "0.7rem 1.2rem",
  marginTop: "1rem",
};

const panelMessage: React.CSSProperties = {
  minHeight: "100svh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#0a0a0c",
  color: "#ff8585",
  textAlign: "center",
  padding: "2rem",
  font: "500 1rem ui-sans-serif, system-ui",
};

const scrollHint: React.CSSProperties = {
  textAlign: "center",
  padding: "0.75rem",
  margin: 0,
  background: "#101015",
  color: "#9a9aa6",
  fontSize: "0.8rem",
};

const scrubHud: React.CSSProperties = {
  position: "absolute",
  top: "1rem",
  left: "1rem",
  padding: "0.5rem 0.7rem",
  background: "rgba(0,0,0,0.65)",
  borderRadius: 8,
  fontFamily: "ui-monospace, Menlo, monospace",
  fontSize: "0.8rem",
  lineHeight: 1.5,
  color: "#fff",
};

export default ScrollStoryDebug;
