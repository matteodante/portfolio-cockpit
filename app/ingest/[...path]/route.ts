import { forwardToPostHog } from '@/lib/analytics/ingest'

/** PostHog's events, passed on to its EU ingestion without the visitor's cookies. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return forwardToPostHog(
    request,
    path,
    process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? ''
  )
}
