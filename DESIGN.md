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
  button-primary-disabled:
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
    textColor: '{colors.ivory-suit}'
    padding: 12px 4px
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

The landing and playable cockpit share monumental Unbounded titles, Space
Grotesk text and actions, warm ivory on near-black, orange commands and thin
rectangular frames. The accepted landing supplies the visual authority for
this shared system. Dungyov informs the outlined/solid lettering; Oakley
Axiom Space informs media scale and native-scroll depth, not asset identity.

The glossy toy astronaut connects an original generated landing image with
the existing model in the vanilla Three.js cockpit. A natural photographic
avatar and services portrait share one edit of the owner’s real photograph.
The landing is spacious and direct; the cockpit is playful and
instrument-dense. Flat controls, the shared avatar and equal EN/IT treatment
connect them while scrolling and gameplay retain their functional layouts.

**Key Characteristics:**

- Near-black space, warm ivory text and orange actions.
- Shared Unbounded display lettering and Space Grotesk prose and actions.
- Thin rectangular frames, flat controls and restrained two-pixel corners.
- A consistent toy astronaut character and recognizable photographic identity.
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
- **Thruster Orange Disabled:** the booking controls' muted orange fill and
  border while setup is deferred; text retains full opacity.

### Tertiary

- **HUD Green, Amber, Red and Blue:** cockpit instrument readouts, gauges,
  radar and status signals. They do not become landing marketing accents.

### Neutral

- **Deep Space:** both surfaces' canvas and landing text on orange.
- **Ivory Suit:** headings, primary text and outlined letter strokes.
- **Muted Text:** supporting copy, metadata and quiet navigation.
- **Frame Line:** translucent ivory dividers, project frames and instruments.
- **Panel:** the subtle fill behind app captures, menus and cockpit panels.
- **Panel Light:** the cockpit header and quiet control hover step.

**The Shared Identity Rule.** Use the same palette, display/body roles and
flat control language across both routes; reserve signal colors for working
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
the photographic work heading uses 700 and the closing display uses 900.
Prose and navigation remain in Space Grotesk, mostly sentence case.

The frontmatter display scale describes the desktop name. On mobile it is
`clamp(38px, 12vw, 65px)`, with 38px below 360px. Contact uses
`clamp(40px, 6vw, 80px)` on desktop and `clamp(27px, 8.6vw, 50px)` on mobile.
The work scene uses `clamp(32px, 5.5vw, 72px)` at line-height 1.2,
changing to `clamp(31px, 9vw, 54px)` on mobile. Services reduce to 26px on
mobile. The hero offer uses `clamp(22px, 2.2vw, 29px)` at line-height 1.45,
then 21px on mobile and 19px below 360px.

Supporting leads use 18px/1.65, reducing to 16px on mobile; service and
project descriptions use 15px, reducing to 14px. Service titles use 20px
and 18px on mobile; project titles use Unbounded 400 at 23px and 20px.
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

**The Type Roles Rule.** Use Unbounded for titles, Space Grotesk for reading
and actions, and JetBrains Mono for telemetry and code on either surface.

## Layout

The landing uses native document flow, with two photographic scenes and
centered content sections. With motion enabled, the hero occupies 300svh
and the work introduction 230svh; each contains a sticky 100svh stage.
Services, the real project cards after the work scene, and contact remain
in normal flow. Their panels have a 100svh minimum height, 140px 70px
padding and 1040px composition width. The hero composition caps at 1160px
and uses 110px 40px 80px padding. These are the current homepage's
compositions, not compulsory templates for every future surface.

A close crop of the generated astronaut fills the hero foreground over lunar
terrain; the 220px framed portrait introduces services. Services form three columns
and shipped products a two-column pair. Below 800px, the hero copy sits
near the bottom of its stage with 100px 25px 104px padding. The astronaut and
landscape crop widen while retaining the same depth travel. The portrait
becomes 150px above the services copy; services and products stack into
one column. Content panels use 100px 25px padding, with 22px side padding
below 360px. The header has a stable dark backing (`#05060aeb`) at every
scroll position and width, with safe-area top padding on mobile. Its Work
shortcut hides while language and booking controls remain. Below
360px, the header booking arrow hides and the name may wrap to preserve
the controls without horizontal overflow.

