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

- `matteodante.it` is registered at GoDaddy, which also runs its DNS.
  Only DNS records point at the hosts; the registration stays there.
- The site and its canonical URLs (`BASE_URL` in `lib/constants/site.ts`,
  the sitemap, structured data, `BETTER_AUTH_URL`) live on
  `https://www.matteodante.it`: a `www` CNAME to the target Railway shows
  for the custom domain, plus the TXT record Railway asks for to verify it.
  The root also keeps the Google Search Console and OpenAI verification TXT
  records; there is no mail.
- GoDaddy cannot point the bare domain at Railway: Railway gives a CNAME
  target, not a fixed IP, and GoDaddy has no CNAME, ALIAS or CNAME
  flattening at the root. GoDaddy's own forwarding was tried and dropped:
  it sends only the home page to `www` and answers 404 on every path, so
  older links such as `matteodante.it/it/corsi` broke.
- So the bare domain's A record points at Vercel, where a project with no
  code, `matteodante-redirect`, answers every request with a permanent
  redirect (308) to the same path and query on `www`. Its whole
  configuration is this `vercel.json`, deployed with `vercel deploy --prod`
  from a folder that holds it and an empty `empty/` directory. The regex
  rule also covers the root and trailing slashes, which `/:path*` missed:

  ```json
  {
    "framework": null,
    "buildCommand": "",
    "outputDirectory": "empty",
    "redirects": [
      { "source": "/(.*)", "destination": "https://www.matteodante.it/$1", "permanent": true }
    ]
  }
  ```

- Plan: keep this bridge for about a year, while search engines and shared
  links move to `www`. Then, with the owner's go-ahead, set GoDaddy's
  forwarding (permanent, to `https://www.matteodante.it`) and delete the
  Vercel project and the domain from Vercel. Moving the DNS to a provider
  with CNAME flattening (Cloudflare, free) would instead let the bare
  domain point at Railway directly.

## Environment variables (names only)

Set on the `web` service; values never in a file, a commit or a chat log.

- Kept by the config (`preserve()`), set by hand in Railway:
  `OPENAI_API_KEY`, `CV_ACCESS_PASSWORD`, `CV_ACCESS_SECRET`,
  `CV_DECRYPT_KEY` (the key that opens the `.enc` files),
  `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
  `ADMIN_EMAILS`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` and
  `NEXT_PUBLIC_POSTHOG_KEY` (a PostHog EU project of its own).
- Written by the config: `DATABASE_URL`, `STORAGE_*` (references to the
  database and the bucket) and `BETTER_AUTH_URL`.
- Optional and unset: `UPSTASH_REDIS_REST_*` (rate limits are then counted
  in the server's memory) and `GOOGLE_SITE_VERIFICATION`.

Vercel keeps "sensitive" values write-only, so they could not be copied
across: each was set again from its source. `NEXT_PUBLIC_*` values are read
at build time: change them, then redeploy.

## Google sign-in

A Google Cloud project of its own, so the consent screen shows
matteodante.it: OAuth client "Web application" with redirect URIs on
`https://www.matteodante.it`, the bare domain and `http://localhost:3000`,
each ending in `/api/auth/callback/google`. Scopes `openid`, `email`,
`profile`. The consent screen links the privacy policy (`/it/privacy`),
which Google requires before the app can leave "Testing".

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

## Vercel

The old `portfolio-cockpit` project on Vercel, with its deployments and
variables, was deleted on 2026-10-23 after the site was verified on Railway.
Vercel Analytics and Speed Insights were removed from the code; PostHog
replaces them after consent. Only `matteodante-redirect` (see Domain and
DNS) is left there.

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
