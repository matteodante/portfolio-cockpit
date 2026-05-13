'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import { useHud } from '@/lib/hooks/cockpit-store'
import { type TranslationKey, useT } from '@/lib/i18n'
import Led from './primitives/led'

type TopBarProps = {
  near: CockpitSection | null
}

export default function TopBar({ near }: TopBarProps) {
  const t = useT()
  const nearLabel = near ? t(`${near.i18nKey}.label` as TranslationKey) : ''
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        zIndex: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 120px',
        pointerEvents: 'none',
      }}
    >
      {/* Ship id */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 3,
              color: 'var(--color-cockpit-text)',
            }}
          >
            {t('cockpit.vessel.name')}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
              fontSize: 9,
              color: 'var(--color-cockpit-text-dim)',
              letterSpacing: 2,
            }}
          >
            {t('cockpit.vessel.id')}
          </div>
        </div>
      </div>
      {/* Mission status */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Led color="#6aff9e" on pulse label={t('cockpit.hud.lifeSupport')} />
        <Led color={COCKPIT_ACCENT} on label={t('cockpit.hud.navOnline')} />
        <Led
          color={near ? '#ffb347' : '#444'}
          on={!!near}
          label={
            near
              ? `${t('cockpit.hud.targetLocked')} · ${nearLabel}`
              : t('cockpit.hud.scanning')
          }
          pulse={!!near}
        />
      </div>
    </div>
  )
}

type ApproachBannerProps = {
  near: CockpitSection
}

export function ApproachBanner({ near }: ApproachBannerProps) {
  const t = useT()
  const landed = useHud((s) => s.landed)
  const label = t(`${near.i18nKey}.label` as TranslationKey)

  if (landed) {
    const color = '#f4f1ea'
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'fade-in 0.3s ease',
        }}
      >
        <div
          style={{
            padding: '10px 22px',
            background: 'rgba(5,6,10,0.75)',
            border: `1px solid ${color}`,
            color,
            fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
            letterSpacing: 3,
            fontSize: 12,
            textShadow: `0 0 8px ${color}`,
          }}
        >
          {t('cockpit.banner.landed').replace('{label}', label)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 10,
            color: 'rgba(244,241,234,0.75)',
            letterSpacing: 2,
          }}
        >
          {t('cockpit.banner.takeoffHint')}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '22%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 22px',
        background: 'rgba(5,6,10,0.75)',
        border: `1px solid ${COCKPIT_ACCENT}`,
        color: COCKPIT_ACCENT,
        fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
        letterSpacing: 3,
        fontSize: 12,
        pointerEvents: 'none',
        zIndex: 20,
        animation: 'fade-in 0.3s ease',
        textShadow: `0 0 8px ${COCKPIT_ACCENT}`,
      }}
    >
      {t('cockpit.banner.approaching').replace('{label}', label)}
    </div>
  )
}
