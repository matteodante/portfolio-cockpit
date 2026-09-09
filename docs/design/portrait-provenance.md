# Matteo portrait and avatar provenance

## Approved identity — 2026-09-09

The owner selected `assets/portrait-options/matteo-a-real-reference.png`
and authorized replacing the site's existing portraits: “Ok usiamo me per
sostituire le attuali sul sito”. The master is an Image Gen photographic
edit based on the owner's supplied real photos, including the smiling
clear-glasses selfie and supporting boat/night photographs. It preserves
the approved natural smile, clear-lens black glasses, short curls, stubble,
earring, black T-shirt and relaxed arms at the sides. It is not an
unmodified camera original.

The exact source prompt and reference history are in
`assets/portrait-options/matteo-a-real-reference.origin.json` and
`public/landing-v2/matteo-portrait-v3.webp.origin.json`. The integration
prompts and generated master paths are in
`assets/portrait-options/site-integration.json`; they are not repeated here.

## Runtime derivatives

| Asset | Dimensions | Bytes | Derivation and use |
| --- | --- | --- | --- |
| `public/landing-v2/matteo-portrait-v3.webp` | 960 × 1200 | 75,748 | Exact approved master, resized and encoded only; human hero, services and Person schema share `PERSON_IMAGE_PATH`. |
| `public/landing-v2/matteo-avatar-v3.webp` | 200 × 200 | 5,160 | Image Gen square headshot edit of the approved master; shared `BrandAvatar` and icon source. |
| `public/landing-v2/identity/astronaut-v2.webp` | 960 × 1200 | 118,722 | Image Gen counterpart following the approved relaxed pose and existing toy design. |
| `public/social/hero-background-v2.jpg` | 1200 × 630 | 128,987 | Image Gen composition using the approved identity and existing lunar background. |

Services retain the existing 7:8 CSS frame; the avatar retains its circular
CSS display across landing, commercial pages and cockpit. The human hero
receives no further generative edit. The hero pair totals 194,470 bytes;
renderer, timing and pointer behavior are unchanged.

The new 512px app icon, 180px Apple icon, 48px favicon payload and
`public/social/avatar-v3-{192,512}.png` derive from the same avatar.
All twelve EN/IT social cards retain their fonts and layout, with
`?v=portrait-3` on their metadata URLs. See
[identity-glitch.md](identity-glitch.md) and
[social-metadata.md](social-metadata.md) for implementation and validation.

Adjacent `.webp.origin.json` records and Impeccable `.webp.json` manifests
preserve the exact prompts and processing. `public/social/origin.json`
records the social composition, icon derivation and previous background.
The prior public portrait/avatar and folded-arm plate files were removed
in favor of versioned replacements. Previous generations remain in Git
history and original tool masters. Existing `public/images/` profile photos,
CV imagery and real historical portfolio screenshots are outside this
replacement; screenshots show their earlier UI, not the current layout.

## Verification boundary — 2026-09-09

An independent finish reviewer inspected the current static assets and all
twelve social outputs and returned **SHIP for static assets/socials only**,
with all five review sections complete and no fixes. Current social evidence
is in `.impeccable/review/portrait-integration/home-it.png` and all
`{page}-{it,en}-small.png` files alongside it.

Local checks passed: `bun run check` (31 tests, 191 assertions),
`bun run build`, asset dimensions/hashes, served images, metadata, Person
schema, optimized services portrait, social render equality and icon payloads.
Provenance found 31 rasters with no missing records. Impeccable found zero
primary issues and 45 existing typography advisories; React Doctor retained
the existing marketing-page complexity warning and score 63 from the earlier
proof work. Logs are in `.impeccable/tmp/portrait-integration/`.

Computer Use confirmed the Mac was still locked this turn. Fresh
desktop/mobile page layout, animated plate registration, cursor/touch,
motion fallback and GPU behavior remain unverified. Earlier browser reviews
and historical proof captures do not validate this replacement. The public
deployment and live platform caches are not updated or verified; no commit
or push is included.
