'use client'

import { useHud } from '@/lib/hooks/cockpit-store'
import { useT } from '@/lib/i18n'

export default function ControlsPanel() {
  const t = useT()
  const phase = useHud((s) => s.phase)
  return (
    <section className="flight-legend">
      <h3>{t('cockpit.hud.controls')}</h3>
      <dl className="flight-keyboard-only">
        <div>
          <dt>
            <kbd>W A S D</kbd>
          </dt>
          <dd>{t('cockpit.controls.move')}</dd>
        </div>
        <div>
          <dt>
            <kbd>SPACE</kbd>
          </dt>
          <dd>
            {t(
              phase === 'landed'
                ? 'cockpit.controls.takeoff'
                : 'cockpit.controls.land'
            )}
          </dd>
        </div>
        <div>
          <dt>
            <kbd>SHIFT</kbd>
          </dt>
          <dd>{t('cockpit.controls.run')}</dd>
        </div>
        <div>
          <dt>
            <kbd>E</kbd>
          </dt>
          <dd>{t('cockpit.controls.dock')}</dd>
        </div>
        <div>
          <dt>
            <kbd>ESC</kbd>
          </dt>
          <dd>{t('cockpit.controls.undock')}</dd>
        </div>
      </dl>
      <p className="flight-touch-only">
        {t('cockpit.flight.touchInstructions')}
      </p>
    </section>
  )
}
