# matteodante.it

[![CI](https://github.com/matteodante/portfolio-cockpit/actions/workflows/ci.yml/badge.svg)](https://github.com/matteodante/portfolio-cockpit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Deploy: Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)](https://matteodante.it)

3D cockpit portfolio. One route, one Three.js scene, a streaming chat
endpoint, and a password-gated CV (AES-256-GCM encrypted at rest in
the repo). EN/IT.

**Live demo:** <https://matteodante.it>

<p align="center">
  <img src="./preview/desktop.png" alt="Desktop view" width="74%" />
  &nbsp;
  <img src="./preview/mobile.png" alt="Mobile view" width="20%" />
</p>

## Stack

Next.js 16 · React 19.2 + Compiler · TypeScript strict · Three.js 0.183
vanilla (NOT R3F) · Tailwind v4 · Zustand · OpenAI Responses API ·
Bun 1.3 · Biome 2.4 · `tsgo`. Node 22.

## Setup

```bash
nvm use                       # Node 22
bun install
cp .env.example .env.local    # set OPENAI_API_KEY + CV_ACCESS_*
bun run dev
```

http://localhost:3000

Required env vars (see `.env.example`):

- `OPENAI_API_KEY` — for `/api/chat`
- `CV_ACCESS_PASSWORD` — shared access code for unlocking the full CV
- `CV_ACCESS_SECRET` — HMAC secret for the access cookie
  (`openssl rand -base64 64`)
- `CV_DECRYPT_KEY` — 32-byte AES-256-GCM key for the encrypted
  blobs (`openssl rand -base64 32`)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — optional;
  Redis-backed rate limiting (in-memory fallback otherwise)
- `NEXT_PUBLIC_BASE_URL` — canonical base URL for SEO / OG

## Commands

```bash
bun run dev              # setup:styles + next dev (Turbopack)
bun run build            # setup:styles + next build
bun run check            # biome + tsgo + bun test (CI-equivalent)
bun run typecheck        # tsgo --noEmit
bun run test             # bun test
bun run encrypt:private  # re-encrypt private-src/ → .enc blobs
bun run analyze          # bundle analyzer
```

`setup:styles` regenerates `lib/styles/css/{tailwind,root}.css` from
`lib/styles/config.ts`. Don't edit those CSS files.

Single test: `bun test path/to/file.test.ts -t "name"`.

## Layout

- `app/[lang]/page.tsx` → `CockpitLauncher` → `CockpitApp` (client-only)
- `proxy.ts` — Next 16 middleware. Locale detect + redirect.
- `components/cockpit/` — scene, HUD, dock overlay
- `app/api/chat/route.ts` — streaming chat with public / gated prompt
- `app/api/unlock/route.ts` — POST password → sets HMAC access cookie
- `app/api/cv/{md,pdf}/[locale]/route.ts` — gated CV download
- `app/api/translations/[locale]/route.ts` — gated full translations
- `app/llms.txt/route.ts` — public summary only (`force-static`, prerendered at build; `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400`)
- `lib/auth/` — cookie HMAC, AES-GCM secret box, encrypted-paths
- `lib/i18n/translations/{en,it}.json` — flat dotted keys (public),
  parity enforced by tests. `.private.json.enc` blobs alongside.

Architecture tour: [`ARCHITECTURE.md`](./ARCHITECTURE.md).
Contributor guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md).
Notes for Claude Code agents: [`CLAUDE.md`](./CLAUDE.md).

## CV access gate

The site shows a skeletal public CV by default. A shared access code
unlocks the full CV, the detailed chat profile, and the private
translation overrides. `/llms.txt` is always public so robots and
CDN edges can cache it freely.

Auth is an HMAC-signed cookie (`CV_ACCESS_SECRET`) set by
`POST /api/unlock` when the password (`CV_ACCESS_PASSWORD`) matches.
Gated content is **AES-256-GCM encrypted at rest** in the repo (`.enc`
blobs); plaintext sources live in `/private-src/` (gitignored) and
the encrypt script regenerates the blobs:

```bash
# edit private-src/cv-en.md (etc.), then:
bun run encrypt:private
git add private/resume/ lib/{ai,i18n/translations}/*.enc
git commit -m "chore: refresh encrypted CV"
```

Full design: [`ARCHITECTURE.md`](./ARCHITECTURE.md#cv-access-gate).

## Forking

Public-facing personal data:

- `lib/constants/identity.ts`
- `lib/constants/contact.ts`
- `lib/i18n/translations/{en,it}.json` (skeletal/public keys only)
- `app/api/chat/route.ts` (public system prompt: head/tail +
  `PROFILE_PUBLIC`)
- `public/resume/` (skeletal CV md/pdf/tex)
- `lib/seo/schemas.ts`
- `app/[lang]/layout.tsx` (metadata + `NEXT_PUBLIC_BASE_URL`)

Gated content (kept locally in `/private-src/`, encrypted in repo):

- `private-src/cv-{en,it}.{md,pdf}` → `private/resume/*.enc`
  (`.tex` sources stay local — used to compile the PDFs, never encrypted)
- `private-src/{en,it}.private.json` →
  `lib/i18n/translations/*.private.json.enc`
- `private-src/chat-profile.md` → `lib/ai/chat-profile.enc`

After editing, run `bun run encrypt:private` and commit the `.enc`
blobs. Set `CV_ACCESS_PASSWORD`, `CV_ACCESS_SECRET`, `CV_DECRYPT_KEY`
on your host (Vercel env vars) and share the password with whoever
should see the full CV.

## Rate limiting

`/api/chat` caps at **10 req / 60s / IP**; `/api/unlock` caps at
**5 req / 60s / IP**. Both go through `lib/api/rate-limit.ts`, which
uses Upstash Redis when `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` are set and a per-instance in-memory
sliding window otherwise. On Vercel, an edge Firewall rule provides
an additional layer.

## Credits

Third-party assets bundled in `public/`:

- **3D model** `public/models/astronaut.glb` — free 3D asset
  ([Poly Pizza](https://poly.pizza/) / Quaternius style libraries,
  no attribution required)
- **Planet textures** `public/textures/planets/*.jpg` — Solar System Scope,
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See
  [`public/textures/planets/ATTRIBUTION.txt`](./public/textures/planets/ATTRIBUTION.txt).
- **Ambient music** `public/audio/ambient.mp3` —
  ["Ambient Cinematic"](https://pixabay.com/music/ambient-ambient-cinematic-510518/)
  via Pixabay ([Pixabay Content License](https://pixabay.com/service/license-summary/))
- **Video** `public/videos/jet-1.mp4` — Grigoriy Bunkov via
  [Pexels](https://www.pexels.com/video/private-jet-flying-through-clear-blue-skies-32301926/)
  ([Pexels License](https://www.pexels.com/license/))
- **Fonts** Orbitron, JetBrains Mono, Rajdhani — loaded via `next/font/google`
  (SIL OFL 1.1). Inter and Instrument Serif self-hosted in
  `public/fonts/` (SIL OFL 1.1).

## License

[MIT](./LICENSE)
