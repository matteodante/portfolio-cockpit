import type { CSSProperties, ReactNode } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

type PanelHeaderProps = {
  title: string
  right?: ReactNode
}

const STYLE: CSSProperties = {
  fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
  fontSize: 9,
  letterSpacing: 2,
  display: 'flex',
  justifyContent: 'space-between',
  color: COCKPIT_ACCENT,
}

/**
 * Accent-tinted header used at the top of every bottom-console panel:
 * "◉ TITLE" on the left, an optional status pill on the right.
 */
export default function PanelHeader({ title, right }: PanelHeaderProps) {
  return (
    <div style={STYLE}>
      <span>◉ {title}</span>
      {right}
    </div>
  )
}
