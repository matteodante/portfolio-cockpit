# Approved identity release — portrait v5

The owner approved the natural black-polo hero and a close-up generated
from that same photograph, replacing the suit portrait. He then requested
integration throughout the remaining site images, commit and push. The
original photograph in all public/protected CV documents remains unchanged.

## Assets and scope

- Hero and Person schema share `/landing-v2/identity/matteo-polo-v1.webp`,
  960×1200, 52,638 bytes. The approved smile, glasses, body and black polo
  are preserved. The crop keeps the shorts length out of view.
- Services uses `matteo-services-hero-closeup-v1.webp`, 560×640,
  38,956 bytes: approved color close-up derived from that hero, with the
  same smile, glasses and polo. The 220px/150px services frame is unchanged.
- `matteo-avatar-v5.webp` (200px, 6,110 bytes), favicon, Apple icon and
  192/512px manifest icons derive from the exact approved close-up through
  top-aligned square CSS layout and image encoding. The full hairstyle is
  preserved. Favicon wraps a 48px RGBA PNG in ICO.
- All twelve EN/IT social previews and four localized OG/Twitter endpoints
  use the exact hero encoded as `social/hero-portrait-v5.jpg`, with the
  existing lunar background, fonts and page-specific copy. Social URLs use
  `?v=portrait-5`; JSON-LD and sitemap images share those URLs. Alt text now
  describes the black polo and glasses, without a folded-arm claim.
- Localized project covers `website-{it,en}-v5.webp` are actual social
  renderer outputs, labeled as covers. The authentic historical cockpit
  screenshot remains unchanged.
- `public/images/profile-photo.jpeg` uses the approved close-up. The separate
  `profile-pic.jpeg`, public CV PDFs, encrypted private CV PDFs and private
  PDF source files retain the original photograph and bytes.
- The existing folded-arm astronaut, identity shader, timing and input
  behavior remain unchanged. The hero and astronaut poses differ. This
  release does not generate new videos or replace the authorized reference
  films used by the work section.

No new face is generated for avatars, icons, social cards or covers.
Image Gen sources and exact prompts are recorded in
`assets/portrait-options/polo-preview.json`; adjacent origins describe the
encoding and CSS framing. `public/social/origin.json` and the portfolio
manifest record their compositions. Superseded public images were removed;
previous versions remain in Git history and original generated masters.

## Verification — 2026-09-09

- Desktop/mobile browser inspection covered the homepage portraits, shared
  avatar and responsive layout. The project cover was inspected on desktop;
  its mobile image and text remain within the viewport. The new cockpit
  avatar and its return-home link were verified on mobile. No homepage
  console errors/warnings or horizontal overflow were observed.
- The full Italian social card, all twelve 360×189 cards, and avatar were
  visually inspected. Typography and complete faces remain readable.
- `bun run check`: 36 tests and 502 assertions passed. Production build
  passed. Impeccable found zero anti-patterns and 45 existing advisories.
  React Doctor reported no issues in changed components, score 100.
- Production-build HTTP checks passed for all twelve localized pages and
  social images, four OG/Twitter routes, manifest icons and invalid-image
  404s. Served social PNGs exactly match the reviewed renders.
- Canonical/hreflang, JSON-LD, public llms.txt, robots, fourteen sitemap
  destinations and API access/noindex boundaries passed.
- Served asset bytes/dimensions, image optimization and RGBA favicon passed.
  Original public/protected CV bytes and profile-pic.jpeg match the prior
  commit; private PDF sources match the encrypted originals.

Reports, local renders and browser captures are in
`.impeccable/tmp/identity-v5/`. Earlier homepage portrait and identity-cycle
captures are in `.impeccable/tmp/polo-preview/`. This pass does not establish
new touch-strength or GPU-performance measurements. Production deployment
and external social-platform cache refresh need separate observation.

Replicate was checked through the user's Chrome profile and displays its
sign-in screen. No Replicate connector or REPLICATE_API_TOKEN is available
in this session. The login tab is left for the owner; no video generation
or billing change was attempted.
