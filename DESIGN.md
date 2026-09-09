---
name: Portfolio Cockpit
description: One stellar identity for Matteo Dante’s client landing and playable cockpit
colors:
  thruster-orange: '#ff6b35'
  deep-space: '#05060a'
  ivory-suit: '#f2ede3'
  panel-light: '#14161c'
  hud-green: '#6aff9e'
  hud-amber: '#ffb347'
  hud-red: '#ff5252'
  hud-blue: '#00d9ff'
  thruster-orange-hover: '#ff8458'
  thruster-orange-disabled: '#d77845'
  muted-text: '#a7a5a1'
  frame-line: '#f2ede333'
  panel: '#0c0d11'
  booking-surface: '#101010'
typography:
  display:
    fontFamily: var(--font-unbounded), Unbounded, sans-serif
    fontSize: clamp(62px, 7.2vw, 96px)
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: 0.005em
  headline:
    fontFamily: var(--font-unbounded), Unbounded, sans-serif
    fontSize: clamp(27px, 3vw, 42px)
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: var(--font-body), Space Grotesk, sans-serif
    fontSize: 20px
    fontWeight: 500
  lead:
    fontFamily: var(--font-body), Space Grotesk, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
  body-copy:
    fontFamily: var(--font-body), Space Grotesk, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
  body-copy-mobile:
    fontFamily: var(--font-body), Space Grotesk, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: var(--font-body), Space Grotesk, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: var(--font-body), Space Grotesk, sans-serif
    fontSize: 12px
    fontWeight: 400
  instrument:
    fontFamily: var(--font-jetbrains-mono), JetBrains Mono, monospace
rounded:
  none: 0px
  control: 2px
  screenshot: 4px
  circle: 50%
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: '{colors.thruster-orange}'
    textColor: '{colors.deep-space}'
    rounded: '{rounded.control}'
    padding: 14px 24px
  button-primary-hover:
    backgroundColor: '{colors.thruster-orange-hover}'
    textColor: '{colors.deep-space}'
  brand-button-primary-disabled:
    backgroundColor: '{colors.thruster-orange-disabled}'
    textColor: '{colors.deep-space}'
  button-nav:
    backgroundColor: '{colors.thruster-orange}'
    textColor: '{colors.deep-space}'
    rounded: '{rounded.control}'
    padding: 10px 16px
  link-text:
    textColor: '{colors.ivory-suit}'
    padding: 12px 0
  hero-play:
    backgroundColor: '{colors.panel-light}'
    textColor: '{colors.ivory-suit}'
    rounded: '{rounded.control}'
    padding: 14px 22px
  service-card:
    backgroundColor: '{colors.panel}'
    rounded: '{rounded.control}'
    padding: 28px
  service-booking:
    backgroundColor: '{colors.panel-light}'
    textColor: '{colors.ivory-suit}'
    rounded: '{rounded.control}'
    padding: 12px 16px
  booking-dialog:
    backgroundColor: '{colors.booking-surface}'
    textColor: '{colors.ivory-suit}'
    rounded: '{rounded.control}'
    padding: 0px
  brand-avatar:
    rounded: '{rounded.circle}'
    width: 36px
    height: 36px
  project-frame:
    backgroundColor: '{colors.panel}'
    rounded: '{rounded.none}'
    padding: 30px 30px 0
  brand-button-primary:
    backgroundColor: '{colors.thruster-orange}'
    textColor: '{colors.deep-space}'
    rounded: '{rounded.control}'
    padding: 12px 24px
  brand-button-secondary:
    backgroundColor: transparent
    textColor: '{colors.ivory-suit}'
    rounded: '{rounded.control}'
    padding: 12px 24px
  access-input:
    backgroundColor: '{colors.panel}'
    textColor: '{colors.ivory-suit}'
    rounded: '{rounded.control}'
    padding: 10px 12px
---

# Design System: Portfolio Cockpit

## Overview

**Creative North Star: "A Personal Introduction Suspended in Space"**

The landing, commercial pages and playable cockpit share monumental Unbounded interface
titles, Space Grotesk text and actions, warm ivory on near-black, orange commands and thin
rectangular frames. The accepted landing supplies the visual authority for
this shared system. Dungyov informs the outlined/solid lettering; Oakley
Axiom Space informs media scale and native-scroll depth, not asset identity.

The hero alternates between matched photographic portraits of Matteo and
his astronaut alter ego through a brief, localized optical glitch. The toy
character connects these portraits to the existing Three.js model. Two
opposing film planes introduce the real app cards in Work. The owner-approved
smiling portrait with clear-lens black glasses supplies the human hero and
services image; a square headshot edit of that master supplies the avatar.
The landing is spacious and direct; the cockpit is playful and
instrument-dense. Flat controls, the shared avatar and equal EN/IT treatment
connect them while scrolling and gameplay retain their functional layouts.

The commercial pages extend this identity through ordinary reading flow:
split introductions, real website and app captures, practical sections and
native disclosures. Their flat booking and consent controls use the same
palette and focus language as the landing.

