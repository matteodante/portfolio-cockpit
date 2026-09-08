import type { CSSProperties, PropsWithChildren } from 'react'

type MetalPanelProps = PropsWithChildren<{
  style?: CSSProperties
}>

export default function MetalPanel({ children, style }: MetalPanelProps) {
  return (
    <div
      style={{
        background: 'var(--color-cockpit-panel)',
        border: '1px solid var(--color-cockpit-border)',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
