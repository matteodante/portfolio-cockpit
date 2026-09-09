# AGENTS.md

Shared instructions for Codex and Claude Code in this repo.

Prefer the simplest working solution. Avoid speculative abstractions,
unnecessary layers and hypothetical edge cases. Preserve existing user
work; implement the requested scope.

## Design and conversion work

- Use the global Impeccable skill at `~/.agents/skills/impeccable`,
  managed by `npx skills -g`. Do not install a second copy in this repo.
- Read `PRODUCT.md` for confirmed product truth, `DESIGN.md` for the
  existing visual system, and the target's `.impeccable/surfaces/`
  brief for its purpose. Do not turn proposals into confirmed facts.
- Landing (`app/[lang]/page.tsx`): help visitors understand the offer,
  inspect real work, and contact Matteo. Commercial pages
  (`app/[lang]/[section]/[slug]/`): explain each service and show its evidence.
  Cockpit (`app/[lang]/cockpit/`):
  the playable CV, with accessible routes to sections, contact and CV.
- Space, the toy astronaut, the playful technical voice and EN/IT are
  confirmed identity commitments. Existing fonts, palette, scroll
  lengths and CTA treatment are implementation choices; a redesign
  can replace them according to the brief.
- Show shipped work as evidence. Never invent clients, testimonials,
  conversion improvements, revenue, availability or delivery promises.
- Keep meaningful copy, project links and contact usable without
  animation. Support keyboard, touch and reduced motion. The landing
  must not require WebGL or completing the cockpit to make contact.
- For visual changes, inspect desktop and mobile in one batch, fix
  the findings together, then confirm once. Run relevant static
  design checks as well as `bun run check` and `bun run build`.
- Follow `docs/design-workflow.md`; priorities and proposed measurement
  live in `docs/redesign-roadmap.md`; commercial SEO and GA activation
  boundaries live in `docs/seo/measurement-plan.md`. A click on email is intent, not
  a confirmed lead. No conversion uplift is established without data.

## Stack

Next.js 16 (App Router), React 19.2 + React Compiler, TypeScript strict,
Three.js 0.183 vanilla (NOT R3F), Tailwind v4, Zustand, OpenAI Responses
API. Bun 1.3 (pkg manager + test runner). Biome 2.4. `tsgo` for fast
typechecks. Node 22. EN/IT.

## Commands

```bash
bun run dev              # setup:styles + next dev (Turbopack)
bun run build            # setup:styles + next build
bun run check            # biome + tsgo + bun test (CI-equivalent)
bun run lint:fix         # biome lint --write --unsafe
bun run typecheck        # tsgo --noEmit
bun run typecheck:tsc    # fallback to stock tsc
bun run setup:styles     # regen tailwind.css + root.css from TS config
bun run encrypt:private  # re-encrypt private-src/ → .enc blobs in repo
bun run analyze          # ANALYZE=true bun run build
bun run design:context   # global Impeccable: landing context (once/session)
bun run design:doctor    # Impeccable artifact/schema checks
bun run design:check     # landing static design detector
bun run design:update    # npx skills update impeccable --global --yes
```

Single test: `bun test path/to/file.test.ts -t "name"`. Bun runs tests
directly. No Jest, no Vitest layer.

`setup:styles` runs before every dev/build and overwrites
`lib/styles/css/{tailwind,root}.css`. Banner says do not edit. Edit
`lib/styles/config.ts` (and re-exported modules: `colors.ts`,
`typography.ts`, `easings.ts`, `layout.mjs`).

## What this is

A space-inspired freelance landing at `/`, three service pages and one
PiùUDITO case in EN/IT, plus the Three.js cockpit game (the playable CV)
at `/cockpit`. Chat + unlock + gated CV / translations APIs. No CMS, no DB.

## Routing

