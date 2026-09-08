# Shared visual language validation

2026-09-08. Owner approved bringing the cockpit and homepage into one
visual identity. Local production preview; no public deployment.

## Implemented

- Unbounded titles and Space Grotesk prose/actions are loaded once by the
  locale layout. Monospace remains for instrumentation and code. The
  Unbounded source variable is distinct from its generated Tailwind alias.
- Shared near-black, ivory and orange palette, circular photo avatar, language
  navigation and flat control treatment. Cockpit panels use thin borders;
  decorative metal fasteners, scanlines and glowing buttons are removed.
- Homepage character imagery is an Image Gen reinterpretation based on
  a render of the cockpit GLB. The lunar background was generated using built-in Image Gen. The
  three Oakley placeholders are removed. Provenance and exact prompt are
  persisted with the assets; details in `brand-media.md`.
- Landing GSAP cinematic scroll remains native and reversible. The
  cockpit wordmark now uses outlined/solid Unbounded with a steady light.
  Gameplay, Three.js world ownership and public/private access stay intact.
- Language switching retains `/cockpit`. The contact Website row points
  to the current locale's homepage, independent of preview base URLs.
- The mobile menu now traps keyboard focus, restores it on close and
  appears above the audio control. Chat controls retain their behavior.
- Cal.com setup remains explicitly deferred; no booking is claimed.

## Checks

- `bun run check` passes: Biome, strict TypeScript and 17 tests.
- `bun run build` passes. Existing encrypted-file tracing and OG glyph /
  z-index warnings remain outside this visual scope.
- One Impeccable detector pass over landing, cockpit chrome/dock and
  shared components: zero primary findings, 52 advisory notes, chiefly
  documentation differences in type steps. No suppression added.
- Original unification provenance scan: 13 rasters, zero missing.
  Latest replacement asset scan is recorded in the identity follow-up.
- React Doctor scanned changed and untracked files. Its two browser-global
  errors are false positives in imperative `buildWorld`, called inside
  `CockpitScene`'s `useEffect`, never during server render. Existing RAF is
  intentional; the unlock handler already guards `submitting`; custom
  dialogs have manually verified focus behavior. Array-iteration and
  component-size warnings are retained. Maintainability analysis could
  not complete; no numeric score or complete clean scan is claimed.
- Desktop 1440×900: landing hero, scroll journey, work scene; cockpit
  intro, HUD, chat. Mobile 390×844: both introductions, scroll journey,
  English menu/contact and no-JS landing. Also 320×740 on both surfaces
  and cockpit at 720×450. No horizontal overflow in narrow captures.
- Shared font family confirmed from computed styles. Native scroll,
  reduced-motion/static landing, no-JS heading and content, dock/menu
  focus loops, Escape and focus return verified. English-to-Italian
  language navigation remains in the cockpit.
- Public CV returns 200; anonymous private translations return 401.
  No private access code, chat message or booking was submitted.
- Final review corrections checked in production: assistant status beside
  title, simplified chat framing, and the internal homepage contact link.
  Preview is bound to 0.0.0.0:3001 for the owner's Tailscale connection.

The character and terrain remain static rasters and add no WebGL dependency
to the homepage. No field performance or conversion improvement is claimed.

Review evidence lives in ignored `.impeccable/review/unify/`. Prior
cinematic-only validation is historical in `validation.md`.

## Identity follow-up

The owner requested a generated astronaut instead of raw model renders,
a circular photo avatar in place of the orbit symbol, removal of the same
symbol from all three service rows, a secondary hero CV link, and more
realistic faces in both personal photos. The final avatar and services
portrait derive from one photographic edit of the real source. The exact
prompts and sources are in `brand-media.md` and `portrait-provenance.md`.

Evidence for this scope is in `.impeccable/review/identity/`: desktop
1440 × 900, mobile 390 × 844 and narrow English 320 × 740. The native
“Gioca al mio CV” link was followed into the Italian cockpit.

Latest checks pass: Biome, strict TypeScript and 17 tests; production build
completed successfully with the same pre-existing tracing/OG warnings.
Scoped static design check: zero primary findings, 38 advisories; no
suppression added. Final provenance scan: 12 rasters, zero missing.
The additional actual 1280 × 720 preview exposed a header contrast issue
over the ivory helmet. A stable near-black header backing addresses it at
all widths; the astronaut composition is unchanged.

The final production capture set includes the corrected stable header at
1280, 1440, 390 and 320 pixels. Both personal photo displays and the
Italian hero-to-cockpit action were confirmed in production. DESIGN.md and
its sidecar now describe the final implementation; the sidecar generation
timestamp was refreshed after the last documentation edit.

Final Impeccable disposition: **ship**. The verdict scores both requested
review corrections resolved: header contrast across the nine refreshed
captures, and design documentation persistence. No visible regression
from those corrections was reported. This verdict is scoped to those two
fixes; the preceding full follow-up review covers the identity refinements.
