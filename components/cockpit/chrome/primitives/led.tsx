type LedProps = {
  color?: string
  on?: boolean
  size?: number
  label?: string
  pulse?: boolean
}

export default function Led({
  color = '#6aff9e',
  on = true,
  size = 8,
  label,
  pulse = false,
}: LedProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: on ? color : '#222',
          boxShadow: on
            ? `0 0 ${size}px ${color}, inset 0 0 ${size / 3}px rgba(255,255,255,0.4)`
            : 'inset 0 1px 2px rgba(0,0,0,0.8)',
          animation:
            pulse && on ? 'led-pulse 1.5s ease-in-out infinite' : 'none',
        }}
      />
      {label ? (
        <span
          style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 9,
            color: 'var(--color-cockpit-text-dim)',
            letterSpacing: 1,
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
