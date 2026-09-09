import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import { MARKETING_PAGES, type MarketingPage } from '@/lib/seo/marketing-pages'

export default function LanguageSwitcher({
  locale,
  cockpit = false,
  page,
}: {
  locale: Locale
  cockpit?: boolean
  page?: MarketingPage
}) {
  const paths = page
    ? MARKETING_PAGES[page].paths
    : ({
        it: cockpit ? '/it/cockpit' : '/it',
        en: cockpit ? '/en/cockpit' : '/en',
      } as const)
  return (
    <nav
      className="brand-languages"
      aria-label={locale === 'it' ? 'Lingua' : 'Language'}
    >
      <Link
        href={paths.it}
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
        href={paths.en}
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
