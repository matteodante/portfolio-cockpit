'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { externalActions } from './bottom-console/external-actions'
import CockpitButton from './cockpit-button'
import LanguageSwitcher from './language-switcher'

type IntroOverlayProps = {
  locale: Locale
  onStart: () => void
}

export default function IntroOverlay({ locale, onStart }: IntroOverlayProps) {
  const t = useT()
  const { downloadCv } = externalActions(locale)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse at 28% 75%, rgba(5,6,10,0) 0%, rgba(5,6,10,0.7) 100%)',
        animation: 'fade-in 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 16px)',
          pointerEvents: 'auto',
        }}
      >
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 'calc(env(safe-area-inset-left, 0px) + 6vw)',
          right: 'calc(env(safe-area-inset-right, 0px) + 6vw)',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 9vh)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 22,
          maxWidth: 'min(680px, 92vw)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
            fontSize: 'clamp(28px, 4.6vw, 54px)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            color: '#f4f1ea',
            margin: 0,
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
            textShadow: `0 0 32px ${COCKPIT_ACCENT}33`,
          }}
        >
          {t('cockpit.intro.subtitle')}
        </h1>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 4,
            flexWrap: 'wrap',
            pointerEvents: 'auto',
          }}
        >
          <CockpitButton onClick={onStart} variant="primary">
            {t('cockpit.intro.start')}
          </CockpitButton>
          <CockpitButton onClick={downloadCv} variant="secondary">
            {t('cockpit.actions.downloadCv')}
          </CockpitButton>
        </div>
      </div>
    </div>
  )
}
