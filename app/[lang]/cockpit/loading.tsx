import { COCKPIT_ACCENT } from '@/lib/constants/theme'

export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05060a',
        color: COCKPIT_ACCENT,
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        fontSize: 12,
        letterSpacing: 4,
      }}
    >
      <style>{`
        @keyframes boot-pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        .boot-label {
          animation: boot-pulse 1.4s ease-in-out infinite;
        }
      `}</style>
      <span className="boot-label">◉ BOOTING COCKPIT…</span>
    </div>
  )
}
