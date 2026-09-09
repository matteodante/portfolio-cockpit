# Hero identity transformation

## Direction

The owner requested a cinematic identity glitch on initial load, then an
astronaut/Matteo transformation every five seconds. The visual subject is
the same person in two states. The current owner-approved portrait has
relaxed arms at the sides, a natural smile and clear-lens black glasses;
the astronaut follows its camera and head/shoulder placement. The headline, offer and booking
controls remain still while the subject transforms.

The implementation uses two photographic plates and one native WebGL quad.
A textured reveal front, displacement derived from image luminance,
refractive ripples, local temporal echoes and brief horizontal tears
provide the transition. Chromatic separation is restricted to the event.
The settled photographs receive no shader color treatment. The second
craft pass reduced broad RGB tearing and added refraction that follows
the actual visor and face detail.

## Timing and rendering budget

- A clean astronaut poster is server-rendered immediately.
- After the effect is ready and visible, the first transformation starts
  at 650 ms and lasts 1120 ms. Subsequent starts are five seconds apart;
  directions alternate. Pauses do not accumulate missed transitions.
- Timers sleep through the settled frames. `requestAnimationFrame` runs
  during the transformation; resizing can redraw a settled frame.
- Offscreen and hidden-document rendering is suspended. The existing
  motion toggle and reduced-motion preference select the static poster.
- A failed image/module, unavailable GPU or lost context also preserves
  the poster. The landing's text and links never depend on the shader.
- Pixel ratio is capped at 1.5. No Three.js import, video decoder,
  additional runtime package, sound, full-screen flash or loading gate.

The current WebP pair totals 194,470 bytes, excluding provenance.
This is an asset transfer count, not a field-performance score.
The landing's two cockpit links disable automatic route prefetching:
production inspection showed it was also fetching the game's 2.1 MB GLB
before a click. The cockpit keeps its own asset preload when opened.

## Generated assets and provenance

`public/landing-v2/matteo-portrait-v3.webp` and
`public/landing-v2/identity/astronaut-v2.webp` are both 960 × 1200,
respectively 75,748 and 118,722 bytes. The human plate is the exact approved
`assets/portrait-options/matteo-a-real-reference.png`, resized and encoded
without another generative edit. These are opaque
dark-background photographic plates, not transparent cutouts. Their
frame edges blend into the scene through CSS; the subject is not
approximated by a geometric cutout.

Matteo's approved master is a photographic edit based on his supplied real
photos. The new Image Gen astronaut uses that approved master as its pose
reference and the previous astronaut as its character reference. Both now
have relaxed arms at their sides. The old folded-arm runtime plates were
removed; their source history remains in Git and the generated masters.
The adjacent `.webp.origin.json` and `.webp.json` files record prompts,
source paths and processing. `assets/portrait-options/site-integration.json`
records the exact integration prompts; see [portrait-provenance.md](portrait-provenance.md).

The original full-body astronaut remains as a source asset, not the current
hero or Work image. The cockpit Three.js model is unchanged.

## Research references

