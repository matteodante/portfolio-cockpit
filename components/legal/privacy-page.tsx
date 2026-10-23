import Link from 'next/link'
import { PRIVACY_COPY, PRIVACY_UPDATED } from '@/components/legal/privacy-copy'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { NAME } from '@/lib/constants/contact'
import { PRIVACY_PATHS } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'

export default function PrivacyPage({ locale }: { locale: Locale }) {
  const t = PRIVACY_COPY[locale]
  return (
    <div className="landing marketing-page">
      <Link className="landing-skip" href="#main-content">
        {t.skip}
      </Link>
      <header className="landing-header">
        <Link className="landing-brand" href={`/${locale}`} aria-label={NAME}>
          <BrandAvatar />
          <span>{NAME}</span>
        </Link>
        <nav className="landing-header-links" aria-label={t.nav}>
          <LanguageSwitcher locale={locale} paths={PRIVACY_PATHS} />
        </nav>
      </header>
      <main id="main-content" className="marketing-main privacy-main">
        <nav className="marketing-breadcrumb" aria-label="Breadcrumb">
          <Link href={`/${locale}`}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <span>{t.title}</span>
        </nav>
        <h1 className="privacy-title">{t.title}</h1>
        <p className="privacy-updated">
          <time dateTime={PRIVACY_UPDATED}>{t.updated}</time>
        </p>
        <p className="privacy-intro">{t.intro}</p>
        {t.sections.map((section) => (
          <section key={section.heading} className="privacy-section">
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </main>
      <footer className="marketing-footer">
        <Link href={`/${locale}`}>{NAME}</Link>
        <Link href={`/${locale}/cockpit`} prefetch={false}>
          {locale === 'it' ? 'Gioca al mio CV' : 'Play my CV'}
        </Link>
      </footer>
    </div>
  )
}
