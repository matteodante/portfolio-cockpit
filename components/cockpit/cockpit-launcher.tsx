'use client'

import dynamic from 'next/dynamic'
import type { Locale } from '@/lib/i18n/config'

const CockpitApp = dynamic(() => import('./cockpit-app'), {
  ssr: false,
  loading: () => <BootScreen />,
})

function BootScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-cockpit-bg)',
        color: 'var(--color-cockpit-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        fontSize: 12,
        letterSpacing: 4,
        animation: 'led-pulse 1.5s ease-in-out infinite',
      }}
    >
      ◉ BOOTING COCKPIT…
    </div>
  )
}

type Props = { locale: Locale }

export default function CockpitLauncher({ locale }: Props) {
  return <CockpitApp locale={locale} />
}
