# Historical: scroll-reactive brand orbit

**Superseded on 2026-09-09.** The owner rejected this orbital carousel.
The shipped replacement is the compact automatic [brand wall](brand-wall.md).
The mechanics, measurements and earlier review below describe only the
removed orbit and are retained as implementation history. They are not
the current specification or validation evidence for Brands.

Implemented 2026-09-09. Scope: only “Chi ho aiutato” / “Who I’ve helped”.
The owner requested a complete replacement of the flat horizontal rail,
no bar, and acceleration driven by scrolling, with Awwwards-level ambition.
No award or conversion improvement is claimed.

## Research and direction

- [Oaksun Studio — Silky Smooth Marquee Scroll, Awwwards](https://www.awwwards.com/inspiration/silky-smooth-marquee-scroll-oaksun-studio)
  is catalogued as a GSAP marquee with swipe/drag interactions. The useful
  reference is tactile movement; its layout and controls are not copied.
- [Atmospheric Depth Gallery, Codrops](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/)
  separates target/current scroll and uses velocity for depth, tilt and
  atmosphere. Its live demo was inspected. This implementation adapts that
  principle to a horizontal orbit of real marks, retaining native scroll.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
  supplies bounded section progress and layout refresh. Our velocity is
  measured from the damped angular position, making the deformation follow
  the actual logo movement rather than raw wheel deltas.

The existing dark space palette, typography, truthful relationship labels
and logo assets remain the visual authority. No new dependency, image,
video or copied third-party source code is shipped.

## Implemented motion

`brands-motion.ts` owns one GSAP ScrollTrigger and a short-lived animation
frame loop. Ten semantic list items occupy equal angles around an inclined
orbit. Scroll advances through nine positions (324 degrees); every mark
can reach the front. Native sticky geometry spans 330svh on desktop and
370svh below 800px. There is no scroll interception, snap or autoplay.

Target angle follows scroll; actual angle approaches it with exponential
8/s damping. Angular velocity drives 10/s damped energy, clamped to ±1.
Energy changes bank (rest −7°, at most ±7° more), radius (up to +12%),
foreground stretch (+20%), skew (±9°), yaw and depth blur. Distant logos
recede in Z, lose intensity and have at most 3.4px blur. Frontmost logos
are sharp and their relationship captions are visible. Reversing scroll
reverses the bank and distortion. The frame loop exits once settled.

The section's old horizontal progress bar is removed. The existing global
progress indicator hides while Brands is the active navigation section.
Header booking, section navigation and the motion toggle remain available.
No-JS, reduced motion and pause use the complete three-/two-column grid.
Pausing removes every inline orbital transform; resuming rebuilds them.
Hidden/offscreen scenes stop requesting frames. Galileo's opaque source
still relies on scene-level screen compositing to hide its dark ground.

## Local production validation

Production build at localhost:3001, Chromium on the development Mac.
These are local observations, not field metrics or physical-phone tests.

- Desktop 1440×1000: start, middle, end and fast-scroll state inspected.
- Mobile 390×844: start, middle, end and complete reduced-motion grid.
- EN 320×740 and 720×500 (compact layout equivalent to a 1440×1000 browser
  at 200% zoom): no document horizontal overflow; title and marks readable.
- No JavaScript: ten list items and exact Cal.com header link preserved.
- Direct `#brands` navigation lands with the stage at the viewport top and
  the heading below the header. PageDown advances the orbit; the section
  menu opens by keyboard and Escape closes it and returns focus.
- Chromium touch emulation: a native swipe moves the page 345px and changes
  orbital position, with zero horizontal overflow.
- Slow input (12×12px at 50ms intervals): 0.56° peak additional bank.
  Fast 650px input: 5.39°. Reverse gesture banks in the opposite direction.
- Fast gesture: median interval between paints 16.7ms, p95 17.3ms.
  Zero orbital paints over each 500ms idle and offscreen sample.
- Pause: ten items, no orbital inline transforms. Resume: transforms restored.
- `bun run check`: passed; 20 tests / 62 assertions.
- `bun run build`: passed. Existing encrypted-file tracing and OG dynamic
  font warnings remain outside this section's scope.
- React Doctor changed-code scan: 97/100, no issues.
- Impeccable detector: no primary findings; 43 typography-ramp advisories
  in the landing stylesheet, passed to the finish reviewer.

Captures and detailed measurements are in the ignored
`.impeccable/review/brands/` and `.impeccable/tmp/brands-*.log` directories.

The fresh Impeccable finish review returned **ship** for the scoped brand
orbit, with no material fixes. It assessed all twelve production captures,
source and input measurements. Two reduced-motion captures were replaced
after allowing native scrolling to settle; no navigation code change was
needed. The verdict does not establish award quality or field performance.
