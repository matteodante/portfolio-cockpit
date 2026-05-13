import type { CSSProperties } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

const STYLE: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 1,
  background: `${COCKPIT_ACCENT}66`,
  animation: 'cockpit-scan 4s linear infinite',
  pointerEvents: 'none',
}

/** Horizontal accent-colored line that sweeps across a panel. */
export default function ScanLine() {
  return <div style={STYLE} />
}