Social previews extend the current hero into one fixed 1200×630 image:
Matteo's smiling photographic portrait with folded arms and the lunar terrain sit
right of a stacked solid name, orange punctuation, localized page title
and subtitle, and the public domain. Six destinations share this composition
equally in EN/IT. The photographic avatar also supplies the favicon and app icons.

The homepage and website-development page also show matteodante.it and the
playable cockpit as a personal project, with two real screenshot previews
and native links. A compact public Pilatus/DonTouch role summary identifies
company-team experience. Their new layout awaits fresh browser review;
the shared proof-row and control patterns are retained.

**Key Characteristics:**

- Near-black space, warm ivory text and orange actions.
- Shared Unbounded interface titles and Space Grotesk prose and actions.
- Thin rectangular frames, flat controls and restrained two-pixel corners.
- Matched human/astronaut portraits, a consistent toy character and recognizable identity.
- Native-scroll depth on the landing; readable telemetry in the playable CV.

## Colors

One warm orange accent sits against deep space and ivory; cockpit status
colors retain their instrument roles. Values in the frontmatter are
normative.

### Primary

- **Thruster Orange:** landing booking controls, selected navigation,
  name punctuation and focus outlines; cockpit actions.
- **Thruster Orange Hover:** the landing's enabled booking hover fill and
  border, a lighter state of the same accent.
- **Thruster Orange Disabled:** muted fill and border for disabled cockpit
  form commands, such as access-code submission and chat send.

### Tertiary

- **HUD Green, Amber, Red and Blue:** cockpit instrument readouts, gauges,
  radar and status signals. They do not become landing marketing accents.

### Neutral

- **Deep Space:** both surfaces' canvas and landing text on orange.
- **Ivory Suit:** headings, primary text and outlined letter strokes.
- **Muted Text:** supporting copy, metadata and quiet navigation.
- **Frame Line:** translucent ivory dividers, project frames and instruments.
- **Panel:** the subtle fill behind service cards, app captures, menus and
  cockpit panels.
- **Panel Light:** dark secondary controls and the cockpit header/hover step.
- **Booking Surface:** the neutral dark Cal.com dialog and calendar backdrop.

**The Shared Identity Rule.** Use the same palette, display/body roles and
flat control language across all surfaces; reserve signal colors for working
instruments and status.

## Typography

**Display Font:** Unbounded via `--font-unbounded`; the generated
`--font-display` alias resolves to `var(--font-unbounded)`.
**Body and Action Font:** Space Grotesk via `--font-body`.
**Instrument Font:** JetBrains Mono via `--font-jetbrains-mono`, exposed
through `--font-mono` for telemetry and code.

All three load once in the shared locale layout through `next/font/google`.
Unbounded loads 400, 700 and 900; Space Grotesk loads 400, 500 and 600;
JetBrains Mono loads 400, 500 and 700. Orbitron and Rajdhani are retired.
The loaded font variables and generated aliases must remain distinct.

The landing name is uppercase, weight 900, with an outlined first name and
solid surname. Contact repeats the outline/solid contrast. Outlined glyphs
use a two-pixel ivory stroke, Deep Space fill and `paint-order: stroke fill`
to keep contours clean. Services use the lighter headline weight 400;
the Work film heading uses 700 and the closing display uses 900.
Prose and navigation remain in Space Grotesk, mostly sentence case.

The frontmatter display scale describes the desktop name. On mobile it is
`clamp(38px, 12vw, 65px)`, with 38px below 360px. Contact uses
`clamp(40px, 6vw, 80px)` on desktop and `clamp(27px, 8.6vw, 50px)` on mobile.
The Work film heading uses `clamp(48px, 6.7vw, 96px)`, line-height 1.13
and letter-spacing −0.03em, changing to `clamp(34px, 10.5vw, 64px)` below
800px. At viewport heights up to 600px, its size becomes
`clamp(32px, 5.4vw, 58px)` at every width. Balanced wrapping and a localized
dark text shadow keep the independent title readable over the films.
Services reduce to 26px on mobile. The hero offer uses
`clamp(22px, 2.2vw, 29px)` at line-height 1.45,
then 21px on mobile and 19px below 360px.

Supporting leads use 18px/1.65, reducing to 16px on mobile; service and
project descriptions use 15px, reducing to 14px. Service titles use 20px
and 18px on mobile; project titles use Unbounded 400 at 23px and 20px.
Service prices use Space Grotesk 500 at 28px/1.3, with a quiet 12px
qualifier. The relationship-section heading uses Unbounded 700 at
`clamp(32px, 3.5vw, 48px)`, reducing to 32px below 800px, with 1.15
line-height and −0.025em tracking. Supporting copy uses Space Grotesk
16px desktop and 15px mobile; relationship captions use 11px and 10px.
The literal project name `claude-local-docs` uses the code/mono role at
16px desktop and 13px mobile in both the wall and static grid. It remains
a literal name, not a fabricated logo. These are scoped relationship-wall
sizes, not additional shared type tokens.
Compact metadata and controls vary by function and viewport; this is not
a single mathematical type scale. Existing 9–10px helper and role text is
not a default for new content. Below 600px viewport height, the hero name
becomes 44px and the offer 18px to preserve the complete introduction.