- `app/[lang]/page.tsx` → server-rendered `LandingPage` with five
  sections: intro, services, brands, shipped work and contact. All surfaces share
  Unbounded and Space Grotesk; landing composition styles are scoped in
  `components/landing/landing.css`. `LandingMotion` progressively adds
  a subtle Canvas 2D star field and GSAP ScrollTrigger driving photographic
  depth layers. Hero/work scenes use native CSS sticky stages (180/280svh)
  on desktop and mobile. Work has two opposing silent film planes with
  internal crop counter-parallax and an independent title. One GSAP progress
  value with 0.45s scrub controls transforms and paused video playheads;
  layout refresh explicitly restores progress and frames. Sources load only
  near the stage through IntersectionObserver, with no idle/offscreen/hidden
  seeking. Pause, reduced motion, no JavaScript and media errors retain
  composed posters; the real app links follow in normal flow. The brands
  section is a compact wall in normal flow: three slow automatic CSS rows
  move right/left/right over 130/140/125s. Repeated runs make seamless loops;
  all 40 visual copies are aria-hidden and a canonical list exposes ten
  real names and relationship captions. An observer pauses CSS offscreen
  or hidden. Passive native scroll adds a gentle speed impulse using short
  existing-GSAP rate tweens and native Animation playback-rate updates,
  capped at 2.25× and returning to 1×. Offscreen/hidden/cleanup cancels
  tweens and resets the rate. Brands has no ScrollTrigger, custom frame
  loop or sticky stage.
  It has no horizontal bar; the global progress indicator hides while
  Brands is active. Pause, reduced motion and no JavaScript show the
  complete four-/two-column static grid. See `docs/design/brand-wall.md`; other
  sections stay in normal flow. Services are three cards: websites from 300 €, apps
  and AI on request. Each dark card link opens its specific localized
  service page. Header, hero and contact booking links remain direct Cal.com links.
  Work adds a PiùUDITO case link with an actual website capture before
  the existing Maestro/GymTree pair; the film sequence stays unchanged.
  `PortfolioEvidence` adds this site/cockpit as a personal project after
  PiùUDITO; `TeamExperience` adds public Pilatus/DonTouch role summaries
  after the apps. Both are also used by website development. Project
  captures live in `public/landing-v2/portfolio/`; cockpit links disable
  prefetch. See `docs/design/portfolio-evidence.md` for evidence boundaries.
  `HeroIdentity` progressively adds one native WebGL quad with two photographic
  plates. `public/landing-v2/identity/matteo-polo-v1.webp` is the approved
  natural standing hero: black polo, glasses and smile, based on the man on
  the right in the owner's sunset family photo. Its crop excludes shorts.
  Hero and Person schema share `PERSON_IMAGE_PATH`. The existing folded-arm
  `identity/astronaut.webp` remains unchanged. Both plates are 960×1200 with
  near-black backgrounds; their poses differ. Services uses the approved
  `matteo-services-hero-closeup-v1.webp` (560×640), derived from the same hero
  with glasses, polo and natural color, in the existing 220px/150px frame.
  The owner rejected the suit portrait. Asset replacement preserves the
  renderer, timing and pointer behavior; exact source prompts are in
  `assets/portrait-options/polo-preview.json` and adjacent origin manifests.
  Image-derived refraction, tears and chromatic
  displacement alternate Matteo/astronaut every five seconds, starting
  on first load. Cursor movement, tap and passive touch drag add a short local refractive
  wake that distorts the visible identity; touch is stronger and wider than
  mouse drag, and dragging is stronger than hover
  and never reveals the other identity. Native scroll is not intercepted.
  GPU drawing stops outside
  transitions/input decay and offscreen/hidden. The new input behavior
  still needs browser visual validation after the owner unlocks the Mac;
  see `docs/design/identity-glitch.md`.
  A static poster remains when motion is disabled or WebGL fails; the
  landing never requires WebGL for copy or contact. No custom scroll interception. Pause,
  reduced motion and no JavaScript use static imagery and normal flow.
  Content and email links work without JavaScript. Assets in
  `public/landing-v2/` include the approved photographic portrait, localized App Store
  captures, an Image Gen astronaut based on the cockpit GLB render, a
  generated lunar landscape and `matteo-avatar-v5.webp`, a 200px square
  CSS rendering of the approved color close-up, shared through
  `BrandAvatar` across landing, commercial pages and cockpit. Current static assets
  and social cards have local image verification; both homepage portraits
  and the identity cycle were inspected at desktop and mobile sizes.
  The owner explicitly requires the old CV photograph: public/protected PDFs
  and `public/images/profile-pic.jpeg` stay unchanged. The other profile image
  uses the approved close-up. Localized project covers use the actual social
  renderer; the historical cockpit screenshot remains authentic. The hero has a
  secondary localized link to the playable CV. Provenance is stored alongside each raster; source notes in
  `docs/design/brand-media.md`. The earlier Oakley photos were replaced;
  Work now temporarily uses authorized Oakley hero-frame and visor films
  in `public/landing-v2/work-video/` (about 5.1MiB). These are disclosed
  reference placeholders, not generated originals or portfolio work.
  JPEG posters have embedded origins; video metadata and `origin.json`
  preserve provenance. See `docs/design/work-video-sequence.md`.
  Booking links use `CAL_BOOKING_URL` in `lib/constants/contact.ts`;
  the owner confirmed `https://cal.com/matteo-dante`. Keep this exact URL.
