'use client'

type Props = { muted: boolean; onToggle: () => void; ariaLabel: string }

export default function MusicToggle({ muted, onToggle, ariaLabel }: Props) {
  return (
    <button
      type="button"
      className="cockpit-action"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={muted}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
        left: 'calc(env(safe-area-inset-left, 0px) + 14px)',
        zIndex: 60,
        minHeight: 40,
        padding: '8px 10px',
        fontSize: 10,
        color: muted
          ? 'var(--color-cockpit-text-dim)'
          : 'var(--color-cockpit-accent)',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 18V5l11-2v13M9 5l11-2M9 18c0 2-2 3-4 3s-3-1-3-2 2-3 4-3 3 1 3 2Zm11-2c0 2-2 3-4 3s-3-1-3-2 2-3 4-3 3 1 3 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {muted ? 'OFF' : 'ON'}
    </button>
  )
}
