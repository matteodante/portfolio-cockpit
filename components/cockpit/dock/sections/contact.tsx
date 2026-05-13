'use client'

import type { Route } from 'next'
import Link from 'next/link'
import {
  EMAIL,
  EMAIL_HREF,
  GITHUB_DISPLAY,
  GITHUB_URL,
  LINKEDIN_DISPLAY,
  LINKEDIN_URL,
} from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { type TranslationKey, useT } from '@/lib/i18n'

type Row = {
  labelKey: TranslationKey
  value: string
  href: string | null
  external: boolean
}

const ROW_STYLE = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 14px',
  marginBottom: 6,
  background: 'var(--color-cockpit-panel-light)',
  border: '1px solid #000',
  textDecoration: 'none',
  color: 'var(--color-cockpit-text)',
  fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
  fontSize: 13,
} as const

export default function ContactSection() {
  const t = useT()

  const rows: Row[] = [
    {
      labelKey: 'contact.email',
      value: EMAIL,
      href: EMAIL_HREF,
      external: false,
    },
    {
      labelKey: 'contact.website',
      value: BASE_URL.replace(/^https?:\/\//, ''),
      href: BASE_URL,
      external: true,
    },
    {
      labelKey: 'contact.github',
      value: GITHUB_DISPLAY,
      href: GITHUB_URL,
      external: true,
    },
    {
      labelKey: 'contact.linkedin',
      value: LINKEDIN_DISPLAY,
      href: LINKEDIN_URL,
      external: true,
    },
    {
      labelKey: 'contact.location',
      value: t('cockpit.about.locationValue'),
      href: null,
      external: false,
    },
  ]

  return (
    <div>
      <p style={{ marginTop: 0, fontSize: 15, lineHeight: 1.6 }}>
        {t('contact.cta')}
      </p>
      {rows.map((row) => {
        const labelText = t(row.labelKey).toUpperCase()
        const labelSpan = (
          <span
            style={{
              color: 'var(--color-cockpit-text-dim)',
              letterSpacing: 2,
              fontSize: 10,
            }}
          >
            {labelText}
          </span>
        )
        if (!row.href) {
          return (
            <div key={row.labelKey} style={ROW_STYLE}>
              {labelSpan}
              <span>{row.value}</span>
            </div>
          )
        }
        return (
          <Link
            key={row.labelKey}
            href={row.href as Route}
            prefetch={false}
            target={row.external ? '_blank' : undefined}
            rel={row.external ? 'noopener noreferrer' : undefined}
            style={ROW_STYLE}
          >
            {labelSpan}
            <span>{row.value}</span>
          </Link>
        )
      })}
    </div>
  )
}
