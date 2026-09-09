---
version: 1
slug: "app-lang-page-tsx"
primary_target: "app/[lang]/page.tsx"
related_targets: ["components/landing","components/landing/landing-page.tsx","components/landing/landing-motion.tsx","components/landing/landing.css"]
---

# Homepage — client project enquiries

## Scope and mode

Mode: Persuade. Replace the existing homepage at /en and /it.
User confirmed: clients first, more serious, very little simple copy,
our space identity, personal photo as an image-generation reference,
CTA directly to Cal.com. The cockpit remains the separate playable CV.

## Selected reference

https://www.dungyov.com/ is the user's pinned visual and interaction
reference. Follow its stellar depth, outlined/solid name, suspended
portrait, framing, spacing and discreet section navigation. Adapt content
to Matteo and shorten its nine stations to five. This live reference is
the visual authority; no alternative generated page comp is needed to
replace an already chosen reference. No global buildPath is inferred.

## Direction contract

THESIS: A personal introduction suspended in space, with a direct path to discussing a real project.
OWN-WORLD: Near-black sky, warm ivory typography, orange booking controls and the approved smiling portrait with clear-lens black glasses. Outlined first name, solid surname, thin rectangular frames.
STORY: Meet Matteo, understand websites/apps/AI and pricing, see work relationships, inspect two shipped products, book a call.
FIRST VIEWPORT: Monumental name and concise offer over lunar terrain, with registered cinematic portraits of Matteo and his astronaut alter ego. A refractive glitch changes identity on load and every five seconds. Booking in hero/header; personal portrait introduces services.
FORM: Dungyov lettering, Oakley cinematic layers. Seed 8b53fb21 acknowledged; explicit references override assignment. GSAP scroll drives sticky stages on desktop/mobile; pause/reduced motion use static flow.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Content and functional requirements

Intro / Services / Brands / Work / Contact. Public evidence: Maestro and GymTree
with official App Store screenshots and localized outbound destinations.
No invented social proof, metrics or delivery promises. All meaningful
content is semantic server-rendered HTML. Keyboard, no-JS, reduced-motion
and small screens retain a readable linear route and working links.
Native scroll is never intercepted. Booking links use the owner-confirmed
`https://cal.com/matteo-dante`. No booking or conversion is claimed from a
link click alone.

Owner follow-up: the previous booking deferral is superseded by the
confirmed `https://cal.com/matteo-dante` destination.

## Owner correction: cinematic scroll and media

Latest scoped refinement (2026-09-09): extend the optical glitch to the
hero UI with the existing approved identity and media. Decorative slices
of the name and CTA edge/arrow feedback share the photo's pointer strength
and clock. Keep semantic text, focus and click targets stationary. Touch
is stronger with a cap on text decoration; scroll stays native. The
approved supporting changes are 11px mobile role type, equal hero button
heights, a short mobile header booking label, `#services` navigation and a
160svh hero. Implementation/evidence: `docs/design/hero-ui-glitch.md`.
New video production and animation changes outside the hero remain separate.

The owner found the page pleasant but lacking the required 3D parallax /
scroll-video feel. Oakley Axiom Space is now the authority for media scale
and motion: https://www.oakley.com/en-us/l/axiom-space . Preserve the
current personal visual identity and concise content, replace the motion
architecture. Full motion must run on mobile and short desktop windows;
only reduced-motion preference or explicit pause selects static flow.
Use photographic placeholders in this phase. Video generation with
Replicate is a possible later step, not required now. Temporary source
imagery is documented; no Oakley partnership or work is claimed.
See docs/design/oakley-motion-reference.md for observed mechanics and the
motion thesis. The signature is layered photographic depth and pinned
media scenes, not zooming complete text panels over particles.

## Approved shared language — 2026-09-08

The owner approved unifying both surfaces. Unbounded titles, Space Grotesk
text/actions and monospace telemetry; shared near-black, ivory and orange;
consistent flat controls, thin frames and language navigation.
The cockpit retains its playable astronaut and instrument function while
dropping decorative glow, scanlines and metal fasteners. The landing uses
an Image Gen astronaut based on a reference render of the cockpit GLB,
plus an original generated lunar background. Cal.com now links to `https://cal.com/matteo-dante`. Preserve gameplay, public/private
access, localized content, keyboard/touch and the landing's native scroll.
The approved incumbent landing supplies the visual authority for this scoped
unification; no new direction tournament or replacement comp is requested.

