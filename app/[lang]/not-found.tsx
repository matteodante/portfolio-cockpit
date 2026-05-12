import Link from 'next/link'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

export default function NotFound() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05060a',
        color: '#d4cfc5',
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        padding: 24,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes nf-scan {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        @keyframes nf-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nf-code { animation: nf-scan 2.4s ease-in-out infinite; }
        .nf-body { animation: nf-fade-up 0.7s ease-out 0.15s both; }
        .nf-btn {
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .nf-btn:hover {
          background: ${COCKPIT_ACCENT};
          color: #05060a;
          border-color: ${COCKPIT_ACCENT};
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-code, .nf-body { animation: none; }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,107,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div className="nf-body" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="nf-code"
          style={{
            fontSize: 11,
            letterSpacing: 6,
            color: COCKPIT_ACCENT,
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          ◉ SIGNAL LOST · 404
        </div>

        <h1
          style={{
            fontFamily:
              'var(--font-orbitron), var(--font-rajdhani), sans-serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: 20,
            color: '#d4cfc5',
          }}
        >
          Off grid
        </h1>

        <p
          style={{
            fontSize: 14,
            maxWidth: '44ch',
            margin: '0 auto 40px',
            lineHeight: 1.7,
            color: 'rgba(212,207,197,0.65)',
            letterSpacing: '0.02em',
          }}
        >
          No telemetry on this route. Return to the cockpit and pick another
          planet.
        </p>

        <Link
          href={'/en'}
          className="nf-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 28px',
            border: `1px solid ${COCKPIT_ACCENT}`,
            color: COCKPIT_ACCENT,
            background: 'transparent',
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: 3,
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          {'>>'} Return to cockpit
        </Link>
      </div>
    </div>
  )
}
