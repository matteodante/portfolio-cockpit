# Homepage depth refinement — 2026-09-09

The owner requested a stronger spatial composition on a 2K desktop:
Services should emerge upward, the brand wall and project transitions
need more space, films should start without cropped tops, and every
project should receive its own scroll treatment. The gallery must lead
with matteodante.it + Cockpit. Contact gets an original ambient film.

## Direction and research

Selected: native HTML planes with CSS perspective and the existing GSAP
lifecycle. This preserves the approved identity and makes depth serve the
reading sequence. A new full-page WebGL scene would add a second rendering
system without helping the offer or project links; a spacing-only adjustment
would not meet the requested depth. The direction brief is retained locally
in `.impeccable/tmp/depth-release/brief.md`.

- [Codrops: On-Scroll Perspective Grid Animations](https://tympanus.net/codrops/2023/08/03/on-scroll-perspective-grid-animations/)
  informed the coordinated plane/rotation approach. This implementation is
  adapted to the existing website and does not copy the demo code.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
  supplies reversible scroll progress and context-owned cleanup.
- [MDN transform-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style)
  informed the perspective/preserve-3d hierarchy. Layer wrappers avoid
  grouping properties that would flatten the intended depth.

## Implemented composition

- Services expands from 1040px to 1480px, with a 220–300px portrait and
  larger heading. Its composition rises 260px, approaches from −360px
  and straightens from 16deg rotateX. Portrait, text and the three cards
  use distinct depth/arrival offsets. The scene settles before normal
  reading; keyboard focus flattens it immediately.
- Brands retains its quiet three-row wall and light velocity impulse.
  The heading now aligns with the 1480px composition; bottom padding is
  180–260px desktop and 150px mobile. No extra horizontal interaction.
- The work films retain 16:9 launch and 4:3 Saturn framing. Initial top
  positions are 16% and 32%, with 7% outer margins. Native 280svh/sticky
  100svh staging and reversible playheads remain. Desktop travel is
  24svh in opposite directions, with 2000px perspective and 120px/90px
  peak depth. Mobile uses 18svh travel and complete 84%/76% width frames.
  Internal overscan and crop counter-translation are removed.
- The gallery begins 160–280px after the cinematic sequence (140px
  mobile), with “Progetti da esplorare” / “Projects to explore”.
  Order: matteodante.it + Cockpit, PiùUDITO, Maestro, GymTree, then the
  compact public company-team experience. The two website presentations
  alternate media/copy; app presentations retain a desktop stagger.
- All four projects have independent scroll progress. Only media moves;
  text, links and reading order stay stable. The website cover/gameplay
  and individual app captures occupy distinct planes. Commercial proof
  rows retain their previous layout and image sizing.
- Contact has a larger headline and original lunar loop. Existing booking,
  email and cockpit links remain normal HTML. No new library, renderer,
  scroll interception, global input handler or animation frame loop.

`section-depth.ts` owns 0.65s service/project progress. The existing GSAP
context owns its triggers and reverses styles on motion mode changes.
`contact-film-motion.ts` observes only the closing landscape and pauses
its video offscreen, hidden or on cleanup.

## Original contact film

Generated through the official Replicate API using the configured Codex
Replicate connection, model `minimax/h3`.
[Prediction](https://replicate.com/p/ay6j2a1r15rmr0d0gzha0wemr4):
`ay6j2a1r15rmr0d0gzha0wemr4`. The approved `lunar-world.webp` is both
first and last frame. Its public source bytes were verified against the
local file before submission. No private image was uploaded.

The prompt asks for a very shallow camera arc, returning to the same view,
stable lunar geometry, restrained amber light, and subtle analog texture.
This is decorative AI imagery, not real mission footage. Exact prompt,
parameters, hashes and provenance are in `assets/work-video/contact-h3.json`
and `public/landing-v2/contact-video/origin.json`.

The 8s 2176×1440 source becomes a 7s silent 1920×1270 H.264 loop, 30fps,
CRF25, GOP60, yuv420p, faststart. Playback begins at source second 1; the
last second crossfades into source seconds 0–1. The encoded loop is
4,151,303 bytes (3.96MiB). Its poster is extracted from the web loop and
contains the original prompt. Source frames were inspected together for
continuity and stable geometry.

The loop has no source URL until Contact is visible with motion enabled.
It never requires autoplay to display the section: rejected playback,
media failure, pause, reduced motion and no JavaScript retain the poster.
Combined possible decorative video transfer, including the two work films,
is 9,962,865 bytes (9.50MiB), loaded at the respective sections rather
than the initial hero. This is a transfer budget, not a field-speed claim.
The model listing estimates $1.04 for the requested eight seconds at 2K;
the final account invoice was not inspected.

## Bounded local review

Production build on the development Mac, with one desktop/mobile inspection
batch, one correction and one final confirmation. Captures and command logs
are in `.impeccable/tmp/depth-release/`.

- 2560×1440 IT: Services is 1480px wide and moves from a tilted raised
  entrance to a settled reading plane. At the sampled entry, arrival was
  0.616, with about 100px upward travel remaining and −138px depth.
- The initial inspection found lateral film overshoot despite corrected
  top framing. Increasing desktop outer offsets from 4% to 7% resolves it.
  Final 2K bounds: launch x47–1300 / y155–901; Saturn x1498–2513 /
  y554–1336. Both complete frames fit the 2560×1440 stage.
- 1440×1000: the work midpoint keeps both paused playheads at 2.968s;
  all four project presentations, copy and actions are legible.
- 390×844 IT and EN: complete initial/midpoint films, stacked services,
  localized gallery title, first cockpit project and contact film inspected.
  At the mobile midpoint both work playheads were 2.980s. No document
  horizontal overflow at 390px or the additional 320×740 EN inspection.
- Project order verified from the DOM. Independent sampled progress values
  include cockpit 0.464, PiùUDITO 0.563, and separate Maestro/GymTree
  values 0.515/0.485. Real captures remain loaded and recognizable.
- Keyboard Tab between service links gives a visible solid focus outline;
  the enclosing service composition becomes flat. Links retain localized
  service destinations and the confirmed `https://cal.com/matteo-dante`.
- Contact has no video source before approaching the section. On desktop
  and mobile it plays muted, with native loop=true and duration=7s.
  Leaving the section pauses it. “Riduci movimento” pauses video, hides
  it and restores the poster. Cold reduced mode requests no contact MP4
  and removes project transforms.
- Blocking the contact video request leaves the poster visible and booking
  usable. With JavaScript disabled the video has no src and all five
  contact/social/cockpit links remain present. These checks concern
  graceful fallback, not a promise that every browser allows autoplay.

Craft review: the larger composition has readable hierarchy at 2K; the
upward Services entrance and project media depth share one visual language;
film edges now fit; spacing separates the brand wall, cinema and evidence;
controls remain usable independently of effects. Verdict: ready for local
preview. No additional visual iteration is needed for this scoped update.

`bun run check`: 36 tests / 502 assertions pass. `bun run build` passes.
React Doctor: no issues across ten changed TS/TSX files, score 90/100.
Impeccable doctor has no schema errors; the existing optional buildPath
mention remains. Static detection has no primary findings and 38 font-ramp
advisories, including the intentional 17px app description. No unrelated
lint suppressions or changes to the original CV photo were introduced.

The preview is available at `http://localhost:3001/it`. Public deployment
and field performance are not verified. This is browser viewport testing,
not a physical-phone or Awwwards-quality certification.
