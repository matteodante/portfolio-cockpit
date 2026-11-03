# Railway hosting and the move from Vercel

matteodante.it runs on Railway. The setup is code in
[`.railway/railway.ts`](../.railway/railway.ts) (Railway's Infrastructure as
Code); this page explains it and records how the move was done. Secrets never
appear here or in that file.

## What runs where

| Resource | What it is |
| --- | --- |
| `web` | This repository, branch `main`, built from the root `Dockerfile` (Next.js `output: 'standalone'`, Bun build, Node runtime). Public, always awake, EU West, `www.matteodante.it`. No pre-deploy command is required. Health check: `/llms.txt`. |

The blog no longer reads GitHub: articles are in `content/blog/` and the
build renders them (see `ARCHITECTURE.md`, Blog), so no GitHub token is
needed.

## Domain and DNS

- `matteodante.it` is registered at GoDaddy, which also runs its DNS.
  Only DNS records point at the hosts; the registration stays there.
- The site and its canonical URLs (`BASE_URL` in `lib/constants/site.ts`,
  the sitemap and structured data) live on
  `https://www.matteodante.it`: a `www` CNAME to the target Railway shows
  for the custom domain, plus the TXT record Railway asks for to verify it.
  The root also keeps the Google Search Console and OpenAI verification TXT
  records; there is no mail.
- GoDaddy cannot point the bare domain at Railway: Railway gives a CNAME
  target, not a fixed IP, and GoDaddy has no CNAME, ALIAS or CNAME
  flattening at the root. GoDaddy's own forwarding was tried and dropped:
  it sends only the home page to `www` and answers 404 on every path, so
  older links with a path broke.
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

- Kept by the config (`preserve()`), set in Railway:
  `OPENAI_API_KEY`, `CV_ACCESS_PASSWORD`, `CV_ACCESS_SECRET`,
  `CV_DECRYPT_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` and
  `NEXT_PUBLIC_POSTHOG_KEY`.
- Optional: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  (without them rate limits use server memory) and `GOOGLE_SITE_VERIFICATION`.
- Written by the config: `PORT` and `NEXT_TELEMETRY_DISABLED`.

`NEXT_PUBLIC_*` values are read at build time: change them, then redeploy.

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
bun install --frozen-lockfile
bun run dev
```

The portfolio does not require an application database or object storage.
The infrastructure config describes the web service only. On an existing
project, review the plan for resource removals before applying it; retiring
a feature does not authorize deleting stored data or infrastructure.
