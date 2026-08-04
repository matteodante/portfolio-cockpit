import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { EMAIL, EMAIL_HREF, NAME } from '@/lib/constants/contact'
import { LANDING_SECTION_IDS } from '@/lib/constants/hero'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

// The middle slice of the landing's section list: `intro` renders inside the
// hero and `contact` as the closing block below. Derived so a new section id
// can never appear in the sr-only SEO block without a visible counterpart.
const SERVICE_IDS = LANDING_SECTION_IDS.filter(
  (id) => id !== 'intro' && id !== 'contact'
)

const INK = '#f2ede3'
const INK_SOFT = '#8f8a97'

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  fontSize: 'clamp(11px, 1.1vw, 14px)',
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: COCKPIT_ACCENT,
  margin: 0,
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
  fontWeight: 700,
  lineHeight: 1.05,
  letterSpacing: '0.01em',
  textTransform: 'uppercase',
  color: INK,
  margin: 0,
}

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-rajdhani), system-ui, sans-serif',
  fontSize: 'clamp(17px, 1.6vw, 21px)',
  lineHeight: 1.55,
  color: INK_SOFT,
  margin: 0,
  maxWidth: 560,
}

const tagStyle: CSSProperties = {
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: INK,
  border: '1px solid rgba(242, 237, 227, 0.22)',
  borderRadius: 999,
  padding: '7px 14px',
  whiteSpace: 'nowrap',
}

/** Fixed chrome: brand mark left, PLAY pill right. */
export function LandingHeader({ locale }: { locale: Locale }) {
  const t = (key: string) => MESSAGES[locale][key] ?? key
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
 * Editorial service sections + closing contact block. Server-rendered — the
 * only client component on the landing is the hero scrub above.
 */
export default function LandingSections({ locale }: { locale: Locale }) {
  const t = (key: string) => MESSAGES[locale][key] ?? key

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
      {SERVICE_IDS.map((id, i) => {
        const alignEnd = i % 2 === 1
        return (
          <section
            key={id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: alignEnd ? 'flex-end' : 'flex-start',
              textAlign: alignEnd ? 'right' : 'left',
              gap: 26,
              padding:
                '16vh calc(env(safe-area-inset-right, 0px) + 6vw) 16vh calc(env(safe-area-inset-left, 0px) + 6vw)',
            }}
          >
            <p style={eyebrowStyle}>
              {`0${i + 1}`}
              <span style={{ color: INK_SOFT }}>{' / '}</span>
              {t(`landing.${id}.eyebrow`)}
            </p>
            <h2
              style={{
                ...titleStyle,
                fontSize: 'clamp(34px, 6.6vw, 104px)',
                maxWidth: '12em',
              }}
            >
              {t(`landing.${id}.title`)}
            </h2>
            <p style={bodyStyle}>{t(`landing.${id}.body`)}</p>
            <ul
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: alignEnd ? 'flex-end' : 'flex-start',
                gap: 10,
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {[1, 2, 3].map((n) => (
                <li key={n} style={tagStyle}>
                  {t(`landing.${id}.tag${n}`)}
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      {/* Contact / closing block */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 30,
          padding:
            '22vh calc(env(safe-area-inset-right, 0px) + 6vw) 18vh calc(env(safe-area-inset-left, 0px) + 6vw)',
        }}
      >
        <p style={eyebrowStyle}>{t('landing.contact.eyebrow')}</p>
        <h2
          style={{
            ...titleStyle,
            fontSize: 'clamp(42px, 9vw, 148px)',
            textShadow: `0 0 64px ${COCKPIT_ACCENT}2e`,
          }}
        >
          {t('landing.contact.title')}
        </h2>
        <p style={{ ...bodyStyle, maxWidth: 480 }}>
          {t('landing.contact.body')}
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginTop: 8,
          }}
        >
          <Link
            href={`/${locale}/cockpit` as Route}
            style={{
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0b0812',
              background: COCKPIT_ACCENT,
              borderRadius: 999,
              padding: '18px 34px',
              textDecoration: 'none',
              boxShadow: `0 0 42px ${COCKPIT_ACCENT}55`,
            }}
          >
            {t('landing.cta.primary')}
          </Link>
          <a
            href={EMAIL_HREF}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: INK,
              border: '1px solid rgba(242, 237, 227, 0.28)',
              borderRadius: 999,
              padding: '17px 30px',
              textDecoration: 'none',
            }}
          >
            {t('landing.cta.secondary')}
          </a>
        </div>
      </section>

      {/* Footer strip */}
      <footer
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding:
            '0 calc(env(safe-area-inset-right, 0px) + 5vw) calc(env(safe-area-inset-bottom, 0px) + 26px) calc(env(safe-area-inset-left, 0px) + 5vw)',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: INK_SOFT,
        }}
      >
        <span>{NAME}</span>
        <a href={EMAIL_HREF} style={{ color: INK_SOFT }}>
          {EMAIL}
        </a>
      </footer>
    </div>
  )
}