Cockpit intro titles use Unbounded 900 at `clamp(28px, 3.5vw, 50px)` and
line-height 1.17, reducing to `clamp(25px, 7vw, 36px)` on mobile. Dock titles
use Unbounded 700 at 32px desktop and 24px mobile. Dock body copy is Space
Grotesk 14px/1.7; shared commands use 14px/500 with no uppercase tracking.
Access and chat fields use Space Grotesk at 16px. Monospace remains for
instrument values, keyboard codes and telemetry rather than prose.

The owner restored the original orange `MATTEO DANTE` sign inside the 3D
world. Its bold Helvetiker TextGeometry is a scene-specific exception to
the shared display family; it does not replace Unbounded in the interface.

Commercial page titles use Unbounded 700 at `clamp(42px, 5vw, 72px)`,
1.1 line-height and −0.03em tracking; below 800px they use
`clamp(34px, 9vw, 56px)`. Section headings use weight 400 at
`clamp(28px, 3vw, 42px)`, settling at 28px on mobile. Leads use Space
Grotesk 20px/1.6 and 18px on mobile; prose uses 1.75 line-height.
FAQ questions use 18px. These are the commercial reading surface's
hierarchy, not replacements for the cinematic landing or cockpit scales.

Server-rendered social cards bundle local Unbounded 900 and Space Grotesk
500 TTF files separately from the webpage font loader. Their solid,
mixed-case name uses 92px/1.12 and −0.03em tracking; the page title uses
30px/1.35, its subtitle 24px, and the domain 20px. These fixed raster sizes
scale with the 1200×630 output and do not change the webpage type tokens.

**The Type Roles Rule.** Use Unbounded for interface titles, Space Grotesk
for reading and actions, and JetBrains Mono for telemetry and code on
either surface. Preserve the explicitly approved Helvetiker 3D sign.

## Layout

The landing uses native document flow: Intro, Services, Brands, Work and
Contact. With motion enabled, the hero occupies 180svh and the work
introduction 280svh; each contains a sticky 100svh stage. The former second
hero text chapter is removed. A compact relationship wall after Services
remains in native vertical flow. It has 86px top and 90px bottom padding;
its heading caps at `min(1160px, calc(100% - 100px))` with 48px below it.
Below 800px, section padding is 66px top and 72px bottom, heading width
is `calc(100% - 50px)` and the heading-to-wall gap is 36px. There is no
sticky brand stage or scroll-controlled horizontal travel.
The work collection adds matteodante.it and its cockpit as a personal
project between PiùUDITO and the app pair. A compact company-team summary
follows the apps.
Services, the real project cards after the work scene, and contact remain
in normal flow. Their panels have a 100svh minimum height, 140px 70px
padding and 1040px composition width. The hero composition caps at 1160px
and uses 110px 40px 80px padding. These are the current homepage's
compositions, not compulsory templates for every future surface.

The Work stage places two clipped rectangular films behind an independent
central title. On desktop, the left mission frame is 42% wide and 68%
high, positioned 5% from the left and 12% from the top; the right visor
frame is 35% wide and 60% high, positioned 5% from the right and 32% from
the top. Below 800px, each is 58% wide with a −9% outer offset that crops
its edge. Their mobile top/height pairs are 21%/48% and 46%/44%. The title
caps at `min(880px, 82%)`, uses `calc(100% - 44px)` on mobile, and caps at
`min(650px, 82%)` when viewport height is at most 600px. Maestro and GymTree
follow in normal flow; the former two-app explanatory note is removed
in both languages.

Human/astronaut portraits with folded arms occupy the hero foreground
over restrained lunar terrain; the 220px framed portrait introduces services. Three squared
service cards form a three-column grid; shipped products form a two-column
pair. Cards have 20px gaps on wide screens, 32px at the compact-desktop
breakpoint and 16px when stacked on mobile. Below 800px, the hero copy sits
near the bottom of its stage with 100px 25px 104px padding. The astronaut and
landscape crop widen while retaining the same depth travel. The portrait
becomes 150px above the services copy; services and products stack into
one column. Content panels use 100px 25px padding, with 22px side padding
below 360px. The header has a stable dark backing (`#05060aeb`) at every
scroll position and width, with safe-area top padding on mobile. Its Work
shortcut hides while language and booking controls remain. Below
360px, the header booking arrow hides and the name may wrap to preserve
the controls without horizontal overflow.

The hero identity frame is 4:5, 108% of its stage height, positioned 8%
from the top and -1% from the right. On mobile it becomes 116% wide with
auto height, 9% top and -26% right. Two intersected gradient masks blend
its opaque plate edges into the scene. The landscape remains a separate
scroll layer at 0.38 opacity. The identity frame retains scroll-driven
translation and rotation; the timed transformation does not move the copy
or actions. Their normal scroll progression remains independent.

Motion works at every viewport width and height. Reduced motion or pause
removes the tall scene lengths and sticky positioning, retaining static
100svh imagery and normal content flow. Short viewports adapt the hero's
type and padding without disabling animation. Section anchors remain
native; sections are never fixed or made inert. Without JavaScript, the
same static content remains available and enhancement-only controls hide.
The relationship wall becomes a complete normal-flow grid with four
columns on desktop and two on mobile. Its headings and relationship
captions remain present in either mode.