- `app/[lang]/[section]/[slug]/page.tsx` → `MarketingPageContent`:
  eight static localized URLs for websites, app/software, AI automation
  and the PiùUDITO case. `lib/seo/marketing-pages.ts` owns paths, metadata
  and schemas; unknown combinations call `notFound()`. Content and normal-flow
  layouts live in `components/marketing/`, sharing landing controls and
  typography. Split introductions, real captures, native FAQs with orange
  open/closed disclosure markers, and cross-service footer links stack on
  mobile. FAQ CSS locally restores markers hidden by the global reset.
  Header/hero Cal links are direct; the final orange CTA uses `BookingPopup`
  with its native dialog, lazy Cal.com embed and direct-link fallback.
  PiùUDITO is one client with three sites: piuudito.it, piuuditogroup.it
  and fabiotomassetti.it. Four actual captures in `public/landing-v2/piuudito/`
  carry embedded origins plus `origin.json`. Maestro/GymTree are labeled
  personal products; the AI page also links to personal `claude-local-docs`.
  These pages do not import the homepage WebGL or cinematic video scenes.
- `app/[lang]/cockpit/page.tsx` → `CockpitLauncher` → dynamic-imports
  `CockpitApp` with `ssr: false`. Scene is client-only. The page wraps
  it in `<div data-viewport-lock>`; `global.css` locks body scroll via
  `body:has([data-viewport-lock])`. Shared font/color/control styles live in
  `lib/styles/css/brand.css`; cockpit composition in `components/cockpit/cockpit.css`
  (the landing must scroll, so the
  layout no longer hardcodes `overflow: hidden` on body).
- `proxy.ts` (root) — Next 16 middleware. Detects locale from
  `Accept-Language` via `@formatjs/intl-localematcher` + `negotiator`
  and redirects `/foo` → `/{locale}/foo`. Matcher excludes `_next`,
  `api`, paths with extensions.
- `app/[lang]/[...rest]/page.tsx` — calls `notFound()`. Without it an
  unknown path under a valid locale falls through to Next's root
  `/_not-found`, which renders outside `app/[lang]/layout.tsx` (no
  fonts, no theme). This routes it to `app/[lang]/not-found.tsx`.
- `lib/i18n/config.ts` — `'en' | 'it'`. Invalid locale → `notFound()`.
- `lib/i18n/index.tsx` — flat-key React context. `useT()` falls back
  to the key. Dotted keys: `cockpit.sections.about.label`.

## Cockpit

`components/cockpit/cockpit-app.tsx` owns three state vars:

- `near` — planet within docking range
- `docked` — section in overlay (or `null`)
- `started` — intro gate. `false` until the player launches; gates the
  chrome, the background music, gameplay input and camera framing.

Composition (single `position: relative` container, `100vw` ×
`100dvh`, `overflow: hidden`):

- `scene/cockpit-scene.tsx` — ~120-line React shell. Holds the refs,
  mounts the canvas div, calls `buildWorld` once in a `useEffect`, and
  re-applies labels on language change. No Three.js logic.
- `scene/build-world.ts` — ~450 lines: the actual world build, the RAF
  loop, post-processing (`EffectComposer` + `UnrealBloomPass`, custom
  god rays), adaptive quality, teardown. Pushes to React via
  `onNearChange` / `onDockRequest` callbacks AND via the Zustand HUD
  store (`setHud`).
- `scene/three/*` — renderer, planets, asteroids, lights, god rays,
  backdrop text, explosion, textures, dispose helpers.
- `scene/player/*` — astronaut, thrusters, input controller, pure
  physics steps + constants.
