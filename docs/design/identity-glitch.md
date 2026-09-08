# Hero identity transformation

## Direction

The owner requested a cinematic identity glitch on initial load, then an
astronaut/Matteo transformation every five seconds. The visual subject is
the same person in two states: folded arms, matched camera, warm rim light
and registered head/shoulder positions. The headline, offer and booking
controls remain still while the subject transforms.

The implementation uses two Image Gen plates and one native WebGL quad.
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

The generated WebP pair totals 199,564 bytes, excluding provenance.
This is an asset transfer count, not a field-performance score.
The landing's two cockpit links disable automatic route prefetching:
production inspection showed it was also fetching the game's 2.1 MB GLB
before a click. The cockpit keeps its own asset preload when opened.

## Generated assets and provenance

`public/landing-v2/identity/matteo.webp` and `astronaut.webp` are 960 ×
1200, WebP quality 90. The source PNGs were 1122 × 1402. Only resizing
and format conversion occurred outside Image Gen. These are opaque
dark-background photographic plates, not transparent cutouts. Their
frame edges blend into the scene through CSS; the subject is not
approximated by a geometric cutout.

Matteo's source is the owner's supplied real photograph. The astronaut
uses the first generated Matteo plate for pose registration and the
existing generated astronaut for its design. Initial generations had a
baked checkerboard; a precise Image Gen background edit replaced it with
the shared dark studio surface. Those intermediate files are not served.
The adjacent `.origin.json` files record both prompts and source paths;
`.webp.json` files carry the exact final edit prompt for Impeccable.

The original full-body astronaut remains in the work scene and the
cockpit Three.js model is unchanged.

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

## Validation and finish review

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
