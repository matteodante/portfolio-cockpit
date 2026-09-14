'use client'

import { COCKPIT_EVENT_JUMP } from '@/components/cockpit/scene/player/player-events'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import { useHud } from '@/lib/hooks/cockpit-store'
import { type TranslationKey, useT } from '@/lib/i18n'

export default function TargetPanel({
  near,
  onDock,
}: {
  near: CockpitSection | null
  onDock: () => void
}) {
  const t = useT()
  const phase = useHud((s) => s.phase)
  if (phase === 'dead') return null
  const landed = phase === 'landed'
  const title = near
    ? t(`${near.i18nKey}.title` as TranslationKey)
    : t('cockpit.flight.explore')
  return (
    <div className="flight-target" data-near={!!near}>
      {near && (
        <span className="flight-target-status">
          {t(landed ? 'cockpit.flight.landed' : 'cockpit.flight.approaching')}
        </span>
      )}
      <strong>{title}</strong>
      {near ? (
        <div className="flight-target-actions">
          <button type="button" className="brand-button" onClick={onDock}>
            <span className="flight-keyboard-only">
              {t('cockpit.controls.dockBtn')}
            </span>
            <span className="flight-touch-only">
              {t('cockpit.mobile.info')}
            </span>
          </button>
          {landed && (
            <button
              type="button"
              className="flight-takeoff"
              onClick={() =>
                window.dispatchEvent(new Event(COCKPIT_EVENT_JUMP))
              }
            >
              {t('cockpit.controls.takeoff')}
            </button>
          )}
        </div>
      ) : (
        <p>
          <span className="flight-keyboard-only">
            {t('cockpit.flight.keyboardHint')}
          </span>
          <span className="flight-touch-only">
            {t('cockpit.flight.touchHint')}
          </span>
        </p>
      )}
    </div>
  )
}