## Owner refinement: character, portraits and CV action

Use an original Image Gen reinterpretation of the astronaut, with the GLB
render as its reference; do not serve the raw render on the landing. Replace
the header orbit symbol with a circular avatar derived from the supplied
real photograph, and remove the same symbol from all three service rows.
The avatar and services portrait must share a realistic, natural face and
confident expression, preserving the owner's recognizable features. Add the
secondary hero action “Gioca al mio CV” / “Play my CV” to the localized cockpit.

## Owner refinement: booking, button and original 3D name

All booking links now use `https://cal.com/matteo-dante`. The secondary
hero CV link is styled as a dark squared button. Cockpit avatar links
return to the localized homepage from intro and active gameplay. Restore
the original orange extruded MATTEO DANTE scene lettering, including its
physical material; this scene-only exception preserves shared UI fonts.

## Owner refinement: service cards and horizontal brands

The three services use squared dark cards. Websites start at 300 €;
apps/software and custom AI are on request. Each card has a secondary
dark booking button opening an animated, themed Cal.com dialog with a
direct-link fallback. The hero CV button still opens the playable CV.

Remove the second hero text chapter “Dall’idea. Al lancio.” and shorten
that scene. Place “Chi ho aiutato” after services. Pilatus, PiùUDITO,
Hexa, DonTouch, Galileo, Fastweb, Sorgenia, GymTree, Maestro and
claude-local-docs appear in a horizontal scroll sequence. Label team,
client, enterprise-project and personal-product relationships accurately.
Use official logos with no visible background; the text-only developer
project keeps its real name. Z1’s process sequence on Awwwards informs
the accelerating horizontal travel and short GSAP scrub. No scroll
interception. Pause/reduced motion/no-JS uses the complete static grid.

## Owner refinement: cinematic identity glitch — original pose, superseded

Create AI-generated Matteo and astronaut portraits in the same folded-arm
pose, camera and lighting. Preserve Matteo's recognizable face and the
astronaut's octagonal ivory helmet, dark visor, orange fittings and chest
hardware. A brief, film-inspired glitch transforms them in both directions
every five seconds, with the first transformation visible on initial load.
The owner delegated technique selection and explicitly requested judgment,
iteration and commit/push after finishing.

Implementation direction: two registered photographic plates, a native
WebGL quad, a textured reveal front, image-derived refraction, temporal
tears and restrained chromatic separation. The effect belongs to the
subject; copy and controls stay stable. Keep existing lunar depth on scroll.
Render only during transitions, suspend offscreen/hidden, share the
existing motion toggle. Reduced motion, blocked assets, unavailable GPU
or lost context leave a fully composed static poster and working CTAs.
No sound, no loading gate, no full-screen flash or synthetic social proof.

The folded-arm pose above records the original direction. The approved
portrait replacement below supersedes its imagery; the motion brief remains.

## Owner refinement: inertial brand orbit — 2026-09-09

Scope: replace only the flat “Chi ho aiutato” rail. Keep horizontal travel,
remove its progress bar and make scroll speed materially change the scene.
The surrounding landing, hero identity and booking flows keep their design.

Focal moment: ten real marks circulate through an inclined spatial orbit.
The nearest mark is large and sharp; distant marks recede behind it. Native
scroll drives angular travel with damped inertia. Fast gestures widen and
bank the orbit, stretch the passing marks, and briefly deepen their focus
falloff. The scene settles fully when the gesture ends and reverses with it.
Continuity: one bounded sticky chapter between services and shipped work;
the complete semantic list returns to a normal grid when motion is paused,
reduced or unavailable. Relationship captions remain attached to each mark.
Feedback: the existing pause and section navigation remain available; no
new meter, carousel controls, scroll interception or autoplay marquee.
Budget: reuse GSAP and CSS perspective, no additional graphics dependency
or media. Paint only while settling and visible; stop when hidden or idle.
Visual authority: the existing space identity, informed by Oaksun Studio's
Awwwards marquee and Houmahani Kane's Codrops Atmospheric Depth Gallery.
This is a code-led motion refinement with no new image comp.

## Owner refinement: opposing scroll-controlled films — 2026-09-09

