# Original Work films — MiniMax H3

Generated and integrated locally on 2026-09-09. The owner requested two
new subjects: a rocket launch and a journey through the solar system,
with analog/VHS character matching the dark space identity.

## Generated pair

- **Launch**: a continuous night launch, ivory rocket, amber exhaust,
  billowing vapor and a gentle upward camera tilt. Original: 2560×1440.
  Replicate prediction: `3a80vkjkkdrmt0d0gz1aa49zk4`.
- **Saturn**: a calm glide beside the ring plane, warm atmospheric bands,
  foreground ring particles and a small distant Sun. Original: 1920×1440.
  Replicate prediction: `cj0rat7gaxrmy0d0gz18th0he8`.

Both use `minimax/h3`, requested duration 6s, resolution `2K`, aspect
ratios `16:9` and `4:3`. Replicate returned 6.584s containers with 24fps
H.264 video and AAC audio; the web versions use the first six seconds and
remove audio. The authenticated Replicate playground completed both jobs.

Text-to-video only: no personal photos, prior generated images or Oakley
media were submitted. The fine analog texture, gentle halation and chroma
bleed were requested in the generation prompt. There is no added CSS tape
overlay or post-production color filter. These are decorative AI films,
not real mission footage, client work or an astronomy diagram.

Exact inputs, IDs, URLs and original SHA-256 hashes are saved in
`assets/work-video/launch-orbit-h3.json` and the public media `origin.json`.
The downloaded 2K masters are kept locally under `.impeccable/tmp/h3-video/`;
Replicate delivery URLs may expire. The optimized films are repository assets.

## Web encoding and integration

- `public/landing-v2/work-video/launch.mp4`: 1440×810, 3,038,971 bytes.
- `public/landing-v2/work-video/saturn.mp4`: 960×720, 2,772,591 bytes.
- Both: H.264/yuv420p, 30fps, 6s, 180 frames, every frame a keyframe,
  libx264 slow / CRF25, MP4 faststart, video stream only.
- Combined video transfer: 5,811,562 bytes (5.54MiB), compared with the
  previous pair's 5,341,981 bytes (5.09MiB).
- JPEG posters come from 1.9s (launch) and 2.4s (Saturn), with embedded
  original generation prompts and adjacent provenance records.

New file names avoid reuse of cached placeholder media. The former Oakley
mission/visor films and posters are removed from public assets and remain
in Git history. The existing left/right positioning classes, 280svh stage,
GSAP scroll mapping, lazy loading, reverse seeking, pause and static
fallbacks are retained. The real project links still follow the sequence.

## Verification

Six evenly spaced frames from each source were inspected for subject,
continuous movement, consistent geometry and palette. Both encodes were
checked with ffprobe for dimensions, duration, silence and 180 keyframes.
Production preview checked at 1440×1000 (IT) and 390×844 (EN) in one
batch. Both films advance to the same time (2.685s desktop, 2.357s mobile)
and native reverse scroll takes both back together (1.892s sampled).
There is no horizontal overflow; pause hides the videos and shows both
loaded posters. Initial hero resource inspection recorded no MP4 requests.

The bright launch exhaust exposed a contrast weakness behind the mobile
title. One correction strengthened the existing radial shade (center 0.75,
outer 0.4 opacity), then desktop/mobile were confirmed together. Existing
layout, native scroll and real project links remain. Captures are under
`.impeccable/tmp/h3-video/`. This is a local browser review, not a claim
of physical-phone or field performance.

`bun run check`: 36 tests / 502 assertions pass. Production build passes.
React Doctor: no diagnostics across six changed TS/TSX files (90/100,
unchanged from the preceding hero work). Impeccable static detection:
no primary findings, 45 existing advisories. Both poster files contain
the embedded generation prompt. Public deployment has not been performed.

## Cost and sources

The listed price is $0.13 per generated second at 2K: an estimated $1.56
for two requested 6-second jobs, without retries. Both jobs succeeded;
the final account invoice was not inspected.

- [Official Replicate H3 model and pricing](https://replicate.com/minimax/h3)
- [MiniMax H3 announcement](https://www.minimax.io/blog/minimax-h3)

Earlier astronaut/visor first frames and `assets/work-video/h3-jobs.json`
remain as unused preparation from the prior direction. Those jobs were
never submitted; the new launch/Saturn pair supersedes that plan. Current
Replicate access succeeded through the owner's authenticated browser,
superseding the previous sign-in blocker.

## Later spatial refinement

The source films and web encodes above remain unchanged. `depth-release.md`
updates their layout to uncropped 16:9 / 4:3 planes, gentler opposing
travel with more visible depth, and larger separation before the new
four-project gallery. It also records the separate H3 contact loop.
