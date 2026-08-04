---
name: Portfolio Cockpit
description: Matteo Dante's space-toy portfolio — a glossy toy cockpit that really flies
colors:
  thruster-orange: "#ff6b35"
  deep-space: "#05060a"
  ivory-suit: "#f2ede3"
  instrument-bone: "#d4cfc5"
  nebula-grey: "#8f8a97"
  dust-grey: "#8a8680"
  panel-char: "#14120f"
  panel-char-light: "#1f1c18"
  void-ink: "#0b0812"
  hud-green: "#6aff9e"
  hud-amber: "#ffb347"
  hud-red: "#ff5252"
  hud-blue: "#00d9ff"
typography:
  display:
    fontFamily: "var(--font-orbitron), Orbitron, sans-serif"
    fontSize: "clamp(38px, 7.4vw, 118px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "0.01em"
  headline:
    fontFamily: "var(--font-orbitron), Orbitron, sans-serif"
    fontSize: "clamp(34px, 6.6vw, 104px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
  title:
    fontFamily: "var(--font-orbitron), Orbitron, sans-serif"
    fontSize: "clamp(26px, 4.6vw, 72px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.04em"
  body:
    fontFamily: "var(--font-rajdhani), system-ui, sans-serif"
    fontSize: "clamp(17px, 1.6vw, 21px)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-jetbrains-mono), monospace"
    fontSize: "clamp(11px, 1.1vw, 14px)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.32em"
rounded:
  none: "0px"
  pill: "999px"
spacing:
  content-x: "6vw"
  chrome-x: "5vw"
  section-y: "16vh"
components:
  button-primary:
    backgroundColor: "{colors.thruster-orange}"
    textColor: "{colors.void-ink}"
    rounded: "{rounded.pill}"
    padding: "18px 34px"
  button-ghost:
    textColor: "{colors.ivory-suit}"
    rounded: "{rounded.pill}"
    padding: "17px 30px"
  button-nav:
    backgroundColor: "{colors.thruster-orange}"
    textColor: "{colors.void-ink}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
  chip-tag:
    textColor: "{colors.ivory-suit}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  cockpit-button-primary:
    backgroundColor: "{colors.thruster-orange}"
    textColor: "#000000"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  cockpit-button-secondary:
    backgroundColor: "rgba(20, 18, 15, 0.6)"
    textColor: "{colors.thruster-orange}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
---

# Design System: Portfolio Cockpit

## Overview

**Creative North Star: "The Toy Cockpit"**

A toy spaceship cockpit whose instruments really work. Everything in this
system holds two truths at once: the *material* is playful — glossy vinyl-toy
surfaces, a chunky orange astronaut, pill-shaped candy buttons — while the
*function* is precise — real gauges, mono labels, exact tracking, a scene
that runs at 60fps. The playfulness is never sloppy and the precision is
never cold. Bold, essential, technical.

