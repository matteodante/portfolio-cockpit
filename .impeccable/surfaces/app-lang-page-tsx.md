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
OWN-WORLD: Near-black sky, warm ivory typography, orange booking controls and amber portrait glasses. Outlined first name, solid surname, thin rectangular frames.
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

## Owner refinement: cinematic identity glitch

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
