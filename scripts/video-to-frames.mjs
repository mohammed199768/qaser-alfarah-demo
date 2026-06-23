#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultInput = path.join(projectRoot, "public", "Create_a_second_cinematic_we.mp4");
const defaultOutput = path.join(projectRoot, "public", "generated", "hero-sequence");
const comparisonRoot = path.join(projectRoot, ".video-frame-output");
const profiles = [
  { id: "profile-a", label: "Profile A", fps: 10, width: 1100, quality: 75 },
  { id: "profile-b", label: "Profile B", fps: 12, width: 1280, quality: 75 },
  { id: "profile-c", label: "Profile C", fps: 12, width: 1280, quality: 82 },
  { id: "profile-d", label: "Profile D", fps: 15, width: 1280, quality: 80 },
  { id: "profile-e", label: "Profile E", fps: 12, width: 1440, quality: 78 },
];

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--test-profiles") options.testProfiles = true;
    else if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument?.startsWith("--")) {
      const key = argument.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
      options[key] = value;
      index += 1;
    } else if (argument) {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function positiveNumber(value, fallback, name) {
  const parsed = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${name} must be a positive number.`);
  return parsed;
}

function runFfmpeg(args, { allowFailure = false } = {}) {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary for this platform.");
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, ["-hide_banner", ...args], { windowsHide: true });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0 || allowFailure) resolve(output);
      else reject(new Error(`FFmpeg exited with code ${code}:\n${output}`));
    });
  });
}

async function probeVideo(inputPath) {
  const output = await runFfmpeg(["-i", inputPath], { allowFailure: true });
  const durationMatch = output.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const videoMatch = output.match(/Video:.*?(\d{2,5})x(\d{2,5}).*?(\d+(?:\.\d+)?) fps/);
  if (!durationMatch || !videoMatch) throw new Error(`Could not read video metadata from ${inputPath}`);
  const duration = Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]);
  return {
    duration,
    width: Number(videoMatch[1]),
    height: Number(videoMatch[2]),
    fps: Number(videoMatch[3]),
  };
}

async function cleanGeneratedFiles(outputDir) {
  await mkdir(outputDir, { recursive: true });
  const entries = await readdir(outputDir, { withFileTypes: true });
  await Promise.all(entries
    .filter((entry) => entry.isFile() && (/^frame_\d+\.webp$/.test(entry.name) || entry.name === "manifest.json"))
    .map((entry) => rm(path.join(outputDir, entry.name))));
}

async function measureSsim(inputPath, outputDir, fps, width) {
  const pattern = path.join(outputDir, "frame_%04d.webp");
  const filter = `[0:v]fps=${fps},scale=${width}:-2:flags=lanczos[reference];[1:v][reference]ssim`;
  const output = await runFfmpeg([
    "-i", inputPath,
    "-framerate", String(fps), "-i", pattern,
    "-lavfi", filter,
    "-shortest", "-f", "null", "-",
  ]);
  const matches = [...output.matchAll(/All:([\d.]+)/g)];
  return matches.length ? Number(matches.at(-1)[1]) : null;
}

async function generateFrames({ inputPath, outputDir, requestedFps, width, quality, maxFrames = 60, label }) {
  const source = await probeVideo(inputPath);
  const effectiveFps = Math.min(requestedFps, maxFrames / source.duration);
  const expectedFrames = Math.min(maxFrames, Math.ceil(source.duration * effectiveFps));
  await cleanGeneratedFiles(outputDir);

  console.log(`${label}: ${requestedFps} fps requested, ${effectiveFps.toFixed(3)} fps effective, ${width}px, q${quality}`);
  await runFfmpeg([
    "-y", "-i", inputPath,
    "-an",
    "-vf", `fps=${effectiveFps},scale=${width}:-2:flags=lanczos`,
    "-frames:v", String(expectedFrames),
    "-c:v", "libwebp", "-preset", "picture",
    "-quality", String(quality), "-compression_level", "6",
    "-fps_mode", "passthrough",
    path.join(outputDir, "frame_%04d.webp"),
  ]);

  const frameNames = (await readdir(outputDir)).filter((name) => /^frame_\d+\.webp$/.test(name)).sort();
  if (!frameNames.length) throw new Error(`No frames were generated in ${outputDir}`);
  const frameStats = await Promise.all(frameNames.map((name) => stat(path.join(outputDir, name))));
  const totalSize = frameStats.reduce((sum, frame) => sum + frame.size, 0);
  const ssim = await measureSsim(inputPath, outputDir, effectiveFps, width);
  const relativeOutput = path.relative(projectRoot, outputDir).replaceAll(path.sep, "/");
  const outputHeight = Math.round((source.height * width) / source.width / 2) * 2;
  const manifest = {
    frameCount: frameNames.length,
    width,
    height: outputHeight,
    fps: Number(effectiveFps.toFixed(3)),
    requestedFps,
    quality,
    totalSize,
    averageFrameSize: Math.round(totalSize / frameNames.length),
    outputPath: relativeOutput,
    filenamePattern: "frame_%04d.webp",
    sourceDuration: source.duration,
    maxFrames,
    ssim,
    generatedAt: new Date().toISOString(),
  };
  await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return { id: path.basename(outputDir), label, ...manifest };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MiB`;
}

function previewHtml(results) {
  const data = JSON.stringify(results).replaceAll("<", "\\u003c");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Video frame profile comparison</title><style>
:root{color-scheme:dark}body{margin:0;padding:24px;font:15px system-ui;background:#111;color:#eee}h1{margin-top:0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}.card{padding:14px;border:1px solid #444;border-radius:12px;background:#1b1b1b}.card img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#000;border-radius:8px}.meta{color:#bbb;line-height:1.5}input{width:100%}button{margin-top:8px;padding:7px 12px}.hint{color:#aaa}</style></head>
<body><h1>Video frame profile comparison</h1><p class="hint">Scrub or play each profile. Only the visible frame and its two neighbors are preloaded.</p><main class="grid" id="profiles"></main>
<script>const profiles=${data};const root=document.querySelector('#profiles');
function framePath(p,i){return p.id+'/frame_'+String(i+1).padStart(4,'0')+'.webp'}
for(const p of profiles){const el=document.createElement('section');el.className='card';el.innerHTML='<h2>'+p.label+'</h2><img alt="'+p.label+' frame"><input type="range" min="0" max="'+(p.frameCount-1)+'" value="0"><button type="button">Play</button><p class="meta">'+p.frameCount+' frames · '+p.width+'×'+p.height+' · '+p.fps+' effective fps ('+p.requestedFps+' requested)<br>'+p.totalSizeLabel+' total · '+p.averageSizeLabel+'/frame · SSIM '+(p.ssim?.toFixed(4)??'n/a')+'</p>';root.append(el);const img=el.querySelector('img'),range=el.querySelector('input'),button=el.querySelector('button');let timer;const show=()=>{const i=Number(range.value);img.src=framePath(p,i);for(const n of [i+1,i+2])if(n<p.frameCount)(new Image()).src=framePath(p,n)};range.oninput=show;button.onclick=()=>{if(timer){clearInterval(timer);timer=null;button.textContent='Play';return}button.textContent='Pause';timer=setInterval(()=>{range.value=(Number(range.value)+1)%p.frameCount;show()},1000/p.fps)};show()}
</script></body></html>`;
}

async function testProfiles(inputPath, maxFrames) {
  const outputRoot = path.join(comparisonRoot, "profiles");
  await mkdir(outputRoot, { recursive: true });
  const results = [];
  for (const profile of profiles) {
    results.push(await generateFrames({
      inputPath,
      outputDir: path.join(outputRoot, profile.id),
      requestedFps: profile.fps,
      width: profile.width,
      quality: profile.quality,
      maxFrames,
      label: profile.label,
    }));
  }
  const displayResults = results.map((result) => ({
    ...result,
    totalSizeLabel: formatBytes(result.totalSize),
    averageSizeLabel: formatBytes(result.averageFrameSize),
  }));
  await writeFile(path.join(outputRoot, "summary.json"), `${JSON.stringify(results, null, 2)}\n`);
  await writeFile(path.join(outputRoot, "preview.html"), previewHtml(displayResults));
  console.table(displayResults.map(({ label, frameCount, width, height, fps, quality, totalSizeLabel, averageSizeLabel, ssim }) => ({ label, frameCount, dimensions: `${width}x${height}`, fps, quality, totalSize: totalSizeLabel, average: averageSizeLabel, ssim })));
  console.log(`Preview: ${path.join(outputRoot, "preview.html")}`);
}

function printHelp() {
  console.log(`Usage:
  npm run video:frames -- [--input <video>] [--output <dir>] [--fps 12] [--width 1280] [--quality 78] [--max-frames 60]
  npm run video:frames:test -- [--input <video>] [--max-frames 60]

The 60-frame default is a network-safety ceiling. Raise it deliberately with --max-frames.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return printHelp();
  const inputPath = path.resolve(projectRoot, args.input ?? defaultInput);
  await readFile(inputPath);
  const maxFrames = Math.floor(positiveNumber(args.maxFrames, 60, "max-frames"));
  if (args.testProfiles) return testProfiles(inputPath, maxFrames);
  const result = await generateFrames({
    inputPath,
    outputDir: path.resolve(projectRoot, args.output ?? defaultOutput),
    requestedFps: positiveNumber(args.fps, 12, "fps"),
    width: Math.floor(positiveNumber(args.width, 1280, "width")),
    quality: positiveNumber(args.quality, 78, "quality"),
    maxFrames,
    label: "Production profile",
  });
  console.log(`Generated ${result.frameCount} frames (${formatBytes(result.totalSize)}) in ${result.outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
