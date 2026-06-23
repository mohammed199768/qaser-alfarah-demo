#!/usr/bin/env node

/* ───────────────────────────────────────────────────────────────────────────
 * build-keyframes.mjs
 *
 * Produces three sharp, single-purpose RESTING stills for /scroll-story from
 * the existing 4-second WebP frame sequence — without regenerating the whole
 * sequence. Each chosen frame was picked by visual inspection for clarity:
 *
 *   memory  → frame 4   (book/hall — frames 1–3 were softer/washed out)
 *   details → frame 27  (cake — sharpest balanced composition in 22–32)
 *   promise → frame 48  (rings — sharpest, most prominent rings)
 *
 * We take each source frame and re-encode it as a high-quality WebP with a
 * gentle unsharp pass. This can't invent detail the source lacks, but it (a)
 * removes the extra q75 compression softness of the transition frames by
 * encoding the resting state at q95, and (b) crisps edges slightly so the
 * landing frame reads sharper than the frames scrubbed during transitions.
 *
 * Output: public/generated/hero-keyframes/{memory,details,promise}.webp
 * plus a manifest.json documenting the source frame for each.
 * ─────────────────────────────────────────────────────────────────────────── */

import { spawn } from "node:child_process";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(projectRoot, "public", "generated", "hero-sequence-4s");
const outputDir = path.join(projectRoot, "public", "generated", "hero-keyframes");

// 1-based source frame on disk → output keyframe id.
//
// `crop` (optional) is an ffmpeg crop expression applied BEFORE sharpening.
// Section 1's source shot has DISTORTED AI "ghost couples" floating in the
// upper third of every frame (1–12) — there is no clean full-frame option in
// that shot. Frame 1 has the faintest figures, so we crop away the top and
// keep the clean, beautiful lower ballroom (book + candlelit tables) as the
// hero. Sections 2 (cake) and 3 (rings) are clean and used full-frame.
const KEYFRAMES = [
  {
    id: "memory",
    sourceFrame: 1,
    // Keep the bottom ~66%: drops the faint broken floating couples up top
    // while keeping an aspect ratio that cover-fits gracefully on tall phones.
    crop: "in_w:in_h*0.66:0:in_h*0.34",
    note: "frame 1 cropped to lower ballroom (removes distorted AI ghost-couples up top)",
  },
  { id: "details", sourceFrame: 27, note: "cake; sharpest balanced composition in 22-32 (clean)" },
  { id: "promise", sourceFrame: 48, note: "rings; sharpest, most prominent (clean)" },
];

// q95 resting still + a light unsharp to crisp edges. luma 5x5, modest amount;
// chroma untouched to avoid colour fringing on the warm palette.
const QUALITY = 95;
const UNSHARP = "unsharp=5:5:0.7:5:5:0.0";

function frameFilename(frame1Based) {
  return `frame_${String(frame1Based).padStart(4, "0")}.webp`;
}

function runFfmpeg(args) {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary for this platform.");
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, ["-hide_banner", ...args], { windowsHide: true });
    let output = "";
    child.stdout.on("data", (c) => { output += c; });
    child.stderr.on("data", (c) => { output += c; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`FFmpeg exited with code ${code}:\n${output}`));
    });
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const entries = [];

  for (const { id, sourceFrame, crop, note } of KEYFRAMES) {
    const inputPath = path.join(sourceDir, frameFilename(sourceFrame));
    await stat(inputPath); // fail loudly if the source frame is missing
    const outName = `${id}.webp`;
    const outputPath = path.join(outputDir, outName);

    // Crop (if any) runs before the sharpen pass.
    const filter = crop ? `crop=${crop},${UNSHARP}` : UNSHARP;

    await runFfmpeg([
      "-y", "-i", inputPath,
      "-vf", filter,
      "-c:v", "libwebp", "-preset", "picture",
      "-quality", String(QUALITY), "-compression_level", "6",
      "-frames:v", "1",
      outputPath,
    ]);

    const { size } = await stat(outputPath);
    console.log(`${id}: ${frameFilename(sourceFrame)} → ${outName} (${(size / 1024).toFixed(1)} KiB) — ${note}`);
    entries.push({ id, file: outName, sourceFrame, crop: crop ?? null, note, size });
  }

  const manifest = {
    description: "Sharp resting keyframes for /scroll-story (re-encoded from hero-sequence-4s).",
    quality: QUALITY,
    unsharp: UNSHARP,
    source: "public/generated/hero-sequence-4s",
    keyframes: entries,
    generatedAt: new Date().toISOString(),
  };
  await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nWrote ${entries.length} keyframes + manifest to public/generated/hero-keyframes`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
