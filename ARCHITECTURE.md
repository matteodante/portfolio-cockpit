# Architecture

Tour of the codebase for contributors. Pairs with `CLAUDE.md` (which
is written for Claude Code agents and is terser).

## Shape

```
matteodante.it
└── one route: /[lang]
    └── CockpitApp
        ├── CockpitScene  (vanilla Three.js, imperative)
        ├── chrome/*      (HUD panels, read from Zustand)
        └── DockOverlay   (full-screen modal, section bodies)
                                  │
                                  └── comm-chat ──► /api/chat (streaming)
```

No CMS, no database, no marketing pages. The site is a single 3D
interactive scene plus a streaming chat endpoint.

## Stack

- **Next.js 16** App Router (Turbopack)
- **React 19.2** with React Compiler enabled
- **TypeScript** strict (`exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)
- **Three.js 0.183** vanilla (NOT React Three Fiber)
- **Tailwind v4** with a generated CSS layer
- **Zustand** for the HUD store
- **OpenAI Responses API** for the chat endpoint (streaming)
- **Bun 1.3** as package manager and test runner
- **Biome 2.4** for lint + format
- **`tsgo`** (`@typescript/native-preview`) for fast typechecking

Node 22 (`.nvmrc`). Bilingual EN/IT.

## Three layers

### 1. The scene (`components/cockpit/scene/cockpit-scene.tsx`)

~1150 lines of imperative Three.js inside a single `useEffect`. It:

- builds the WebGL world on mount, tears it down on unmount
- owns a `requestAnimationFrame` loop independent from React
- runs physics, rendering, and post-processing every frame
- pushes state back to React via callbacks and the Zustand HUD store

Why not R3F: the imperative loop bypasses React's reconciler, which
keeps the 60fps budget intact for the disc/lensing shader. React only
re-renders on phase / near / dock transitions, where chrome updates
are fine.

#### Per-frame work

```
loop(now):
  1. dt = min(0.05, now - last)         # tab-background guard
  2. world.update(dt)                   # planets, asteroids,
                                        # explosion, backdrop
  3. player physics                     # dispatched on phase:
                                        # flying / landed /
                                        # transitioning / dead
  4. astronaut.setTransform(...)        # visual sync
  5. thrusters.update(dt, ...)          # particle emitters
  6. lights.tick()                      # disc/ring pulse
  7. blackHole.update(dt, camera)       # shader uniforms
  8. updateFollowCamera(...)            # lerps from intro pose
  9. cubemap render (if enabled)        # for lensing
 10. composer.render()                  # bloom + god rays
 11. FPS sampler                        # may downgrade quality
```

#### React bridge

Two channels:

1. **Callbacks** — `onNearChange`, `onDockRequest`. Used for
   transitions (rare).
2. **Zustand `useHud`** — `speed`, `coords`, `gravity`, `landed`,
   `phase`, `nearestId`. Used for per-frame gauges. Writes go through
   `setHud`, which diffs before calling `setState`, so 60 Hz calls
   produce React renders only on actual changes.

#### Player physics (`scene/player/`)

Pure functions over a `PlayerState` value:

- `stepFlight(state, input, dt, planets)` — thrust, BH gravity (1/d²
  inside `BH_GRAV_RADIUS`), drag, terminal velocity, hard-collision
  fallback to landing.
- `stepLanded(state, input, dt, nearest)` — tracks the planet as a
  rigid body (rotates the local offset by planet self-spin, translates
  by orbital delta), then applies walk velocity and clamps to surface.
- `stepTransition(state, now)` — ease-in-out-cubic lerp for land /
  takeoff. Tracks the moving planet so the target stays aligned.
- `tryLand` / `tryTakeoff` — gated on distance and radial velocity.
- `updateNearestLocked(state, planets)` — nearest planet by center +
  currently locked section (within `LOCK_SURFACE_DIST` of surface).

Tuning lives in `scene/player/player-constants.ts`.

#### Adaptive quality (`lib/utils/scene-quality.ts`)

Three presets: `low`, `mid`, `high`. Knobs: DPR cap, black hole
ray-marching steps, bloom on/off, god-rays on/off, cubemap on/off and
resolution.

The scene starts at the best preset and steps down when the rolling
1-second FPS average drops below `FPS_THRESHOLD` (40). A 3s grace
window absorbs warmup jitter and a 2s cooldown prevents oscillation.

Forceable via `?quality=low|mid|high`.

### 2. The chrome (`components/cockpit/chrome/`)

Non-interactive HUD panels: top bar, side consoles, bottom console,
the cockpit frame bezel. All read from `useHud` and update only when
their slice changes. None of them write back to the scene.

### 3. The dock (`components/cockpit/dock/`)

Full-screen overlay shown when `docked !== null`. Section bodies in
`dock/sections/*.tsx`:

- `about`, `experience`, `projects`, `skills`, `contact` — static
  content driven by translations
- `comm-chat` — reads the stream from `/api/chat` and renders via
  `react-markdown`

`COMM_SECTION` is dock-only: not a 3D planet. It's reached via the
COMM button in the bottom console.

## State ownership

| State | Owner | Why |
| --- | --- | --- |
| `near` (PlanetSection \| null) | `cockpit-app.tsx` (React) | Drives banner/dock-button enabling |
| `docked` (CockpitSection \| null) | `cockpit-app.tsx` (React) | Drives overlay mount |
| `started` (boolean) | `cockpit-app.tsx` (React) | Camera framing + input gating |
| HUD gauges | `lib/hooks/cockpit-store.ts` (Zustand) | Updated 60 Hz from the scene, read by chrome |
| Player physics state | `cockpit-scene.tsx` (ref inside effect) | Mutated every frame, never crosses React |

## Routing & locale

- `app/[lang]/page.tsx` → `CockpitLauncher` → `CockpitApp`
  (client-only).
- `proxy.ts` at the repo root is Next 16's middleware (renamed from
  `middleware.ts`). It uses `@formatjs/intl-localematcher` and
  `negotiator` to pick a locale from `Accept-Language` and redirects
  `/foo` → `/{locale}/foo`.
- `lib/i18n/config.ts` declares the union `'en' | 'it'`. Invalid
  locales `notFound()`.
- `lib/i18n/index.tsx` is a flat-key React context. Keys are dotted
  strings (`cockpit.sections.about.label`). `useT()` falls back to the
  key if missing.

Translation parity (every key exists in both `en` and `it`) is
enforced by tests in `lib/i18n/translations.test.ts`.

## Chat API (`app/api/chat/route.ts`)

The chat backend.

- `runtime = 'nodejs'` (no `force-dynamic` — cookie reads already
  opt the route into dynamic rendering)
- Caps via Zod: 20 messages, 500 chars per message, 4000 chars total
- Roles validated against `['user', 'assistant']` (no system
  injection); content NFKC-normalized and stripped of invisibles
  before the length check
- Rate-limiting is handled by `lib/api/rate-limit.ts`
  (`createRateLimiter`). The chat limiter is 10 req / 60s / IP
  (prefix `portfolio:chat`); the unlock limiter is 5 req / 60s / IP.
  Uses Upstash Redis when `UPSTASH_REDIS_REST_URL` /
  `UPSTASH_REDIS_REST_TOKEN` are set, in-memory sliding window
  otherwise. `getClientIp` reads `x-vercel-forwarded-for` (signed by
  Vercel edge). On Vercel, an edge Firewall rule adds another layer
- Moderates the latest user message via `omni-moderation-latest`.
  Fails open on moderation errors (network/timeout)
- Calls `openai.responses.create({ stream: true })` and pipes
  `response.output_text.delta` to a `ReadableStream<Uint8Array>` as
  plain text. No SSE framing
- Model id `gpt-5.4-nano` is intentional and real

The system prompt is built from three pieces:
`INSTRUCTIONS_HEAD` + (`PROFILE_PUBLIC` | decrypted private profile)
+ `INSTRUCTIONS_TAIL`. The route calls `hasAccess()` per request; on
unlocked, it lazy-loads `lib/ai/chat-profile.enc` via
`loadDecryptedText` (cached per function instance), and builds a
per-language Map of full instructions. `{{LOCALE_LANGUAGE}}` is
templated from the request body.

## CV access gate

The detailed CV, full chat profile, and private translations are
gated behind a shared access code.

### Authentication

- `POST /api/unlock` validates a password (env `CV_ACCESS_PASSWORD`)
  with constant-time compare and sets an HMAC-signed cookie
  `cv_access` (env `CV_ACCESS_SECRET`, 30 days, httpOnly, secure in
  prod, sameSite=lax).
- `DELETE /api/unlock` clears the cookie.
- `lib/auth/cv-access.ts` exposes `hasAccess(): Promise<boolean>`
  which reads the cookie via Next's `cookies()` and verifies the
  HMAC + expiry. Cookie write/clear via `writeAccessCookie(res)` /
  `clearAccessCookie(res)` on `NextResponse`.

### Encryption at rest

The repo is public, so "private" content must not exist as plaintext
in the git tree. The gated content lives as AES-256-GCM-encrypted
`.enc` blobs that decrypt at runtime with `CV_DECRYPT_KEY`
(32-byte base64).

- `lib/auth/secret-box.ts` — `encryptBlob` / `decryptBlob` (random
  12-byte IV, 16-byte auth tag, format `iv|ciphertext|tag`).
  Key sourced from `CV_DECRYPT_KEY` (32-byte base64), memoized once
  per worker.
- `lib/auth/load-encrypted.ts` — `loadDecrypted` /
  `loadDecryptedText` / `loadDecryptedJson` with a module-scope Map
  cache (per function instance lifetime).
- `lib/auth/encrypted-paths.ts` — single source of truth for `.enc`
  paths. Exports `CHAT_PROFILE_ENC`, `PRIVATE_TRANSLATIONS_ENC`
  (record by locale), `cvMdEnc(locale)`, `cvPdfEnc(locale)`.
  Imported by both runtime routes AND the encrypt script.
- `scripts/encrypt-private.ts` — `bun run encrypt:private` reads the
  plaintext sources from `/private-src/` (gitignored) and rewrites
  the `.enc` blobs in `private/resume/`, `lib/i18n/translations/`,
  and `lib/ai/`.
- `next.config.ts` declares `outputFileTracingIncludes` for the gated
  routes so the serverless bundles ship the `.enc` blobs. When adding
  a new encrypted asset under a new route, add a matching tracing
  entry — otherwise decryption fails at runtime with a missing-file
  error.

### Gated endpoints

All call `await hasAccess()` and 401 on failure:

- `GET /api/cv/md/[locale]` — full CV markdown.
- `GET /api/cv/pdf/[locale]` — full CV PDF (attachment).
- `GET /api/translations/[locale]` — private translations JSON,
  merged into the i18n context client-side.

Routes that branch on the cookie (always 200, content varies):

- `POST /api/chat` — public vs private system prompt.

`GET /llms.txt` is intentionally not gated. It is
`dynamic = 'force-static'` so Next prerenders it at build time.
CDN cache: `public, max-age=300, s-maxage=3600,
stale-while-revalidate=86400`. Serves only `LLMS_PUBLIC` from
`lib/seo/llms-content.ts`. The URL is meant for LLM crawlers and
CDN edges — keeping it cookie-free guarantees the full content
never leaks via a cached private response.

### UI flow

- `components/cockpit/chrome/intro-overlay.tsx` has an access-code
  input that POSTs `/api/unlock`. On success it calls
  `applyUnlock()` from the i18n provider.
- `lib/i18n/index.tsx` provider mounts and fetches
  `/api/translations/[locale]` once. 200 → store overrides and set
  `unlocked: true`. 401 → stay in public mode.
- `lib/constants/site.ts:cvPdfPath(locale, unlocked)` picks
  `/api/cv/pdf/<locale>` when unlocked (Vercel decrypts on the fly)
  or falls back to the static skeletal `/resume/cv-<locale>.pdf`
  when not.
- Consumers: `chrome/bottom-console/actions-panel.tsx` (Download CV
  button), `chrome/intro-overlay.tsx`, `chrome/mobile-actions.tsx`.

### Updating private content

1. Edit a file in `/private-src/` (e.g. `cv-en.md`,
   `chat-profile.md`).
2. Run `bun run encrypt:private` (uses `CV_DECRYPT_KEY` from env).
3. Commit the regenerated `.enc` blobs.

For the PDFs, recompile from the `.tex` sources (`tectonic
private-src/cv-en.tex`) before encrypting.

## SEO

- `app/[lang]/layout.tsx` injects JSON-LD from `lib/seo/schemas.ts`
  via `dangerouslySetInnerHTML` (Next docs pattern; the
  `// biome-ignore` is intentional)
- Fonts via `next/font/google` (Orbitron, JetBrains Mono, Rajdhani)
  → CSS variables
- `app/sitemap.ts`, `robots.ts`, `manifest.ts`, plus per-locale OG /
  Twitter image generators
- CV: **skeletal** `.md` and `.pdf` in `/public/resume/` (public).
  The full versions are gated `.enc` blobs (see CV access gate).

## Styles pipeline

- Edit `lib/styles/config.ts` (and the modules it re-exports:
  `colors.ts`, `typography.ts`, `easings.ts`, `layout.mjs`)
- `bun run setup:styles` regenerates
  `lib/styles/css/{tailwind,root}.css`
- This runs automatically before every `dev` and `build`
- The generated CSS files carry a "DO NOT EDIT" banner — they will be
  overwritten

## Adding a planet

1. Add an entry to `SECTIONS` in `lib/data/cockpit-sections.ts`
   (position, radius, color, ring/earth flags, `i18nKey`)
2. Add `cockpit.sections.<id>.{label,title,sub}` to both translation
   files
3. Add a case to the switch in
   `components/cockpit/dock/dock-overlay.tsx` returning a section body

The scene picks up the new entry automatically.

## Tests

`bun test`. No Jest or Vitest layer — Bun runs `.test.ts` files
directly. Tests cover translation parity, the data layer, and a few
pure utilities. Heavy WebGL code is not unit-tested; visual regression
is manual.

Single test: `bun test path/to/file.test.ts -t "test name"`.

## CI

`.github/workflows/ci.yml` runs `bun run check` (biome + tsgo + bun
test) and `bun run build` on every push and PR. `OPENAI_API_KEY` is
set to a placeholder in CI — the build doesn't call the API.