The cockpit remains a locked 100vw × 100dvh stage. HUD chrome pins to the
edges, the Three.js scene owns the center, and dock/intro overlays cover
the scene. Keep its viewport lock scoped to the cockpit route.

The three service pages and PiùUDITO case share a normal-flow commercial
layout capped at `min(1160px, calc(100% - 100px))`, with 144px top padding
below the shared header. The introduction pairs title and explanation in
1.3:1 columns with a 72px gap. Reading sections pair headings and content
in 1:1.1 columns with a 100px gap, 104px vertical padding and thin dividers.
Below 800px, the container leaves 20px side margins, top padding becomes
112px, sections use 64px vertical padding and the columns stack. Actual
captures follow the introduction; the commercial pages have no sticky
cinematic stage, WebGL scene or scroll-controlled video.

The case's two related website captures and the app evidence use two
columns on desktop and one on mobile. Cross-service links and the playable
CV sit in the footer. Analytics preferences follow in normal footer flow;
only the optional choice panel is fixed above the lower page edge.

## Elevation & Depth

Landing depth comes from separate planes: the hero identity frame moves
past the viewer as lunar terrain approaches and typography recedes. Two
opposing film planes pass behind the Work title before the real app cards.
Portrait, project pair and contact landscape have separate parallax travel.
CSS perspective, translation, rotation, clipping and opacity create depth.
GSAP 3.15 ScrollTrigger maps native scroll to hero and parallax progress
with a 0.3-second scrub response and linear progress. Work uses its own
0.45-second scrub. CSS owns sticky positioning without pin spacers; the
hero/work progression needs no custom frame loop.

Work uses one reversible progress value for both film containers, internal
crops, title and paused video playheads. The mission film descends 112svh
while the visor rises 112svh; each travels 80svh on mobile. A 1500px
perspective and restrained yaw/rotation separate the planes. Desktop adds
opposing 8vw horizontal travel and central depth lifts of up to 70px/50px;
mobile keeps vertical travel and rotation. Internal images overscan by
12% above/below their frames and counter-translate through 16%. The title
drifts upward through its own 12svh range; a radial dark shade and
`0 5px 35px #05060acc` text shadow protect its contrast.

The silent films remain paused; scroll sets `currentTime` in either
direction. One seek may be in flight per film, and the `seeked` event
takes the latest progress; changes under 1/60s are ignored. A layout refresh
explicitly restores progress and renders the frame, since GSAP may restore
its animation with callbacks suppressed. An IntersectionObserver adds
video sources only within one viewport of the stage. The initial hero
does not request them. Idle, offscreen and hidden states do not seek.
Pause/reduced motion clears the motion styles and film visibility;
no-JavaScript and cold reduced-motion mode use the composed JPEG posters
without requesting videos. An unavailable film also leaves its poster.

`HeroIdentity` adds a dynamically loaded native WebGL renderer with one
quad and two image textures; it does not import Three.js. A textured reveal
front, luminance-derived refraction, refractive ripples, local temporal
echoes, brief horizontal tears and restrained chromatic separation transform
the subject. Both settled endpoints sample the original plates without
shader color treatment. The headline, offer and controls remain undisturbed
by the timed effect.

The first transformation starts 650ms after the ready hero begins visible,
motion-enabled time. Each transition lasts 1120ms; starts recur every
5000ms and alternate direction. Timers sleep through settled frames;
`requestAnimationFrame` runs during transformations and short pointer/touch
wakes, with settled redraws for setup or resize. Offscreen/hidden-document time is suspended rather
than accumulating missed changes. Pixel ratio is capped at 1.5.

A clean astronaut poster is server-rendered immediately. The existing
motion toggle, reduced-motion preference and no-JavaScript mode select
that poster. A failed image/module, unavailable GPU or lost context also
keeps it visible. This enhancement has no loading gate, sound or video
decoder, and text, contact and booking links remain independent of it.

The prepared cursor/touch extension adds a local irregular refractive lens
inside the portrait: cursor motion glitches the visible photograph, with
stronger distortion during mouse or touch drag. It never reveals the other
identity; the automatic transformation remains independent. Hover strength
is 0.32–0.55; mouse drag is 0.72–1 and touch is 2.6–3.8. Touch also widens
the local glitch radius from 0.22 to at most 0.402 texture units. A bounded speed response, 55ms
position following and 190ms decay return the image to its clean state.
Controls, native scroll and pinch zoom retain their normal behavior in the
implementation. This interaction awaits browser visual and lifecycle
validation after the owner unlocks the Mac; the prior hero finish review
does not cover it. See `docs/design/identity-glitch.md`.

The relationship wall uses three flat CSS transform loops moving right,
left, right over 130s, 140s and 125s, with linear timing and starting
delays of −28s, −16s and −24s. Each row repeats its assigned marks twice
per run, then duplicates the run so translating by half the track width
loops seamlessly. Forty visual copies sit inside an `aria-hidden` wall;
one canonical semantic list retains all ten names and relationship labels.
Soft horizontal masks fade the outer 12% on desktop and 7% on mobile.