Motion works at every viewport width and height. Reduced motion or pause
removes the tall scene lengths and sticky positioning, retaining static
100svh imagery and normal content flow. Short viewports adapt the hero's
type and padding without disabling animation. Section anchors remain
native; sections are never fixed or made inert. Without JavaScript, the
same static content remains available and enhancement-only controls hide.

The cockpit remains a locked 100vw × 100dvh stage. HUD chrome pins to the
edges, the Three.js scene owns the center, and dock/intro overlays cover
the scene. Keep its viewport lock scoped to the cockpit route.

## Elevation & Depth

Landing depth comes from separate raster planes: the closely framed
astronaut moves past the viewer as the lunar terrain approaches, typography
recedes, and the same full figure pulls back before the real app cards.
Portrait, project pair and contact landscape have separate parallax travel.
CSS perspective, translation, rotation, clipping and opacity create depth.
GSAP 3.15 ScrollTrigger maps native scroll to scene and parallax progress,
with a 0.3-second scrub response and linear progress. CSS owns sticky
positioning; there are no pin spacers or application-owned animation loop.

The Canvas 2D background uses 700 subtle points, a 1.5 DPR cap and 0.5 layer
opacity. It redraws with scroll/layout updates, with no autonomous star
animation. Photographic shading protects text contrast. No WebGL or
animation is required to read content or reach email and project links.
Landing controls have no glow or drop shadow; hover moves enabled booking
controls by two pixels and project captures by seven pixels.

Cockpit chrome uses the same flat dark panels, ivory hairlines and orange
state feedback. Decorative halos, scanlines, metal fasteners and inset
metal highlights have been removed. The 3D scene retains its lighting,
planet effects and functional signals; those are scene depth, not a control
material. The Unbounded outline/solid world wordmark is a CanvasTexture
with a steady warm light, without an extruded or pulsing sign.

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
lifts the control, and shifts its SVG arrow. Focus-visible uses a two-pixel
orange outline with six-pixel offset across landing links and buttons.

The hero pairs booking with the secondary “Play my CV” / “Gioca al mio CV”
link to the current locale’s cockpit. It has an outlined SVG play symbol,
ivory text and an understated bottom hairline; hover turns text and line
orange. Minimum height is 48px on desktop and 46px on mobile. The flexible
action row can wrap; the play label reduces from 14px to 12px on mobile and
11px below 360px. Keyboard focus restores the hero copy’s visibility and
position during scroll, keeping the link reachable even after its scene fades.

**Booking state:** all three booking controls are currently disabled at
full opacity, with the muted orange state fill and border. The owner has
explicitly deferred Cal.com setup; this is an accepted state for this
phase. Their labels and styling do not establish an operational booking
path. Connecting the approved URL later does not change this visual world.

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
There is no landing form.

### Cards / Containers

Project evidence uses thin rectangular dark frames containing two real
localized App Store captures, staggered vertically. The whole project is
a link, with a circular ivory arrow indicator and text below the frame.
Frames are 380px tall with 30px 30px 0 padding, changing to 310px with
24px 25px 0 padding on mobile. Hover brightens the border and lifts the
captures. Services use open text rows with top hairlines and no icons or
filled card backgrounds.
Cockpit containers use the shared Panel fill and thin Frame Line border.
Dock headers use Panel Light; content remains in a readable scroll area.
The dialog is `min(760px, 92vw)` wide and capped at 85vh on desktop; mobile
uses a full 100vw × 100dvh surface with safe-area padding. Focus trapping,
focus return, Escape and direct section/contact/CV access remain functional
requirements. Public/private access state changes the available content.

### Navigation

