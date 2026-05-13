import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Matteo Dante · Cockpit Portfolio'
export const size = { width: 1200, height: 600 }
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#05060a',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cockpit grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,107,53,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Overline */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#ff6b35',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 18,
          }}
        >
          ◉ Cockpit Portfolio
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: '#d4cfc5',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}
        >
          Matteo Dante
        </div>

        {/* Divider */}
        <div
          style={{
            width: 56,
            height: 2,
            background: '#ff6b35',
            marginBottom: 24,
          }}
        />

        {/* Role */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: 'rgba(212,207,197,0.7)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Senior Software Engineer
        </div>
      </div>
    </div>,
    { ...size }
  )
}