- `scene/camera/*` — follow camera + constants.
- `scene/blackhole/*` — simulation, shader, config.
- `chrome/*` — HUD. Read-only gauges (top bar, left/right consoles,
  mini radar, cockpit frame) subscribe to `useHud`; `bottom-console/*`
  (DOCK / COMM / actions), `intro-overlay` (access code + start),
  `language-switcher`, `music-toggle`, `mobile-actions`,
  `mobile-game-controls` and `death-overlay` are interactive and call
  back into `cockpit-app.tsx` (or dispatch player events).
- `dock/dock-overlay.tsx` — full-screen modal shell (focus trap, focus
  return). The per-section switch lives in `dock/dock-content.tsx`;
  bodies in `dock/sections/*`.
- `COMM_SECTION` — dock-only. Not a planet. Reached via the
  bottom-console COMM button.

`Escape` undocks. Owned by `cockpit-app.tsx`, not the scene.

## State

- React state (`near`, `docked`, `started`) lives in `cockpit-app.tsx`.
- `lib/hooks/cockpit-store.ts` — `useHud` (Zustand) for HUD gauges
  (`speed`, `coords`, `gravity`, `landed`, `phase`, `nearestId`,
  `orbitAngle`). `setHud` diffs before `setState` so the RAF loop in
  `build-world.ts` can call it every frame without renders. Use
  `setHud(patch)`, not `useHud.setState`.

## Sections data

`lib/data/cockpit-sections.ts` — single source of truth for planet
layout (position, radius, color, emissive, ring/earth flags) and the
`CockpitSectionId` union.

To add a planet:

1. Add an entry to `SECTIONS`.
2. Add `cockpit.sections.<id>.*` keys to both translation files.
3. Add a case to the switch in `dock/dock-content.tsx`.

## Chat API

`app/api/chat/route.ts` is the only chat backend.

- `runtime = 'nodejs'` and `dynamic = 'force-dynamic'`, both explicit
  (the cookie read alone would already opt the route into dynamic
  rendering).
- Zod caps: 8 messages, 500 chars each, 4000 chars total — all three
  from `lib/ai/limits.ts` (`CHAT_MAX_*`), shared with the client for
  history trimming and the composer counter. The tight message cap is
  deliberate: less room for forged-assistant-turn injection.
- Rate limit via `lib/api/rate-limit.ts` (`createRateLimiter`):
  chat 10/60s/IP, unlock 5/60s/IP. Uses Upstash Redis when
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are set,
  in-memory sliding window otherwise. `getClientIp` reads
  `x-vercel-forwarded-for` (signed by Vercel edge). On Vercel, an
  edge Firewall rule adds another layer.
- Moderates the latest user message via `omni-moderation-latest`.
  Fails open if moderation itself errors.
- `openai.responses.create({ stream: true })` → pipes
  `response.output_text.delta` into a `ReadableStream<Uint8Array>` as
  plain text. No SSE framing.
- `INSTRUCTIONS_HEAD` + `PROFILE_PUBLIC` + `INSTRUCTIONS_TAIL` is the
  public system prompt. When `hasAccess()` (cv_access cookie) returns
  true, the private profile is loaded from `lib/ai/chat-profile.enc`
  (AES-GCM, lazy-cached) and replaces `PROFILE_PUBLIC`.
  `{{LOCALE_LANGUAGE}}` is templated per request.
- Model `gpt-5.4-nano` is real and intentional. Do not "fix" it to
  `gpt-5-nano` or any variant. Confirmed by the project owner.

Client: `dock/sections/comm-chat/` — `index.tsx` (shell),
`use-chat-stream.ts` (POST + stream reader + history trimming),
`message-list.tsx`, `message-bubble.tsx` (markdown via
`react-markdown`), `chat-header.tsx`, `chat-composer.tsx`.

## CV access gate

Detailed CV, private translations, and the full chat profile are
gated behind a shared access code. `/llms.txt` is always public.

- `POST /api/unlock` validates a password (`CV_ACCESS_PASSWORD` env)
  and sets an HMAC-signed cookie `cv_access` (`CV_ACCESS_SECRET` env,
  30 days, httpOnly, secure in prod, sameSite=lax).
