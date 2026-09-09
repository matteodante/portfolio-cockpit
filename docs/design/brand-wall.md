# Compact automatic brand wall

Implemented 2026-09-09 for “Chi ho aiutato” / “Who I’ve helped”. The owner
rejected the orbital carousel and requested a compact, elegant wall with
three slow automatic rows moving right, left, right. Repeated marks were
explicitly allowed. This code-led refinement preserves the existing space
world, hero and Work film sequence. No new comp, asset or dependency was
needed. The [orbit record](brands-orbit.md) is historical and superseded.

## Current implementation

`components/landing/brands-section.tsx` keeps ten real brands and their
accurate team, client, enterprise-project or personal-project captions.
The rows group Pilatus–DonTouch, Galileo–Sorgenia and the three personal
projects. Every row repeats its entries twice per run and duplicates that
run for the seam. All forty visual copies are inside an `aria-hidden`
wall. One canonical `<ul>` exposes each of the ten names and relationships
once to assistive technology.

`landing.css` supplies three linear CSS transform loops: right over 130s,
left over 140s, right over 125s, starting at −28s/−16s/−24s delays. The
tracks translate between −50% and 0, or the reverse, across identical runs.
Native vertical scroll adds a gentle speed impulse without setting logo
positions. Absolute scroll velocity sets a positive playback rate capped
at 2.25×, with a 160ms attack and 1.1s return to 1× using `power2.out`.
Short tweens use the existing GSAP dependency and native
`Animation.updatePlaybackRate`, retaining continuous phase and each row's
direction. There is no brand ScrollTrigger, custom frame loop, sticky
stage, progress bar, perspective, skew or depth treatment.
The existing global progress indicator hides while Brands is active.

`brands-motion.ts` observes intersection and document visibility, gates
CSS `animation-play-state` and listens passively for native scroll.
`landing-motion.tsx` installs and removes it with the existing motion
configuration. Offscreen, hidden and cleanup states cancel rate tweens and
reset the rate to 1×; offscreen or hidden rows pause. Explicit pause,
reduced motion and no JavaScript hide the visual
wall and expose the full canonical grid in normal flow; during motion,
that list is visually clipped without removing its semantics.

## Composition

The section has 86px top / 90px bottom padding on desktop and 66px / 72px
below 800px. The heading width is `min(1160px, calc(100% - 100px))`, changing
to `calc(100% - 50px)` on mobile; its bottom gap is 48px / 36px. Unbounded
700 uses `clamp(32px, 3.5vw, 48px)`, 1.15 line-height and −0.025em tracking,
with a 32px mobile size. Supporting copy is 16px / 15px Space Grotesk.

Wall cells are 176px / 140px wide with 64px / 52px mark areas. Row gaps
are 28px / 26px; runs use 72px / 40px gaps and matching trailing padding,
with `space-around` distributing spare width across a minimum 100vw run.
Soft masks fade the outer 12% / 7%. Captions are 11px / 10px Space Grotesk,
12px / 10px below the marks. The literal `claude-local-docs` name stays
monospace at 16px / 13px. These sizes belong to this wall, not a new global
type scale.

The static grid uses four desktop columns with 36px row / 60px column
gaps, and two mobile columns with 28px / 26px gaps. Existing logos and
provenance are unchanged. Most marks become white through CSS; PiùUDITO
retains its grayscale/brightness treatment. Galileo remains an opaque
source with grayscale/inversion and section-level screen compositing.
Personal projects remain labelled as personal work, never external clients.

## Local validation

Production build at localhost:3001, Chromium on the development Mac.
These observations are local evidence, not field performance, physical
phone testing, conversion results or an award-quality claim.

- Seven final viewport captures: IT 1440×1000 and 390×844; EN 320×740;
  reduced-motion EN 390×844; EN 720×500 with its lower section view; and
  no-JavaScript IT 390×844. The 720×500 layout is equivalent in available
  CSS space to 1440×1000 at 200% zoom. No document horizontal overflow.
- Motion-enabled section heights: 655px at desktop 1440, 532px at mobile
  390 IT and 592px at narrow 320 EN. Compact 720 EN is 532px tall and
  remains ordinary scrollable flow in its 500px-high viewport.
- Natural one-second row travel: +15.51 / −10.806 / +12.1px. Sampled seam
  boundary discrepancy was at most 0.00037px across identical runs.
- Offscreen sampling showed paused CSS and zero travel over 500ms.
  Pause exposed all ten canonical entries; resume restored movement.
- PageDown moved the native page 960px; Enter activated the pause control.
  Emulated native touch moved it 463px with `scrollX` zero.
- `bun run check`: passed, 20 tests / 62 assertions. `bun run build`:
  passed. React Doctor: 97/100 with no issues. The single Impeccable
  detector pass had no primary findings and 42 typography advisories;
  these do not establish new shared tokens or require unrelated redesign.

The fresh scoped Impeccable finish review returned **SHIP**, approved all
seven final captures and required no material fixes. Its disposition
applies to this brand wall only. Captures are in ignored
`.impeccable/review/brand-wall/`: `desktop-it.png`, `mobile-it.png`,
`narrow-en.png`, `mobile-reduced.png`, `compact-en.png`,
`compact-bottom.png` and `mobile-nojs.png`. Detailed evidence is in
`.impeccable/tmp/brand-wall/{confirmation,behavior,input,check,build,react-doctor,design-check}.log`.

### Gentle scroll impulse follow-up — 2026-09-09

The owner requested this speed refinement after the compact wall review.
A fresh scoped finish review returned **SHIP** with no material fixes.
Desktop and mobile compositions remain 655px / 532px tall with no
horizontal overflow; CSS, layout, assets and copy are unchanged.

Local playback samples: baseline 1×, slow scroll 1.064×, fast scroll 1.44×,
reverse scroll 1.36×, settling to 1×. Emulated touch reached 1.156× and
returned to 1×. Offscreen loops paused with zero travel over 500ms;
pause/reduced motion retained all ten canonical entries. Check passed
(20 tests / 62 assertions), build passed, React Doctor remained 97/100
with no issues, and the detector reported zero primary findings and the
42 existing advisories. These remain local observations.

Captures: `.impeccable/review/brand-impulse/{desktop,mobile}.png`.
Logs: `.impeccable/tmp/brand-impulse/{inspection,touch,check,build,design-check,react-doctor}.log`.
