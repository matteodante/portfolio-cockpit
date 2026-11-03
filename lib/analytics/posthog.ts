'use client'

import type { PostHog } from 'posthog-js'
import { stripEventUrls } from '@/lib/analytics/posthog-url'

/**
 * Product analytics (PostHog, EU cloud), only after "Accept analytics" in the
 * cookie panel, on the same pages as Google Analytics (never the cockpit).
 * Nothing of PostHog loads before that answer; "Reject" afterwards stops it
 * and forgets this browser's analytics id. Same setup as DroneClean:
 *
 * - NEXT_PUBLIC_POSTHOG_KEY (public, read at build time). Without it there is
 *   no PostHog code at all.
 * - Events go to this site's own /ingest (app/ingest), passed on without the
 *   visitor's cookies, so the course session never leaves the site.
 * - Page views and our named events under a random browser id, never tied to
 *   a course account (no `identify`). No autocapture, recordings, surveys or
 *   flags; addresses lose their query strings.
 */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? ''

let enabled = false
let loading: Promise<PostHog | null> | null = null

function load(): Promise<PostHog | null> {
  loading ??= import('posthog-js/no-external').then(
    ({ default: posthog }) => {
      if (!enabled) {
        loading = null
        return null
      }
      posthog.init(POSTHOG_KEY, {
        api_host: `${window.location.origin}/ingest`,
        ui_host: 'https://eu.posthog.com',
        // Next.js redirects /ingest/e/ to /ingest/e: ask without the slash.
        rewriteRequestPath: (url) => {
          url.pathname = url.pathname.replace(/\/+$/, '')
          return url
        },
        persistence: 'localStorage',
        person_profiles: 'identified_only',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: false,
        rageclick: false,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_performance: false,
        capture_exceptions: false,
        disable_session_recording: true,
        disable_surveys: true,
        disable_external_dependency_loading: true,
        advanced_disable_flags: true,
        mask_personal_data_properties: true,
        before_send: stripEventUrls,
      })
      return posthog
    },
    () => {
      loading = null
      return null
    }
  )
  return loading
}

/** Follows the visitor's cookie choice. */
export function setPostHogConsent(allowed: boolean) {
  if (!POSTHOG_KEY || enabled === allowed) return
  enabled = allowed
  if (allowed) {
    void load().then((posthog) => {
      if (!(posthog && enabled && posthog.has_opted_out_capturing())) return
      posthog.set_config({ disable_persistence: false })
      posthog.opt_in_capturing()
    })
    return
  }
  try {
    for (const storage of [localStorage, sessionStorage]) {
      for (let index = storage.length - 1; index >= 0; index -= 1) {
        const key = storage.key(index)
        if (key?.startsWith('ph_')) storage.removeItem(key)
      }
    }
  } catch {
    /* Storage blocked: nothing was kept. */
  }
  void loading?.then((posthog) => {
    if (!posthog || enabled) return
    posthog.reset(true)
    posthog.opt_out_capturing()
    posthog.set_config({ disable_persistence: true })
  })
}

/** One of our named events, if the visitor allowed analytics. */
export function capturePostHog(
  event: string,
  properties: Record<string, string | undefined>
) {
  if (!(enabled && loading)) return
  void loading.then((posthog) => {
    if (posthog && enabled) posthog.capture(event, properties)
  })
}
