'use client'

import { useT } from '@/lib/i18n'
import SectionCard from '../primitives/section-card'
import SectionKicker from '../primitives/section-kicker'

const LIST_STYLE = {
  margin: 0,
  paddingLeft: 18,
  fontSize: 13,
  lineHeight: 1.6,
  color: 'var(--color-cockpit-text)',
} as const

export default function AboutSection() {
  const t = useT()

  const learningItems = [
    t('about.learning.1'),
    t('about.learning.2'),
    t('about.learning.3'),
    t('about.learning.4'),
  ]
  const educationItems = [t('about.education.1'), t('about.education.2')]

  return (
    <div>
      <p style={{ marginTop: 0, fontSize: 14, lineHeight: 1.7 }}>
        {t('about.bio')}
      </p>

      <div style={{ marginTop: 18 }}>
        <SectionKicker>
          {t('about.education.title').toUpperCase()}
        </SectionKicker>
        <ul style={LIST_STYLE}>
          {educationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionKicker>{t('about.learning.title').toUpperCase()}</SectionKicker>
        <ul style={LIST_STYLE}>
          {learningItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <SectionCard
        style={{
          marginTop: 20,
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
          fontSize: 12,
        }}
      >
        <SectionKicker
          size="sm"
          style={{ color: 'var(--color-cockpit-text-dim)' }}
        >
          {t('cockpit.about.vitalsTitle')}
        </SectionKicker>
        <div>
          {t('cockpit.about.location')} ─── {t('cockpit.about.locationValue')}
        </div>
        <div>
          {t('cockpit.about.yearsExp')} ─── {t('cockpit.about.yearsExpValue')}
        </div>
        <div>
          {t('cockpit.about.role')} ─── {t('cockpit.about.roleValue')}
        </div>
      </SectionCard>
    </div>
  )
}
