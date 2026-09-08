import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'

export default function LanguageSwitcher({
  locale,
  cockpit = false,
}: {
  locale: Locale
  cockpit?: boolean
}) {
  return (
    <nav
      className="brand-languages"
      aria-label={locale === 'it' ? 'Lingua' : 'Language'}
    >
      <Link
        href={cockpit ? '/it/cockpit' : '/it'}
        prefetch={false}
        lang="it"
        hrefLang="it"
        aria-label="Italiano"
        aria-current={locale === 'it' ? 'page' : undefined}
      >
        IT
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={cockpit ? '/en/cockpit' : '/en'}
        prefetch={false}
        lang="en"
        hrefLang="en"
        aria-label="English"
        aria-current={locale === 'en' ? 'page' : undefined}
      >
        EN
      </Link>
    </nav>
  )
}
