/**
 * matteodante.it on Railway, as code (Railway's Infrastructure as Code).
 * EU West, like the owner's other projects. One public Next.js service, a
 * Postgres database for course accounts and a private bucket for lesson
 * recordings. Once connected, pushing to main deploys the site.
 *
 * Secrets are never written here: preserve() keeps the value set in Railway.
 *
 *   railway config plan     preview the changes
 *   railway config apply    apply them (only with the owner's go-ahead)
 *
 * Migration steps from Vercel, domain included: docs/railway.md.
 */
import {
  bucket,
  defineRailway,
  github,
  postgres,
  preserve,
  project,
  ref,
  service,
  volume,
} from 'railway/iac'

const REGION = 'europe-west4-drams3a'
const SITE_URL = 'https://matteodante.it'

export default defineRailway(() => {
  const Postgres = postgres('Postgres', { region: REGION })
  Postgres.deploy = {
    limitOverride: { containers: { cpu: 0.5, memoryBytes: 500_000_000 } },
  }
  Postgres.networking = { privateNetworkEndpoint: 'postgres' }
  const postgresVolume = volume('postgres-volume', {
    alerts: { usage: { '80': {}, '95': {}, '100': {} } },
    allowOnlineResize: true,
    region: REGION,
    sizeMB: 5000,
  })
  const recordings = bucket('matteodante-courses', { region: 'ams' })

  const web = service('web', {
    source: github('matteodante/portfolio-cockpit', { branch: 'main' }),
    build: { builder: 'DOCKERFILE', dockerfilePath: 'Dockerfile' },
    deploy: {
      startCommand: 'node server.js',
      preDeployCommand: ['cd /migrate && bun migrate.ts'],
      healthcheckPath: '/llms.txt',
      healthcheckTimeout: 60,
      restartPolicyType: 'ON_FAILURE',
      restartPolicyMaxRetries: 5,
      // The public site stays awake: a cold start would greet visitors and
      // crawlers with a slow first page.
      sleepApplication: false,
      limitOverride: { containers: { cpu: 1, memoryBytes: 1_000_000_000 } },
    },
    replicas: { [REGION]: 1 },
    networking: {
      customDomains: {
        'matteodante.it': { port: 3000 },
        'www.matteodante.it': { port: 3000 },
      },
    },
    env: {
      PORT: '3000',
      NEXT_TELEMETRY_DISABLED: '1',
      // Existing site secrets, copied from Vercel by the owner.
      OPENAI_API_KEY: preserve(),
      CV_ACCESS_PASSWORD: preserve(),
      CV_ACCESS_SECRET: preserve(),
      CV_DECRYPT_KEY: preserve(),
      UPSTASH_REDIS_REST_URL: preserve(),
      UPSTASH_REDIS_REST_TOKEN: preserve(),
      GOOGLE_SITE_VERIFICATION: preserve(),
      // Read at build time (public): analytics after consent only.
      NEXT_PUBLIC_GA_MEASUREMENT_ID: preserve(),
      NEXT_PUBLIC_POSTHOG_KEY: preserve(),
      // Courses: accounts, Google sign-in, admin and recordings.
      DATABASE_URL: Postgres.env.DATABASE_URL,
      BETTER_AUTH_URL: SITE_URL,
      BETTER_AUTH_SECRET: preserve(),
      GOOGLE_CLIENT_ID: preserve(),
      GOOGLE_CLIENT_SECRET: preserve(),
      ADMIN_EMAILS: preserve(),
      STORAGE_ENDPOINT: ref(recordings, 'ENDPOINT'),
      STORAGE_REGION: ref(recordings, 'REGION'),
      STORAGE_BUCKET: ref(recordings, 'BUCKET'),
      STORAGE_ACCESS_KEY_ID: ref(recordings, 'ACCESS_KEY_ID'),
      STORAGE_SECRET_ACCESS_KEY: ref(recordings, 'SECRET_ACCESS_KEY'),
      STORAGE_FORCE_PATH_STYLE: 'false',
    },
  })

  return project('matteodante.it', {
    resources: [web, Postgres, postgresVolume, recordings],
  })
})
