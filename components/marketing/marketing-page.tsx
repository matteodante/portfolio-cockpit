import Image from 'next/image'
import Link from 'next/link'
import BookingPopup from '@/components/landing/booking-popup'
import AppEvidence from '@/components/marketing/app-evidence'
import CaseDetails from '@/components/marketing/case-details'
import { MARKETING_COPY } from '@/components/marketing/marketing-copy'
import { AI_COPY, APP_COPY } from '@/components/marketing/service-copy'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import {
  CAL_BOOKING_URL,
  CLAUDE_LOCAL_DOCS_REPO_URL,
  EMAIL_HREF,
  NAME,
} from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'
import { MARKETING_PAGES, type MarketingPage } from '@/lib/seo/marketing-pages'

export default function MarketingPageContent({
  locale,
  page,
}: {
  locale: Locale
  page: MarketingPage
}) {
  const base = MARKETING_COPY[locale]
  const overrides = {
    apps: APP_COPY[locale],
    ai: AI_COPY[locale],
    websites: {},
    piuudito: {},
  }
  const t = { ...base, ...overrides[page] }
  const service = page !== 'piuudito'
  const website = page === 'websites'
  const serviceId = { websites: 'web', apps: 'app', ai: 'ai', piuudito: 'web' }[
    page
  ]
  const casePath = MARKETING_PAGES.piuudito.paths[locale]
  const servicePath = MARKETING_PAGES[service ? page : 'websites'].paths[locale]
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
          <Link className="landing-work-link" href={servicePath}>
            {t.websites}
          </Link>
          <LanguageSwitcher locale={locale} page={page} />
          <Link
            className="booking-link booking-link-compact"
            href={CAL_BOOKING_URL}
            data-track="booking_opened"
            data-placement="header"
          >
            {t.calendar}
          </Link>
        </nav>
      </header>
      <main id="main-content" className="marketing-main">
        <nav className="marketing-breadcrumb" aria-label="Breadcrumb">
          <Link href={`/${locale}`}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <span>{service ? t.websites : 'PiùUDITO'}</span>
        </nav>
        <section className="marketing-hero" aria-labelledby="marketing-heading">
          <h1 id="marketing-heading">{service ? t.hero : t.caseHero}</h1>
          <div className="marketing-hero-copy">
            <p>{service ? t.intro : t.caseIntro}</p>
            {service && (
              <p className="marketing-price">
                <strong>{t.price}</strong>
                <span>{t.priceNote}</span>
              </p>
            )}
            <Link
              className="booking-link"
              href={CAL_BOOKING_URL}
              data-track="booking_opened"
              data-placement={service ? 'service_hero' : 'case_hero'}
              data-service={serviceId}
            >
              {t.book}
            </Link>
            {!service && (
              <Link
                className="marketing-text-link"
                href="https://www.piuudito.it/"
                target="_blank"
                rel="noopener noreferrer"
                data-track="project_opened"
                data-project="piuudito"
                data-placement="case_hero"
              >
                {t.live}
              </Link>
            )}
          </div>
        </section>
        {page === 'apps' || page === 'ai' ? (
          <AppEvidence locale={locale} />
        ) : (
          <figure className="marketing-showcase">
            <Image
              src="/landing-v2/piuudito/desktop.jpg"
              width={1440}
              height={1000}
              alt={t.desktopAlt}
              sizes="(max-width: 799px) 100vw, 1160px"
              priority
              quality={90}
            />
            <figcaption>
              <span>PiùUDITO</span>
              <Link
                href={service ? casePath : 'https://www.piuudito.it/'}
                data-track={service ? 'case_study_opened' : 'project_opened'}
                data-placement="showcase"
                data-project="piuudito"
              >
                {service ? t.caseLink : t.live}
              </Link>
            </figcaption>
          </figure>
        )}
        {service ? (
          <>
            <section
              className="marketing-section marketing-split"
              aria-labelledby="marketing-proof"
            >
              <h2 id="marketing-proof">{t.proof}</h2>
              <div className="marketing-prose">
                <p>{t.proofBody}</p>
                {website && (
                  <Link
                    className="marketing-text-link"
                    href={casePath}
                    data-track="case_study_opened"
                    data-project="piuudito"
                    data-placement="service_proof"
                  >
                    {t.caseLink}
                  </Link>
                )}
                {page === 'ai' && (
                  <Link
                    className="marketing-text-link"
                    href={CLAUDE_LOCAL_DOCS_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="project_opened"
                    data-placement="service_proof"
                    data-project="claude_local_docs"
                  >
                    {locale === 'it'
                      ? 'Ricerca documentale: il mio progetto open source'
                      : 'Document search: my open-source project'}
                  </Link>
                )}
              </div>
            </section>
            <section
              className="marketing-section marketing-split"
              aria-labelledby="marketing-scope"
            >
              <h2 id="marketing-scope">{t.scopeTitle}</h2>
              <div className="marketing-rows">
                {t.scopes.map(([title, body]) => (
                  <div key={title}>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </section>
            <section
              className="marketing-section marketing-split"
              aria-labelledby="marketing-process"
            >
              <h2 id="marketing-process">{t.processTitle}</h2>
              <ol className="marketing-rows marketing-process">
                {t.process.map(([title, body]) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section
              className="marketing-section marketing-split"
              aria-labelledby="marketing-faq"
            >
              <h2 id="marketing-faq">{t.faqTitle}</h2>
              <div className="marketing-faq">
                {t.faqs.map(([question, answer]) => (
                  <details key={question}>
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        ) : (
          <CaseDetails locale={locale} />
        )}
        <section
          className="marketing-contact"
          aria-labelledby="marketing-contact"
        >
          <h2 id="marketing-contact">
            {service ? t.contactTitle : t.caseContact}
          </h2>
          <p>{t.contactBody}</p>
          <div className="marketing-contact-actions">
            <BookingPopup
              id={serviceId}
              className="booking-link"
              locale={locale}
              label={t.book}
              title={t.calendar}
              closeLabel={t.close}
              fallbackLabel={t.fallback}
            />
          </div>
          <Link
            className="marketing-text-link"
            href={EMAIL_HREF}
            data-track="contact_clicked"
            data-placement="service_footer"
            data-service={serviceId}
          >
            {t.email}
          </Link>
        </section>
      </main>
      <footer className="marketing-footer">
        <Link href={`/${locale}`}>{NAME}</Link>
        {(['websites', 'apps', 'ai'] as const)
          .filter((key) => key !== page)
          .map((key) => (
            <Link
              key={key}
              href={MARKETING_PAGES[key].paths[locale]}
              data-track="service_opened"
              data-placement="service_footer"
              data-service={{ websites: 'web', apps: 'app', ai: 'ai' }[key]}
            >
              {
                {
                  websites: base.websites,
                  apps: APP_COPY[locale].websites,
                  ai: AI_COPY[locale].websites,
                }[key]
              }
            </Link>
          ))}
        <Link href={`/${locale}/cockpit`} prefetch={false}>
          {locale === 'it' ? 'Gioca al mio CV' : 'Play my CV'}
        </Link>
      </footer>
    </div>
  )
}
