# Opposing scroll-controlled films

Current media update: original MiniMax H3 launch/Saturn films now replace
the initial Oakley pair. See `original-work-video.md` for generation,
encoding and current validation. The playback/lifecycle architecture is retained. The geometry below is
historical: `depth-release.md` supersedes its travel, frame sizes and
internal crop with complete native-aspect planes and a smaller 3D arc.

Scope, 2026-09-09: replace the “Ideas, out in the world” / “Idee diventate
prodotti” introduction, remove the two-app explanatory note in EN and IT,
and retain the two real App Store project links below the scene.

## Reference and visual direction

[Lusion v3 on Awwwards](https://www.awwwards.com/sites/lusion-v3) is listed
as Site of the Year 2023. Its official Awwwards clips were inspected:
[a spatial astronaut sequence](https://assets.awwwards.com/awards/element/2023/09/6516c112a166e447899126.mp4)
and [large interactive media](https://assets.awwwards.com/awards/element/2023/09/6516c2abeb13c196794165.mp4).
The current live Lusion site stalled at its loading screen in the isolated
browser, so the official reference recordings supplied the visual evidence.

The transferable decisions are cinematic media scale, independent depth
planes and a clear typographic foreground. The specific two-film opposing
movement comes from the owner's request, not a claim that Lusion uses this
identical layout. This implementation keeps Matteo's dark space field,
ivory Unbounded lettering, squared film planes and orange booking control.
No Awwwards code or media is included in the shipped page, and no award
quality or conversion improvement is claimed for this implementation.

## Original reference media and provenance — superseded

The previous generated identity assets are still photographs. The repository
contains a jet clip and older cockpit recordings, but no matching original
cinematic film pair. The owner had authorized temporary Oakley reference
media earlier in the conversation; this temporary substitution was disclosed
before implementation.

- `mission.mp4`: Oakley Axiom hero frames 60–170, encoded at 30fps,
  1440×712; 3.7 seconds, 3,391,558 bytes.
- `visor.mp4`: Oakley Axiom visor film, encoded at 30fps, 960×784;
  3.966667 seconds, 1,950,423 bytes. Audio removed.
- Both use H.264/yuv420p, CRF24, a keyframe for each frame and MP4 faststart.
  Total transfer is 5,341,981 bytes (about 5.1MiB), requested near the section.
- Two JPEG posters, approximately 100KB together, retain embedded origin
  metadata. Video comments and `public/landing-v2/work-video/origin.json`
  record source URLs, processing and their temporary status.

These clips are decorative reference material, not Matteo's portfolio work,
an Oakley client claim or AI-generated originals. Replace these four files
with owned films/posters when ready; the component does not depend on their
subjects. Old jet/cockpit recordings and generated astronaut assets remain.

[FFmpeg documentation](https://www.ffmpeg.org/ffmpeg.html) informed the
local encode; [MDN currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)
and [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
supply the playback and scroll primitives. No new dependency was added.

## Motion and fallbacks

A native 280svh scene contains a sticky 100svh stage. The left film descends
112svh while the right rises 112svh across the timeline; mobile travel is
80svh. Unequal frames, opposing rotation/yaw and a small central depth lift
make their paths intersect behind the headline. Internal image translation
moves against each container; the title has its own 12svh drift.

One GSAP progress value drives CSS transforms and both video playheads with
a 0.45s scrub. The videos remain paused: currentTime follows scroll in either
direction. Only one seek may be in flight per video; the seeked event takes
the newest target. Differences below 1/60s are ignored. GSAP layout refresh
explicitly restores the visual progress and frame, avoiding a first-load
poster freeze when fonts or media trigger a refresh with callbacks suppressed.

An approaching-stage observer adds video sources within one viewport of the
section. No MP4 is requested at the initial hero. Seeking is disabled while
the stage is offscreen or the document is hidden. Pause/reduced motion clears
video visibility and motion styles; no-JS and cold reduced mode use composed
posters without video sources. A failed MP4 leaves its poster in place.
Semantic heading, App Store links, booking, keyboard and native scroll remain.

## Original sequence validation and finish — historical baseline

Production Chromium on the development Mac; no physical-phone or field
performance claim. All twelve final captures were opened and reviewed.

- 1440×1000 desktop, 390×844 mobile, 320×740 narrow EN and 720×500 compact
  layout: opposing travel, readable title and zero horizontal overflow.
- Every captured video time is within 50ms of the shared scroll target;
  reversing scroll reverses both playheads. PageDown and native touch
  emulation advance both films; pause/resume restores the matching frame.
- Browser resize retained synchronization within 5ms in the sampled state.
- Initial hero, cold reduced motion and no JavaScript: zero MP4 requests.
- Two 503 video responses leave both loaded posters and the project links.
- Local scrolling sample: 78 seeking events, 16.7ms median/p95 animation-frame
  interval; zero seeking events in each 500ms idle/offscreen sample.
- Both MP4s contain only video streams and a keyframe on every frame:
  mission 111 frames; visor 119 frames. Posters: provenance scan 0 missing.
- The prior brands orbit still restores after the shared pause/resume.
- `bun run check`: 20 tests/62 assertions pass; `bun run build` passes.
  Pre-existing encrypted-file tracing and OG font warnings remain.
- React Doctor changed-React scan: 97/100, no issues. Impeccable detector
  ran once: 0 primary findings, 43 typography-ramp advisories in landing CSS.

The independent Impeccable reviewer returned **ship** for this scoped
sequence, with no material fixes. Its strongest reviewed moment is the
crossing composition. The footage's softness and closely related subjects
remain acknowledged temporary-media limitations; complementary original
films would improve the final art direction. No award achievement is implied.