Native vertical scroll adds a gentle impulse to playback speed. Absolute
scroll velocity sets a positive rate capped at 2.25×, with a 160ms attack
and 1.1s return to 1×, both using `power2.out`. Short tweens use the existing
GSAP dependency and native `Animation.updatePlaybackRate`, preserving each
loop's phase and right/left/right direction. The scroll listener is passive.

An IntersectionObserver and document-visibility listener gate the CSS play
state. Offscreen, hidden and cleanup states cancel rate tweens and reset
the rate to 1×. Brands has no ScrollTrigger, custom animation-frame loop,
sticky stage, perspective, skew or scroll-driven position. Offscreen and
hidden rows pause; the existing motion toggle, reduced motion and no JavaScript show
the complete static grid. During motion the canonical list is visually
clipped, preserving assistive-technology access. There is no brand progress
bar; the global right-side indicator still hides while Brands is active.

The native booking dialog opens with a 240ms opacity/translate/scale
animation using `cubic-bezier(0.16, 1, 0.3, 1)`, from 24px down and 0.97
scale. The global reduced-motion rule overrides animation and transition
durations to 0.001ms and animation iteration count to one.

The Canvas 2D background uses 700 subtle points, a 1.5 DPR cap and 0.5 layer
opacity. It redraws with scroll/layout updates, with no autonomous star
animation. Photographic shading protects text contrast. No WebGL or
animation is required to read content or reach email and project links.
Landing controls have no glow or drop shadow; hover moves enabled booking
controls by two pixels and project captures by seven pixels.

Cockpit chrome uses the same flat dark panels, ivory hairlines and orange
state feedback. Interface halos, scanlines, metal fasteners and inset metal
highlights have been removed. The 3D scene retains its lighting, planet
effects and functional signals. Its restored orange name sign has beveled,
extruded lettering with a dark metallic base, clearcoat and warm emissive
light. The sign material and its point light pulse together, as explicitly
requested by the owner; this scene treatment does not apply to controls.

Dock overlays separate from the scene through a translucent near-black
backdrop and 12px blur. Panels do not need a glow to establish hierarchy.

**The Flat Controls Rule.** Use fill, hairline borders and clear state
changes for interface depth; keep physical light in the space scene.

**The Optional Motion Rule.** Readable content and usable navigation are
the base layer; depth travel enhances them without intercepting scrolling.

## Shapes

Controls on both surfaces are almost square with two-pixel corners. Screenshot
images use four-pixel top corners; their surrounding project frames and
section menu remain rectangular. Thin one-pixel ivory strokes define
frames and separators. The portrait's offset outline is an empty frame,
not a hard offset shadow. The circular photographic avatar and project-open
indicator supply the round geometry.

Cockpit panels retain rectangular edges; access fields and shared command
buttons use the same restrained control radius. Circular geometry belongs
to the avatar, status points and gameplay controls where it has a role.

## Components

### Buttons

Landing booking controls use orange fill/border, Deep Space text, Space
Grotesk 500 and the control radius. Standard controls have a 52px minimum
height; compact header controls use 43px. Mobile standard controls use
46px and the header uses 38px. Enabled hover lightens the fill and border,
lifts the control, and shifts its SVG arrow. Text stays Deep Space on the
orange hover fill, including in the header. Focus-visible uses a two-pixel
orange outline with six-pixel offset across landing links and buttons.

The hero pairs booking with the secondary “Play my CV” / “Gioca al mio CV”
link to the current locale’s cockpit. It is a dark squared button with Panel
Light fill, ivory text, an outlined SVG play symbol, a full Frame Line
border and two-pixel corners. Hover uses Panel fill and an orange border.
Minimum height is 52px desktop and 46px mobile; desktop padding is 14px
22px, with horizontal padding reducing to 14px below 800px and 8px below
360px. Space Grotesk 500 labels reduce from 14px to 12px and then 11px at
those breakpoints. The flexible action row can wrap. Keyboard focus restores
the hero copy’s visibility and position during scroll, keeping the link
reachable even after its scene fades.

**Booking state:** the homepage header, hero and contact booking CTAs are enabled
orange links to the owner-confirmed `https://cal.com/matteo-dante`. They
remain direct links, as do the commercial pages' header and hero controls.
Each homepage service card has a dark link to its specific localized
service page: Panel Light fill, full ivory hairline, two-pixel corners,
13px Space Grotesk 500, 48px minimum height and 12px 16px padding. Hover
changes the border to orange and the fill to `#1c1e25` over 180ms.
The final orange CTA on each commercial page opens the native calendar
dialog. Modifier-key activation or no JavaScript follows the same direct
Cal.com URL, and the dialog retains a direct-link fallback.

The shared `brand-button` used by cockpit commands and chat uses Space
Grotesk 500, a 48px minimum height and 12px 24px padding. Primary is orange
with Deep Space text; secondary is transparent with an ivory hairline and
ivory text. Hover lifts two pixels; secondary hover adds the Panel Light
fill and orange border. Transitions use 180ms ease-out. Compact submit
controls use a 44px minimum height and 10px 16px padding. Focus outlines
remain two pixels, with a four-to-six-pixel offset by context.

