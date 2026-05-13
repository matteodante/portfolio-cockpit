'use client'

import type { CSSProperties } from 'react'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import type { Locale } from '@/lib/i18n/config'
import ActionsPanel from './actions-panel'
import AiPanel from './ai-panel'
import ControlsPanel from './controls-panel'
import TargetPanel from './target-panel'

type BottomConsoleProps = {
  near: CockpitSection | null
  locale: Locale
  onDock: () => void
  onOpenComm: () => void
}

const WRAPPER_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 90,
  right: 90,
  height: 220,
  zIndex: 12,
  padding: '16px 20px',
  display: 'flex',
  gap: 14,
  alignItems: 'stretch',
  color: 'var(--color-cockpit-text)',
}

const MIDDLE_STYLE: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: 12,
  minWidth: 0,
}

/**
 * Cockpit bottom bar composed of four panels: keyboard legend, target lock,
 * AI chat teaser, and a column of external-link action buttons.
 */
export default function BottomConsole({
  near,
  locale,
  onDock,
  onOpenComm,
}: BottomConsoleProps) {
  return (
    <div style={WRAPPER_STYLE}>
      <ControlsPanel />
      <div style={MIDDLE_STYLE}>
        <TargetPanel near={near} onDock={onDock} />
        <AiPanel onOpenComm={onOpenComm} />
      </div>
      <ActionsPanel locale={locale} />
    </div>
  )
}
