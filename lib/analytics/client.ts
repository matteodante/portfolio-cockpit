import { resolveMarketingPage } from '@/lib/seo/marketing-pages'

export type AnalyticsConsent = 'granted' | 'denied'
export const CONSENT_KEY = 'matteo-analytics-consent-v1'
const CONSENT_EVENT = 'matteo:analytics-consent'
const MAX_AGE = 180 * 24 * 60 * 60 * 1000
const DENIED = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const

export const TRACKED_EVENTS = [
  'booking_opened',
  'booking_created',
  'contact_clicked',
  'service_opened',
  'case_study_opened',
  'project_opened',
] as const
export type MarketingEvent = (typeof TRACKED_EVENTS)[number]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let memoryConsent: AnalyticsConsent | null = null
let activeId = ''
let initialized = false
let enabled = false
let lastPage = ''

export function validMeasurementId(value: string | undefined): string {
  return value && /^G-[A-Z0-9]{5,20}$/.test(value) ? value : ''
}

export function consentFromStorage(
  value: string | null,
  now = Date.now()
): AnalyticsConsent | null {
  if (!value) return null
  try {
    const saved: unknown = JSON.parse(value)
    if (
      !saved ||
      typeof saved !== 'object' ||
      !('choice' in saved) ||
      !('at' in saved)
    )
      return null
    if (saved.choice !== 'granted' && saved.choice !== 'denied') return null
    if (
      typeof saved.at !== 'number' ||
      saved.at > now ||
      now - saved.at >= MAX_AGE
    )
      return null
    return saved.choice
  } catch {
    return null
  }
}

export function readConsent(): AnalyticsConsent | null {
  if (memoryConsent) return memoryConsent
  try {
    return consentFromStorage(localStorage.getItem(CONSENT_KEY))
  } catch {
    return null
  }
}

export function subscribeConsent(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      memoryConsent = null
      callback()
    }
  }
  window.addEventListener(CONSENT_EVENT, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function saveConsent(choice: AnalyticsConsent) {
  memoryConsent = choice
  try {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ choice, at: Date.now() })
    )
  } catch {
    /* Choice still applies in memory. */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

export function safePageLocation(url: string): string {
  const parsed = new URL(url)
  const known =
    ['/it', '/en', '/it/cockpit', '/en/cockpit'].includes(parsed.pathname) ||
    resolveMarketingPage(parsed.pathname)
  return `${parsed.origin}${known ? parsed.pathname : '/not-found'}`
}

export function enableAnalytics(id: string) {
  if (!validMeasurementId(id) || readConsent() !== 'granted') return
  if (enabled && activeId === id) return
  activeId = id
  enabled = true
  const flags = window as unknown as Record<string, unknown>
  flags[`ga-disable-${id}`] = false
  window.dataLayer ??= []
  window.gtag ??= function (..._args: unknown[]) {
    // biome-ignore lint/complexity/noArguments: Google's documented gtag queue uses an arguments object.
    window.dataLayer?.push(arguments)
  }
  if (!initialized) {
    window.gtag('consent', 'default', DENIED)
    window.gtag('js', new Date())
  }
  window.gtag('consent', 'update', { ...DENIED, analytics_storage: 'granted' })
  if (initialized) return
  window.gtag('config', id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: safePageLocation(location.href),
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
    cookie_flags: 'SameSite=Lax;Secure',
  })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  script.id = 'matteo-google-analytics'
  document.head.append(script)
  initialized = true
}

export function disableAnalytics() {
  if (!(activeId && enabled)) return
  enabled = false
  lastPage = ''
  const flags = window as unknown as Record<string, unknown>
  flags[`ga-disable-${activeId}`] = true
  window.gtag?.('consent', 'update', DENIED)
  const cookies = ['_ga', `_ga_${activeId.slice(2)}`]
  const domains = location.hostname.split('.')
  for (const name of cookies) {
    // biome-ignore lint/suspicious/noDocumentCookie: revoke existing GA cookies in browsers without Cookie Store.
    document.cookie = `${name}=; Max-Age=0; Path=/`
    for (let i = 0; i < domains.length - 1; i++) {
      // biome-ignore lint/suspicious/noDocumentCookie: also clear GA cookies scoped to the parent domain.
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${domains.slice(i).join('.')}`
    }
  }
}

export function trackPage(pathname: string) {
  if (!enabled || readConsent() !== 'granted') return
  const page = safePageLocation(`${location.origin}${pathname}`)
  if (lastPage === page) return
  lastPage = page
  window.gtag?.('event', 'page_view', {
    page_location: page,
    page_title: document.title,
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
  })
}

export function trackMarketing(
  event: MarketingEvent,
  details: {
    placement?: string | undefined
    method?: string | undefined
    service?: string | undefined
    project?: string | undefined
  } = {}
) {
  if (!enabled || readConsent() !== 'granted') return
  // Only internal labels are sent. Never forward hrefs, form data or Cal payloads.
  const knownPlacement = [
    'header',
    'services',
    'home_work',
    'home_contact',
    'service_hero',
    'case_hero',
    'showcase',
    'service_proof',
    'case_body',
    'service_footer',
    'service_popup',
  ].includes(details.placement ?? '')
    ? details.placement
    : 'page'
  window.gtag?.('event', event, {
    placement: knownPlacement,
    method: details.method === 'embed' ? 'embed' : 'link',
    ...(['web', 'app', 'ai'].includes(details.service ?? '')
      ? { service: details.service }
      : {}),
    ...([
      'piuudito',
      'piuuditogroup',
      'fabio',
      'maestro',
      'gymtree',
      'claude_local_docs',
      'portfolio_website',
      'portfolio_cockpit',
    ].includes(details.project ?? '')
      ? { project: details.project }
      : {}),
    locale: location.pathname.startsWith('/it') ? 'it' : 'en',
    page_location: safePageLocation(location.href),
  })
}
