# Original Work films — MiniMax H3

Prepared 2026-09-09. **Video jobs have not been submitted.**
The owner requested a modern generation model, suggesting MiniMax H3.
The official H3 model is available on Replicate; the earlier Hailuo 2.3
suggestion is superseded. No Hailuo video was generated or charged.

## Prepared assets

Two first frames generated with the built-in Image Gen tool:

- `assets/work-video/mission-first-frame.png`: the existing original
  astronaut in its lunar environment, wide 16:9 composition.
- `assets/work-video/visor-first-frame.png`: a complementary 4:3 helmet
  detail with the same character, materials, amber light and lunar reflection.

Both reference the original generated astronaut already used in this repo.
The wide shot also references the original lunar background. The close-up
references the wide shot to preserve identity and lighting. The exact image
prompts are embedded in PNG metadata and saved in adjacent origin JSON.
No Oakley imagery or real-person photograph was supplied to these new jobs.

`assets/work-video/h3-jobs.json` holds the exact video prompts and inputs:
model `minimax/h3`, two 6-second clips, `resolution: "2K"`, `ratio: "adaptive"`.
The first-frame file must be supplied as the API's `first_frame_image` URI
when authenticated. No token or generated video URL is stored in this file.

## Motion

The wide shot uses a restrained lateral dolly with foreground parallax and
a slight head turn. The macro shot uses a small opposite camera arc and
traveling visor reflection. Each is one continuous shot: no cuts, typography,
extra characters, material morphing or face reveal. The existing website
scroll timeline supplies the large opposing movements; video does not need
a competing camera stunt.

After generation: inspect both films, encode H.264/yuv420p with no audio,
30fps, per-frame keyframes and faststart; extract matching posters. Preserve
provenance and replace the four live film/poster files only after both pass.
Keep all existing scrolling, accessibility and reduced-motion behavior.

## Access and cost

The official listed 2K price is $0.13 per output second, so the prepared pair
is estimated at $1.56 before retries. This is an estimate, not a payment or
an assertion that generation succeeded. No paid prediction has been sent.

No Replicate token was available in the current shell or this repo's env
files. Computer Use reports that the Mac is locked and cannot automatically
unlock it. Owner was asked to unlock it; browser setup is pending. Vercel CLI
credentials also need renewed sign-in. An automatically started device-login
wait was stopped without changing the account. GitHub reports the preceding
website deploy as successful; this is independent of the expired local CLI.

## Primary sources

- [MiniMax H3 announcement, 2026-07-31](https://www.minimax.io/blog/minimax-h3)
- [Official Replicate H3 model and pricing](https://replicate.com/minimax/h3)

H3 input schema was inspected in the public model-page metadata: 4–15s,
768P/2K, first/last frame, references, adaptive ratio for image-to-video.
