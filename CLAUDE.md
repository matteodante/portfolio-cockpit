# CLAUDE.md

Notes for Claude Code in this repo.

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
```

Single test: `bun test path/to/file.test.ts -t "name"`. Bun runs tests
directly. No Jest, no Vitest layer.

`setup:styles` runs before every dev/build and overwrites
`lib/styles/css/{tailwind,root}.css`. Banner says do not edit. Edit
`lib/styles/config.ts` (and re-exported modules: `colors.ts`,
`typography.ts`, `easings.ts`, `layout.mjs`).

## What this is

Two page routes: a scroll-cinematic freelance landing at `/` and the
Three.js cockpit game (the playable CV) at `/cockpit`. Chat + unlock +
gated CV / translations APIs. No CMS, no DB.

## Routing

- `app/[lang]/page.tsx` → landing: server-rendered `sr-only` SEO block +
  poster preload hints + `LandingHeader`/`LandingSections` (server) +
  `LandingHero` (the only client component). The hero is a single
  AI-generated ascent clip (toy astronaut, clouds → deep space) scrubbed
  by scroll: sticky 100svh viewport inside a 500svh track, rAF loop with
  dt-normalised lerp, frame-grid quantised `currentTime` seeks, WebKit
  play()+pause() priming. Assets in `public/hero/`: `ascent.mp4` (1080p
  30fps GOP-8, ~3 MB) + `ascent-m.mp4` (9:16 centre crop) + webp
  posters. Paths and the `?v=` cache-busting token come from
  `lib/constants/hero.ts` (bump `VERSION` on any re-encode);
  `next.config.ts` gives `/hero/:path*` a 24h `Cache-Control` with a
  week of stale-while-revalidate. The hero's `isMobile()` predicate and
  the page's preload media queries must stay in sync. Regeneration
  pipeline (Replicate): nano-banana-pro still → nano-banana-pro edit
  (end frame) → wan-2.7-i2v first+last frame, then ffmpeg re-encode
  (`-g 8 -bf 0`) for scrub-smooth seeking.
- `app/[lang]/cockpit/page.tsx` → `CockpitLauncher` → dynamic-imports
  `CockpitApp` with `ssr: false`. Scene is client-only. The page wraps
  it in `<div data-viewport-lock>`; `global.css` locks body scroll via
  `body:has([data-viewport-lock])` (the landing must scroll, so the
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

- `app/[lang]/layout.tsx` injects JSON-LD from `lib/seo/schemas.ts`
  via `dangerouslySetInnerHTML`. Keep the `// biome-ignore`.
- Fonts via `next/font/google` (Orbitron, JetBrains Mono, Rajdhani)
  → CSS vars `--font-orbitron`, `--font-jetbrains-mono`,
  `--font-rajdhani` (consumed via `lib/styles/typography.ts`).
- `app/sitemap.ts`, `robots.ts`, `manifest.ts`, plus per-locale OG /
  Twitter image generators.
- CV: **public skeletal** versions in `/public/resume/` (cv.md,
  cv.it.md, cv-en.pdf, cv-it.pdf, plus the cv-en.tex / cv-it.tex
  sources). The full / gated versions live as `.enc` blobs under
  `/private/resume/` — see the CV access gate section.

## Conventions

Preferred, but **not** machine-enforced (`biome.json` has no
`plugins` key):

- `@/*` for cross-area imports. Sibling `../` imports inside a
  component folder exist and are fine.
- `next/link` for internal navigation. Legit `<a>`s remain: the
  `mailto:`s on the landing and the `<noscript>` fallback markup in
  `app/[lang]/layout.tsx`.
- No `forwardRef`. React 19 + React Compiler accept `ref` as a prop.

Enforced by tooling (Biome + tsconfig):

- No `<img>` (`noImgElement` is `error`). Use `next/image`.
- Type imports/exports: `useImportType` / `useExportType` are
  `error` in the `.tsx`/`.jsx` override.
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
