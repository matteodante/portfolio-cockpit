'use client'

import { useEffect } from 'react'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Cockpit global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#05060a',
          color: '#d4cfc5',
          fontFamily:
            '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          padding: 24,
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,107,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 6,
              color: '#ff6b35',
              marginBottom: 20,
            }}
          >
            ⚠ CRITICAL FAULT
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: 16,
              color: '#d4cfc5',
            }}
          >
            Cockpit down
          </h1>

          <p
            style={{
              fontSize: 14,
              color: 'rgba(212,207,197,0.6)',
              maxWidth: '42ch',
              margin: '0 auto 36px',
              lineHeight: 1.7,
              letterSpacing: '0.02em',
            }}
          >
            The application encountered a fatal fault. Reboot the session or
            return to base.
          </p>

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
              style={{
                padding: '12px 28px',
                border: '1px solid #ff6b35',
                background: 'transparent',
                color: '#ff6b35',
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {'>>'} Reboot
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              style={{
                padding: '12px 28px',
                border: '1px solid rgba(212,207,197,0.25)',
                background: 'transparent',
                color: 'rgba(212,207,197,0.7)',
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Return to base
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
