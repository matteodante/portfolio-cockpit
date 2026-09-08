'use client'

import type { Route } from 'next'
import Link from 'next/link'
import {
  CLAUDE_LOCAL_DOCS_REPO_URL,
  GYMTREE_APP_STORE_URL,
  MAESTRO_APP_STORE_URL,
  PORTFOLIO_REPO_URL,
} from '@/lib/constants/contact'
import { type TranslationKey, useT } from '@/lib/i18n'
import SectionCard from '../primitives/section-card'

type Project = {
  titleKey: TranslationKey
  descKey: TranslationKey
  badgeKey: TranslationKey
  href: `https://${string}`
  linkKey: TranslationKey
}

const PROJECTS: readonly Project[] = [
  {
    titleKey: 'projects.maestro.title',
    descKey: 'projects.maestro.desc',
    badgeKey: 'projects.maestro.badge',
    href: MAESTRO_APP_STORE_URL,
    linkKey: 'projects.maestro.link',
  },
  {
    titleKey: 'projects.gymtree.title',
    descKey: 'projects.gymtree.desc',
    badgeKey: 'projects.gymtree.badge',
    href: GYMTREE_APP_STORE_URL,
    linkKey: 'projects.gymtree.link',
  },
  {
    titleKey: 'projects.claudeLocalDocs.title',
    descKey: 'projects.claudeLocalDocs.desc',
    badgeKey: 'projects.claudeLocalDocs.badge',
    href: CLAUDE_LOCAL_DOCS_REPO_URL,
    linkKey: 'projects.claudeLocalDocs.link',
  },
  {
    titleKey: 'projects.portfolio.title',
    descKey: 'projects.portfolio.desc',
    badgeKey: 'projects.portfolio.badge',
    href: PORTFOLIO_REPO_URL,
    linkKey: 'projects.portfolio.link',
  },
] as const

const LINK_STYLE = {
  display: 'inline-flex',
  marginTop: 10,
  color: 'var(--color-cockpit-accent)',
  fontFamily: 'var(--font-body), sans-serif',
  fontSize: 11,
  letterSpacing: 1.2,
  textDecoration: 'none',
  textTransform: 'uppercase',
} as const

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
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: 17,
                fontWeight: 600,
                color: 'var(--color-cockpit-accent)',
              }}
            >
              {t(p.titleKey)}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: 10,
                color: 'var(--color-cockpit-text-dim)',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {t(p.badgeKey)}
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>{t(p.descKey)}</div>
          <Link
            href={p.href as Route}
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            style={LINK_STYLE}
          >
            {t(p.linkKey)} ↗
          </Link>
        </SectionCard>
      ))}
    </div>
  )
}
