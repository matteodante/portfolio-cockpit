'use client'

import Link from 'next/link'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'

type LanguageSwitcherProps = {
  currentLocale: Locale
}

const LANGUAGES: readonly { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
] as const

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 4,
        background: 'var(--color-cockpit-panel)',
        border: '1px solid #000',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.8)',
        padding: 2,
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
      }}
    >
      {LANGUAGES.map((lang) => {
        const active = lang.code === currentLocale
        return (
          <Link
            key={lang.code}
            href={`/${lang.code}`}
            prefetch={false}
            style={{
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2,
              color: active ? '#000' : '#d4cfc5',
              background: active ? COCKPIT_ACCENT : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
              boxShadow: active ? `0 0 8px ${COCKPIT_ACCENT}66` : 'none',
            }}
          >
            {lang.label}
          </Link>
        )
      })}
    </div>
  )
}