The visual field is almost entirely dark, quiet space (`deep-space`,
#05060a) punctured by very few, very large, very finished elements: one
giant uppercase headline, one glowing character or planet, one orange
action. The confirmed anti-reference is the verbose multi-section
portfolio — many medium-sized blocks of copy and cards. This site says few
things, enormously.

**Key Characteristics:**

- Dark near-black canvas with warm, glossy subjects lit like backlit toys
- One accent color (Thruster Orange) carrying every action and highlight
- Giant uppercase Orbitron paired with tiny wide-tracked mono labels
- Depth through glow and inset light, never grey drop shadows
- Motion is narrative (scroll-scrubbed flight, orbiting planets), honors
  `prefers-reduced-motion` globally

## Colors

A single warm flame against deep space: one orange voice, ivory and bone
neutrals, and four HUD signal colors that exist only inside instruments.

### Primary

- **Thruster Orange** (#ff6b35): the only accent. Every CTA, active state,
  eyebrow label, focus ring, progress hairline, and glow halo. Its alpha
  variants (`#ff6b3555`, `#ff6b352e`) are the glow vocabulary of the whole
  system.

### Neutral

- **Deep Space** (#05060a): the page canvas everywhere — landing sky,
  cockpit void, section backgrounds. Never pure black.
- **Ivory Suit** (#f2ede3): landing text — headlines, chips, ghost buttons.
  Warm, like the astronaut's cream straps.
- **Instrument Bone** (#d4cfc5): cockpit body text on panels.
- **Nebula Grey** (#8f8a97): landing secondary text (body copy, hints,
  footer).
- **Dust Grey** (#8a8680): cockpit dim text (inactive labels, captions).
- **Panel Char** (#14120f) / **Panel Char Light** (#1f1c18): cockpit panel
  surfaces; Light is the hover step.
- **Void Ink** (#0b0812): text sitting ON Thruster Orange (buttons, pills).

### Tertiary

- **HUD Green** (#6aff9e), **HUD Amber** (#ffb347), **HUD Red** (#ff5252),
  **HUD Blue** (#00d9ff): instrument readouts only — gauges, radar,
  status LEDs inside the cockpit chrome. Never used as marketing accents,
  never on the landing.

### Named Rules

**The Single Flame Rule.** Thruster Orange is the only voice of attention
on any surface. If two unrelated elements glow orange at once, one of them
is wrong. HUD colors never leave the instruments.

**The Warm Dark Rule.** Darks lean warm (char, not slate); lights lean
ivory (never #fff). Pure white and pure black appear only as text-on-accent
(#000 in cockpit buttons) and inset shadow lines.

## Typography

**Display Font:** Orbitron (via `--font-orbitron`, fallback sans-serif)
**Body Font:** Rajdhani (via `--font-rajdhani`, fallback system-ui)
**Label/Mono Font:** JetBrains Mono (via `--font-jetbrains-mono`)

**Character:** Orbitron shouts in giant geometric uppercase — the voice of
the hull. JetBrains Mono whispers in tiny, wide-tracked uppercase — the
voice of the instruments. Rajdhani explains in relaxed sentence case — the
voice of the pilot.

### Hierarchy

- **Display** (700, clamp(38px, 7.4vw, 118px), 1.04): hero headline only.
  Uppercase, `max-width` in `em` so it wraps to 2–3 monumental lines.
- **Headline** (700, clamp(34px, 6.6vw, 104px), 1.05): section titles on
  the landing; uppercase.
- **Title** (600, clamp(26px, 4.6vw, 72px), 1.1): mid-tier statements
  (hero mid-flight line, cockpit intro subtitle); uppercase.
- **Body** (400, clamp(17px, 1.6vw, 21px), 1.55): Rajdhani paragraphs,
  `max-width: 560px` on the landing. Sentence case.
- **Label** (400, clamp(11px, 1.1vw, 14px), tracking 0.18–0.32em,
  UPPERCASE): mono eyebrows, chips, nav brand, hints, footer. Eyebrows use
  0.32em; chips and buttons 0.12–0.18em.

### Named Rules

**The Three Voices Rule.** Every text element speaks as hull (Orbitron
uppercase), instrument (mono uppercase, wide tracking), or pilot (Rajdhani
sentence case). No fourth font, no Orbitron body copy, no mono paragraphs.

## Layout

Two spatial models, one system:

- **Landing (cinematic scroll):** full-viewport scenes. The hero is a
  sticky 100svh viewport inside a 500svh scrub track; the clip is the
  layout. Editorial sections below breathe at `16vh` vertical / `6vw`
  horizontal padding, alternate left/right alignment per section
  (01 left, 02 right, 03 left), and cap prose at 560px. Fixed chrome
  (brand + PLAY pill) floats at `5vw` gutters over everything.
- **Cockpit (locked viewport):** a single `100vw × 100dvh` stage
  (`data-viewport-lock` freezes body scroll). HUD chrome pins to the
  edges; the 3D scene owns the center. Overlays (dock, intro) are
  full-screen modals over the scene.

Safe-area insets (`env(safe-area-inset-*)`) wrap every fixed edge.
Single breakpoint `dt: 800px`; the mobile predicate is portrait AND
(coarse pointer OR ≤860px) — keep it in sync between preload hints and
runtime. Fluid `clamp()`/`vw` typography does most responsive work;
layout changes are rare and deliberate.

## Elevation & Depth

**Glow, not shadows.** This system casts light, not grey drop shadows.
Depth outside the 3D scene is conveyed by: (1) orange halos radiating from
active elements, (2) a 1px inset top highlight (`inset 0 1px 0
rgba(255,255,255,0.2)`) that makes controls read as backlit physical
buttons, and (3) warm panel layering (`panel-char` → `panel-char-light`)
for surface steps. Text over imagery uses dark soft text-shadows for
legibility only.

### Shadow Vocabulary

- **Halo rest** (`0 0 10px #ff6b3555`): primary controls at rest.
- **Halo hover** (`0 0 18px #ff6b35aa`): primary controls on
  hover/focus, paired with `translateY(-1px)`.
- **Halo ambient** (`0 0 42px #ff6b3555` / `0 0 64px #ff6b352e`): large
  CTAs and giant headlines' `text-shadow` breathing room.
- **Instrument edge** (`inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px
  0 rgba(0,0,0,0.8)`): secondary cockpit controls at rest.

### Named Rules

**The Glow, Not Shadow Rule.** No neutral/grey `box-shadow` anywhere. If
an element needs separation, it either glows orange (interactive), gains
an inset light edge (physical control), or steps up one panel tone
(surface).

## Shapes

Two silhouettes, chosen by surface register: **pills** (999px) for the
landing's persuade layer — CTAs, chips, the PLAY nav — friendly and
toy-like; **hard rectangles** (0px) for cockpit instruments — buttons,
panels, gauges — crisp like switchgear. Both share 1px borders: Thruster
Orange on controls, `rgba(242,237,227,0.22–0.28)` on quiet chips and ghost
buttons. There is deliberately no middle ground: no 8–12px "card radius"
exists in this system. Ornament comes from the material (glow, inset
light), never from corner softening.

## Components

Every control feels like a physical cockpit command: crisp border, mono or
Orbitron uppercase with wide tracking, immediate luminous feedback.

### Buttons

- **Shape:** pill (999px) on the landing; hard rectangle (0px) in the
  cockpit.
- **Primary (landing CTA):** Thruster Orange fill, Void Ink text, Orbitron
  700 uppercase 0.12em tracking, `18px 34px`, ambient halo
  (`0 0 42px #ff6b3555`).
- **Primary (cockpit):** Thruster Orange fill, #000 text, Orbitron 700,
  letterspacing 3px, `14px 28px`, 1px orange border, halo rest → halo
  hover + `translateY(-1px)`, `transition: all 0.15s`.
- **Secondary (cockpit):** translucent char fill (`rgba(20,18,15,0.6)`),
  orange text, same border; hover fills to Panel Char Light with a soft
  halo.
- **Ghost (landing, e.g. "Email me"):** transparent, Ivory Suit mono
  uppercase, 1px `rgba(242,237,227,0.28)` border, `17px 30px`.
- **Focus:** `:focus-visible` outline 2px in the accent — never removed.

### Chips

- **Style:** transparent pill, 1px `rgba(242,237,227,0.22)` border, Ivory
  Suit JetBrains Mono 11px, uppercase, 0.18em tracking, `7px 14px`.
- **Role:** static tech tags — no selected state exists.

### Cards / Containers

No card component exists on the landing — sections sit directly on Deep
Space. In the cockpit, containers are hard-edged Panel Char surfaces with
inset light edges (see Elevation); internal padding 14–22px.

### Inputs / Fields

- **Style (cockpit access code):** dark translucent field on Panel Char,
  1px border, mono text; label in Label style above.
- **Focus:** border/glow shifts to Thruster Orange.
- **Error:** message line in #ff6b6b-family red, never a red fill.

### Navigation

- **Style:** fixed bar, transparent over the scene; brand = 34×42px logo
  bust + name in mono uppercase 0.24em tracking; PLAY pill right (see
  button-nav). `pointer-events` pass through except on links.

### Signature: The Ascent Hero

The landing hero is a single AI-generated clip (toy astronaut rising from
night clouds to planet-dotted space) scrubbed by scroll: frame-grid
quantised seeks, dt-normalised lerp smoothing, 30fps GOP-8 encode. Overlay
text phases fade against scrub progress (intro out by 26%, mid line
38–76%); a 2px orange progress hairline tracks the top edge. Regeneration
pipeline documented in CLAUDE.md. This is the template for any future
"one clip, one journey" surface.

## Do's and Don'ts

### Do:

- **Do** set every heading in uppercase Orbitron and every eyebrow/label in
  uppercase JetBrains Mono with 0.18–0.32em tracking.
- **Do** use Thruster Orange alpha halos (`55`/`aa` hex alpha) plus inset
  top light for all interactive depth, with `transition: all 0.15s`.
- **Do** keep the canvas exactly Deep Space #05060a and add faint ivory
  starfield specks (1–1.5px radial gradients at ≤0.5 alpha) when a static
  section needs to read as sky.
- **Do** honor `prefers-reduced-motion` for every animation and scrub
  smoothing (snap instead of lerp).
- **Do** put Void Ink (#0b0812) or #000 text on orange — never white.

### Don't:

- **Don't** use grey/neutral drop shadows, or any `box-shadow` that isn't
  orange glow or inset light.
- **Don't** introduce mid-size border radii (8–16px cards): pills or hard
  edges only.
- **Don't** let HUD Green/Amber/Red/Blue out of the cockpit instruments,
  and don't add a second accent color anywhere.
- **Don't** compose surfaces as grids of medium cards with medium copy —
  few enormous elements, generous void, prose capped at 560px.
- **Don't** use stock photography or white-background imagery; every image
  belongs to the glossy toy-space world (see the Replicate pipeline in
  CLAUDE.md).