### Inputs / Fields

Access-code and chat fields use dark fills, thin ivory borders and readable
16px Space Grotesk text. The access field uses the control radius and
10px 12px padding; the multiline composer stays rectangular with 8px 10px
padding. Labels, error feedback and disabled/sending state remain explicit.
The composer is a simple field/action row without an extra framed panel.
The landing’s scheduling form is supplied by the lazy Cal.com embed;
there is no separate custom lead-capture form.

### Cards / Containers

Project evidence uses thin rectangular dark frames containing two real
localized App Store captures, staggered vertically. The whole project is
a link, with a circular ivory arrow indicator and text below the frame.
Frames are 380px tall with 30px 30px 0 padding, changing to 310px with
24px 25px 0 padding on mobile. Hover brightens the border and lifts the
captures.

Services use three dark squared cards with full thin borders, two-pixel
corners and 28px padding, reducing to 25px on mobile. Each card contains a
title, brief description, price and dark service-page link. Websites start at
300 €; apps/software and custom AI are on request. These are owner-confirmed
prices, not implied fixed scopes or delivery promises. A flexible price
area keeps controls aligned; service icons remain removed.

Website evidence uses actual public captures, with a caption and project
link. The commercial showcase has a quiet blue-black fill, 32px padding
and four-pixel corners; mobile padding is 12px. PiùUDITO is presented as
one client with three websites. Its desktop/mobile, Group and Fabio
Tomassetti JPEG captures have embedded origins plus adjacent `origin.json`
in `public/landing-v2/piuudito/`. The homepage links to this case before
the existing app pair. Commercial app evidence reuses the localized
Maestro and GymTree frames, labels both as personal products and keeps
their real App Store links. The AI page also links to the personal
`claude-local-docs` repository as document-search evidence.

Cockpit containers use the shared Panel fill and thin Frame Line border.
Dock headers use Panel Light; content remains in a readable scroll area.
The dialog is `min(760px, 92vw)` wide and capped at 85vh on desktop; mobile
uses a full 100vw × 100dvh surface with safe-area padding. Focus trapping,
focus return, Escape and direct section/contact/CV access remain functional
requirements. Public/private access state changes the available content.

### Service booking dialog

The final commercial-page booking CTA opens a native modal `<dialog>` with an accessible title and
44px close control. The Cal.com React embed loads only when opened, uses
a dark theme, month view and orange brand accent, and retains the exact
owner destination. The route locale is passed into the embed; the external
calendar controls its own displayed language. Escape and the close control dismiss
the dialog; native modal behavior owns focus. The footer provides a direct
Cal.com link in a new tab, so visitors can continue outside the embed.

The shell is near-square with a thin ivory border and Booking Surface fill,
`min(1000px, calc(100vw - 40px))` wide and capped at `100dvh - 40px` high.
Mobile leaves 10px on each side and caps height at `100dvh - 20px`. A sticky
header keeps the title and close action visible; the calendar has a 540px
minimum height and the shell can scroll. The page stops scrolling while
the dialog is open. Its translucent near-black backdrop adds 8px blur.

### Commercial FAQ

Practical questions use native `<details>` and `<summary>` in the reading
column, separated by ivory hairlines. Summary remains a list item, with
orange native disclosure markers changing between closed and open states.
This local rule restores markers hidden by the global reset, including
WebKit's marker. Questions have 22px vertical row padding and answers
appear 18px below. Keyboard focus has a two-pixel orange outline with
six-pixel offset. Disclosure and reading remain usable without JavaScript.

### Optional analytics choice

When a valid GA ID is configured, the first choice appears in a fixed dark
rectangular panel with an ivory hairline. It is 420px wide, capped to the
viewport, with 24px padding; mobile uses 20px padding and a scrollable
height cap. The two choices use equal transparent fills, borders, 44px
minimum targets and 14px body type. Orange hover borders and visible focus
give feedback without visually favoring consent. After a choice, the
preferences button sits in normal footer flow and reopens the panel.

No valid ID means no Google tag or consent interface. Google loads only
after positive consent, and the cockpit is excluded. This is the optional
GA control, not a universal consent manager for existing Vercel tools.
Activation in Google's services remains pending owner access and real IDs;
event meanings and verification limits live in `docs/seo/measurement-plan.md`.

### Relationship logos

“Chi ho aiutato” / its English equivalent sits after Services. The official
logo sequence is Pilatus Aircraft, PiùUDITO, Hexa Credit Care, DonTouch,
Galileo SpA, Fastweb, Sorgenia, GymTree and Maestro, followed by the literal
text `claude-local-docs`. Captions preserve the source relationship: team
for Pilatus, Hexa, DonTouch and Galileo; client for PiùUDITO; project for
Fastweb and Sorgenia; personal for GymTree, Maestro and claude-local-docs.
These labels do not turn personal projects into external clients.

