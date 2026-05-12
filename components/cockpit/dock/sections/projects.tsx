'use client'

import { type TranslationKey, useT } from '@/lib/i18n'
import SectionCard from '../primitives/section-card'

type Project = {
  titleKey: TranslationKey
  descKey: TranslationKey
  badgeKey: TranslationKey
}

const PROJECTS: readonly Project[] = [
  {
    titleKey: 'projects.gymtree.title',
    descKey: 'projects.gymtree.desc',
    badgeKey: 'projects.gymtree.badge',
  },
  {
    titleKey: 'projects.claudeLocalDocs.title',
    descKey: 'projects.claudeLocalDocs.desc',
    badgeKey: 'projects.claudeLocalDocs.badge',
  },
  {
    titleKey: 'projects.portfolio.title',
    descKey: 'projects.portfolio.desc',
    badgeKey: 'projects.portfolio.badge',
  },
] as const

export default function ProjectsSection() {
  const t = useT()
  return (
    <div>
      {PROJECTS.map((p) => (
        <SectionCard key={p.titleKey} marginBottom={16}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 6,
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
                fontSize: 17,
                fontWeight: 600,
                color: 'var(--color-cockpit-accent)',
              }}
            >
              {t(p.titleKey)}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
                fontSize: 10,
                color: 'var(--color-cockpit-text-dim)',
                letterSpacing: 1,
              }}
            >
              {t(p.badgeKey)}
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>{t(p.descKey)}</div>
        </SectionCard>
      ))}
    </div>
  )
}
