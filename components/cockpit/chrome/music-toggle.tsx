'use client'

type Props = { muted: boolean; onToggle: () => void; ariaLabel: string }
export default function MusicToggle({ muted, onToggle, ariaLabel }: Props) {
  return (
    <button
      type="button"
      className="flight-icon-button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={!muted}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M4 9h4l5-4v14l-5-4H4Z" />
        {muted ? (
          <path d="m17 9 5 6m0-6-5 6" />
        ) : (
          <path d="M17 8q5 4 0 8m3-11q8 7 0 14" />
        )}
      </svg>
    </button>
  )
}
