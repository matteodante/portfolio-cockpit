'use client'

import { useState } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

type ActionButtonProps = {
  onClick: () => void
  label: string
  sub: string
}

export default function ActionButton({
  onClick,
  label,
  sub,
}: ActionButtonProps) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        flex: 1,
        padding: '10px 14px',
        textAlign: 'left',
        background: hover ? '#1f1c18' : '#14120f',
        border: `1px solid ${hover ? COCKPIT_ACCENT : '#000'}`,
        boxShadow: hover
          ? `0 0 10px ${COCKPIT_ACCENT}44, inset 0 1px 0 rgba(255,255,255,0.08)`
          : 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.8)',
        color: 'var(--color-cockpit-text)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'inherit',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 9,
            color: 'var(--color-cockpit-text-dim)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sub}
        </div>
      </div>
    </button>
  )
}
