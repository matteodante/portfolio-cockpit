'use client'

import type { ReactNode } from 'react'

type CockpitButtonProps = {
  onClick: () => void
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export default function CockpitButton({
  onClick,
  variant = 'primary',
  children,
}: CockpitButtonProps) {
  return (
    <button
      type="button"
      className="brand-button"
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
