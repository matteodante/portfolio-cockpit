# Social previews and metadata

The sharing previews extend the existing homepage hero: the original
portrait of Matteo with crossed arms, lunar terrain, near-black, ivory and orange.
The user requested this identity for all Open Graph and related metadata.
This is a fixed raster composition; the website layout and motion are unchanged.

The owner subsequently requested Matteo himself in every sharing image,
replacing the astronaut. Image Gen edited the existing lunar composition
using the current human hero plate and photographic services portrait.
The homepage still alternates Matteo and the astronaut; only the sharing
images switch to Matteo exclusively.

## Images and routes

`lib/seo/social-image.tsx` renders one 1200×630 composition with Next
ImageResponse. It combines `public/social/hero-background.jpg`, locally
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

## Other metadata

Homepage title and description emphasize websites, apps and AI automation,
with the confirmed Italy/Ticino audience. Service and case metadata retain
their specific offer and evidence. Canonical and language alternatives remain
on `https://matteodante.it`.

WebSite, homepage, cockpit and commercial WebPage schemas reference the
matching social image. Person uses the existing photographic services
portrait. The favicon, Apple icon and 192/512px manifest icons use the
current photographic avatar, replacing the earlier cartoon icon.

Matteo’s portrait is personal brand imagery. It is not a screenshot of
client work, a client logo or evidence of results.

## Provenance

`public/social/origin.json` records the exact Image Gen background prompt,
original hero portrait references, the previous background’s provenance,
format processing and icon source.
The generated JPEG and derived PNG icons contain embedded provenance.
`public/fonts/social-origin.json` and the two OFL files record font sources
and licenses. The social renderer and copy module are the composition recipe.

## Verification — 2026-09-09

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