Media decision superseded later the same day: the owner requested MiniMax
H3 films of a rocket launch and the solar system. Original 6s launch and
Saturn-ring clips now replace the Oakley footage/posters below. Retain
near-black, ivory and amber with light analog/VHS texture, continuous shots
and the existing opposing scroll movement. Generation used text only;
no external media or personal photographs were submitted. Details and
current verification: `docs/design/original-work-video.md`.

Replace only the “Ideas, out in the world” / “Idee diventate prodotti”
introduction with two substantial video planes, one left and one right.
The left descends from above; the right rises from below. Their frames,
internal crop and perspective follow the same reversible GSAP scroll
timeline. Typography occupies a separate readable plane between them.
Remove “Two published apps. Real products you can try.” in both languages.
Keep the real Maestro/GymTree proof links immediately after the sequence.

Reference: Lusion v3 on Awwwards (Site of the Year 2023), for cinematic
media scale, independent type and asymmetric editorial composition.
This is a code-led adaptation within the existing space identity.
No new comp or claims are introduced. Native scroll, pause and reduced
motion remain; both films have static posters and no audible track.

Asset decision: prior generated portraits are still images; the repo's
existing videos are jet footage and an older cockpit recording. Reuse
the previously authorized Oakley Axiom media temporarily: its hero frame
sequence and visor film, locally encoded as two seekable, silent MP4s.
The owner has been informed these are placeholders, not generated originals.
Load videos only as the section approaches; no auto-playing loop, no
offscreen/hidden seeking and no decoder queue. No-JS/reduced mode retains
the composed posters and all project content without requesting videos.

## Owner correction: compact, quiet brand wall — 2026-09-09

The owner rejected the orbital carousel. Replace it completely with a
compact, elegant wall: three slow automatic rows moving right, left, right.
Repeated marks are explicitly allowed. No horizontal scrolling tied to
page input, no sticky stage, no progress bar and no 3D/skew/depth effects.
The surrounding Work film sequence and hero keep their approved behavior.

Focal moment: a dense but calm field of real white marks with consistent
optical weight, generous space between neighbors and soft edge fades.
The heading becomes smaller so the whole section reads within one viewport.
Continuity: native vertical flow; the three belts loop seamlessly and move
at a restrained constant speed. Scroll merely reveals the section.
Feedback/budget: existing pause and reduced-motion preferences switch to
a complete static list. Only three CSS transform animations run, paused
when offscreen or hidden. No GSAP brand trigger or animation-frame loop.
The visual repetitions are hidden from assistive technology; one canonical
list exposes all ten real names and accurate relationship captions.

Implemented state: 130s / 140s / 125s CSS loops, with repeated runs and
soft edge fades. The canonical list uses four desktop columns and two
below 800px when static. The current source and local evidence are recorded
in `docs/design/brand-wall.md`; the earlier orbit brief above is superseded.
The fresh scoped finish review returned **SHIP** after all seven final
desktop/mobile, compact, reduced-motion and no-JavaScript captures, with
no material fixes. This is a local brand-wall review, not an award or
field-performance claim. No new comp, asset or provenance change was needed.

### Owner refinement: gentle scroll impulse — 2026-09-09

Preserve the compact wall and its right/left/right loops. The owner now
requests a light acceleration in response to native vertical scroll.
Scroll speed adds a bounded playback-rate impulse (maximum 2.25×), with
160ms attack and 1.1s return to the slow baseline. Position and direction
stay continuous. Use the existing GSAP for short rate tweens and native
Web Animations rate updates; no sticky geometry or scroll interception.
Pause/reduced/no-JS retain the canonical grid; offscreen/hidden cancels
impulses and pauses the loops. This supersedes constant-speed-only wording
above, preserving all composition and product truth.

The fresh scoped scroll-impulse finish review returned **SHIP**, with no
material fixes. Desktop/mobile captures preserve the approved composition;
local rate, touch, pause and offscreen checks passed. Validation is recorded
in `docs/design/brand-wall.md`. No layout, CSS, copy or assets changed.

## Owner refinement: cursor and touch identity wake — 2026-09-09

Add a local refractive glitch following the pointer over the portrait,
including tap and touch drag. Keep the five-second automatic identity
sequence, scroll depth, copy and controls. Social previews now use Matteo
himself, not the astronaut; that change does not remove the hero astronaut.

