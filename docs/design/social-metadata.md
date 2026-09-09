# Social images and metadata

The current twelve EN/IT previews share the approved natural black-polo hero,
encoded as `public/social/hero-portrait-v5.jpg`, and the existing lunar
background. `lib/seo/social-image.tsx` uses the exact photo, local fonts and
existing composition. Copy and localized alt text live in `lib/seo/social.ts`;
alt text describes glasses and a black polo, with no folded-arm claim.

`/social/{en|it}/{home|websites|apps|ai|piuudito|cockpit}.png?v=portrait-5`
prerenders at build time. The existing localized OG/Twitter image endpoints
use the same renderer. JSON-LD and sitemap images share these versioned URLs.
Person uses `PERSON_IMAGE_PATH`, the exact approved hero.

`matteo-avatar-v5.webp`, favicon, Apple icon and
`/social/avatar-v5-{192,512}.png` derive from the approved color close-up
`matteo-services-hero-closeup-v1.webp`. Square CSS framing preserves the hair
and face; no new image generation is used for these derivatives. The original
CV photo and PDFs remain unchanged. Current project covers are direct social
renderer outputs, labeled as covers, alongside the historical cockpit capture.

See [identity-release.md](identity-release.md) for the current release and
verification. Sources and recipes are in `public/social/origin.json` and
`assets/portrait-options/polo-preview.json`. The following records concern
superseded assets and do not validate this release.

## Earlier verification — 2026-09-09, before the approved portrait integration

The following records the previous folded-arm background and avatar set.
It does not establish validation of their replacements.

- Inspected the corrected Italian homepage card at 1200×630 and all twelve
  Italian/English cards at 360×189; no clipped content or head. Existing
  photographic icons are unchanged from the prior verified set.
- Production-build HTTP checks passed for all twelve localized pages:
  correct OG/Twitter image, canonical, schema image, dimensions and MIME type.
- All twelve served PNGs match the reviewed renders byte for byte.
- Four previous image endpoints return the new 1200×630 artwork;
  invalid image/locale paths return 404; both manifest icon dimensions match.
- Impeccable detector: zero primary findings, one advisory for the local
  warm-gray subtitle color `#c5c2bb`. Provenance: five rasters, zero missing.
- `bun run check`: 29 tests, 160 assertions. `bun run build`: passed.

A fresh independent finish review of the portrait replacement returned
**ship**: all five review sections completed with no material fixes.
Evidence is in `.impeccable/review/social-metadata/home-it.png` and all
twelve `{page}-{it,en}-mobile.png` captures. This verdict covers the sharing
portraits only. The separate cursor/touch hero interaction still awaits
browser validation after the owner unlocks the Mac at 18:00; this review
does not establish its touch behavior or GPU performance.

Validation covers the local production build. Social platform cache refresh
and the public deployment have not been verified for this change. Original
MiniMax H3 videos and Google account activation remain separate pending work;
see `original-work-video.md` and `../seo/measurement-plan.md`.

## Approved portrait verification — 2026-09-09

The independent finish reviewer inspected the current static assets, the
Italian homepage card at 1200×630 and all twelve EN/IT cards at 360×189.
The verdict is **SHIP for static assets/socials only**, with all five
review sections completed and no fixes. Current captures are in
`.impeccable/review/portrait-integration/home-it.png` and all
`{page}-{it,en}-small.png` files in that directory.

Local production HTTP checks passed for all twelve pages' metadata and
`?v=portrait-3` PNGs, which match the reviewed renders byte for byte; four
legacy image endpoints, two invalid-path 404s and both manifest icons also
passed. Separate checks verified current assets, dimensions and hashes,
EN/IT homepage image descriptions and removal of old portrait references,
Person schema, optimized service portrait and the 48px RGBA favicon payload.
`bun run check` passed (31 tests, 191 assertions) and `bun run build` passed.
Provenance: 31 rasters, zero missing. Impeccable: zero primary findings,
45 existing typography advisories. React Doctor retains the pre-existing
`marketing-page.tsx` complexity warning and score 63 from the earlier proof
work. Logs and `http-check.json` are in `.impeccable/tmp/portrait-integration/`.

Computer Use confirmed the Mac remained locked. Fresh desktop/mobile page
layout, animated hero registration and cursor/touch behavior remain pending;
these static social renders and historical portfolio captures do not verify
them. The public deployment and live social-platform cache refresh have not
been updated or verified for this replacement. No commit or push is included.
