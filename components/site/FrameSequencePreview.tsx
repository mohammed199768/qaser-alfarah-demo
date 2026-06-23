"use client";

import { useEffect, useState } from "react";

type FrameManifest = {
  frameCount: number;
  width: number;
  height: number;
  fps: number;
};

type FrameSequencePreviewProps = {
  manifestUrl?: string;
  className?: string;
};

function frameUrl(manifestUrl: string, index: number) {
  const directory = manifestUrl.slice(0, manifestUrl.lastIndexOf("/") + 1);
  return `${directory}frame_${String(index + 1).padStart(4, "0")}.webp`;
}

export function FrameSequencePreview({
  manifestUrl = "/generated/hero-sequence/manifest.json",
  className,
}: FrameSequencePreviewProps) {
  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [frame, setFrame] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(manifestUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
        return response.json() as Promise<FrameManifest>;
      })
      .then(setManifest)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(true);
      });
    return () => controller.abort();
  }, [manifestUrl]);

  useEffect(() => {
    if (!manifest) return;
    for (let offset = 1; offset <= 2; offset += 1) {
      const nextFrame = frame + offset;
      if (nextFrame < manifest.frameCount) new Image().src = frameUrl(manifestUrl, nextFrame);
    }
  }, [frame, manifest, manifestUrl]);

  if (error) return <p role="alert">The frame sequence could not be loaded.</p>;
  if (!manifest) return <p aria-live="polite">Loading frame sequence…</p>;

  return (
    <figure className={className}>
      {/* A native image avoids Next/Image optimizer requests for every scrubbed frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frameUrl(manifestUrl, frame)}
        alt="Video sequence preview"
        width={manifest.width}
        height={manifest.height}
        decoding="async"
        draggable={false}
      />
      <input
        type="range"
        min={0}
        max={manifest.frameCount - 1}
        value={frame}
        onChange={(event) => setFrame(Number(event.target.value))}
        aria-label="Video frame"
      />
    </figure>
  );
}
