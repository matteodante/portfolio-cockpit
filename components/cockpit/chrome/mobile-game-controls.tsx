'use client'

import {
  COCKPIT_EVENT_TURN_LEFT_DOWN,
  COCKPIT_EVENT_TURN_LEFT_UP,
  COCKPIT_EVENT_TURN_RIGHT_DOWN,
  COCKPIT_EVENT_TURN_RIGHT_UP,
} from '@/components/cockpit/scene/player/player-events'
import { useHud } from '@/lib/hooks/cockpit-store'
import { useT } from '@/lib/i18n'

const DIRECTIONS = [
  {
    key: 'left',
    down: COCKPIT_EVENT_TURN_LEFT_DOWN,
    up: COCKPIT_EVENT_TURN_LEFT_UP,
    label: 'cockpit.mobile.turnLeft',
  },
  {
    key: 'right',
    down: COCKPIT_EVENT_TURN_RIGHT_DOWN,
    up: COCKPIT_EVENT_TURN_RIGHT_UP,
    label: 'cockpit.mobile.turnRight',
  },
] as const

export default function MobileGameControls() {
  const t = useT()
  const phase = useHud((s) => s.phase)
  if (phase === 'dead') return null
  const fire = (name: string) => window.dispatchEvent(new Event(name))
  return (
    <div className="flight-turn-controls">
      {DIRECTIONS.map((direction) => (
        <button
          type="button"
          key={direction.key}
          className="flight-turn"
          aria-label={t(direction.label)}
          onPointerDown={(event) => {
            event.preventDefault()
            event.currentTarget.setPointerCapture(event.pointerId)
            fire(direction.down)
          }}
          onPointerUp={() => fire(direction.up)}
          onPointerCancel={() => fire(direction.up)}
          onLostPointerCapture={() => fire(direction.up)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              fire(direction.down)
            }
          }}
          onKeyUp={() => fire(direction.up)}
          onBlur={() => fire(direction.up)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d={direction.key === 'left' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'}
            />
          </svg>
        </button>
      ))}
    </div>
  )
}
