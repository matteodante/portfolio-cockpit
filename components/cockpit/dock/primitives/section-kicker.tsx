import type { CSSProperties, ReactNode } from 'react'

type SectionKickerProps = {
  children: ReactNode
  size?: 'sm' | 'md'
  marginBottom?: number
  style?: CSSProperties
}

const SIZE_PX: Record<NonNullable<SectionKickerProps['size']>, number> = {
  sm: 9,
  md: 10,
}

/**
 * Small uppercase accent-tinted label that introduces a sub-section inside
 * a docked panel — the recurring "◉ FOO" kicker pattern.
 */
export default function SectionKicker({
  children,
  size = 'md',
  marginBottom = 6,
  style,
}: SectionKickerProps) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        fontSize: SIZE_PX[size],
        letterSpacing: 2,
        color: 'var(--color-cockpit-accent)',
        marginBottom,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
