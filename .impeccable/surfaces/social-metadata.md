---
version: 1
slug: "social-metadata"
primary_target: "lib/seo/social-image.tsx"
related_targets: ["lib/seo/social.ts", "app/social/[lang]/[image]/route.ts", "app/[lang]/opengraph-image.tsx", "app/[lang]/twitter-image.tsx"]
---

# Social previews — the homepage identity before the visit

Mode: Persuade. Code-led extension of the existing hero identity.
Owner request: update all Open Graph and related metadata with images like
the hero of matteodante.it. Preserve the current site and unrelated work.

THESIS: Recognize Matteo and the offer before opening the shared page.
OWN-WORLD: Matteo’s approved smiling portrait with clear black glasses, relaxed arms, lunar terrain,
near-black, ivory, restrained amber and orange, Unbounded and Space Grotesk.
STORY: Name first, actual service/project next, public domain as destination.
FIRST VIEWPORT: A single 1200x630 card with name and localized copy left,
Matteo’s portrait right; recognize both at mobile sharing-preview width.
FORM: Fixed raster output, not a new interactive surface. One shared layout
and original Image Gen background, six page-specific texts in EN/IT.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

QUALITY BAR: accurate original hero identity; coherent custom fonts;
readable name at 360px preview width; no clipped text or head; no old
cockpit grid, overline, stock portrait or client-site-only social thumbnail.
No new world or approved comp is needed for this pinned scoped translation.

Scope includes homepage, website/app/AI services, PiùUDITO case and cockpit;
current photographic favicon/app icons; localized title/description,
OG/Twitter dimensions/alt, manifest and public schema image references.
Do not expose private CV data, invent testimonials or claim SEO gains.
Matteo’s portrait is personal brand identity, not PiùUDITO's work imagery.

Video generation/account setup remains a separate pending task: H3 jobs
prepared; Mac locked and Replicate/Vercel credentials unavailable. No paid
video generation occurred as part of this metadata change.

## Owner correction — 2026-09-09

Use Matteo himself in all sharing images, replacing the astronaut. Preserve
the current name, typography, lunar scene and all twelve localized variants.
The corrected Image Gen background uses the existing hero portrait and
photographic services portrait as identity references. Alt text describes
Matteo in normal black clothing. The homepage keeps both identity states.

Historical status, before the new portrait approval: ship for the corrected portrait sharing images only. A fresh
independent finish review completed all five sections with no material fixes.
Evidence: `.impeccable/review/social-metadata/home-it.png` at 1200×630 and
all twelve `{home,websites,apps,ai,piuudito,cockpit}-{it,en}-mobile.png`
captures at 360×189. All twelve served PNGs match the reviewed output;
the localized page metadata passed local production-build HTTP checks.
This verdict supersedes the earlier astronaut-card review for this surface.
The separate cursor/touch hero interaction awaits browser validation when
the owner unlocks the Mac at 18:00; no current hero capture is available.
This social verdict does not approve the hero interaction or establish
touch behavior or GPU performance. Public deployment and platform cache
refresh remain unverified; H3 videos remain a separate pending task.

## Approved portrait replacement — 2026-09-09

The owner approved `assets/portrait-options/matteo-a-real-reference.png`
and requested its use throughout the site. All twelve sharing previews now
use `public/social/hero-background-v2.jpg`: the approved smiling identity,
clear black glasses, black T-shirt and relaxed arms on the lunar landscape.
Fonts, copy and composition remain unchanged. Metadata URLs append
`?v=portrait-3`; localized descriptions and Person schema use the new identity.
The favicon, Apple icon and versioned manifest icons derive from the new
shared avatar. Prompts and processing are in `public/social/origin.json`.

Current status: **ship for static assets and social cards only**, from a
fresh independent review of `.impeccable/review/portrait-integration/home-it.png`
and all twelve `{page}-{it,en}-small.png` outputs. Local build, 31 tests and
HTTP checks pass; served social PNGs match the reviewed renders. The Mac is
still locked, so this does not validate desktop/mobile page layout, animated
registration, pointer/touch or GPU behavior. Public deployment and social
platform cache refresh remain unverified. See `docs/design/portrait-provenance.md`.
