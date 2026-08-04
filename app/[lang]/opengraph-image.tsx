import { ImageResponse } from 'next/og'
import type { Locale } from '@/lib/i18n/config'
import { defaultLocale, isValidLocale, locales } from '@/lib/i18n/config'

export const alt = 'Matteo Dante · Cockpit Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Metadata images are route handlers: they never pass through
// app/[lang]/layout.tsx, so its generateStaticParams does not reach them.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

const OVERLINE: Record<Locale, string> = {
  en: '◉ Cockpit · System online',
  it: '◉ Cockpit · Sistema online',
}

const ROLE: Record<Locale, string> = {
  en: 'Senior Software Engineer · 8+ years',
  it: 'Senior Software Engineer · 8+ anni',
}

type ImageProps = { params: Promise<{ lang: string }> }

export default async function OGImage({ params }: ImageProps) {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale

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
          justifyContent: 'center',
          padding: '0 100px',
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
            marginBottom: 24,
          }}
        >
          {OVERLINE[locale]}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            color: '#d4cfc5',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            marginBottom: 28,
          }}
        >
          Matteo Dante
        </div>

        {/* Divider */}
        <div
          style={{
            width: 64,
            height: 2,
            background: '#ff6b35',
            marginBottom: 28,
          }}
        />

        {/* Role */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: 'rgba(212,207,197,0.7)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {ROLE[locale]}
        </div>
      </div>

      {/* Right accent */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: '15%',
          bottom: '15%',
          width: 1,
          background: 'rgba(255,107,53,0.18)',
        }}
      />

      {/* Bottom-right URL */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          right: 100,
          fontSize: 13,
          fontWeight: 400,
          color: 'rgba(212,207,197,0.45)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        matteodante.it
      </div>
    </div>,
    { ...size }
  )
}
