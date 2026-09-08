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
to Matteo and shorten its nine stations to four. This live reference is
the visual authority; no alternative generated page comp is needed to
replace an already chosen reference. No global buildPath is inferred.

## Direction contract

THESIS: A personal introduction suspended in space, with a direct path to discussing a real project.
OWN-WORLD: Near-black sky, warm ivory typography, orange booking controls and amber portrait glasses. Outlined first name, solid surname, thin rectangular frames.
STORY: Meet Matteo, understand websites/apps/AI, inspect two shipped products, book a call.
FIRST VIEWPORT: Monumental name and concise offer over lunar terrain, with an oversized helmet in the foreground. Booking in hero/header; personal portrait introduces services.
FORM: Dungyov lettering, Oakley cinematic layers. Seed 8b53fb21 acknowledged; explicit references override assignment. GSAP scroll drives sticky stages on desktop/mobile; pause/reduced motion use static flow.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Content and functional requirements

Intro / Services / Work / Contact. Public evidence: Maestro and GymTree
with official App Store screenshots and localized outbound destinations.
No invented social proof, metrics or delivery promises. All meaningful
content is semantic server-rendered HTML. Keyboard, no-JS, reduced-motion
and small screens retain a readable linear route and working links.
Native scroll is never intercepted. Booking URL is still awaiting the
owner's exact link; the UI must not claim a functioning booking funnel
until that URL is supplied and verified.

Owner follow-up: Cal.com setup is explicitly deferred to a later session
together. Continue reviewing and improving the site now; do not treat
the missing booking URL as a blocker or request it again in this phase.

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
plus an original generated lunar background. Cal.com remains deferred. Preserve gameplay, public/private
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
