'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { EMAIL_HREF, NAME } from '@/lib/constants/contact'
import {
  SCROLL_WORLD_CONNECTORS,
  SCROLL_WORLD_CONNECTORS_MOBILE,
  SCROLL_WORLD_SECTION_IDS as SECTION_IDS,
  swClip,
  swClipMobile,
  swStill,
  swStillMobile,
} from '@/lib/constants/scroll-world'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'
import type { ScrollWorldSection } from '@/lib/vendor/scrub-engine'
import { mountScrollWorld } from '@/lib/vendor/scrub-engine'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

const ACCENTS: Record<(typeof SECTION_IDS)[number], string> = {
  intro: COCKPIT_ACCENT,
  webapp: '#4da3ff',
  ai: '#b48bff',
  web: '#3ddc97',
  contact: COCKPIT_ACCENT,
}

const DIVE_SCROLL = 2.2
const CONN_SCROLL = 1.2
const CONTACT_SCROLL = 2.8

// Total scroll length of the flight, in viewport-heights, mirroring what the engine
// computes from the config below. Reserved on the container so the page is scrollable
// from first paint instead of only once the client effect has mounted the engine —
// otherwise the first wheel/touch gesture after load falls into a dead div.
const TRACK_VH =
  DIVE_SCROLL * (SECTION_IDS.length - 1) +
  CONTACT_SCROLL +
  CONN_SCROLL * SCROLL_WORLD_CONNECTORS.length +
  1

const THEME = {
  '--sw-bg': '#05060a',
  '--sw-ink': '#f2ede3',
  '--sw-ink-soft': '#8f8a97',
  '--sw-accent': COCKPIT_ACCENT,
  // Foreground for text sitting ON the accent (active nav pill, primary buttons).
  // The engine defaults to white, which is unreadable on this orange.
  '--sw-on-accent': '#0b0812',
  '--sw-font-display': 'var(--font-orbitron), system-ui, sans-serif',
  '--sw-font-body': 'var(--font-rajdhani), system-ui, sans-serif',
  minHeight: `calc(100svh * ${TRACK_VH})`,
} as CSSProperties

export default function LandingWorld({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const m = MESSAGES[locale]
    const t = (key: string) => m[key] ?? key
    const cockpitHref = `/${locale}/cockpit`

    const sections: ScrollWorldSection[] = SECTION_IDS.map((id) => {
      const section: ScrollWorldSection = {
        id,
        label: t(`landing.${id}.label`),
        still: swStill(id),
        stillMobile: swStillMobile(id),
        clip: swClip(id),
        clipMobile: swClipMobile(id),
        accent: ACCENTS[id],
        eyebrow: t(`landing.${id}.eyebrow`),
        title: t(`landing.${id}.title`),
        body: t(`landing.${id}.body`),
      }
      if (id === 'intro') {
        section.linger = 0.3
      }
      if (id === 'contact') {
        section.scroll = CONTACT_SCROLL
        section.linger = 0.4
        section.cta = {
          primary: { label: t('landing.cta.primary'), href: cockpitHref },
          secondary: { label: t('landing.cta.secondary'), href: EMAIL_HREF },
        }
      } else {
        section.tags = [
          t(`landing.${id}.tag1`),
          t(`landing.${id}.tag2`),
          t(`landing.${id}.tag3`),
        ]
      }
      return section
    })

    const destroy = mountScrollWorld(ref.current, {
      brand: { name: NAME, href: `/${locale}` },
      cta: { label: t('landing.nav.play'), href: cockpitHref },
      hint: t('landing.hint'),
      diveScroll: DIVE_SCROLL,
      connScroll: CONN_SCROLL,
      fps: 24,
      sections,
      connectors: SCROLL_WORLD_CONNECTORS,
      connectorsMobile: SCROLL_WORLD_CONNECTORS_MOBILE,
    })
    // The engine owns the scroll length from here on (.sw-track), so drop the
    // placeholder height reserved for the pre-hydration gap.
    ref.current.style.minHeight = '0px'
    return destroy
  }, [locale])

  return <div ref={ref} style={THEME} />
}