The three automatic rows group Pilatus through DonTouch, Galileo through
Sorgenia, and the three personal projects. Wall items are 176px wide on
desktop and 140px below 800px; logo areas are 64px and 52px high in both
moving and static modes. Row gaps are 28px desktop and 26px mobile.
Each run has a 72px gap and matching trailing padding, reducing to 40px
on mobile; `space-around` distributes spare space across a minimum 100vw
run. Captions sit 12px below the mark area, reducing to 10px on mobile.
The static list uses four columns, 36px row gaps and 60px column gaps,
with the heading's width cap. Below 800px it uses two columns with
28px row gaps and 26px column gaps. Official alpha/SVG assets sit directly on the dark
scene; most are rendered white through CSS. PiùUDITO uses grayscale and
brightness adjustment. Galileo is the exception: its source is opaque and
uses CSS grayscale/inversion. `mix-blend-mode: screen` is applied to the
whole `.brands-scene`, compositing its dark pixels into the page backdrop.
It is not an image-level-only treatment, and the source is not transparent.
No brand media was created or replaced for this refinement. Current motion
mechanics and local validation are recorded in `docs/design/brand-wall.md`;
the prior orbit record is historical and superseded.

### Navigation

The landing header combines the circular photographic avatar/name, quiet
Services and Work links, the shared EN/IT control and a compact booking control. Services
opens the website-development page. Commercial headers reuse this shell
with their current service link; the language control opens the matching
localized page. Their footer links to the other services, home and cockpit.
A bottom-left section picker
includes Intro, Services, Brands, Work and Contact in a dark rectangular
menu; its current item is orange, and hover
adds a faint ivory tint behind the existing text. Menu links use 13px
type and 12px 20px padding. Escape closes the picker and returns
focus. A slim right-side progress rail and bottom motion toggle remain
secondary to the content; the rail hides while Brands is active.
Enhancement-only navigation is absent without JavaScript.

The same `BrandAvatar` and `LanguageSwitcher` appear in the cockpit. Language
links preserve the current landing/cockpit route, use an ivory current
state and retain clear focus. The cockpit intro avatar/name link has an
explicit localized “Back to home” label. The in-game desktop avatar and
mobile avatar link also return to the localized landing, with 44px square
targets and pointer events enabled. On mobile, the avatar sits beside audio
at a 92px left offset plus the safe-area inset. Website and menu actions
retain the same return path. HUD controls preserve direct DOCK, COMM,
section, contact and CV routes alongside the flight controls.

### Signature: Astronaut, photographic identity and outlined display

The hero uses `public/landing-v2/identity/astronaut.webp` and
`public/landing-v2/identity/matteo-polo-v1.webp`: two opaque 960 × 1200
photographic plates. The owner approved the natural standing portrait with
black polo, glasses, tilted head and real smile, based on the man at the
right in his sunset family photograph. The crop excludes the shorts length.
The existing folded-arm toy astronaut remains unchanged. The identities
have different poses; the refractive transition preserves its existing
renderer, timing, pointer and touch behavior. Near-black photographic
backgrounds blend through CSS frame-edge masks. Exact prompts and sources
are in `assets/portrait-options/polo-preview.json` and adjacent origins.

Both identities and the services close-up were inspected in the browser
at desktop and mobile sizes. This asset release does not establish a new
review of touch strength or measured GPU performance.

`public/landing-v2/astronaut.webp` remains in source history as an original
Image Gen reinterpretation based on a render of the existing
`public/models/astronaut.glb`. That full-body asset has true transparency at
1122 × 1402. Its octagonal helmet, opaque visor, ivory suit, chest controls,
hoses and orange fittings preserve the toy character; the runtime cockpit
model is unchanged. It is no longer used in Work and is not the current
hero portrait. Raw GLB renders
were reference inputs only and are no longer public landing assets.
The generated lunar landscape remains behind the hero and contact.
This media’s provenance is in `docs/design/brand-media.md` and adjacent
asset metadata. The hero retains its still-image layers and optional
image shader; the Work introduction separately uses scroll-controlled film.

The Work pair in `public/landing-v2/work-video/` is temporary Oakley Axiom
reference media under the owner's prior explicit authorization, disclosed
before implementation. The mission film uses the hero frame sequence
(1440 × 712); the visor film is 960 × 784. Together the silent seekable
MP4s are about 5.1MiB. Both JPEG posters carry embedded origins; video
metadata and `origin.json` record the sources and processing. These films
are neither AI-generated originals nor Matteo's portfolio work, and they
do not imply an Oakley relationship. `docs/design/work-video-sequence.md`
records the asset decision, mechanics and replacement path. The real
Maestro/GymTree links remain the work evidence immediately afterward.

The cockpit world wordmark is the original orange `MATTEO DANTE` sign,
restored at the owner’s request. Bold Helvetiker TextGeometry supplies its
beveled extrusion, with a physical emissive material (`#ff8a3c`) and a
matching point light. Its material emissive intensity varies from 1.2 to
1.8 while the light varies from 200 to 290. The scene update loop drives
both from the same sine pulse. This is the named scene exception; the
landing keeps its Unbounded outlined first name and solid surname.

