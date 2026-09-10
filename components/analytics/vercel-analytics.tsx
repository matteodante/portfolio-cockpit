'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { safePageLocation } from '@/lib/analytics/client'

export default function VercelAnalytics() {
  return (
    <>
      <Analytics
        beforeSend={(event) => ({
          ...event,
          url: safePageLocation(event.url),
        })}
      />
      <SpeedInsights
        beforeSend={(event) => {
          const url = safePageLocation(event.url)
          return { ...event, url, route: new URL(url).pathname }
        }}
      />
    </>
  )
}
