'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  type AnalyticsConsent,
  disableAnalytics,
  enableAnalytics,
  type MarketingEvent,
  readConsent,
  saveConsent,
  subscribeConsent,
  TRACKED_EVENTS,
  trackMarketing,
  trackPage,
} from '@/lib/analytics/client'
import type { Locale } from '@/lib/i18n/config'
import '@/components/analytics/analytics.css'

const serverConsent = () => undefined

export default function MarketingAnalytics({
  id,
  locale,
}: {
  id: string
  locale: Locale
}) {
  const pathname = usePathname()
  const isMarketingPage = !pathname.endsWith('/cockpit')
  const consent = useSyncExternalStore<AnalyticsConsent | null | undefined>(
    subscribeConsent,
    readConsent,
    serverConsent
  )
  const [editing, setEditing] = useState(false)
  const it = locale === 'it'

  useEffect(() => {
    if (!id) return
    if (consent === 'granted' && isMarketingPage) {
      enableAnalytics(id)
      trackPage(pathname)
    } else disableAnalytics()
  }, [id, consent, pathname, isMarketingPage])

  useEffect(() => {
    if (!id || consent !== 'granted' || !isMarketingPage) return
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const target = event.target.closest<HTMLElement>('[data-track]')
      const name = target?.dataset.track
      if (!(name && (TRACKED_EVENTS as readonly string[]).includes(name)))
        return
      trackMarketing(name as MarketingEvent, {
        placement: target?.dataset.placement,
        method: target?.dataset.method,
        service: target?.dataset.service,
        project: target?.dataset.project,
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [id, consent, isMarketingPage])

  if (!id || consent === undefined || !isMarketingPage) return null
  const choose = (choice: 'granted' | 'denied') => {
    saveConsent(choice)
    if (choice === 'denied') disableAnalytics()
    setEditing(false)
  }
  return (
    <div className="analytics-controls">
      {consent === null || editing ? (
        <section className="analytics-panel" aria-labelledby="analytics-title">
          <h2 id="analytics-title">
            {it ? 'Statistiche facoltative' : 'Optional analytics'}
          </h2>
          <p>
            {it
              ? 'Con il tuo consenso, Google Analytics usa cookie per misurare le visite e le interazioni sul sito. Puoi continuare senza attivarli e cambiare scelta in qualsiasi momento.'
              : 'With your consent, Google Analytics uses cookies to measure visits and interactions on this website. You can continue without enabling them and change your choice at any time.'}
          </p>
          <p>
            {it
              ? 'La scelta viene conservata per 180 giorni. La misurazione pubblicitaria è disattivata.'
              : 'Your choice is saved for 180 days. Advertising measurement is disabled.'}{' '}
            <Link
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              {it ? 'Come Google utilizza i dati' : 'How Google uses data'}
            </Link>
          </p>
          <div className="analytics-actions">
            <button type="button" onClick={() => choose('denied')}>
              {it ? 'Continua senza' : 'Continue without'}
            </button>
            <button type="button" onClick={() => choose('granted')}>
              {it ? 'Consenti statistiche' : 'Allow analytics'}
            </button>
          </div>
          {editing && (
            <button
              className="analytics-close"
              type="button"
              onClick={() => setEditing(false)}
            >
              {it ? 'Chiudi' : 'Close'}
            </button>
          )}
        </section>
      ) : (
        <button
          className="analytics-settings"
          type="button"
          onClick={() => setEditing(true)}
        >
          {it ? 'Preferenze statistiche' : 'Analytics preferences'}
        </button>
      )}
    </div>
  )
}