- `DELETE /api/unlock` clears the cookie.
- `lib/auth/cv-access.ts` — `hasAccess()` reads cookie via Next's
  `cookies()`, verifies HMAC + expiry. `checkPassword` is constant-
  time. Cookie writes via `writeAccessCookie(res)` /
  `clearAccessCookie(res)`.

`/llms.txt` is intentionally **always public** — only the summary
content lives in `lib/seo/llms-content.ts`. No cookie check, no
decrypt, public CDN-cacheable. Robots/LLMs should never see gated
content via this URL.

Gated content is AES-256-GCM **encrypted at rest in the repo**
(`.enc` blobs). The plaintext sources are gitignored under
`/private-src/`. Decryption uses `CV_DECRYPT_KEY` env var
(32-byte base64).

- `lib/auth/secret-box.ts` — `encryptBlob` / `decryptBlob`, memoized
  key.
- `lib/auth/load-encrypted.ts` — `loadDecrypted` /
  `loadDecryptedText` / `loadDecryptedJson` with module-scope Map
  cache (per function instance lifetime).
- `lib/auth/encrypted-paths.ts` — single source of truth for `.enc`
  paths. Imported by both runtime and the encrypt script.
- `scripts/encrypt-private.ts` — `bun run encrypt:private` regen all
  `.enc` blobs from `/private-src/`. Reads `CV_DECRYPT_KEY` from env.

Gated endpoints (all return 401 without a valid cookie):

- `GET /api/cv/md/[locale]` — full CV markdown.
- `GET /api/cv/pdf/[locale]` — full CV PDF.
- `GET /api/translations/[locale]` — private translations JSON,
  merged into the i18n context client-side.
- `POST /api/chat` — not gated by the cookie: it answers either way,
  only the system prompt swaps (`PROFILE_PUBLIC` inline vs. decrypted
  `lib/ai/chat-profile.enc`, per `await hasAccess()`). It still fails
  on its own terms: 400 (bad JSON / bad body / moderation block),
  413 (input over the total-chars cap), 429 (rate limit), 503
  (upstream OpenAI error). A missing private profile degrades to the
  public one instead of erroring.

UI: `components/cockpit/chrome/intro-overlay.tsx` has the password
input. The `lib/i18n/index.tsx` provider fetches
`/api/translations/[locale]` once, and only on `/cockpit` — every
private override key is a cockpit key, and the route is
`force-dynamic`, so mounting the fetch on the landing burned an
invocation per pageview on a guaranteed 401. 200 → merge overrides +
set `unlocked`. The `cvPdfPath(locale, unlocked)` helper picks
`/api/cv/pdf/<locale>` (gated) or `/resume/cv-<locale>.pdf` (static
skeletal) for the Download CV button.

To update private content: edit files in `private-src/`, run
`bun run encrypt:private`, commit the new `.enc` blobs.

## SEO

- `lib/seo/page-metadata.ts` owns shared page metadata construction and
  language alternatives. Canonical, title and social fields belong to each
  page; the layout owns common defaults. Only the cockpit declares a public
  CV Markdown alternative. Every page links the public `/llms.txt` guide.
- JSON-LD describes public identity and visible services/projects. Keep
  detailed employer scope and private CV information out of the shared
  graph. Website pricing is a minimum of EUR 300, not a fixed package.
  Public APIs and standalone JSON records have noindex headers; images
  remain indexable. See `docs/seo/technical-metadata.md` and discovery tests.
- Commercial pages have localized canonical/hreflang, Open Graph,
  WebPage + Service/CreativeWork + breadcrumb JSON-LD, sitemap entries
  and public llms.txt links. This describes content, not measured SEO results.
- `lib/seo/social.ts` owns EN/IT sharing copy, image URLs and descriptors.
  `lib/seo/social-image.tsx` renders the shared 1200×630 Matteo portrait
  composition from `public/social/hero-portrait-v5.jpg` and `lunar-background.jpg`,
  with the exact approved natural smile, glasses and black polo. CSS
  frame-edge masks blend the photo into the lunar background. Locally bundled
  Unbounded 900 and Space Grotesk 500 keep the existing typography and copy.
  `/social/{en|it}/{home|websites|apps|ai|piuudito|cockpit}.png` prerenders
  all twelve previews at build time. Homepage metadata explicitly sets
  page images so Next's file defaults do not override them; the existing
  localized OG/Twitter endpoints also render the new homepage image.
  `socialImageUrl` adds `?v=portrait-5`. Schemas use matching social images;
  Person uses `PERSON_IMAGE_PATH`. Favicon, Apple and manifest icons derive
  from the same approved close-up as `matteo-avatar-v5.webp`; manifest paths are
  `/social/avatar-v5-{192,512}.png`. Local build and HTTP verification are recorded
  in `docs/design/identity-release.md`;
  public deployment and platform cache refresh are not verified for this
  replacement. See `docs/design/social-metadata.md` and the image
  and font origin manifests for provenance and local verification limits.