Focal moment: a soft irregular glitch distorts only the visible identity
beneath the cursor or finger. Hover already responds; dragging with mouse
or touch produces stronger refraction and chromatic tearing at the same
speed. The owner explicitly rejected revealing the identity underneath.
A short trailing response settles fully.
Continuity: the existing five-second sequence is unaffected. Input stops
producing energy when still; settled GPU drawing returns to timer sleep.
Feedback: tap creates an impulse, dragging updates it. Passive touch input
preserves native scrolling and pinch zoom. Links and controls are excluded.
Budget: the existing quad and two textures, no new asset, graphics library,
permanent animation loop or input capture. Pause, reduced motion, hidden or
offscreen state and lost context clear the interaction and keep fallbacks.

QUALITY BAR: local image-derived refraction and recognizable settled faces;
clear connection to pointer/finger; no whole-page flash or moving copy;
no blocked scrolling, pinch zoom, keyboard navigation or booking action.
Implementation is prepared. Browser inspection and independent hero finish
review are pending: the Mac is locked, and the owner will unlock it at 18:00.

The owner authorized commit and push with the browser pass still deferred
until the Mac is unlocked. Keep that verification boundary explicit.

Owner correction: touch must be much stronger. Use a distinct 2.6–3.8
strength range and a wider local distortion field, retaining mouse hover
0.32–0.55 and mouse drag 0.72–1. No identity reveal or input capture.

## Owner refinement — additional evidence

Add this website and the cockpit as one personal project, beside PiùUDITO.
Use real existing homepage/gameplay captures, clear personal authorship and
localized links to explore the work. Homepage places it between PiùUDITO
and the existing app pair; website development places it after the PiùUDITO
proof paragraph. A compact company-team section presents the public roles
at Pilatus Aircraft and DonTouch; no corporate screenshots or private scope.

Inherit the current editorial proof-row and flat-control language. No new
visual world, animation, client claim or generated screenshot. Touch and
keyboard links stay native; cockpit prefetch stays off. Current source and
HTTP verification live in `docs/design/portfolio-evidence.md`. Browser
validation remains pending while the owner's Mac is locked; existing
captures document the projects and do not validate this new section layout.

## Owner refinement — approved portrait replacement — 2026-09-09

Use the selected `assets/portrait-options/matteo-a-real-reference.png` to
replace the current site portraits. Preserve its recognizable smile,
clear-lens black glasses, black T-shirt and relaxed arms at the sides.
The runtime human plate is that exact approved master resized to 960 × 1200
and encoded as `matteo-portrait-v3.webp`; hero, services and Person schema
share `PERSON_IMAGE_PATH`. Services keep the existing 7:8 CSS frame.

The shared avatar is a square Image Gen headshot edit of the approved
master. The matching astronaut plate follows its open posture. Social
previews retain the existing lunar composition and typography, using the
approved human identity; all twelve localized image URLs carry
`?v=portrait-3`. Icons derive from the same avatar. Renderer, timing,
pointer behavior, page composition and historical proof captures retain
their existing scope. Prompts and processing are recorded in
`docs/design/portrait-provenance.md` and adjacent asset origins.

The independent finish review returned **SHIP for static assets and social
cards only**, with all five review sections completed and no fixes. Local
checks, build, provenance and production HTTP verification passed. Evidence
is in `.impeccable/review/portrait-integration/` and its corresponding
`.impeccable/tmp/portrait-integration/` logs. Fresh desktop/mobile layout,
animated plate registration, cursor/touch, fallback and GPU behavior remain
pending: Computer Use confirmed the Mac was still locked this turn. Older
reviews and historical portfolio screenshots do not validate these changes.
No public deployment, commit or push is included in this replacement.


## Owner correction — explicit hero and portrait references

This supersedes the portrait-replacement pose above and the rejected wider
services edit. Photo 1 from attachment A7C4C9E2 supplies the hero's exact
smiling face and clear black glasses. Photo 3 supplies actual body
proportions only. Return to the original wider folded-arm hero composition,
plain black T-shirt and flat near-black background, without the gray wall.
The old generated human plate supplies only pose, framing and lighting.
Restore its folded-arm astronaut counterpart; preserve renderer and inputs.