- [Red Giant: Chromatic Displacement](https://www.youtube.com/watch?v=u8WcvHcvlcI):
  image-driven refraction and color separation informed the optical treatment.
- [Video Copilot: Colorful Glitch FX](https://www.videocopilot.net/tutorials/colorful_glitch_fx/):
  procedural distortion informed the brief temporal tearing.
- [Codrops: Creative WebGL Image Transitions](https://tympanus.net/codrops/2019/11/05/creative-webgl-image-transitions/):
  texture sampling and UV displacement informed the browser implementation.
- [Codrops: Animating WebGL Shaders](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/):
  bounded shader transitions informed the rendering approach.

No external footage, tutorial code or paid plug-in is redistributed.

## Earlier validation and finish review — before the 2026-09-09 portrait replacement

This review covers the former folded-arm plates and predates the cursor,
touch and approved-portrait changes below. It does not validate the current
images in the browser or their animated registration.

Verified in an isolated Chromium browser against the local app, including
1440×900 desktop, 390×844 mobile, 320×740 narrow layout and a 720×450 CSS
viewport equivalent to 200% layout at desktop size. The user's Mac was
locked; these tests did not depend on the foreground desktop session.

- Both clean states and two transition phases captured on desktop/mobile.
- No horizontal overflow; copy and both hero actions remain readable.
- Paused/reduced-motion poster and complete static brand grid verified.
- Forced GPU context loss preserves the poster even after pause/resume.
- No-JavaScript poster and all three direct service booking links work.
- Offscreen and idle shader draw counts were both zero during observation.
- All three booking dialogs open and close; focus returns to the trigger.
  Real calendar content loaded on desktop/mobile. No booking was submitted.
- Production starts: 0.6656, 5.6654 and 10.6651 seconds in the measured run.
  Median active frame interval 16.7 ms, p95 18.3 ms in the test browser.
  This is local frame scheduling evidence, not a physical-phone benchmark.
- Production loading check: no astronaut GLB before clicking the CV link;
  the model loads after navigation to `/it/cockpit`.

`bun run check` passed Biome, TypeScript and 20 tests; `bun run build`
passed. React Doctor reported no diagnostics in changed files, score
75/100 unchanged. Impeccable detector: zero primary findings and 43
advisory typography-ramp findings. Provenance scan: 19 rasters, none
missing. Existing Next file-tracing/OG-font warnings remain. Local
production also reports expected missing Vercel analytics endpoints,
which are provided by Vercel hosting rather than `next start`.

The independent reviewer inspected 22 valid captures and identified no
material visual correction in the scoped hero/services/brands work.
Its sole documentation finding was corrected by the documenter, then
scored resolved in the targeted `ship` verdict. Review evidence and logs
live in ignored `.impeccable/review/glitch/` and `.impeccable/tmp/`.

## Cursor, tap and drag refinement — prepared 2026-09-09

The owner requested local cursor interaction, then explicitly added tap
and touch drag. The owner then clarified that input must distort the
visible photograph, never reveal the identity underneath. Hover works
without pressing; dragging with mouse or touch is distinctly stronger.
`identity-pointer.ts` distinguishes hover (0.32–0.55), mouse drag (0.72–1)
and touch (2.6–3.8), with movement-speed response, 55ms position following
and a 190ms
exponential decay. Once below 0.008, the interaction
becomes exactly zero so the shared renderer can sleep again.

The existing quad receives pointer position and strength. An irregular
local lens distorts the visible identity with image-derived refraction,
limited tearing, grain and chromatic separation. Pointer position and
strength never alter the identity blend; only the independent five-second
timeline does. Pixels outside the wake keep
the clean photograph when the automatic transition is idle. No additional
media, graphics library, custom cursor or page-wide overlay is introduced.

Mouse movement, primary pointer down and passive single-touch movement
feed the same effect. Touch release leaves the short decay; passive
`touchmove` continues through native scroll’s pointer cancellation. Multiple
fingers clear the wake. No preventDefault, pointer capture or touch-action
override is added, so native scrolling and pinch zoom retain ownership.
Link/form/control targets are excluded. Mouse exit, window blur, input-mode
change, offscreen/hidden, pause and lost context clear the pointer state.

Pointer input wakes the existing timer/RAF scheduler; it does not create a
second permanent loop or reset the five-second automatic identity timeline.
The shared cinema flag still controls pause and reduced motion.

### Verification boundary — cursor/touch preparation

Pure timing tests cover tap decay, stronger but bounded fast movement,
position following, immediate reset and resuming without an old trail.
These tests verify the input envelope, not visual rendering or browser
interaction. Current browser capture, touch-scroll behavior, GPU frame
budget, motion fallback and independent visual finish review remain
pending. Computer Use reports the Mac locked; the owner confirmed they
will unlock it at 18:00. The previous review above predates this refinement
and must not be presented as approval of the new interaction.

Next browser pass: desktop and mobile together, both identity states,
mouse hover/fast movement, tap/drag and native scroll/pinch zoom, CTA clicks,
keyboard focus, pause/reduced motion, offscreen/hidden and settled GPU idle.
Capture the new states and hand them to a fresh Impeccable finish reviewer.

Automatic checks for this preparation: `bun run check` passed (30 tests,
175 assertions) and `bun run build` passed. Impeccable’s scoped detector
reported zero primary findings; its only advisory concerns the existing
social-card subtitle shade. The refreshed local production preview serves
the updated code and all twelve portrait-based social cards.

React Doctor’s changed-file scan reported an observer-cleanup error.
A direct scan of both the exact HEAD component and the changed component
reported the same `effect-needs-cleanup` message for `observe`. This is a
pre-existing analyzer limitation around the async setup’s assigned cleanup:
the returned effect callback invokes `cleanup`, which cancels timer/RAF,
disconnects all three observers and removes every registered listener.
The `destroyed` guard also stops setup after unmount during image loading.
No suppression or tooling configuration was added. Comparison evidence:
`.impeccable/tmp/cursor-glitch/cleanup-comparison.json`. Runtime lifecycle
verification remains part of the deferred browser pass.

The owner explicitly requested commit and push before the deferred browser
pass. This authorization does not turn pending visual checks into a pass.

### Stronger touch correction

The owner requested a much stronger touch effect after the first push.
Touch now supplies more than three times the mouse-drag shader strength
for the tested matching gestures, while mouse hover/drag keep their ranges.
The shader widens the interaction radius above strength 1, reaching 0.402
instead of 0.22 texture units. This makes distortion visible around the
finger instead of hiding most of it beneath the touch point. The radius
shrinks with the same decay; the identity blend remains timer-only.
A touch impulse still becomes exactly zero within 1.2 seconds after input
stops. Returning to mouse input immediately restores its lower range.
No scrolling, zoom, controls, assets or identity timing behavior was changed.
Browser visual validation remains deferred to the owner's Mac unlock.

Stronger-touch checks: `bun run check` passed with 31 tests and 191
assertions; `bun run build` passed. The scoped Impeccable detector found
no primary issues. The mouse/touch comparison test includes rest, slow and
fast movement, decay back to zero and switching back to mouse input.

## Approved portrait integration — 2026-09-09

The owner selected `assets/portrait-options/matteo-a-real-reference.png`
and authorized replacing the site's existing portraits. The updated pair
changes the textures and localized image descriptions only; the renderer,
five-second timeline and mouse/touch behavior are unchanged. The services
portrait and Person schema now share the same human image through
`PERSON_IMAGE_PATH`, with services retaining its existing 7:8 CSS frame.

The independent finish review inspected the current static assets and all
twelve social outputs and returned **SHIP for static assets/socials only**,
with all five review sections and no fixes. Evidence lives in
`.impeccable/review/portrait-integration/`; this includes `home-it.png` and
all `{page}-{it,en}-small.png` social captures. No new browser capture was
made: Computer Use confirmed the Mac remained locked this turn. Desktop
and mobile layout, animated registration, cursor/touch scrolling, motion
fallbacks, GPU idle and frame-budget checks remain pending. Historical
portfolio screenshots show the earlier UI and are not layout validation.

Local verification passed: `bun run check` (31 tests, 191 assertions),
`bun run build`, and production HTTP checks for the new asset paths,
dimensions and hashes, homepage image descriptions, Person schema,
optimized services portrait, all twelve social outputs and metadata,
legacy image routes, invalid-path 404s, manifest icons and favicon payload.
The provenance scan found 31 rasters with no missing records. Impeccable
reported zero primary findings and 45 existing typography advisories;
React Doctor retained the existing `marketing-page.tsx` complexity warning
and score 63 from the earlier uncommitted proof work. Logs are in
`.impeccable/tmp/portrait-integration/`. These are local checks; the public
deployment has not been updated or verified for this replacement.
