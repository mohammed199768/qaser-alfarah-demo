#!/usr/bin/env node

/* ───────────────────────────────────────────────────────────────────────────
 * diagnose-frames.mjs  (diagnostic only — does NOT touch the production pipeline)
 *
 * 1. Builds a contact sheet (every Nth frame, with frame numbers burned in)
 *    from an existing generated frame sequence.
 * 2. Optionally regenerates a short sequence from the FIRST N seconds of the
 *    source video into a separate output folder.
 *
 * Usage:
 *   node scripts/diagnose-frames.mjs contact-sheet [--dir public/generated/hero-sequence] [--every 5]
 *   node scripts/diagnose-frames.mjs trim --seconds 4 --fps 12 --width 1280 --quality 75 \
 *        --output public/generated/hero-sequence-4s
 * ─────────────────────────────────────────────────────────────────────────── */

import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultSource = path.join(projectRoot, "public", "Create_a_second_cinematic_we.mp4");

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { command };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg?.startsWith("--")) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
      const value = rest[i + 1];
      if (value === undefined || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      options[key] = value;
      i += 1;
    }
  }
  return options;
}

function runFfmpeg(args, { allowFailure = false } = {}) {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary for this platform.");
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, ["-hide_banner", ...args], { windowsHide: true });
    let output = "";
    child.stdout.on("data", (c) => { output += c; });
    child.stderr.on("data", (c) => { output += c; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0 || allowFailure) resolve(output);
      else reject(new Error(`FFmpeg exited with code ${code}:\n${output}`));
    });
  });
}

async function probeVideo(inputPath) {
  const out = await runFfmpeg(["-i", inputPath], { allowFailure: true });
  const d = out.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const v = out.match(/Video:.*?(\d{2,5})x(\d{2,5}).*?(\d+(?:\.\d+)?) fps/);
  if (!d || !v) throw new Error(`Could not read video metadata from ${inputPath}`);
  return {
    duration: Number(d[1]) * 3600 + Number(d[2]) * 60 + Number(d[3]),
    width: Number(v[1]),
    height: Number(v[2]),
    fps: Number(v[3]),
  };
}

/* ── Contact sheet ─────────────────────────────────────────────────────────
 * Tiles every Nth frame into a grid with a 1-based frame number drawn on each.
 */
async function buildContactSheet(opts) {
  const dir = path.resolve(projectRoot, opts.dir ?? "public/generated/hero-sequence");
  const every = Math.max(1, Number(opts.every ?? 5));
  const cols = Math.max(1, Number(opts.cols ?? 4));
  const tileWidth = Math.max(160, Number(opts.tileWidth ?? 320));

  const frameNames = (await readdir(dir))
    .filter((n) => /^frame_\d+\.webp$/.test(n))
    .sort();
  if (!frameNames.length) throw new Error(`No frames found in ${dir}`);

  // Pick every Nth frame (1-based: frame 1, 6, 11, …) plus always the last.
  const picked = [];
  for (let i = 0; i < frameNames.length; i += every) picked.push(i);
  if (picked.at(-1) !== frameNames.length - 1) picked.push(frameNames.length - 1);

  // Fixed 16:9 tile so every cell aligns in the grid regardless of source AR.
  const tileH = Math.round((tileWidth * 9) / 16 / 2) * 2;
  const rows = Math.ceil(picked.length / cols);

  // Label each picked frame with its 1-based number, force it to the tile box,
  // then concat all tiles on the time axis and lay them out with `tile` (which,
  // unlike xstack, computes the canvas reliably and keeps reading order).
  const inputs = [];
  const labels = [];
  picked.forEach((idx, slot) => {
    inputs.push("-i", path.join(dir, frameNames[idx]));
    labels.push(
      `[${slot}:v]scale=${tileWidth}:${tileH}:force_original_aspect_ratio=decrease,` +
        `pad=${tileWidth}:${tileH}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,` +
        `drawtext=text='#${idx + 1}':x=8:y=8:fontsize=26:fontcolor=white:` +
        `box=1:boxcolor=black@0.6:boxborderw=6[t${slot}]`,
    );
  });
  const tileRefs = picked.map((_, slot) => `[t${slot}]`).join("");
  const filter =
    `${labels.join(";")};${tileRefs}concat=n=${picked.length}:v=1:a=0[seq];` +
    `[seq]tile=${cols}x${rows}:padding=4:color=black[grid]`;

  const outPath = path.resolve(projectRoot, opts.output ?? path.join(dir, "contact-sheet.webp"));
  await runFfmpeg([
    "-y", ...inputs,
    "-filter_complex", filter,
    "-map", "[grid]",
    "-frames:v", "1",
    "-c:v", "libwebp", "-quality", "82",
    outPath,
  ]);
  console.log(
    `Contact sheet: ${path.relative(projectRoot, outPath).replaceAll(path.sep, "/")} ` +
      `(${picked.length} tiles, every ${every}th frame, ${cols}×${rows} grid)`,
  );
  console.log(`Frames shown: ${picked.map((i) => i + 1).join(", ")}`);
}

