# CLAUDE.md

Notes for Claude Code in this repo.

## Stack

Next.js 16 (App Router), React 19.2 + React Compiler, TypeScript strict,
Three.js 0.183 vanilla (NOT R3F), Tailwind v4, Zustand, OpenAI Responses
API. Bun 1.3 (pkg manager + test runner). Biome 2.4. `tsgo` for fast
typechecks. Node 22. EN/IT.

## Commands

```bash
bun run dev           # setup:styles + next dev (Turbopack)
bun run build         # setup:styles + next build
bun run check         # biome + tsgo + bun test (CI-equivalent)
bun run lint:fix      # biome lint --write --unsafe
bun run typecheck     # tsgo --noEmit
bun run typecheck:tsc # fallback to stock tsc
bun run setup:styles  # regen tailwind.css + root.css from TS config
bun run analyze       # ANALYZE=true bun run build
```

Single test: `bun test path/to/file.test.ts -t "name"`. Bun runs tests
directly. No Jest, no Vitest layer.

`setup:styles` runs before every dev/build and overwrites
`lib/styles/css/{tailwind,root}.css`. Banner says do not edit. Edit
`lib/styles/config.ts` (and re-exported modules: `colors.ts`,
`typography.ts`, `easings.ts`, `layout.mjs`).

## What this is

One route. One Three.js scene. One streaming chat API. No CMS, no DB,
no marketing pages.

## Routing

- `app/[lang]/page.tsx` → `CockpitLauncher` → dynamic-imports
  `CockpitApp` with `ssr: false`. Scene is client-only.
- `proxy.ts` (root) — Next 16 middleware. Detects locale from
  `Accept-Language` via `@formatjs/intl-localematcher` + `negotiator`
  and redirects `/foo` → `/{locale}/foo`. Matcher excludes `_next`,
  `api`, paths with extensions.
- `lib/i18n/config.ts` — `'en' | 'it'`. Invalid locale → `notFound()`.
- `lib/i18n/index.tsx` — flat-key React context. `useT()` falls back
  to the key. Dotted keys: `cockpit.sections.about.label`.

## Cockpit

`components/cockpit/cockpit-app.tsx` owns two state vars:

- `near` — planet within docking range
- `docked` — section in overlay (or `null`)

Composition (single `position: fixed` container):

- `scene/cockpit-scene.tsx` — ~1150 lines of imperative Three.js. Owns
  its RAF loop, physics constants, post-processing (`EffectComposer`
  + `UnrealBloomPass`, custom god rays). Pushes to React via
  `onNearChange` / `onDockRequest` callbacks AND via the Zustand HUD
  store (`setHud`).
- `chrome/*` — non-interactive HUD panels (top bar, side consoles,
  bottom console, frame). Read from `useHud`.
- `dock/dock-overlay.tsx` — full-screen overlay. Section bodies in
  `dock/sections/*`.
- `COMM_SECTION` — dock-only. Not a planet. Reached via the
  bottom-console COMM button.

`Escape` undocks. Owned by `cockpit-app.tsx`, not the scene.

## State

- React state (`near`, `docked`) lives in `cockpit-app.tsx`.
- `lib/hooks/cockpit-store.ts` — `useHud` (Zustand) for HUD gauges
  (`speed`, `coords`, `gravity`, `landed`, `phase`, `nearestId`).
  `setHud` diffs before `setState` so the scene can call it every
  frame without renders. Use `setHud(patch)`, not `useHud.setState`.

## Sections data

`lib/data/cockpit-sections.ts` — single source of truth for planet
layout (position, radius, color, emissive, ring/earth flags) and the
`CockpitSectionId` union.

To add a planet:

1. Add an entry to `SECTIONS`.
2. Add `cockpit.sections.<id>.*` keys to both translation files.
3. Add a case in `dock/dock-overlay.tsx`.

## Chat API

`app/api/chat/route.ts` is the only backend code.

- `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`.
- Zod caps: 20 messages, 500 chars each, 4000 chars total.
- Primary rate limit: Vercel Firewall rule at the edge (10 req / 60s
  / IP). The in-app `@upstash/ratelimit` (or in-memory fixed window)
  is opt-in defense-in-depth — see the comment block in the route.
- Moderates the latest user message via `omni-moderation-latest`.
  Fails open if moderation itself errors.
- `openai.responses.create({ stream: true })` → pipes
  `response.output_text.delta` into a `ReadableStream<Uint8Array>` as
  plain text. No SSE framing.
- `INSTRUCTIONS` is the system prompt — authoritative profile +
  scope/safety rules. Editing it changes what the assistant can say.
  `{{LOCALE_LANGUAGE}}` is templated from the request body.
- Model `gpt-5.4-nano` is real and intentional. Do not "fix" it to
  `gpt-5-nano` or any variant. Confirmed by the project owner.

Client: `dock/sections/comm-chat.tsx` reads the stream and renders
markdown via `react-markdown`.

## SEO

- `app/[lang]/layout.tsx` injects JSON-LD from `lib/seo/schemas.ts`
  via `dangerouslySetInnerHTML`. Keep the `// biome-ignore`.
- Fonts via `next/font/google` (Orbitron, JetBrains Mono, Rajdhani)
  → CSS vars `--font-orbitron`, `--font-mono`, `--font-rajdhani`.
- `app/sitemap.ts`, `robots.ts`, `manifest.ts`, plus per-locale OG /
  Twitter image generators.
- CV: static markdown + PDF in `/public/resume/` (see
  `lib/constants/site.ts`).

## Conventions

- `@/*` imports only. No `../`. Enforced by Biome plugin.
- `next/link`, never `<a>`. Enforced.
- No `forwardRef`. React 19 + React Compiler accept `ref` as a prop.
- No `<img>`. Use `next/image`.
- Type imports/exports: `useImportType` / `useExportType` are
  `error`.
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
