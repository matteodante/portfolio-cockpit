'use client'

import MiniRadar from '@/components/cockpit/chrome/mini-radar'
import { useHud } from '@/lib/hooks/cockpit-store'
import { type TranslationKey, useT } from '@/lib/i18n'
import type { PlayerPhase } from '@/lib/types/player'

const PHASE_KEYS: Record<PlayerPhase, TranslationKey> = {
  flying: 'cockpit.flight.freeFlight',
  landed: 'cockpit.hud.phaseLanded',
  transitioning: 'cockpit.hud.phaseTransitioning',
  dead: 'cockpit.hud.phaseDead',
}

export default function LeftConsole() {
  const t = useT()
  const coords = useHud((s) => s.coords)
  const speed = useHud((s) => s.speed)
  const phase = useHud((s) => s.phase)
  return (
    <div className="flight-telemetry">
      <MiniRadar />
      <div className="flight-readout">
        <span>{t(PHASE_KEYS[phase])}</span>
        <div className="flight-speed">
          <strong>{speed.toFixed(1)}</strong>
          <small>{t('cockpit.flight.speed')}</small>
        </div>
        <div className="flight-coords">
          X {coords[0].toFixed(1)} <span>/</span> Z {coords[1].toFixed(1)}
        </div>
      </div>
    </div>
  )
}
