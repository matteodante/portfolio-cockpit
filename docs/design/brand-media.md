# Brand media

Generated using the built-in Image Gen tool, with the owner's requested
references. Original media dates from 2026-09-08; the approved portrait
integration below is current as of 2026-09-09. The hero uses photographic
depth layers; Work separately uses the temporary films documented in
[work-video-sequence.md](work-video-sequence.md).

## Astronaut

`public/landing-v2/astronaut.webp` is an Image Gen reinterpretation of a
reference render of the existing `public/models/astronaut.glb`. It preserves
the toy character's octagonal helmet, opaque visor, ivory suit, chest
controls, hoses and orange fittings, with smoother sculpted materials and
warmer cinematic light. The runtime Three.js model is unchanged.

The full figure has genuine alpha, 1122 × 1402, encoded WebP quality 92.
It is retained as a source asset; the current hero uses the photographic
identity pair and Work uses its separate films. Raw
GLB renders were reference inputs only and have been removed from public
landing assets. The identity pair now has its own optional native WebGL
quad; the cockpit's Three.js model is unchanged.

Exact prompt: [astronaut.webp.json](../../public/landing-v2/astronaut.webp.json).
Generated master: `/Users/matteodante/.codex/generated_images/01a08106-7e99-7e90-ae74-8779c820f97d/exec-7e58c4cc-c322-4e3d-98a3-81c6054fc2ed.png`.

## Personal photographs

The owner selected `assets/portrait-options/matteo-a-real-reference.png`
and authorized replacing the site's portraits on 2026-09-09. This approved
photographic edit follows his real reference photos, natural smile,
clear-lens black glasses, short curls, stubble, earring and black T-shirt.
Current files:

- `public/landing-v2/matteo-avatar-v3.webp`, 200 × 200, 5,160 bytes;
  Image Gen square headshot edit of the approved master, circular CSS display.
- `public/landing-v2/matteo-portrait-v3.webp`, 960 × 1200, 75,748 bytes;
  exact approved master resized and encoded only, shared by the human hero,
  services portrait and Person schema through `PERSON_IMAGE_PATH`.

Services retain the existing 7:8 frame. `BrandAvatar` shares the new avatar
across landing, commercial pages and cockpit; favicon, Apple and manifest
icons derive from it. These are photographic edits, not unmodified camera
originals. Old runtime portraits were removed in favor of versioned paths;
source masters and Git history preserve provenance. Existing profile/CV
photos and historical portfolio screenshots are outside this replacement.
See [portrait provenance](portrait-provenance.md) for sources and exact prompts.

## Landscape

`public/landing-v2/lunar-world.webp` was generated with built-in Image Gen,
then encoded as WebP quality 88. Its exact final prompt is in the adjacent
`.webp.json`. The miniature lunar terrain and warm grazing light support
the character without competing with page text. The three temporary Oakley
rasters were replaced and removed; that reference informs motion only.

## Runtime wordmark

The owner requested restoring the original orange 3D MATTEO DANTE sign.
It uses the pre-unification Helvetiker Bold TextGeometry, beveled physical
material with warm emissive light, clearcoat and the original light pulse.
The UI retains its shared Unbounded typography; this lettering belongs to
the 3D scene. Restored source: the parent of commit `803130e`.

## Work relationship logos

The “Chi ho aiutato” section uses the actual brands in the owner's CV
and the additional names the owner explicitly supplied. Team experience,
client/project work and personal products have separate captions; the
rail does not imply endorsements or that every brand is a direct client.

Files live in `public/landing-v2/brands/`. Adjacent `.origin.json` files
record original sources; raster `.webp.json` files record sourced-asset
provenance for Impeccable. Only resizing and format conversion were used.

| Brand | Source |
| --- | --- |
| Pilatus Aircraft | Official header SVG at https://www.pilatus-aircraft.com/en |
| PiùUDITO | Owner's piuudito repository, `apps/piuudito/src/assets/images/piuudito/piuudito-logo-italiano.webp` |
| Hexa Credit Care | https://www.hexacredit.com/wp-content/uploads/2021/02/HEXA-WHITE.svg |
| DonTouch | https://www.dontouch.ch/img/logo-dt.webp |
| Galileo SpA | https://www.galileospa.com/media/immagini/402_n_logo.jpg |
| Fastweb | Official header symbol `v8662a44f` from https://www.fastweb.it/adsl-fibra-ottica/gfx/sprite.svg?rel=6454a29f |
| Sorgenia | https://www.sorgenia.it/sites/default/themes/sorgenia/assets/images/footer/logo-white.svg |
| GymTree | Owner's gymtrainer repository, `brand/assets/gymtree-logo.svg` |
| Maestro | Owner's maestro repository, `content/product/icons/maestro-wordmark.png` |

SVG paths and transparent rasters retain their original silhouette.
CSS presents most logos in white, PiùUDITO in grayscale. Galileo's
official source has a white background: CSS inversion and `screen`
blending remove its visible rectangle on the dark surface; its file
does not have alpha. `claude-local-docs` uses its actual project name
as text because no logo was supplied.

The movement takes inspiration from [Z1's process sequence on Awwwards](https://www.awwwards.com/inspiration/process-z1-digital-studio).
Native vertical scroll drives horizontal travel with `power2.inOut`,
0.55-second GSAP scrub and a small [velocity-driven skew](https://gsap.com/docs/v3/Plugins/ScrollTrigger/getVelocity()/).
The static fallback keeps all ten entries in a grid.

The booking dialog uses Cal.com's [official React embed and UI configuration](https://cal.com/help/embedding/embed-instructions).
No booking is created by opening the calendar.

## Hero identity plates

The hero pairs the approved `matteo-portrait-v3.webp` with
`identity/astronaut-v2.webp` (960 × 1200, 118,722 bytes), generated to follow
the approved relaxed arms-at-sides pose. The pair totals 194,470 bytes and
replaces the old folded-arm plates. Opaque dark studio backgrounds blend
into the existing scene through CSS and the native WebGL transformation.
The renderer, timing and pointer behavior are unchanged. See
[identity-glitch.md](identity-glitch.md) for prompts and verification limits.

## Current verification — 2026-09-09

The approved portrait, avatar, astronaut, social background and icon assets,
plus all twelve localized social cards, received a scoped **SHIP** finish
review with no fixes. Build, checks, provenance and local production HTTP
verification passed. Browser layout, animated registration and cursor/touch
validation remain pending while the Mac is locked; static review does not
establish those behaviors. No public deployment is updated by these checks.
