'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { EMAIL_HREF, NAME } from '@/lib/constants/contact'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'
import type { ScrollWorldSection } from '@/lib/vendor/scrub-engine'
import { mountScrollWorld } from '@/lib/vendor/scrub-engine'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

const SECTION_IDS = ['intro', 'webapp', 'ai', 'web', 'contact'] as const

const ACCENTS: Record<(typeof SECTION_IDS)[number], string> = {
  intro: COCKPIT_ACCENT,
  webapp: '#4da3ff',
  ai: '#b48bff',
  web: '#3ddc97',
  contact: COCKPIT_ACCENT,
}

const THEME = {
  '--sw-bg': '#05060a',
  '--sw-ink': '#f2ede3',
  '--sw-ink-soft': '#8f8a97',
  '--sw-accent': COCKPIT_ACCENT,
  '--sw-font-display': 'var(--font-orbitron), system-ui, sans-serif',
  '--sw-font-body': 'var(--font-rajdhani), system-ui, sans-serif',
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
        still: `/scroll-world/${id}.webp`,
        stillMobile: `/scroll-world/${id}-m.webp`,
        clip: `/scroll-world/vid/dive-${id}.mp4`,
        clipMobile: `/scroll-world/vid/dive-${id}-m.mp4`,
        accent: ACCENTS[id],
        eyebrow: t(`landing.${id}.eyebrow`),
        title: t(`landing.${id}.title`),
        body: t(`landing.${id}.body`),
      }
      if (id === 'intro') {
        section.linger = 0.3
      }
      if (id === 'contact') {
        section.scroll = 2.8
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
      diveScroll: 2.2,
      connScroll: 1.2,
      sections,
      connectors: [
        '/scroll-world/vid/conn1.mp4',
        '/scroll-world/vid/conn2.mp4',
        '/scroll-world/vid/conn3.mp4',
        '/scroll-world/vid/conn4.mp4',
      ],
      connectorsMobile: [
        '/scroll-world/vid/conn1-m.mp4',
        '/scroll-world/vid/conn2-m.mp4',
        '/scroll-world/vid/conn3-m.mp4',
        '/scroll-world/vid/conn4-m.mp4',
      ],
    })
    return destroy
  }, [locale])

  return <div ref={ref} style={THEME} />
}
