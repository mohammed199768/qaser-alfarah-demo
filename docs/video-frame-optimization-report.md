# Video frame optimization report

Generated on 2026-06-22.

## Input

- File: `public/Create_a_second_cinematic_we.mp4`
- Container/video: MP4, H.264 High, progressive YUV 4:2:0
- Audio: AAC stereo (not included in the frame sequence)
- Duration: 10.01 seconds
- Dimensions: 1280 × 720
- Source frame rate: 24 fps
- File size: 2,213,695 bytes (2.11 MiB)
- Bit rate: approximately 1,770 kbit/s

The supplied source is 10 seconds rather than the expected four seconds. The converter therefore applied its default 60-frame network-safety limit. All requested profile rates were capped to an effective 5.994 fps so the complete source could be represented without producing 100–150 image requests. Both values are retained in every manifest.

## Tested profiles

All variants use WebP, Lanczos resizing, FFmpeg's `picture` preset, and compression level 6. SSIM compares the decoded WebP sequence with source frames resized using the same sampling and scaling path; values closer to 1 indicate greater similarity.

| Profile | Requested fps | Effective fps | Dimensions | Quality | Frames | Total size | Average frame | SSIM |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A | 10 | 5.994 | 1100 × 618 | 75 | 60 | 1.67 MiB | 28.4 KiB | 0.984716 |
| B | 12 | 5.994 | 1280 × 720 | 75 | 60 | 1.96 MiB | 33.5 KiB | 0.986111 |
| C | 12 | 5.994 | 1280 × 720 | 82 | 60 | 2.56 MiB | 43.8 KiB | 0.989663 |
| D | 15 | 5.994 | 1280 × 720 | 80 | 60 | 2.35 MiB | 40.2 KiB | 0.988738 |
| E | 12 | 5.994 | 1440 × 810 | 78 | 60 | 2.49 MiB | 42.5 KiB | 0.988175 |

The generated comparison viewer is `.video-frame-output/profiles/preview.html`. It provides independent scrubbing and playback for each profile and loads only the current frame plus two neighboring frames.

## Recommendation

**Profile B wins:** WebP, 12 fps requested, 1280 px wide, quality 75, with the 60-frame cap producing 5.994 effective fps for this source.

Profile B preserves the source's native resolution and looked effectively indistinguishable from the higher-quality variants in representative-frame inspection. Profile C's SSIM improvement is only 0.003552 while its payload is about 31% larger. Profile E upscales a 1280 px source, so its additional bytes cannot recover real source detail. Profile A is smallest, but loses native resolution for a modest 0.29 MiB saving.

Production output is in `public/generated/hero-sequence/` and contains 60 sequential WebP frames plus `manifest.json`.

## Performance notes

- The source MP4 is 2.11 MiB, so ordinary linear playback should keep using the video: one compressed video request is more efficient than 60 separate images. Use the frame sequence when deterministic scroll-to-frame control justifies the request overhead.
- The 1.96 MiB total is practical only when frames are fetched progressively. Do not eagerly preload all 60 images on initial page load.
- Roughly 6 fps can work well for scroll-controlled animation, where frames advance with user movement, but it will look less fluid during automatic real-time playback.
- If full-duration 12 fps playback is a firm requirement, rerun with `--max-frames 120`. Expect approximately twice the requests and roughly twice the payload; validate that tradeoff on throttled mobile hardware before shipping.
- Serve the generated files with long-lived immutable caching after filenames are versioned or content-hashed. The current stable names require cache invalidation when regenerated.
- Respect `prefers-reduced-motion` in the consuming hero and show a representative static frame when motion is reduced.

## Reproduction

Generate the production profile:

```sh
npm run video:frames -- --fps 12 --width 1280 --quality 75
```

Regenerate the complete comparison matrix:

```sh
npm run video:frames:test
```

Run `npm run video:frames -- --help` for custom input, output, and frame-cap options.
