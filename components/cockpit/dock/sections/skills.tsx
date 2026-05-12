'use client'

import { useT } from '@/lib/i18n'
import SectionCard from '../primitives/section-card'
import SectionKicker from '../primitives/section-kicker'

const SKILL_KEYS = [
  'skills.1',
  'skills.2',
  'skills.3',
  'skills.4',
  'skills.5',
  'skills.6',
] as const

export default function SkillsSection() {
  const t = useT()

  return (
    <div>
      <SectionKicker marginBottom={12}>
        {t('skills.title').toUpperCase()}
      </SectionKicker>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
        }}
      >
        {SKILL_KEYS.map((key) => {
          const raw = t(key)
          const [heading, ...rest] = raw.split(':')
          const body = rest.join(':').trim()
          return (
            <SectionCard key={key} padding={12}>
              <SectionKicker size="sm">
                {heading?.toUpperCase() ?? ''}
              </SectionKicker>
              <div style={{ fontSize: 12, lineHeight: 1.55 }}>{body}</div>
            </SectionCard>
          )
        })}
      </div>
    </div>
  )
}
