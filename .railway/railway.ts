/**
 * matteodante.it on Railway, as code (Railway's Infrastructure as Code).
 * One public Next.js service in EU West. Once connected, pushing to main
 * deploys the site.
 *
 * Secrets are never written here: preserve() keeps the value set in Railway.
 *
 *   railway config plan     preview the changes
 *   railway config apply    apply them (only with the owner's go-ahead)
 *
 * Migration steps from Vercel, domain included: docs/railway.md.
 */
import { defineRailway, github, preserve, project, service } from 'railway/iac'

const REGION = 'europe-west4-drams3a'
export default defineRailway(() => {
  const web = service('web', {
    source: github('matteodante/portfolio-cockpit', { branch: 'main' }),
    build: { builder: 'DOCKERFILE', dockerfilePath: 'Dockerfile' },
    deploy: {
      startCommand: 'node server.js',
      preDeployCommand: [],
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
    domains: [{ domain: 'www.matteodante.it', port: 3000 }],
    env: {
      PORT: '3000',
      NEXT_TELEMETRY_DISABLED: '1',
      // Site secrets are configured in the provider dashboard.
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
    },
  })

  return project('matteodante.it', {
    resources: [web],
  })
})
