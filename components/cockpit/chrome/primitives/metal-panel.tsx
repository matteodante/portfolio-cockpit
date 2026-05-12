import type { CSSProperties, PropsWithChildren } from 'react'
import Rivet from './rivet'

type MetalPanelProps = PropsWithChildren<{
  style?: CSSProperties
  showRivets?: boolean
}>

export default function MetalPanel({
  children,
  style,
  showRivets = true,
}: MetalPanelProps) {
  return (
    <div
      style={{
        background: 'var(--color-cockpit-panel)',
        border: '1px solid #000',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
        position: 'relative',
        ...style,
      }}
    >
      {showRivets ? (
        <>
          <Rivet size={7} style={{ position: 'absolute', top: 5, left: 5 }} />
          <Rivet size={7} style={{ position: 'absolute', top: 5, right: 5 }} />
          <Rivet
            size={7}
            style={{ position: 'absolute', bottom: 5, left: 5 }}
          />
          <Rivet
            size={7}
            style={{ position: 'absolute', bottom: 5, right: 5 }}
          />
        </>
      ) : null}
      {children}
    </div>
  )
}
