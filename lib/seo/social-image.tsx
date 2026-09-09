import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { Locale } from '@/lib/i18n/config'
import {
  SOCIAL_COPY,
  SOCIAL_IMAGE_SIZE,
  type SocialPage,
} from '@/lib/seo/social'

export async function renderSocialImage(page: SocialPage, locale: Locale) {
  const [background, displayFont, bodyFont] = await Promise.all([
    readFile(join(process.cwd(), 'public/social/hero-background-v2.jpg')),
    readFile(join(process.cwd(), 'public/fonts/social-unbounded-900.ttf')),
    readFile(join(process.cwd(), 'public/fonts/social-space-grotesk-500.ttf')),
  ])
  const [title, subtitle] = SOCIAL_COPY[locale][page]
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#05060a',
        backgroundImage: `url(data:image/jpeg;base64,${background.toString('base64')})`,
        backgroundSize: '1200px 630px',
        color: '#f2ede3',
        fontFamily: 'Space Grotesk',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: 64,
          top: 74,
          width: 610,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Unbounded',
            fontSize: 92,
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
          }}
        >
          <span>Matteo</span>
          <div style={{ display: 'flex' }}>
            Dante<span style={{ color: '#ff6b35' }}>.</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 36,
            width: 570,
            fontSize: 30,
            lineHeight: 1.35,
          }}
        >
          <span>{title}</span>
          <span style={{ fontSize: 24, marginTop: 10, color: '#c5c2bb' }}>
            {subtitle}
          </span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          left: 66,
          bottom: 42,
          fontSize: 20,
          color: '#f2ede3',
        }}
      >
        matteodante.it
      </div>
    </div>,
    {
      ...SOCIAL_IMAGE_SIZE,
      fonts: [
        { name: 'Unbounded', data: displayFont, weight: 900, style: 'normal' },
        { name: 'Space Grotesk', data: bodyFont, weight: 500, style: 'normal' },
      ],
    }
  )
}
