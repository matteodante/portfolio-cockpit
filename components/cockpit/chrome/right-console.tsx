'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import LanguageSwitcher from './language-switcher'
import MiniRadar from './mini-radar'

type RightConsoleProps = {
  locale: Locale
}

export default function RightConsole({ locale }: RightConsoleProps) {
  const t = useT()
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 90,
        height: 220,
        zIndex: 12,
        padding: '12px 8px',
        textAlign: 'right',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
          fontSize: 9,
          letterSpacing: 2,
          color: COCKPIT_ACCENT,
          marginBottom: 8,
        }}
      >
        ◉ {t('cockpit.hud.radar')}
      </div>
      <MiniRadar />
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          justifyContent: 'flex-end',
          pointerEvents: 'auto',
        }}
      >
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </div>
  )
}