Photo 2 was the services portrait reference: close head-and-shoulders crop,
black and white, expression only slightly more relaxed, faithful face and
glasses. Keep the existing 7:8 frame at 220px/150px with its thin outline.
Use separate image assets. Avatar and social artwork retain their current
versions while these two photographs are refined. Person metadata follows
the current color hero asset.

The owner explicitly deferred updating the matteodante.it project preview
until the overall design is settled. Keep that real historical screenshot
as it is in this pass. Current browser validation remains pending while
the Mac is locked; no older capture validates the new photograph.

The owner subsequently approved the hero: "Foto hero perfetta". Preserve
that image and its counterpart. For services, replace the Photo 2 reference
with the man on the left in attachment B7F1C78D, preserving his authentic
smile without glasses. Keep close-up framing, monochrome, black T-shirt,
near-black background and the existing 7:8 services frame.

## Approved release — both portraits and sharing

The owner approved both latest photographs and authorized final integration,
commit and push. Keep the hero and services images exactly as approved.
Use the color hero directly in all twelve EN/IT social images, with existing
fonts and copy; derive the shared avatar/icons from the approved monochrome
close-up using CSS image layout, without another generative face edit.
The project card now uses the actual localized social cover, explicitly
described as a cover, alongside the existing real cockpit screenshot.
Mac lock prevents a fresh browser capture; no synthetic UI screenshot.
Owner exception: retain the previous photograph in all CV documents and
their original profile-pic.jpeg source.

## Approved rollout — black-polo hero and matching close-up

The owner approved the new natural standing hero with glasses, then clarified
that the polo must be black in this HERO image. Crop above the shorts length.
The owner rejected the suit portrait, asking for the same natural confidence
as the hero. He approved a close-up generated directly from the approved
black-polo hero: the same glasses, smile, polo and natural color, on a
near-black background. Services now uses
`matteo-services-hero-closeup-v1.webp` in its existing 7:8 frame. Remove the
unused suit candidate from public assets; keep its generated master.

The owner approved the remaining rollout and requested commit/push. Hero
and Person schema share PERSON_IMAGE_PATH; all twelve OG/Twitter images and
localized project covers use the exact hero. The shared avatar, favicon,
Apple/manifest icons and standalone profile-photo derive from the approved
color close-up through square CSS framing. No new face is generated.
The original CV photo/PDFs, existing astronaut and shader remain unchanged.
Exact prompts and framing are in `assets/portrait-options/polo-preview.json`.
Versioned social URLs use portrait-5. See `docs/design/identity-release.md`.

Previous local verification (2026-09-09): the Mac was unlocked and both sections were
inspected in the in-app browser at 1440×900 and 390×844. The hero keeps the
shorts out of view and alternates with the astronaut; the services portrait
is in color with a jacket and white shirt. No horizontal overflow or browser
errors/warnings were observed. Captures are in
`.impeccable/tmp/polo-preview/{desktop,mobile}-{hero,services}.png`.
`bun run check` and `bun run build` passed. Static design checks report
45 existing advisories; React Doctor found no issues in the two changed
components. Both localized pages and image URLs return HTTP 200; served
image bytes match the new files. Shared social assets and CVs are unchanged.

Close-up replacement verification (2026-09-09): the approved hero-derived
portrait was inspected at 1440×900 and 390×844 with its full hairstyle,
glasses, smile and black polo visible. Image loading and color rendering
passed, with no horizontal overflow or console warnings/errors. Captures:
`.impeccable/tmp/polo-preview/closeup-{desktop,mobile}.png`.
`bun run check` (36 tests, 502 assertions) and `bun run build` passed.
The shared avatar, social images, hero and CV were not changed in this step.


## Owner refinement — depth at 2K — 2026-09-09

Keep the approved identity and media subjects. Make Services emerge upward
in perspective; widen the services/project composition, give the brand
wall more bottom space, retain complete film frames, and separate cinema
from real work. Introduce the gallery with a localized title and lead
with matteodante.it + Cockpit. Treat all four project media presentations
with individual scroll depth. Replace the final landscape still with an
original, quiet Replicate loop, retaining its static fallback.

Selected implementation: CSS perspective and the existing GSAP lifecycle,
without another WebGL renderer or scroll interception. The commercial
proof rows and original CV photo stay unchanged. The selected geometry,
research and bounded desktop/mobile review live in
`docs/design/depth-release.md`. This refinement supersedes the earlier
1040px layout, cropped films and PiùUDITO-first gallery order.
