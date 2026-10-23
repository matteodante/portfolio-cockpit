# Railway hosting and the move from Vercel

matteodante.it moved from Vercel to Railway on 2026-10-23, together with the
courses area, like the owner's other projects. The setup is code in
[`.railway/railway.ts`](../.railway/railway.ts) (Railway's Infrastructure as
Code); this page explains it and records how the move was done. Secrets never
appear here or in that file.

## What runs where

| Resource | What it is |
| --- | --- |
| `web` | This repository, branch `main`, built from the root `Dockerfile` (Next.js `output: 'standalone'`, Bun build, Node runtime). Public, always awake, EU West, `www.matteodante.it`. Before each deploy it applies the course migrations (`bun --cwd /migrate migrate.ts`: the pre-deploy command runs without a shell, so `cd … &&` does not work). Health check: `/llms.txt`. |
| `Postgres` | Course accounts (Better Auth), courses, lessons, enrolments, progress and pilot applications. EU West, private network only, with the data volume Railway gives every managed database (none is declared in the config). |
| `matteodante-courses` | Private bucket (Amsterdam) for lesson recordings. The site signs every upload and playback URL. |

Without `DATABASE_URL`, Google keys or bucket variables the site still
builds and runs: the courses page renders, the application form says it is
not active yet and the course area explains it is unavailable.

The blog no longer reads GitHub: articles are in `content/blog/` and the
build renders them (see `ARCHITECTURE.md`, Blog), so no GitHub token is
needed.

## Domain and DNS

- `matteodante.it` is registered outside Vercel and its DNS is at GoDaddy
  (nameservers `ns81`/`ns82.domaincontrol.com`). Railway does not take
  domain transfers and does not sell `.it` domains, so the domain stays
  where it is and only DNS records point at Railway.
- GoDaddy cannot point the bare domain at Railway: Railway gives a CNAME
  target, not a fixed IP, and GoDaddy allows no CNAME, ALIAS or CNAME
  flattening at the root. So the site answers on `www`:
  - `www` CNAME to the target Railway shows for the custom domain, plus the
    `_railway-verify.www` TXT record Railway asks for;
  - `matteodante.it` forwarded by GoDaddy (301) to
    `https://www.matteodante.it`;
  - the `openai-domain-verification` TXT record stays; there is no mail.
- Canonical URLs, the sitemap and structured data keep
  `https://matteodante.it` (`BASE_URL`), which forwards to `www`.
  Moving the DNS to a provider with CNAME flattening (for example
  Cloudflare, free, keeping the registration at GoDaddy) would let the bare
  domain serve the site directly; then add it back in `.railway/railway.ts`
  and set `SITE_URL` there to the bare domain.

## Environment variables (names only)

Set on the `web` service; values never in a file, a commit or a chat log.

- From Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Vercel stored the others as
  "sensitive", which nobody can read back, so they came from elsewhere:
  `OPENAI_API_KEY`,
  `CV_ACCESS_PASSWORD`, `CV_DECRYPT_KEY` and
  `CV_ACCESS_SECRET` (new).
- New: `BETTER_AUTH_SECRET` (random 32 bytes), `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_POSTHOG_KEY` (project
  "matteodante.it" in its own PostHog EU organization).
- Set by the config: `DATABASE_URL`, `STORAGE_*` (references),
  `BETTER_AUTH_URL=https://www.matteodante.it`,
  `ADMIN_EMAILS` (kept in Railway).
- Not set, as on Vercel: `UPSTASH_REDIS_REST_*` (rate limits are counted in
  the server's memory, one instance) and `GOOGLE_SITE_VERIFICATION`.

`NEXT_PUBLIC_*` values are read at build time: change them, then redeploy.

## Google sign-in

Google Cloud project `matteodante-it` (a project of its own, so the consent screen shows matteodante.it): OAuth client "Web
application" with redirect URIs `https://matteodante.it/…`,
`https://www.matteodante.it/…` and `http://localhost:3000/…`, each ending in
`/api/auth/callback/google`. Scopes `openid`, `email`, `profile`. The consent
screen links the privacy policy (`/it/privacy`), which Google requires
before the app can leave "Testing".

## Running the config

```bash
railway config plan     # preview
railway config apply    # only with the owner's go-ahead
```

On Windows, run them from PowerShell with the CLI's real binary, and set
`$env:_` to it: the `railway` SDK checks the CLI version by launching `_`
(or `railway`) without a shell, which fails on npm's Windows shims.
`restartPolicyType` and `sleepApplication` always show as a change because
Railway reports their default values as empty; applying them is harmless.

## Switching off Vercel

After the domain has served from Railway for a few days, and with the
owner's go-ahead: remove the Vercel project (its Analytics and Speed
Insights were already removed from the code; PostHog replaces them after
consent). The articles left the profile repository `matteodante/matteodante`
once `main` (which builds them from `content/blog/`) was live on both hosts.

## Local development

```bash
# Postgres on localhost, then:
DATABASE_URL=postgres://postgres@localhost:5432/courses bun run db:migrate
DATABASE_URL=... BETTER_AUTH_SECRET=... BETTER_AUTH_URL=http://localhost:3000 \
  COURSES_DEV_PASSWORD=1 ADMIN_EMAILS=you@example.com bun run dev
```

`COURSES_DEV_PASSWORD=1` enables email and password accounts outside
production only, so the area can be tested without a Google client. After a
change to `lib/courses/schema.ts`, run `bun run db:generate` and commit the
new file in `drizzle/`.
