import type { PropsWithChildren } from 'react'

export default function Key({ children }: PropsWithChildren) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 6px',
        minWidth: 14,
        textAlign: 'center',
        background: '#0a0908',
        border: '1px solid #3a3630',
        borderBottom: '2px solid #1a1816',
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--color-cockpit-text)',
        marginRight: 3,
        borderRadius: 2,
      }}
    >
      {children}
    </span>
  )
}
