# Brand media

2026-09-08. Generated using the built-in Image Gen tool, with the owner's
requested references. The landing uses still-image depth layers, not video.

## Astronaut

`public/landing-v2/astronaut.webp` is an Image Gen reinterpretation of a
reference render of the existing `public/models/astronaut.glb`. It preserves
the toy character's octagonal helmet, opaque visor, ivory suit, chest
controls, hoses and orange fittings, with smoother sculpted materials and
warmer cinematic light. The runtime Three.js model is unchanged.

The full figure has genuine alpha, 1122 × 1402, encoded WebP quality 92.
It is framed closely with CSS in the hero and shown full length in the
work scene, keeping one consistent character throughout the scroll. Raw
GLB renders were reference inputs only and have been removed from public
landing assets. No live WebGL renderer was added to the homepage.

Exact prompt: [astronaut.webp.json](../../public/landing-v2/astronaut.webp.json).
Generated master: `/Users/matteodante/.codex/generated_images/01a08106-7e99-7e90-ae74-8779c820f97d/exec-7e58c4cc-c322-4e3d-98a3-81c6054fc2ed.png`.

## Personal photographs

The circular header avatar and framed services portrait use the same
identity-preserving photographic edit of the owner's real photo. The owner
requested a more convincing, realistic face. Final files:

- `public/landing-v2/matteo-avatar-v2.webp`, 200 × 200; circular CSS display.
- `public/landing-v2/matteo-portrait-v2.webp`, 768 × 768; CSS frames the portrait.

Both retain natural skin color and texture, amber glasses, curly hair,
stubble, the earring and black crew-neck. Background and lighting were
cleaned up; expression was directed to be relaxed and confident. They are
generated edits, not unmodified camera originals. See
[portrait provenance](portrait-provenance.md) for the exact final prompt.

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

The hero now uses two registered Image Gen studio portraits: Matteo and
his astronaut alter ego in a matching folded-arm pose. They replace the
hero's use of the full-body astronaut; the work scene keeps that asset.
The new images have opaque dark backgrounds and are composited through
a native WebGL transformation. See [identity-glitch.md](identity-glitch.md)
for source prompts, timing, implementation and research references.