The landing header combines the circular photographic avatar/name, a quiet
Work link, the shared EN/IT control and a compact booking control. A bottom-left section picker
uses a dark rectangular menu; its current item is orange, and hover
adds a faint ivory tint behind the existing text. Menu links use 13px
type and 12px 20px padding. Escape closes the picker and returns
focus. A slim right-side progress rail and bottom motion toggle remain
secondary to the content. Enhancement-only navigation is absent without
JavaScript.

The same `BrandAvatar` and `LanguageSwitcher` appear in the cockpit. Language
links preserve the current landing/cockpit route, use an ivory current
state and retain clear focus. The cockpit intro brand and Website action
return to the localized landing. HUD controls preserve direct DOCK, COMM,
section, contact and CV routes alongside the flight controls.

### Signature: Astronaut, photographic identity and outlined display

`public/landing-v2/astronaut.webp` is an original Image Gen reinterpretation
based on a reference render of the existing `public/models/astronaut.glb`.
The octagonal helmet, opaque visor, ivory suit, chest controls, hoses and
orange fittings preserve the toy character. The runtime model is unchanged.
The landing asset has true transparency at 1122 × 1402: the hero uses a 1.7
CSS scale for a close crop, and the work scene shows the same full figure.
Raw GLB renders were reference inputs only and are no longer public landing
assets. The generated lunar landscape remains behind the character and
contact. Temporary Oakley rasters were removed. Media provenance is in
`docs/design/brand-media.md` and adjacent asset metadata. The landing
animates still-image layers; it does not scrub video or require WebGL.

The cockpit world wordmark uses the same outlined first name and solid
surname, rendered with Unbounded into a CanvasTexture. The scene updates
that texture after fonts load; its warm light remains steady.

The shared `BrandAvatar` uses `matteo-avatar-v2.webp` (200 × 200), displayed
as a 36px circle on desktop and 32px below 800px. It replaces the former
orbit brand symbol. Services and contact no longer repeat that symbol.
The services portrait uses `matteo-portrait-v2.webp` (768 × 768), cropped in
a 7:8 frame at 220px desktop and 150px mobile with a thin offset outline.

Both personal images derive from the same identity-preserving Image Gen
edit of the owner’s real photograph. Natural skin tone and texture, amber
glasses, curly hair, stubble and the earring retain a recognizable face
with a relaxed, confident expression. The dark background and lighting are
edited; these are generated photographic edits, not untouched originals.
Their provenance is in `docs/design/portrait-provenance.md`. Official app
captures retain their actual UI and colors, documented in
`docs/design/project-assets.md`; they need not imitate the site's palette.

**Not canonized:** compact role/navigation labels and remaining tiny helper
text are not templates for decorative kickers or a new small-text scale.
Static detector advisories do not define new rules; isolated legacy values
are not promoted to shared tokens.

## Do's and Don'ts

### Do:

- **Do** share Unbounded titles, Space Grotesk reading/actions and JetBrains
  Mono telemetry/code across landing and cockpit.
- **Do** use thin frames, flat controls, small control corners and clear
  outline/solid display contrast across both routes.
- **Do** preserve keyboard focus, native anchors, readable content and
  reduced-motion behavior in both languages.
- **Do** preserve the toy character across the existing cockpit model and
  original generated landing artwork, with recorded provenance.
- **Do** use the matching natural avatar and services portrait derived from
  the owner’s photograph, alongside actual shipped product imagery.

### Don't:

- **Don't** restore the orbit brand symbol, service-row icons or raw GLB
  renders as landing artwork.
- **Don't** restore the separate Orbitron/Rajdhani font system or decorative
  cockpit glow, scanlines and metal fasteners.
- **Don't** turn HUD signal colors into general marketing accents or
  monospace telemetry styles into body and action typography.
- **Don't** make reading or contact depend on animation, JavaScript or
  completing the cockpit.
- **Don't** represent the disabled booking controls as working until the
  owner's exact destination is supplied and verified.
