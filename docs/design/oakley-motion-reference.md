# Oakley Axiom motion adaptation

The owner rejected the previous homepage's lack of cinematic 3D scroll,
especially on their phone. New motion/media reference:
https://www.oakley.com/en-us/l/axiom-space . Keep Matteo's own typography,
orange/ivory identity, concise EN/IT copy and real project evidence.
Cal.com is explicitly deferred. Use image placeholders now, no generated
video or Replicate spend in this phase.

## Observed reference

Inspected desktop 1280x720 / 1440x900 and mobile 390x844 in the browser.
The hero is a 300vh native-flow section with a sticky 100vh stage. Its
canvas plays a scroll-controlled sequence, observed frames 00000–00170:
an extreme visor close-up pulls back to the astronaut and lunar surface.
Hero text is overlaid, with independent vertical offset and opacity.
A lunar panorama then moves independently of a centered heading.
The next composition pins a transparent profile of the helmet on the
right (60% desktop width, 100% mobile), while images/text pass beside it.
Computed desktop padding80px/mobile24px, photo panels30vw/100%, body14px,
headings80px/60px and32px mobile. Fonts are Garamond Narrow and Avenir.
Those fonts and Oakley branding are not adopted by the portfolio.
Source CSS saved in .impeccable/tmp/oakley/main.css; inventory assets.json.
The hero's very dark first frame is intentional, not missing media.

## Adapted motion thesis

Focal moment: pass the helmet in the foreground and approach a lunar
landscape. A large transparent image, panorama and typography occupy
separate depth planes. Native scroll drives the camera; it reverses
when the user scrolls back. A second full-screen media scene pulls back
from a visor to introduce the real products. Contact closes on the moon.
Continuity: sections remain in document flow, with native anchor links.
Feedback: pause control and current section; no hidden booking claim.
Budget: static optimized image placeholders, CSS transforms and opacity,
GSAP ScrollTrigger with a 0.3-second scrub response. Canvas
stars remain subtle and scroll-driven. Full motion works on phone and
short desktop windows. Reduced motion and pause retain static imagery,
readable text and working links. No viewport-width cutoff for animation.

## Motion engine component specification

Target: components/landing/landing-motion.tsx. Existing props remain.
Own this file only. Parent owns page markup, CSS, imagery and copy.
Root keeps .landing + font className. Existing section nav/menu, progress,
scroll hint and pause labels stay; keyboard Escape/focus return stay.
Remove old data-flight panel scaling/inert behavior entirely. Normal
sections are no longer fixed or inert. Set data-interactive after setup.
Set data-cinema=true unless prefers-reduced-motion or user paused.
No width/height threshold. Canvas stars may be reduced to ~700 subtle
points and move only on scroll (no idle animation), bounded DPR<=1.5.

Two elements [data-cinema-scene] are measured. Each has a .cinema-stage
child. Parent CSS gives scenes300svh/230svh and stages sticky100svh only
under data-cinema=true. Progress = clamp((scrollY - absoluteSceneTop) /
(sceneHeight - stageHeight),0,1). Set --scene-progress on each scene.
CSS implements layer transforms from that variable; do not set their
styles individually. Smooth progress with GSAP ScrollTrigger scrub: 0.3, ease: none. There is
no application-owned RAF loop. Respect document.hidden and resume accurately.
Elements [data-parallax] get --parallax-progress = clamp((scrollY + vh -
absoluteTop)/(elementHeight + vh),0,1), likewise smoothed. CSS owns effects.
Update nav current from real section offsets, including tall scenes.
Progress rail uses total document scroll range. Hint visible only near
page start. Header may receive data-scrolled for its background after80px.
On mode change remove scene/parallax inline vars so base CSS is the static
fallback. Preserve current section when heights change; don't constantly
scrollTo on phone address-bar resize. Re-measure on window resize and
image/font layout changes via ResizeObserver on main, with full cleanup.
No scroll/touch/wheel prevention. Navigation remains native next/link.
GSAP 3.15 is the single animation dependency, added following the owner’s
explicit research request. CSS handles sticky positioning; no pin spacers
or Lenis scroll interception. Typecheck scoped changes before return.

## Research and temporary assets

Official references: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
and [image-sequence scrubbing](https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/).
ScrollTrigger maps native scroll to reversible animation progress. For a
future true camera sequence, a canvas frame sequence offers deterministic
frame selection; the present prototype moves still-image depth layers.
It does not yet play or scrub video.

The owner also authorized temporary reference video if useful. No video
was needed for this placeholder pass and no generation was purchased.
The three WebP placeholders in public/landing-v2/placeholders come from:

- https://media.oakley.com/2025/Axiom/01_moon_D.jpg
- https://media.oakley.com/2025/Axiom/02_astronaut_side_D_2.png
- https://media.oakley.com/2025/Axiom/Hero_D/fbf/Hero_D_00170.jpg

Fetched through the browser’s page-asset export on 2026-09-08. Originals
were resized and encoded as WebP; the helmet retains its original alpha.
They are local prototype media to replace with owned imagery, not portfolio
work or evidence of an Oakley relationship. Each carries embedded provenance.