The shared `BrandAvatar` uses `matteo-avatar-v5.webp` (200 × 200), displayed
as a 36px circle on desktop and 32px below 800px. It replaces the former
orbit brand symbol. Services and contact no longer repeat that symbol.
Services use `matteo-services-hero-closeup-v1.webp` (560 × 640), a close-up
Image Gen edit derived directly from the approved hero. It preserves the
natural smile, glasses, black polo and color. The owner rejected the suit
portrait and requested the same informal confidence as the hero. The
existing 7:8 frame stays 220px/150px with its thin offset outline.
Hero and Person schema share the approved hero through `PERSON_IMAGE_PATH`.

The avatar and icons use square CSS layout of the approved color close-up,
aligned to the top to retain the full hairstyle. Social cards use the exact
color hero, without generating another face. These are photographic edits,
not untouched camera originals. Provenance lives in
`docs/design/portrait-provenance.md`. The CV retains the original photograph;
`public/images/profile-pic.jpeg` and all CV PDFs remain unchanged.
Official app captures retain their real UI and colors, documented in
`docs/design/project-assets.md`.

**Not canonized:** compact role/navigation labels and remaining tiny helper
text are not templates for decorative kickers or a new small-text scale.
Static detector advisories do not define new rules; isolated legacy values
are not promoted to shared tokens.

### Social sharing cards

One static composition serves home, websites, apps, AI, PiùUDITO and cockpit
in both languages. `public/social/hero-portrait-v5.jpg` is a JPEG encoding
of the exact approved natural black-polo hero. It sits on the right at 544 × 680,
with complete head, smile and clear black glasses. The separate existing
lunar image has a dark overlay for legible copy; CSS frame-edge masks blend
the photo into that scene. No new face is generated. Typography is unchanged.
The stacked solid name begins at
64px left and 74px top in a 610px column; title and subtitle sit 36px below
it in a 570px column. The domain sits at 66px left and 42px from the bottom.
The name and title use Ivory Suit, the period uses Thruster Orange, and
the local subtitle shade is `#c5c2bb`. That shade is scoped to these raster
cards; it does not replace the shared Muted Text token.

`lib/seo/social-image.tsx` composes the image and local fonts without
external rendering requests; `lib/seo/social.ts` supplies localized copy.
All twelve PNGs are prerendered during the build. Page-specific copy names
the actual destination; Matteo's portrait remains personal identity artwork,
including on the PiùUDITO preview. It is not client work imagery.
`socialImageUrl` appends `?v=portrait-5` to distinguish the updated previews
from previously cached images; live platform caches are not verified.
The favicon, Apple icon and 192/512px manifest icons use the same approved
color close-up as the avatar. Source prompts, image processing and font
licenses are recorded in `public/social/origin.json`,
`public/fonts/social-origin.json` and `docs/design/social-metadata.md`.

## Do's and Don'ts

### Do:

- **Do** share Unbounded interface titles, Space Grotesk reading/actions
  and JetBrains Mono telemetry/code across landing and cockpit, preserving
  the approved orange Helvetiker 3D sign.
- **Do** use thin frames, flat controls and small control corners across
  both routes, with outline/solid display contrast on the landing.
- **Do** preserve keyboard focus, native anchors, readable content and
  reduced-motion behavior in both languages.
- **Do** preserve the toy character across the existing cockpit model and
  original generated landing artwork, with recorded provenance.
- **Do** use the owner-approved smiling portrait and its matching avatar
  edit, alongside actual shipped product imagery.
- **Do** retain official logo provenance, relationship captions and complete
  static access to the wall's ten items, distinguishing personal work from
  clients.
- **Do** confine the identity glitch to its registered subject plates, keep
  clean settled photographs and preserve the composed astronaut fallback.

### Don't:

- **Don't** restore the orbit brand symbol, service-row icons or raw GLB
  renders as landing artwork.
- **Don't** restore the separate Orbitron/Rajdhani interface font system or
  decorative chrome glow, scanlines and metal fasteners. The restored
  emissive 3D sign is an explicit scene exception.
- **Don't** turn HUD signal colors into general marketing accents or
  monospace telemetry styles into body and action typography.
- **Don't** make reading or contact depend on animation, JavaScript or
  completing the cockpit.
- **Don't** confuse a booking-link click with a completed appointment or
  confirmed lead.

### Personal website and team evidence

`PortfolioEvidence` reuses the two-column website-proof row, pairing an
localized site-generated social cover with a narrow real mobile gameplay capture. Both retain
their full aspect ratio, thin frame and two-pixel corners. The image group
uses a fluid main column and a 24% companion column; the entire proof row
stacks below 800px. Its heading and concise copy identify a personal project.
A dark squared action opens the localized cockpit; the website-service
version also has a plain homepage link. Both disable automatic prefetch.

`TeamExperience` is a quiet row with a top divider and two company/role
columns, stacking on mobile. It states the public Pilatus and DonTouch
roles as employment/team experience. These additions are implemented;
fresh desktop/mobile layout inspection is pending the owner's Mac unlock.
The reused project captures do not constitute review of the new layout.
