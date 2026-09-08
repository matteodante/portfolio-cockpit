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

The cockpit title renders Unbounded into a CanvasTexture: outlined first
name, solid surname. Font loading refreshes it once. The warm scene light
is steady; no pulsing material or dedicated sign animation is used.
