# Approved identity release

The owner approved the color folded-arm hero and the smiling monochrome
close-up, requested integration throughout the site and all social formats,
then authorized commit and push. The later CV exception is authoritative:
the previous photograph remains in public and protected CVs.

## Final assets and scope

- Hero and Person image: `matteo-portrait-v4.webp`, 960×1200, 78,154 bytes.
  The approved file is unchanged. The restored folded-arm astronaut keeps
  the existing hero timing, rendering, pointer and touch behavior.
- Services: `matteo-services-closeup-bw-v2.webp`, 560×640, 34,792 bytes.
  The approved file is unchanged; the existing 7:8 frame stays 220px/150px.
- Shared avatar: `matteo-avatar-v4.webp`, 200px, 4,504 bytes. Next
  ImageResponse renders the approved close-up with square CSS cover sizing.
  Icons use the same photograph at 512/192/180/48px. The favicon contains
  an RGBA PNG, as required by the Next ICO decoder.
- Social cards: all twelve localized destinations and the existing
  OG/Twitter image routes render the exact approved color hero with the
  existing lunar landscape, local fonts and page-specific text. Image URLs
  use `?v=portrait-4`; JSON-LD and sitemap images use the same URLs.
- Project covers: localized `website-{it,en}-v4.webp` files are WebP
  encodings of actual social-card output. Alt text identifies them as
  covers. They replace the outdated homepage capture alongside the unchanged
  authentic historical mobile cockpit screenshot. No synthetic UI capture.
- The standalone `profile-photo.jpeg` uses the approved close-up. The
  separate `profile-pic.jpeg` CV source, public PDFs, protected encrypted
  PDFs and local private PDF sources retain the old photo. CV text and
  layout are unchanged. Superseded public site portraits have been removed.

No new face was generated after approval. Image Gen source prompts and
references remain in `assets/portrait-options/hero-services-correction.json`.
New derivatives record CSS layout/encoding and source hashes in adjacent
origins; `public/social/origin.json` and the portfolio origin describe their
compositions. Prior versions remain in Git history.

## Verification boundary

The full homepage card, all twelve 360×189 cards and the avatar were visually
inspected. Face and text remain clear with no clipped headings or hairstyle.
The services portrait was previously inspected at desktop/mobile image
sizes. These are raster inspections, not current browser layout captures.
Computer Use reports the Mac locked. Fresh desktop/mobile layout, hero
motion and new cockpit-avatar browser checks remain unavailable. The
historical cockpit screenshot is evidence of the project, not this release.

Local checks passed: `bun run check` (36 tests, 502 assertions), production
build, Impeccable (zero anti-patterns, existing type advisories) and React
Doctor (nine changed files, no reported issues, score 64).

Production HTTP verification passed for all twelve localized pages and
their social images, all four localized OG/Twitter image routes, manifest
icons and invalid-image 404s. Every served social PNG matches its reviewed
render byte-for-byte. Canonical/hreflang, JSON-LD, llms.txt, robots, fourteen
sitemap destinations and API access/noindex boundaries passed. Twelve
asset payloads and dimensions, image optimization, localized project-cover
markup and the RGBA favicon passed. Public/protected CV binaries and the
old CV photo match the prior commit; private PDF sources match decryption.
Logs and reports are under `.impeccable/tmp/identity-release/`.

The owner authorized commit and push. Public deployment and external
social-platform cache refresh require separate observation; local renders
and versioned image URLs do not establish that platforms refreshed a share.
