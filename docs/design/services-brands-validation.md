# Services, brands and booking — 2026-09-08

## Implemented scope

- Three service cards: websites from 300 €, apps/software and AI on
  request. Dark squared secondary actions open an animated Cal.com
  dialog; normal links remain available without JavaScript.
- “Chi ho aiutato” follows services. Ten verified brand/project names,
  official logos, relationship captions, accelerating horizontal GSAP
  travel and velocity skew. Static grid when motion is disabled.
- The second hero text chapter is removed and its scroll stage shortened
  from 300svh to 180svh. The playable CV action remains in the hero.
- Previously completed orange 3D name, Cal URL, cockpit home avatars and
  dark hero CV button remain in this working tree.

## Completed checks

- `bun run check`: Biome and TypeScript passed; 17 tests, 0 failures.
- `bun run build`: passed. Existing Next tracing and OG dynamic-font
  download warnings remain; no new build failure.
- React Doctor on changed files: 8 files, no diagnostics, score 75/100,
  unchanged from the preceding controls pass.
- Impeccable detector: 0 primary findings, 43 advisory type-scale
  findings. Result: `.impeccable/review/brands/detector.json`.
- Raster provenance scan: 17 rasters, 0 missing. New logo directory
  totals about 176 KB including source metadata.
- Production HTTP checks: EN and IT return 200, with section order
  intro/services/brands/work/contact, all ten names, starting price and
  the confirmed Cal.com URL. All nine logo assets return 200 with the
  expected SVG or WebP content type.
- Updated local production preview: `http://100.114.154.21:3001/it`.

## Visual evidence and remaining verification

Desktop services were inspected at 1440 × 900 and captured in
`.impeccable/review/brands/desktop-services.png`. The beginning of the
logo rail and the real Cal.com calendar were inspected in the browser.
Opening/closing the first service dialog and returning focus to its
trigger worked. No appointment or time was selected.

The initial calendar had white surrounding padding; the official Cal UI
configuration now sets its body background to the dialog's dark surface.
This correction still needs a visual confirmation. Escape pressed inside
the cross-origin calendar does not reach the parent dialog; its visible
close control remains available. Do not claim universal Escape handling.

CUA subsequently reported that the Mac was locked. The follow-up used
an isolated Playwright browser against this local app and completed the
desktop rail, mobile/narrow services, loaded desktop/mobile calendar,
focus-return and all three triggers, plus the static grid. Evidence is
in `.impeccable/review/glitch/` and
`.impeccable/tmp/identity-verification.log`. The calendar's white surround
is resolved. Its own localization follows the visitor's browser; the
parent dialog's labels follow the landing locale.

The Galileo rectangle was still visible with blending scoped to the
image. Moving `screen` blending to the section's compositing level fixes
it in both horizontal and static layouts. A global link hover rule also
affected the orange booking button's text; its dark hover text is now
explicit. Both corrections were visually confirmed.

The earlier `controls` ship verdict covers its preceding four refinements;
the new hero/cards/brands review is recorded separately under `glitch`.

Sources and interaction reference are recorded in [brand-media.md](brand-media.md).
