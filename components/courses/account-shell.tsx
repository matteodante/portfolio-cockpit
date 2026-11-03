import type { Route } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ACCOUNT_COPY } from '@/components/courses/account-copy'
import SignOutButton from '@/components/courses/sign-out-button'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { NAME } from '@/lib/constants/contact'
import type { CourseUser } from '@/lib/courses/auth'
import type { Locale } from '@/lib/i18n/config'
import { accountPath, COURSES_PATHS } from '@/lib/seo/courses-page'

/** The course area's frame: the site header, the account controls, the page. */
export default function AccountShell({
  locale,
  viewer,
  children,
}: {
  locale: Locale
  viewer: CourseUser | null
  children: ReactNode
}) {
  const t = ACCOUNT_COPY[locale]
  return (
    <div className="landing account-page">
      <header className="landing-header">
        <Link className="landing-brand" href={`/${locale}`} aria-label={NAME}>
          <BrandAvatar />
          <span>{NAME}</span>
        </Link>
        <nav className="landing-header-links" aria-label={t.title}>
          <Link className="landing-work-link" href={COURSES_PATHS[locale]}>
            {locale === 'it' ? 'Corsi' : 'Courses'}
          </Link>
          {viewer?.admin && (
            <Link
              className="account-nav-link"
              href={accountPath(locale, 'admin') as Route}
            >
              {t.admin}
            </Link>
          )}
          <LanguageSwitcher
            locale={locale}
            paths={{ it: accountPath('it'), en: accountPath('en') }}
          />
          {viewer && (
            <SignOutButton
              label={t.signOut}
              redirectTo={COURSES_PATHS[locale]}
            />
          )}
        </nav>
      </header>
      <main id="main-content" className="account-main">
        {children}
      </main>
    </div>
  )
}
