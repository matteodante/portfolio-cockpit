import type { CSSProperties, ReactNode } from 'react'

type SectionCardProps = {
  children: ReactNode
  padding?: number | string
  marginBottom?: number
  style?: CSSProperties
}

/**
 * Recessed dark card used for the structured blocks inside dock sections
 * (about vitals, project cards, skill groups, contact rows).
 */
export default function SectionCard({
  children,
  padding = 14,
  marginBottom,
  style,
}: SectionCardProps) {
  return (
    <div
      style={{
        padding,
        marginBottom,
        background: 'var(--color-cockpit-panel-light)',
        border: '1px solid #000',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