/* ── Trim: regenerate from the first N seconds of the source ────────────────*/
async function generateTrim(opts) {
  const inputPath = path.resolve(projectRoot, opts.input ?? defaultSource);
  await readFile(inputPath);
  const seconds = Number(opts.seconds ?? 4);
  const fps = Number(opts.fps ?? 12);
  const width = Math.floor(Number(opts.width ?? 1280));
  const quality = Number(opts.quality ?? 75);
  const outputDir = path.resolve(projectRoot, opts.output ?? "public/generated/hero-sequence-4s");

  const source = await probeVideo(inputPath);
  const expectedFrames = Math.ceil(seconds * fps);

  await mkdir(outputDir, { recursive: true });
  // Clear any prior frames/manifest in the target (separate from production).
  const existing = await readdir(outputDir).catch(() => []);
  await Promise.all(
    existing
      .filter((n) => /^frame_\d+\.webp$/.test(n) || n === "manifest.json")
      .map((n) => rm(path.join(outputDir, n))),
  );

  console.log(
    `Trim: first ${seconds}s of source · ${fps} fps · ${width}px · q${quality} → ~${expectedFrames} frames`,
  );
  await runFfmpeg([
    "-y", "-t", String(seconds), "-i", inputPath,
    "-an",
    "-vf", `fps=${fps},scale=${width}:-2:flags=lanczos`,
    "-frames:v", String(expectedFrames),
    "-c:v", "libwebp", "-preset", "picture",
    "-quality", String(quality), "-compression_level", "6",
    "-fps_mode", "passthrough",
    path.join(outputDir, "frame_%04d.webp"),
  ]);

  const frameNames = (await readdir(outputDir)).filter((n) => /^frame_\d+\.webp$/.test(n)).sort();
  if (!frameNames.length) throw new Error(`No frames generated in ${outputDir}`);
  const stats = await Promise.all(frameNames.map((n) => stat(path.join(outputDir, n))));
  const totalSize = stats.reduce((s, f) => s + f.size, 0);
  const outputHeight = Math.round((source.height * width) / source.width / 2) * 2;
  const manifest = {
    frameCount: frameNames.length,
    width,
    height: outputHeight,
    fps,
    requestedFps: fps,
    quality,
    totalSize,
    averageFrameSize: Math.round(totalSize / frameNames.length),
    outputPath: path.relative(projectRoot, outputDir).replaceAll(path.sep, "/"),
    filenamePattern: "frame_%04d.webp",
    sourceDuration: source.duration,
    trimmedSeconds: seconds,
    generatedAt: new Date().toISOString(),
  };
  await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Generated ${frameNames.length} frames (${(totalSize / 1024 ** 2).toFixed(2)} MiB) in ` +
      `${manifest.outputPath}`,
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  switch (opts.command) {
    case "contact-sheet":
      return buildContactSheet(opts);
    case "trim":
      return generateTrim(opts);
    default:
      console.log(
        "Usage:\n" +
          "  node scripts/diagnose-frames.mjs contact-sheet [--dir <frames>] [--every 5] [--output <file>]\n" +
          "  node scripts/diagnose-frames.mjs trim [--seconds 4] [--fps 12] [--width 1280] [--quality 75] [--output <dir>]",
      );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
