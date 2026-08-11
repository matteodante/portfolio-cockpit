import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NAME } from '@/lib/constants/contact'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'
import { makeT } from './i18n'
import Marquee from './sections/marquee'
import SectionContact from './sections/section-contact'
import SectionProjects from './sections/section-projects'
import SectionServices from './sections/section-services'

const INK = '#f2ede3'

/** Fixed chrome: brand mark left, PLAY pill right. */
export function LandingHeader({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding:
          'calc(env(safe-area-inset-top, 0px) + 14px) calc(env(safe-area-inset-right, 0px) + 5vw) 14px calc(env(safe-area-inset-left, 0px) + 5vw)',
        pointerEvents: 'none',
      }}
    >
      <Link
        href={`/${locale}` as Route}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          pointerEvents: 'auto',
          textDecoration: 'none',
        }}
      >
        <Image src="/images/logo.webp" alt="" width={34} height={42} priority />
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 12,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: INK,
          }}
        >
          {NAME}
        </span>
      </Link>
      <Link
        href={`/${locale}/cockpit` as Route}
        style={{
          pointerEvents: 'auto',
          fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#0b0812',
          background: COCKPIT_ACCENT,
          borderRadius: 999,
          padding: '10px 22px',
          textDecoration: 'none',
        }}
      >
        {t('landing.nav.play')}
      </Link>
    </header>
  )
}

/**
 * Everything below the hero: marquee ribbon, the three service scenes, the
 * horizontal projects bay and the contact finale (which carries the footer).
 * This wrapper is a server component — it only provides the shared canvas
 * (deep space + faint starfield) the client sections animate on.
 */
export default function LandingSections({ locale }: { locale: Locale }) {
  return (
    <div
      style={{
        position: 'relative',
        background: '#05060a',
        // Faint starfield so the editorial half still reads as the same sky
        // the hero clip ends in.
        backgroundImage:
          'radial-gradient(1px 1px at 12% 18%, rgba(242,237,227,0.5) 0, transparent 100%), radial-gradient(1px 1px at 78% 9%, rgba(242,237,227,0.34) 0, transparent 100%), radial-gradient(1.5px 1.5px at 55% 42%, rgba(242,237,227,0.28) 0, transparent 100%), radial-gradient(1px 1px at 31% 67%, rgba(242,237,227,0.38) 0, transparent 100%), radial-gradient(1.5px 1.5px at 88% 58%, rgba(242,237,227,0.3) 0, transparent 100%), radial-gradient(1px 1px at 8% 89%, rgba(242,237,227,0.3) 0, transparent 100%), radial-gradient(1px 1px at 64% 83%, rgba(242,237,227,0.42) 0, transparent 100%)',
      }}
    >
      <Marquee locale={locale} />
      <SectionServices locale={locale} />
      <SectionProjects locale={locale} />
      <SectionContact locale={locale} />
    </div>
  )
}
