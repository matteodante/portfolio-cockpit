'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useHud } from '@/lib/hooks/cockpit-store'
import { useT } from '@/lib/i18n'
import {
  COCKPIT_EVENT_INFO,
  COCKPIT_EVENT_JUMP,
  COCKPIT_EVENT_TURN_LEFT_DOWN,
  COCKPIT_EVENT_TURN_LEFT_UP,
  COCKPIT_EVENT_TURN_RIGHT_DOWN,
  COCKPIT_EVENT_TURN_RIGHT_UP,
} from '../scene/player/player-events'

type Props = {
  onOpenChat: () => void
}

const STYLES = `
.mg {
  position: absolute;
  z-index: 30;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  appearance: none;
  background: rgba(5,6,10,0.6);
  border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent);
  color: var(--accent);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 160ms ease, color 160ms ease;
}
.mg:active {
  border-color: var(--accent);
}
.mg:disabled {
  opacity: 0.32;
  cursor: default;
}
.mg-label {
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #d4cfc5;
}

.mg-jump { left: calc(env(safe-area-inset-left, 0px) + 16px); bottom: calc(env(safe-area-inset-bottom, 0px) + 18px); }
.mg-info { right: calc(env(safe-area-inset-right, 0px) + 16px); bottom: calc(env(safe-area-inset-bottom, 0px) + 18px); }
.mg-ai   { right: calc(env(safe-area-inset-right, 0px) + 16px); bottom: calc(env(safe-area-inset-bottom, 0px) + 90px); }

.mg-turn-row {
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  gap: 10px;
  pointer-events: none;
}
.mg-turn {
  pointer-events: auto;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  appearance: none;
  background: rgba(5,6,10,0.6);
  border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent);
  color: var(--accent);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 160ms ease;
}
.mg-turn:active { border-color: var(--accent); }
`

function IconJump() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
    >
      <title>jump</title>
      <path d="M12 4v12" />
      <path d="M6 10l6-6 6 6" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
    >
      <title>info</title>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconAi() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
    >
      <title>ai</title>
      <path d="M12 4v3" />
      <path d="M12 17v3" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconChevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="square"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <title>chevron</title>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export default function MobileGameControls({ onOpenChat }: Props) {
  const t = useT()
  const phase = useHud((s) => s.phase)
  const nearestId = useHud((s) => s.nearestId)
  const hidden = phase === 'dead'
  const infoEnabled = !!nearestId

  if (hidden) return null

  const fire = (event: string) => window.dispatchEvent(new Event(event))

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static css */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {phase === 'landed' && (
        <button
          type="button"
          className="mg mg-jump"
          onClick={() => fire(COCKPIT_EVENT_JUMP)}
          aria-label={t('cockpit.mobile.jump')}
          style={{ ['--accent' as string]: COCKPIT_ACCENT }}
        >
          <IconJump />
          <span className="mg-label">{t('cockpit.mobile.jump')}</span>
        </button>
      )}
      <button
        type="button"
        className="mg mg-ai"
        onClick={onOpenChat}
        aria-label={t('cockpit.mobile.chat')}
        style={{ ['--accent' as string]: COCKPIT_ACCENT }}
      >
        <IconAi />
        <span className="mg-label">{t('cockpit.mobile.chat')}</span>
      </button>
      <button
        type="button"
        className="mg mg-info"
        onClick={() => fire(COCKPIT_EVENT_INFO)}
        aria-label={t('cockpit.mobile.info')}
        disabled={!infoEnabled}
        style={{ ['--accent' as string]: COCKPIT_ACCENT }}
      >
        <IconInfo />
        <span className="mg-label">{t('cockpit.mobile.info')}</span>
      </button>
      <div
        className="mg-turn-row"
        style={{ ['--accent' as string]: COCKPIT_ACCENT }}
      >
        <button
          type="button"
          className="mg-turn"
          aria-label={t('cockpit.mobile.turnLeft')}
          onPointerDown={(e) => {
            e.preventDefault()
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            fire(COCKPIT_EVENT_TURN_LEFT_DOWN)
          }}
          onPointerUp={() => fire(COCKPIT_EVENT_TURN_LEFT_UP)}
          onPointerCancel={() => fire(COCKPIT_EVENT_TURN_LEFT_UP)}
          onPointerLeave={() => fire(COCKPIT_EVENT_TURN_LEFT_UP)}
        >
          <IconChevron flip />
        </button>
        <button
          type="button"
          className="mg-turn"
          aria-label={t('cockpit.mobile.turnRight')}
          onPointerDown={(e) => {
            e.preventDefault()
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            fire(COCKPIT_EVENT_TURN_RIGHT_DOWN)
          }}
          onPointerUp={() => fire(COCKPIT_EVENT_TURN_RIGHT_UP)}
          onPointerCancel={() => fire(COCKPIT_EVENT_TURN_RIGHT_UP)}
          onPointerLeave={() => fire(COCKPIT_EVENT_TURN_RIGHT_UP)}
        >
          <IconChevron />
        </button>
      </div>
    </>
  )
}
