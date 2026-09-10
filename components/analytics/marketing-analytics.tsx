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
  const [bannerReady, setBannerReady] = useState(false)
  const it = locale === 'it'
  const cookieDescription = it
    ? 'Con il tuo consenso, Google Analytics usa cookie per misurare le visite e le interazioni. Puoi cambiare scelta in qualsiasi momento.'
    : 'With your consent, Google Analytics uses cookies to measure visits and interactions. You can change your choice at any time.'
  const necessaryDescription = it
    ? 'Google Analytics non è attivo. Salviamo solo le preferenze necessarie al funzionamento del sito sul tuo dispositivo.'
    : 'Google Analytics is not active. We only save preferences needed for the site to work on your device.'
  const rejectLabel = it ? 'Rifiuta' : 'Reject'
  const acknowledgeLabel = it ? 'Ho capito' : 'Got it'

  useEffect(() => {
    if (!isMarketingPage || consent !== null || bannerReady) return
    const timer = window.setTimeout(() => setBannerReady(true), 20_000)
    return () => window.clearTimeout(timer)
  }, [isMarketingPage, consent, bannerReady])

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

  if (consent === undefined || !isMarketingPage) return null
  const choose = (choice: 'granted' | 'denied') => {
    saveConsent(choice)
    if (choice === 'denied') disableAnalytics()
    setEditing(false)
  }
  return (
    <div className="analytics-controls">
      {(consent === null && bannerReady) || editing ? (
        <section className="analytics-panel" aria-labelledby="analytics-title">
          <h2 id="analytics-title">
            {it ? 'Cookie, scegli tu.' : 'Cookies. Your choice.'}
          </h2>
          <p>{id ? cookieDescription : necessaryDescription}</p>
          <details className="analytics-details">
            <summary>
              {it ? 'Dettagli e preferenze' : 'Details and preferences'}
            </summary>
            <p>
              {it
                ? 'Preferenze tecniche: sempre attive. La scelta sui cookie viene conservata per 180 giorni. La chat si attiva solo quando invii un messaggio, elaborato da OpenAI. La conversazione non viene salvata sul dispositivo.'
                : 'Technical preferences: always active. Your cookie choice is saved for 180 days. The chat activates when you send a message, processed by OpenAI. The conversation is not saved on your device.'}
            </p>
            <p>
              {it
                ? 'Vercel fornisce statistiche e misure di prestazione senza cookie. Cal.com si apre solo quando scegli di prenotare.'
                : 'Vercel provides cookieless analytics and performance measurements. Cal.com opens only when you choose to book.'}
            </p>
            {id && (
              <p>
                {it
                  ? 'Statistiche Google facoltative. Misurazione pubblicitaria disattivata.'
                  : 'Optional Google analytics. Advertising measurement is disabled.'}{' '}
                <Link
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {it ? 'Come Google usa i dati' : 'How Google uses data'}
                </Link>
              </p>
            )}
          </details>
          <div className="analytics-actions">
            <button type="button" onClick={() => choose('denied')}>
              {id ? rejectLabel : acknowledgeLabel}
            </button>
            {id && (
              <button type="button" onClick={() => choose('granted')}>
                {it ? 'Accetta statistiche' : 'Accept analytics'}
              </button>
            )}
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
          {it ? 'Preferenze cookie' : 'Cookie preferences'}
        </button>
      )}
    </div>
  )
}
