'use client'

export default function ActionButton({
  onClick,
  label,
  sub,
}: {
  onClick: () => void
  label: string
  sub: string
}) {
  return (
    <button type="button" className="cockpit-action" onClick={onClick}>
      <span>
        <strong>{label}</strong>
        <small>{sub}</small>
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12h14m-6-6 6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  )
}
