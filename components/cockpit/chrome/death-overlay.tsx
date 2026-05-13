'use client'

import { useHud } from '@/lib/hooks/cockpit-store'
import { useT } from '@/lib/i18n'

export default function DeathOverlay() {
  const phase = useHud((s) => s.phase)
  const t = useT()
  if (phase !== 'dead') return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse at center, rgba(255,20,20,0.18) 0%, rgba(5,6,10,0.72) 60%, rgba(5,6,10,0.92) 100%)',
        animation: 'fade-in 0.25s ease-out both',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-orbitron), sans-serif',
          fontSize: 'clamp(28px, 5vw, 64px)',
          color: '#ff3b3b',
          letterSpacing: '0.3em',
          textShadow: '0 0 16px rgba(255,60,60,0.85)',
          fontWeight: 700,
        }}
      >
        {t('cockpit.death.title')}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 'clamp(11px, 1.1vw, 14px)',
          color: '#ffb3b3',
          letterSpacing: '0.25em',
        }}
      >
        {t('cockpit.death.subtitle')}
      </div>
    </div>
  )
}
