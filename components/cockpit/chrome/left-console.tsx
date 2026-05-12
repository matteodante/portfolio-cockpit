'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useHud } from '@/lib/hooks/cockpit-store'
import { type TranslationKey, useT } from '@/lib/i18n'
import Led from './primitives/led'

export default function LeftConsole() {
  const t = useT()
  const coords = useHud((s) => s.coords)
  const speed = useHud((s) => s.speed)
  const gravity = useHud((s) => s.gravity)
  const phase = useHud((s) => s.phase)

  const phaseLabelKey: Record<typeof phase, TranslationKey> = {
    flying: 'cockpit.hud.phaseFlying',
    landed: 'cockpit.hud.phaseLanded',
    transitioning: 'cockpit.hud.phaseTransitioning',
    dead: 'cockpit.hud.phaseDead',
  }
  const phaseColorMap: Record<typeof phase, string> = {
    flying: '#6aff9e',
    landed: '#ffb347',
    transitioning: '#00d9ff',
    dead: '#ff3b3b',
  }
  const phaseLabel = t(phaseLabelKey[phase])
  const phaseColor = phaseColorMap[phase]

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 90,
        height: 220,
        zIndex: 12,
        padding: '12px 8px',
        color: 'var(--color-cockpit-text)',
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
        ◉ {t('cockpit.hud.nav')}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
          fontSize: 10,
          lineHeight: 1.8,
          color: 'var(--color-cockpit-text-dim)',
        }}
      >
        <div>
          {t('cockpit.hud.x')}:{' '}
          <span style={{ color: 'var(--color-cockpit-text)' }}>
            {coords[0].toFixed(1)}
          </span>
        </div>
        <div>
          {t('cockpit.hud.z')}:{' '}
          <span style={{ color: 'var(--color-cockpit-text)' }}>
            {coords[1].toFixed(1)}
          </span>
        </div>
        <div>
          {t('cockpit.hud.speed')}:{' '}
          <span style={{ color: 'var(--color-cockpit-text)' }}>
            {speed.toFixed(1)}
          </span>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <Led color="#6aff9e" on size={6} label={t('cockpit.hud.o2')} />
        <div style={{ height: 4 }} />
        <Led color="#6aff9e" on size={6} label={t('cockpit.hud.fuel')} />
        <div style={{ height: 4 }} />
        <Led
          color={gravity > 0.2 ? '#ffb347' : '#444'}
          on={gravity > 0.2}
          size={6}
          label={`${t('cockpit.hud.gravity')} ${gravity.toFixed(2)}`}
          pulse={gravity > 0.5}
        />
        <div style={{ height: 4 }} />
        <Led
          color={phaseColor}
          on
          size={6}
          label={phaseLabel}
          pulse={phase === 'transitioning' || phase === 'dead'}
        />
      </div>
    </div>
  )
}
