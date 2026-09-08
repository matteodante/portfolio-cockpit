# Homepage replacement — Dungyov reference

User-approved source: https://www.dungyov.com/ (corrected by the user).
Destination: existing /en and /it homepage in this repo. Replace the
old cinematic landing. Keep /[lang]/cockpit and private APIs intact.
Use existing components/landing; new assets: public/landing-v2.
Reference captures: .impeccable/review/reference/ (local review artifacts).

## Direction and adaptation

The user's reference pins composition and interaction: a dark stellar
field, a large outlined first name over a solid surname, a suspended
portrait to the right, depth travel with scroll, discreet fixed chrome,
section picker bottom-left and thin progress rule at the right.
Our identity supplies Matteo, deep-space #05060a, warm ivory #f2ede3,
orange #ff6b35, the provided photo, and the existing cockpit.
User asks for more serious client-facing copy, little text, and direct
Cal.com booking. This overrides the old playful landing copy/hero clip.
No invented metrics, client logos, endorsements or availability.

## Measured reference

DOM at 1280×720: body #121010, Space Grotesk; WebGL canvas fills viewport.
Fixed internal scroller: 15840px (22 viewport heights); source has nine
stations every 34 world units. Each station flies towards/past camera.
DOM header: top 28px, horizontal 32px; brand 15px, weight 300, tracking
.06em. Bottom section nav: left32/bottom30, 11px uppercase/.28em.
Progress: right32, height38vh, width1px, vertically centered.
Display: Unbounded 900, hero world font size .98, x=-4.8; outlined
first line and filled second. Portrait 2.5×2.5 world plane, x=3.7,
y=.1, z=.4, y-rotation -.18; offset thin rectangular border and idle float.
Mobile (<640): header18px, portrait above left-aligned name; first line
.78 world units, roles .3, overall x=-2.55. Reference screenshots show
390×844 intro with portrait centered above type and four short role lines.

## Page topology for Matteo

Four stations: Intro, Servizi/Services, Progetti/Work, Parliamone/Contact.
Keep a Cal.com CTA in header + hero + close; direct project links; cockpit
is a secondary link. Use semantic SSR text/links instead of canvas text.
Progressive enhancement applies depth transforms to those same panels;
no-JS/reduced-motion/short viewports retain readable normal-flow sections.
The stellar field remains a lightweight procedural Canvas 2D perspective
simulation, independent from the existing Three.js cockpit.

## Interaction specification: landing-motion.tsx

Own ONE file: components/landing/landing-motion.tsx.
Client default export LandingMotion accepts children:ReactNode,
className:string, sections: readonly {id:string;label:string}[], and
labels:{navigation:string;section:string;scroll:string;pause:string;resume:string}.
Wrap children in div class `landing ${className}` with a ref. Canvas
`.landing-stars` fixed/full viewport/aria-hidden/pointer-events:none.
Server markup uses `section.flight-stop` IDs, containing `.flight-panel`.
Enhanced root data attribute `data-flight="true"`; otherwise normal flow.
Each stop occupies 125svh; last 100svh. Fixed panels fill viewport; parent
CSS will switch them to fixed on data-flight, with transform-origin center.
At each stop's scroll offset its panel is identity transform. Between
stops, prior panel enlarges/fades while next approaches from depth.
Keep content readable while settled: use a short plateau and eased travel.
Set style transform and opacity imperatively in RAF, not React each frame.
Hide/disable inactive panels using visibility and inert; never leave an
invisible overlay intercepting input. Cleanup restores all attributes/style.
Normal flow for prefers-reduced-motion, viewport <740px high or <800px wide,
explicit pause choice. Native scrolling remains available, no wheel interception.
On view-mode switch preserve current station through its new flow offset.
Canvas uses seeded particles, white/ivory with occasional orange, concentration
in a diagonal band, perspective z changes on scroll and restrained idle
motion. Cap DPR1.5/particle count, stop RAF when page hidden; reduced motion
gets static stars. Canvas support failure must not block semantic content.
Fixed `.landing-section-nav`: toggle button + ol links to section anchors,
aria-expanded, aria-controls, Escape closes/returns focus; native links work.
A fixed `.landing-progress` child span uses scaleY progress. A fixed
`.landing-scroll-hint` text with thin animated line may hide after intro.
A `.landing-motion-toggle` button chooses pause/resume; when media query
requires reduced motion do not present a misleading resume control.
Each control gets a meaningful label and visible focus (CSS parent).
Default hero remains SSR visible. No loading gate, no third-party deps,
no global context/state, no imports except React and next/link.
Use React19 refs, @/* imports, Bun/tsgo/Biome repo conventions.
