'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Cockpit error boundary:', error)
  }, [error])

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
        @keyframes err-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes err-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .err-tag { animation: err-blink 1.2s steps(2, end) infinite; }
        .err-body { animation: err-fade-up 0.7s ease-out 0.15s both; }
        .err-btn {
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          cursor: pointer;
          font-family: inherit;
        }
        .err-btn.primary:hover {
          background: ${COCKPIT_ACCENT};
          color: #05060a;
          border-color: ${COCKPIT_ACCENT};
        }
        .err-btn.ghost:hover {
          border-color: rgba(212,207,197,0.6);
          color: #d4cfc5;
        }
        @media (prefers-reduced-motion: reduce) {
          .err-tag, .err-body { animation: none; }
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

      <div className="err-body" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="err-tag"
          style={{
            fontSize: 11,
            letterSpacing: 6,
            color: COCKPIT_ACCENT,
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          ⚠ SYSTEM FAULT
        </div>

        <h1
          style={{
            fontFamily:
              'var(--font-orbitron), var(--font-rajdhani), sans-serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.05,
            marginBottom: 16,
            color: '#d4cfc5',
          }}
        >
          Cockpit offline
        </h1>

        <p
          style={{
            fontSize: 14,
            maxWidth: '44ch',
            margin: '0 auto 36px',
            lineHeight: 1.7,
            color: 'rgba(212,207,197,0.65)',
            letterSpacing: '0.02em',
          }}
        >
          An unexpected fault interrupted the scene. Try rebooting or return to
          base.
        </p>

        {error.digest ? (
          <div
            style={{
              fontSize: 10,
              letterSpacing: 3,
              color: 'rgba(212,207,197,0.35)',
              marginBottom: 28,
              textTransform: 'uppercase',
            }}
          >
            fault id · {error.digest}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={reset}
            className="err-btn primary"
            style={{
              padding: '12px 28px',
              border: `1px solid ${COCKPIT_ACCENT}`,
              background: 'transparent',
              color: COCKPIT_ACCENT,
              fontSize: 11,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {'>>'} Reboot
          </button>
          <Link
            href={'/en'}
            className="err-btn ghost"
            style={{
              padding: '12px 28px',
              border: '1px solid rgba(212,207,197,0.25)',
              background: 'transparent',
              color: 'rgba(212,207,197,0.7)',
              fontSize: 11,
              letterSpacing: 3,
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Return to base
          </Link>
        </div>
      </div>
    </div>
  )
}
