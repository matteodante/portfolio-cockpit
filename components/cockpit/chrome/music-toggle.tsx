'use client'

import { useState } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

type Props = {
  muted: boolean
  onToggle: () => void
  ariaLabel: string
}

export default function MusicToggle({ muted, onToggle, ariaLabel }: Props) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={ariaLabel}
      aria-pressed={muted}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
        left: 'calc(env(safe-area-inset-left, 0px) + 14px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: hover ? '#1f1c18' : '#14120f',
        border: `1px solid ${muted ? '#2a2824' : `${COCKPIT_ACCENT}55`}`,
        boxShadow: hover
          ? `0 0 10px ${COCKPIT_ACCENT}44, inset 0 1px 0 rgba(255,255,255,0.08)`
          : 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.8)',
        color: muted ? 'var(--color-cockpit-text-dim)' : COCKPIT_ACCENT,
        fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>
        ♪
      </span>
      <span>{muted ? 'OFF' : 'ON'}</span>
    </button>
  )
}
