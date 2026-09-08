# Booking, CV action and cockpit navigation

Owner refinement after commit `803130e`, 2026-09-08.

- All three booking CTAs link to the confirmed
  `https://cal.com/matteo-dante`. The hero link was followed in the browser
  and opened the public “Talk with me” event (Cal.com redirects to
  `/matteo-dante/30min`). No appointment was selected or booked.
- The hero CV link is a dark filled, squared button with visible focus.
  Both actions fit at 1440, 390 and 320 pixels.
- Cockpit avatars return to the localized homepage before and during
  gameplay. The active-game desktop link was activated with Enter and
  returned to `/it`; the mobile avatar click returned to `/en`. Targets
  are 44 × 44 pixels; desktop overrides the HUD's pointer-events:none.
- The original orange extruded scene sign was restored from the parent
  of `803130e`, including its physical material, light and pulse. This is
  an explicit owner exception to the shared Unbounded interface typography.
  The restored asset is code and bundled typeface data; no new raster.
- Desktop/mobile intro and HUD captures show the intended states.
  Evidence: `.impeccable/review/controls/`.

`bun run check` passes Biome, strict TypeScript and 17 tests. The scoped
Impeccable detector reports zero primary findings and 50 advisory notes.
React Doctor examined 7 changed files and reported no issues (score 75;
no comparable baseline score is available, so no improvement is claimed).

Previous validation documents record their own earlier snapshots; their
booking deferral and CanvasTexture descriptions are now superseded.
