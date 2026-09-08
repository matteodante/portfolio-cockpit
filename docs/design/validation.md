# Homepage cinematic scroll validation

Earlier cinematic prototype. The later shared-identity implementation is
recorded in `unified-validation.md`; its new media replace these placeholders.

2026-09-08. EN/IT homepage. Local production preview through Tailscale;
no public deployment.

## Scope

The owner requested larger photographic media and cinematic 3D parallax
inspired by Oakley Axiom Space. GSAP ScrollTrigger now drives separate
helmet, landscape and text layers on both desktop and mobile. Hero and
work stages remain sticky during their scroll sequences; real products
and contact retain native document anchors. The personal portrait now
introduces the services.

This phase uses still-image placeholders, not video playback or a canvas
frame sequence. The owner authorized temporary source media and deferred
original media generation. Cal.com configuration is also explicitly
deferred to a later session together: the three booking controls remain
disabled. Email and public project links remain available.

## Review outcome

The fresh Impeccable review found the current placeholder direction and
required captures valid. Its one material fix was stale design-system
documentation. The documenter updated DESIGN.md and its JSON sidecar;
the reviewer scored that persistence fix resolved, disposition `ship`.
This verdict scores the listed fix. The artifact doctor found no schema
errors; it mentions the still-unset global build-path preference, which
this explicitly reference-led task does not decide for future sessions.

## Verification

- `bun run check`: Biome, strict TypeScript and 17 tests pass.
- `bun run build`: passes. Existing file-tracing warning through
  encrypted-asset loading and OG image glyph/z-index warnings remain.
- Impeccable detector, one run: zero primary findings; 51 advisories,
  mostly type steps absent from the previous sidecar and the new opaque
  disabled-control fill. These are recorded by the scoped documenter.
- Impeccable provenance scan: 13 rasters, zero missing provenance.
- React Doctor changed-file scan plus explicit scan of both untracked
  landing components: no errors, one component-size advisory in the motion
  component. The changed-file scan also notes an existing array-iteration
  pattern in the layout. Its maintainability subsystem could not complete,
  so no whole-project score or complete analysis is claimed.
- Batched browser inspection: Italian 1440×900 and 390×844, English
  320×740, actual 1280×720 window, and 720×450 reflow equivalent to a
  1440×900 viewport at 200% zoom. No horizontal overflow at tested widths.
- Confirmed hero progress 0 → 0.8 on mobile, independent 3D transforms,
  and reverse native scroll returning progress to zero. Full motion is
  active at all tested viewport sizes.
- Native anchors to services/work/contact, menu Enter/Escape and focus
  return, pause preserving the contact position, reduced motion and
  no-JavaScript fallbacks verified. Image-request failure leaves the
  offer and text readable. No booking was submitted or claimed.
- Production confirmation at 1440×900 and 390×844 through the Tailscale
  address, with loaded placeholder images. English no-JS title and content
  also confirmed in production. `GET /it` through Tailscale returned 200.

Review artifacts are ignored under `.impeccable/review/cinema/`, including
viewport/state captures, source-reference comparisons, detector findings,
React Doctor output and the finish review. Source observations and official
GSAP research are in `docs/design/oakley-motion-reference.md`.

## Media budget

The three new WebP placeholders total 259,328 bytes. The route references
438,916 bytes of raster sources in Italian and 436,560 in English,
including portrait and four localized App Store captures. Next/image
negotiates actual transfer sizes. The portrait PNG is an unused generation
master. These are source-size measurements, not field performance data.

The source photos are temporary design references, not Matteo's work or
partnership evidence; replace them with owned media for the final release.
No Lighthouse score, lead increase or conversion uplift is established.
