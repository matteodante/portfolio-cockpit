'use client'

import TargetPanel from '@/components/cockpit/chrome/bottom-console/target-panel'
import LeftConsole from '@/components/cockpit/chrome/left-console'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import { useT } from '@/lib/i18n'

type Props = {
  near: CockpitSection | null
  onDock: () => void
  onOpenComm: () => void
}

export default function BottomConsole({ near, onDock, onOpenComm }: Props) {
  const t = useT()
  return (
    <div className="flight-bottom">
      <LeftConsole />
      <TargetPanel near={near} onDock={onDock} />
      <div className="flight-chat-action">
        <button
          type="button"
          className="flight-chat-button"
          onClick={onOpenComm}
        >
          {t('cockpit.controls.openAiBtn')}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 12h15m-6-6 6 6-6 6" />
          </svg>
        </button>
        <span className="flight-keyboard-only flight-menu-hint">
          {t('cockpit.flight.menuHint')}
        </span>
      </div>
    </div>
  )
}
