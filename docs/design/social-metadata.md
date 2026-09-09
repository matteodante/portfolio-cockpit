# Social previews and metadata

The sharing previews extend the existing homepage hero: the owner-approved
smiling portrait of Matteo with clear-lens black glasses and arms at his
sides, lunar terrain, near-black, ivory and orange.
The user requested this identity for all Open Graph and related metadata.
This is a fixed raster composition; the website layout and motion are unchanged.

The owner requested Matteo himself in every sharing image, replacing the
astronaut. On 2026-09-09 he approved
`assets/portrait-options/matteo-a-real-reference.png` for the site portraits.
Image Gen placed this identity into the existing lunar composition;
`public/social/hero-background-v2.jpg` is 1200 × 630 and 128,987 bytes.
The homepage still alternates Matteo and the astronaut; only the sharing
images switch to Matteo exclusively.

## Images and routes

`lib/seo/social-image.tsx` renders one 1200×630 composition with Next
ImageResponse. It combines `public/social/hero-background-v2.jpg`, locally
bundled Unbounded 900 and Space Grotesk 500, the owner's name and concise
localized copy. No fonts or images are fetched from external services when
rendering. `lib/seo/social.ts` owns copy, URLs and metadata descriptors.

Six destinations have independent EN/IT previews:

- Homepage: `/social/{en|it}/home.png`.
- Website development: `/social/{en|it}/websites.png`.
- App/software development: `/social/{en|it}/apps.png`.
- AI automation: `/social/{en|it}/ai.png`.
- PiùUDITO case study: `/social/{en|it}/piuudito.png`.
- Playable CV: `/social/{en|it}/cockpit.png`.

These twelve endpoints are prerendered at build time. The existing localized
`opengraph-image` and `twitter-image` endpoints also use the new homepage
renderer. Explicit page metadata selects the matching image; the homepage
sets its images at page level because Next's file metadata would otherwise
supersede the layout images. Both social formats include localized alt text;
Open Graph declares PNG and 1200×630 dimensions.
`socialImageUrl` appends `?v=portrait-3` to every preview URL to distinguish
the updated artwork from earlier cached previews. Font, copy placement and
layout are unchanged; localized alt text describes the smile and clear
black glasses.

## Other metadata

Homepage title and description emphasize websites, apps and AI automation,
with the confirmed Italy/Ticino audience. Service and case metadata retain
their specific offer and evidence. Canonical and language alternatives remain
on `https://matteodante.it`.

WebSite, homepage, cockpit and commercial WebPage schemas reference the
matching social image. Person shares `PERSON_IMAGE_PATH` with the human
hero and services portrait: `/landing-v2/matteo-portrait-v3.webp`.
The 512px app icon, 180px Apple icon, 48px favicon payload and
`/social/avatar-v3-{192,512}.png` manifest icons derive from the new
`/landing-v2/matteo-avatar-v3.webp` square headshot edit.

Matteo’s portrait is personal brand imagery. It is not a screenshot of
client work, a client logo or evidence of results.

## Provenance

`public/social/origin.json` records the exact Image Gen background prompt,
approved portrait references, the previous background’s provenance,
format processing and icon source.
The generated JPEG and derived PNG icons contain embedded provenance.
`public/fonts/social-origin.json` and the two OFL files record font sources
and licenses. The social renderer and copy module are the composition recipe.
`assets/portrait-options/site-integration.json` also records the exact
avatar, astronaut and social integration prompts and generated masters.

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
