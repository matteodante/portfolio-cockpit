'use client'

import { type ReactNode, useState } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

type Variant = 'primary' | 'secondary'

type CockpitButtonProps = {
  onClick: () => void
  variant?: Variant
  children: ReactNode
}

const computeBackground = (isPrimary: boolean, hover: boolean) => {
  if (isPrimary) return COCKPIT_ACCENT
  return hover ? 'var(--color-cockpit-panel-light)' : 'rgba(20,18,15,0.6)'
}

const computeBoxShadow = (isPrimary: boolean, hover: boolean) => {
  if (isPrimary) {
    return hover
      ? `0 0 18px ${COCKPIT_ACCENT}aa, inset 0 1px 0 rgba(255,255,255,0.3)`
      : `0 0 10px ${COCKPIT_ACCENT}55, inset 0 1px 0 rgba(255,255,255,0.2)`
  }
  return hover
    ? `0 0 12px ${COCKPIT_ACCENT}55`
    : 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.8)'
}

export default function CockpitButton({
  onClick,
  variant = 'primary',
  children,
}: CockpitButtonProps) {
  const [hover, setHover] = useState(false)
  const isPrimary = variant === 'primary'
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        padding: isPrimary ? '14px 28px' : '14px 22px',
        background: computeBackground(isPrimary, hover),
        color: isPrimary ? '#000' : COCKPIT_ACCENT,
        border: `1px solid ${COCKPIT_ACCENT}`,
        fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
        fontSize: 13,
        fontWeight: isPrimary ? 700 : 600,
        letterSpacing: 3,
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: computeBoxShadow(isPrimary, hover),
        transform: isPrimary && hover ? 'translateY(-1px)' : 'none',
      }}
    >
      {children}
    </button>
  )
}
