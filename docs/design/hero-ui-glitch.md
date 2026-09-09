# Shared hero optical glitch

Implemented locally on 2026-09-09 after the owner approved direction A in
`hero-ui-glitch-proposal.md`. This is a scoped interaction and navigation
refinement of the existing design, with no new imagery or dependencies.

## Behavior

- `hero-interaction.ts` owns one lifecycle for the existing photographic
  renderer and the new `hero-ui.ts` decorative DOM controller. Position,
  velocity-derived strength, decay and active time come from the existing
  pointer model. No React state updates occur per frame.
- Two aria-hidden copies of the outlined/solid name create local clipped
  slices. The original H1 stays readable and the title disables selection
  during drag. A brief period echo accompanies the identity transition.
- Both hero links retain stationary text and hit areas. A 220ms border
  scan and small arrow displacement share the name/photo's input; the
  secondary CV link uses lower border opacity. Focus-visible removes
  decorative border/arrow motion. Role and offer receive a faint echo.
- Hover is light, mouse drag stronger, and touch stronger still. The DOM
  shift caps at 6.6px and opacity at 0.85. The photographic touch strength
  is unchanged. Passive listeners do not prevent native scrolling or clicks.
- Listeners initialize before decoding images or creating WebGL. Photo/GPU
  failure leaves the composed poster and optional DOM response. Offscreen,
  hidden, paused and reduced-motion states stop/reset the effects. Teardown
  removes listeners, observers, timers, frame requests and temporary styles.

The mobile role is now 11px. Hero actions share a 52px desktop / 48px mobile
minimum height, including short windows. Mobile header booking uses
“Prenota” / “Book”, with a full accessible label. Header Services and the
visible scroll hint link to `#services`; actual service-card destinations
are unchanged. The enhanced hero is 160svh instead of 180svh.

## Verification

Production preview on port 3001, one desktop/mobile inspection batch,
corrections together, then one confirmation batch. Local evidence is under
`.impeccable/tmp/hero-ui/` (ignored review artifacts).

- Inspected 1440×900 IT, 390×844 EN, 320×640 IT and 720×450 IT. The latter
  is a smaller-layout stress test, not a claim of actual browser zoom.
- Observed local title slices and stronger mouse drag, stationary Cal.com
  link bounds and a single accessible H1. The original Cal.com destination
  and localized playable-CV link remain intact.
- Final confirmation: no name selection during drag; both actions measured
  52px at 1440px and 48px at 320/390/720px. The header name fits on one line
  at 320px, without horizontal overflow. Keyboard focus retains a visible
  2px orange outline and no decorative border; EN/IT labels and links fit.
- The services hint reaches the native section anchor after 160svh. Pause
  resets decoration and photographic animation. Emulated reduced motion
  switches to a 100svh static hero and hides the decorative copies.
- Script-disabled navigation retains heading, offer, all service/project
  links and booking controls. Simulated WebGL context loss preserves the
  poster while the DOM input controller continues responding.
- Synthetic touch down/move events reached the stronger capped DOM response
  without preventing default. Native touch dispatch is unsupported by this
  in-app browser; physical-phone drag and first-tap behavior remain to be
  verified on a real device. No touch performance claim is established.
- A 100-interval requestAnimationFrame scheduling probe during mouse input
  measured mean 6.95ms, p95 7.7ms, max 7.8ms in this browser. This measures
  scheduling on the available host, not GPU paint time or field performance.
- `bun run check` (36 tests, 502 assertions) and `bun run build` pass.
  Design detection reports no primary findings and 45 existing advisories;
  artifact doctor only mentions the unset global build-path preference.
  React Doctor scans all five changed TS/TSX files with no diagnostics
  (90/100, unchanged from the first feature scan). Outputs are retained
  with the review artifacts. No award or
  conversion improvement is inferred from this implementation.

The approved hero, services portrait, avatars, social previews, original
CV photograph and PDFs are unchanged. New videos and feedback outside
the hero are separate follow-ups.
