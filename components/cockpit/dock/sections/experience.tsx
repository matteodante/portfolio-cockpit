'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { type TranslationKey, useT } from '@/lib/i18n'

type ExperienceKey = '01' | '02' | '03' | '04' | '05'

const EXPERIENCES: readonly ExperienceKey[] = [
  '03',
  '04',
  '02',
  '01',
  '05',
] as const
// order: Pilatus → DonTouch → Hexa → Galileo → GymTree

export default function ExperienceSection() {
  const t = useT()
  return (
    <div>
      {EXPERIENCES.map((key) => (
        <ExperienceCard key={key} id={key} t={t} />
      ))}
    </div>
  )
}

type CardProps = {
  id: ExperienceKey
  t: (key: TranslationKey) => string
}

function ExperienceCard({ id, t }: CardProps) {
  const company = t(`experience.${id}.hero.company`)
  const role = t(`experience.${id}.hero.role`)
  const period = t(`experience.${id}.context.period.value`)
  const location = t(`experience.${id}.context.location.value`)
  const team = t(`experience.${id}.context.team.value`)
  const stack = t(`experience.${id}.context.stack.value`)

  const ownership = [
    t(`experience.${id}.ownership.1`),
    t(`experience.${id}.ownership.2`),
    t(`experience.${id}.ownership.3`),
    t(`experience.${id}.ownership.4`),
  ]

  return (
    <div
      style={{
        marginBottom: 22,
        paddingLeft: 14,
        borderLeft: `2px solid ${COCKPIT_ACCENT}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
            fontWeight: 600,
            fontSize: 17,
            color: 'var(--color-cockpit-text)',
          }}
        >
          {company}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
            fontSize: 10,
            color: 'var(--color-cockpit-text-dim)',
            letterSpacing: 1,
          }}
        >
          {period}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--color-cockpit-text-dim)',
          fontStyle: 'italic',
          marginBottom: 8,
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        }}
      >
        {role} · {location}
      </div>

      {id === '03' ? (
        <div
          style={{
            marginBottom: 10,
            border: '1px solid #000',
            background: '#0a0908',
            overflow: 'hidden',
          }}
        >
          <video
            src="/videos/jet-1.mp4"
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: 140,
              objectFit: 'cover',
              display: 'block',
            }}
          >
            <track kind="captions" />
          </video>
        </div>
      ) : null}

      <div
        style={{
          fontSize: 11,
          color: 'var(--color-cockpit-text-dim)',
          marginBottom: 6,
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
          letterSpacing: 1,
        }}
      >
        {t('experience.context.team')}:{' '}
        <span style={{ color: 'var(--color-cockpit-text)' }}>{team}</span> ·{' '}
        {t('experience.context.stack')}:{' '}
        <span style={{ color: 'var(--color-cockpit-text)' }}>{stack}</span>
      </div>

      <ul
        style={{
          margin: 0,
          paddingLeft: 18,
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--color-cockpit-text)',
        }}
      >
        {ownership.map((item) => (
          <li key={item}>{stripMarkdown(item)}</li>
        ))}
      </ul>
    </div>
  )
}

function stripMarkdown(text: string): string {
  // Remove **bold** markers and collapse newlines, leaving pure text
  return text.replace(/\*\*(?<bold>.*?)\*\*/g, '$<bold>').replace(/\n+/g, ' ')
}
