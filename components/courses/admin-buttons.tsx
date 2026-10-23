'use client'

import { useTransition } from 'react'

/** A small button that runs a server action, asking first when destructive. */
export default function ActionButton({
  label,
  confirm,
  action,
  className = 'admin-link',
}: {
  label: string
  confirm?: string
  action: () => Promise<void>
  className?: string
}) {
  const [pending, start] = useTransition()
  return (
    <button
      className={className}
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return
        start(action)
      }}
    >
      {label}
    </button>
  )
}
