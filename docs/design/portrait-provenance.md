# Matteo portrait and avatar provenance

Updated 2026-09-08 with the built-in Image Gen tool (not CLI), following
the owner's request for a convincing, realistic expression in both photos.

## Source and outputs

- Sole identity reference, inspected before generation: `/tmp/codex-remote-attachments/01a08106-7e99-7e90-ae74-8779c820f97d/BBC1B083-B69D-4334-8130-426CDD015256/1-Foto-1.jpg`.
- Generated master: `/Users/matteodante/.codex/generated_images/01a08106-7e99-7e90-ae74-8779c820f97d/exec-9643cea4-eead-4b7e-9ddc-4a40a3e2af75.png`.
- Services portrait: `public/landing-v2/matteo-portrait-v2.webp`, 768 × 768.
- Circular header avatar: `public/landing-v2/matteo-avatar-v2.webp`, 200 × 200.
- Both WebP derivatives use quality 90. Only resizing and format conversion
  were performed outside Image Gen; framing and the circular avatar are CSS.
- The previous generated portrait and avatar were replaced and removed
  from public assets. Generated masters remain at their original paths.

## Inspection

Natural skin tone and texture, recognizable facial proportions, amber
glasses, curly hair, stubble, earring and black crew-neck are retained. The
expression is subtly more relaxed, with an opaque charcoal background.
Both displays use the same image, avoiding inconsistent facial identity.
This is a generated photographic edit, not an unmodified original photo.

## Exact final prompt

```text
Edit this real photograph into a highly believable professional portrait of the EXACT SAME MAN for his personal software-engineer website. Identity-preserving photographic edit. Preserve his actual face, facial proportions, asymmetries, nose, jaw, hairline, curly hair, stubble, amber-tinted thick black glasses, small hoop earring, natural skin pores and black crew-neck T-shirt. Improve only his expression into a subtle, genuine, confident and approachable closed-mouth half-smile, relaxed brow and eyes looking straight at the camera. He should look like this real person on a good day, not a different model. No generic handsome AI face, no facial reshaping, no airbrushed skin, no waxy texture, no exaggerated smile, no teeth. Replace the busy street with a plain deep charcoal studio backdrop and soft natural window-like light, realistic tonal range, neutral skin tone, minimal retouching. Tight head-and-shoulders photograph with the whole hairstyle visible and comfortable space around the head; face centered; upper chest visible. Square 1:1 image used both as a circular avatar and as a larger website portrait, face fits safely within a centered circular crop. Contemporary natural portrait photography, not a render or illustration. No graphics, no text, no border.
```
