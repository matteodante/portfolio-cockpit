# Railway hosting and the move from Vercel

matteodante.it moves from Vercel to Railway, like the owner's other projects
(requested 2026-10-23, together with the courses area). The whole setup is
code in [`.railway/railway.ts`](../.railway/railway.ts) (Railway's
Infrastructure as Code); this page explains it and lists the steps that need
the owner. Secrets never appear here or in that file.

## What runs where

| Resource | What it is |
| --- | --- |
| `web` | This repository, branch `main`, built from the root `Dockerfile` (Next.js `output: 'standalone'`, Bun build, Node runtime). Public, always awake, `matteodante.it` and `www.matteodante.it`. Before each deploy it applies the course migrations (`cd /migrate && bun migrate.ts`). Health check: `/llms.txt`. |
| `Postgres` | Course accounts (Better Auth), courses, lessons, enrolments, progress and pilot applications. Private network only. |
| `matteodante-courses` | Private bucket for lesson recordings. The site signs every upload and playback URL. |

Without `DATABASE_URL`, Google keys or bucket variables the site still
builds and runs: the courses page renders, the application form says it is
not active yet and the course area explains it is unavailable.

## Environment variables (names only)

Copy the existing values from Vercel's project settings into the `web`
service's variables in Railway's dashboard, never into a file or a chat:

- Existing: `OPENAI_API_KEY`, `CV_ACCESS_PASSWORD`, `CV_ACCESS_SECRET`,
  `CV_DECRYPT_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
  `GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- New: `NEXT_PUBLIC_POSTHOG_KEY` (PostHog EU project key, public),
  `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`.
- Set by the config itself: `DATABASE_URL`, `STORAGE_*` (references),
  `BETTER_AUTH_URL=https://matteodante.it`,
  `ADMIN_EMAILS` (kept in Railway).

`NEXT_PUBLIC_*` values are read at build time: change them, then redeploy.

## Steps, in order

Each step that creates, publishes or moves something needs the owner's
explicit go-ahead in the session.

1. **Google sign-in.** In Google Cloud,
   create an OAuth client of type "Web application" with redirect URIs
   `https://matteodante.it/api/auth/callback/google` and, for local tests,
   `http://localhost:3000/api/auth/callback/google`. Scopes: `openid`,
   `email`, `profile`. Publish the consent screen so any Google account can
   sign in (in "Testing" only listed test users can).
2. **Create the Railway project.** From this repository:
   `railway config plan`, then `railway config apply`. Connect the GitHub
   repository when Railway asks.
3. **Variables.** Fill the `preserve()` variables listed above.
4. **First deploy on Railway's own address.** Check `/it`, `/en`, the
   cockpit, the chat, the CV unlock, `/it/corsi`, a test application, Google
   sign-in and `/it/account/admin` on the `*.up.railway.app` address. Google
   sign-in needs that address in the OAuth redirect URIs for this test.
5. **Domain.** matteodante.it was bought on Vercel. Two options:
   - keep it registered at Vercel and only change its DNS records to the
     ones Railway prints for the custom domains (quickest; Vercel then only
     holds the registration);
   - transfer the registration out of Vercel to another registrar (for
     example Cloudflare), then set Railway's records there. A transfer takes
     days and needs the auth code from Vercel.
   Either way, keep Vercel's deployment running until Railway serves the
   domain with a valid certificate.
6. **Switch off Vercel.** After the domain serves from Railway for a few
   days: remove the Vercel project's production deployment and its
   integrations (Analytics and Speed Insights were removed from the code in
   this change; PostHog replaces them after consent).

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
