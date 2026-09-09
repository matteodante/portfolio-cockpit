# Matteo portrait and avatar provenance

## Current approved integration — portrait v5

The owner approved the natural black-polo hero and a close-up derived from
that same hero, then authorized all remaining site images, commit and push.
The family sunset photograph supplies the hero identity (man on the right).
The suit portrait was rejected. The close-up keeps the hero's glasses,
natural smile, black polo and color, communicating the same informal confidence.

- Hero/Person: `public/landing-v2/identity/matteo-polo-v1.webp`,
  960×1200, 52,638 bytes; cropped above the shorts length.
- Services: `public/landing-v2/matteo-services-hero-closeup-v1.webp`,
  560×640, 38,956 bytes; close-up Image Gen edit of the approved hero.
- Avatar/icons/profile-photo: square CSS layout of that close-up,
  top aligned to preserve the full hairstyle, followed by image encoding.
- All twelve social images and localized project covers use the exact
  hero, existing lunar background and existing fonts. No new face generated.
- The folded-arm astronaut and the original CV photo/PDFs are unchanged.

Exact prompts, reference roles and master paths are in
`assets/portrait-options/polo-preview.json` and adjacent image origins.
See [identity-release.md](identity-release.md) for validation and deployment.
Older approved/rejected versions below are retained as history only.


## Historical integration — portrait v4

Both current portraits are approved and the owner authorized commit/push.
The release extends them to all site portraits, avatar/icons, twelve social
cards and localized project covers. It uses the exact approved photographs
through CSS image layout; no further generative face changes. Superseded
runtime portraits are removed. See [identity-release.md](identity-release.md).

Owner correction: the CV keeps the earlier photo. Public and protected PDFs
and `public/images/profile-pic.jpeg` are restored byte-for-byte; the separate
`profile-photo.jpeg` uses the new approved close-up.

## Historical correction — photo roles before v5

Attachment `A7C4C9E2-7CB1-43B2-A5AC-1F060B6E2B69` assigns Photo 1 to the
hero face and Photo 3 to body proportions. The owner explicitly approved
the resulting hero: "Foto hero perfetta". Its folded-arm pose, dark
background and all hero assets remain unchanged.

The services portrait now uses the man on the left in the new boat selfie,
attachment `B7F1C78D-2DF1-4363-BAA5-02564ADC60B1`: his natural smile, no
glasses, close framing, black T-shirt and monochrome treatment. This sole
face reference replaces the earlier Photo 2 portrait. The prior rejected
services derivatives are removed; generated originals and exact prompt
history remain. Both current photographs were made with built-in Image Gen.

| Current asset | Dimensions | Bytes | Source and use |
| --- | --- | --- | --- |
| `public/landing-v2/matteo-portrait-v4.webp` | 960 × 1200 | 78,154 | Photo 1 face and clear glasses, Photo 3 body proportions, previous hero pose/framing only. Human hero and Person schema. |
| `public/landing-v2/identity/astronaut.webp` | 960 × 1200 | 115,138 | Original folded-arm counterpart restored byte-for-byte from `eb0606b`, including its provenance. |
| `public/landing-v2/matteo-services-closeup-bw-v2.webp` | 560 × 640 | 34,792 | Latest boat selfie only; natural smile without glasses, close-up, black and white. |

The hero pair totals 193,292 bytes. Images have opaque near-black
backgrounds; no gray studio rectangle or fake transparency is intended.
Only resize/crop and WebP encoding happened outside Image Gen. Exact prompts,
reference roles and original generated paths are in
`assets/portrait-options/hero-services-correction.json` and adjacent origins.

The existing 7:8 services frame remains 220px/150px, now filled by the
close-up. Shader, timing, interaction, avatar and social artwork retain
their existing implementations. Updating the historical matteodante.it
project capture is deferred at the owner's request.

This correction is outside the earlier independent static-asset SHIP review.
Computer Use confirmed the Mac is locked; current desktop/mobile browser
layout and animated plate registration cannot be verified. Local asset and
automated verification for this correction lives under
`.impeccable/tmp/portrait-correction/`; older screenshots are not its evidence.

The preceding hero/Photo 2 correction passed `bun run check` (36 tests, 502 assertions),
production build, EN/IT markup and Person image references, all three served
image payloads/dimensions/hashes, and the optimized services image response.
Impeccable reported zero anti-patterns and 45 existing typography advisories.
React Doctor scanned three changed files with no reported issues (score 64;
the hero's existing effect is unchanged apart from its asset path).
Desktop/mobile-sized image previews were inspected together; these are
resized assets, not browser screenshots. No commit or push is part of this
correction.

The latest services-only refinement has separate evidence under
`.impeccable/tmp/services-face-v2/`. It preserves the hero image, astronaut,
hero component and Person path byte-for-byte. Its original generated source
and exact prompt are in the new asset's `.origin.json`; resized 220px/150px
image previews do not constitute browser layout validation.

This services refinement passed the production build, `bun run check`
(36 tests, 502 assertions), Impeccable (zero anti-patterns; existing type
advisories), and React Doctor (no issues, unchanged score 64). EN/IT HTML,
served image hashes and optimized image response passed HTTP verification
after restarting port 3001. The hero hashes match the values recorded before
the edit. Computer Use again reported the Mac locked, so browser inspection
remains pending; no new layout or motion validation is claimed.

## Previous approved identity — 2026-09-09

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

## Previous replacement derivatives

| Asset | Dimensions | Bytes | Derivation and use |
| --- | --- | --- | --- |
| `public/landing-v2/matteo-portrait-v3.webp` | 960 × 1200 | 75,748 | Previous exact approved master; superseded for hero and Person by the correction above. |
| `public/landing-v2/matteo-avatar-v3.webp` | 200 × 200 | 5,160 | Image Gen square headshot edit of the approved master; shared `BrandAvatar` and icon source. |
| `public/landing-v2/identity/astronaut-v2.webp` | 960 × 1200 | 118,722 | Previous arms-at-sides counterpart; superseded by the restored folded-arm plate. |
| `public/social/hero-background-v2.jpg` | 1200 × 630 | 128,987 | Image Gen composition using the approved identity and existing lunar background. |

The previous hero pair totaled 194,470 bytes. The avatar retains its circular
CSS display across landing, commercial pages and cockpit. Renderer, timing
and pointer behavior are unchanged by either asset replacement.

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

## Previous replacement verification — 2026-09-09

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