- `components/analytics/marketing-analytics.tsx` mounts from the locale
  layout. A valid `NEXT_PUBLIC_GA_MEASUREMENT_ID` enables the optional
  consent UI; Google loads only after positive consent. With no ID there
  is no Google tag or consent UI. The fixed choice panel gives both
  buttons equal treatment; preferences remain in normal footer flow.
  The cockpit is excluded. Existing Vercel tools are independent.
  Live Google activation still needs owner login and real IDs. Keep click
  intent, embed booking creation and confirmed outcomes distinct; consult
  `docs/seo/measurement-plan.md` for event definitions and activation checks.
- `app/[lang]/layout.tsx` injects JSON-LD from `lib/seo/schemas.ts`
  via `dangerouslySetInnerHTML`. Keep the `// biome-ignore`.
- Fonts via `next/font/google` in the shared locale layout: Unbounded
  (`--font-unbounded`), Space Grotesk (`--font-body`) and JetBrains Mono
  (`--font-jetbrains-mono`). `lib/styles/typography.ts` maps display/mono/alt
  aliases. Never give a loaded font the same variable as its generated
  Tailwind alias: that creates a circular custom property.
- `app/sitemap.ts`, `robots.ts`, `manifest.ts`, plus per-locale OG /
  Twitter image generators.
- CV: **public skeletal** versions in `/public/resume/` (cv.md,
  cv.it.md, cv-en.pdf, cv-it.pdf, plus the cv-en.tex / cv-it.tex
  sources). The full / gated versions live as `.enc` blobs under
  `/private/resume/` — see the CV access gate section.

## Conventions

Repository conventions for new and changed code (the import and link
preferences are not currently enforced by a Biome plugin):

- `@/*` imports only. No relative imports in new code.
- Use `next/link`, never introduce `<a>` elements. Existing mailto and
  noscript anchors predate this rule; do not expand scope to rewrite them.
- No `forwardRef`. React 19 + React Compiler accept `ref` as a prop.

Enforced by tooling (Biome + tsconfig):

- No `<img>` (`noImgElement` is `error`). Use `next/image`.
- Type imports/exports: `useImportType` / `useExportType` are
  `error` in the `.ts`/`.tsx` override.
- Filenames: kebab-case or camelCase.
- No nested ternaries. Extract to IIFE or helper.
- TS strict + `exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `verbatimModuleSyntax`,
  `noUnusedLocals/Parameters`. Biome's `noExplicitAny` is `error`.
- Format: single quotes, no semicolons, trailing commas `es5`,
  2-space, 80 cols, LF.
- Tailwind: `useSortedClasses` is `error` with auto-fix. Don't
  hand-sort.

## Looks weird, is intentional

- `tailwind.css` and `root.css` are generated. Banner says so. Edit
  `lib/styles/config.ts`.
- `proxy.ts` at root is Next 16's middleware convention.
- Scene is vanilla Three.js, not R3F. Don't convert it. The
  imperative loop bypasses React's render cycle for 60fps stability
  and notifies React only on phase / near / dock transitions.
- `setHud` diffs before writing. Load-bearing for performance.
- `next.config.ts` has `typedRoutes: true`. Some `router.replace`
  literals get cast to `` `/${string}` `` (see `lib/i18n/index.tsx`).
- `COMM_SECTION` exists in `cockpit-sections.ts` but is excluded
  from `SECTIONS` on purpose — dock-only, reached via COMM button.
- `next.config.ts` `outputFileTracingIncludes` is load-bearing: it
  ships the `.enc` blobs into the serverless bundles for
  `/api/cv/**`, `/api/translations/**` and `/api/chat`. Drop it and
  those routes ENOENT in production while working fine locally. Add
  an entry for every new encrypted asset.
