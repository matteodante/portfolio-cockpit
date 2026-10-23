import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { COURSES_COPY } from '@/components/courses/courses-copy'
import PilotPass from '@/components/courses/pilot-pass'
import BookingPopup from '@/components/landing/booking-popup'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { CAL_BOOKING_URL, EMAIL_HREF, NAME } from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'
import { accountPath, COURSES_PATHS } from '@/lib/seo/courses-page'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3.5 9.5 7 13l7.5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export default function CoursesPage({ locale }: { locale: Locale }) {
  const t = COURSES_COPY[locale]
  const account = accountPath(locale) as Route
  const teacherTargets = {
    ai: MARKETING_PAGES.ai.paths[locale],
    cockpit: `/${locale}/cockpit`,
  } as const
  return (
    <div className="landing marketing-page courses-page">
      <Link className="landing-skip" href="#main-content">
        {t.skip}
      </Link>
      <header className="landing-header">
        <Link className="landing-brand" href={`/${locale}`} aria-label={NAME}>
          <BrandAvatar />
          <span>{NAME}</span>
        </Link>
        <nav className="landing-header-links" aria-label={t.nav}>
          <Link className="landing-work-link" href={account} prefetch={false}>
            {t.signIn}
          </Link>
          <LanguageSwitcher locale={locale} paths={COURSES_PATHS} />
          <Link
            className="booking-link booking-link-compact"
            href={CAL_BOOKING_URL}
            aria-label={t.calendar}
            data-track="booking_opened"
            data-placement="header"
          >
            <span className="booking-label-full">{t.calendar}</span>
            <span className="booking-label-short" aria-hidden="true">
              {t.calendarShort}
            </span>
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <section className="courses-hero" aria-labelledby="courses-heading">
          <div className="courses-hero-scene" aria-hidden="true">
            <Image
              className="courses-hero-ground"
              src="/landing-v2/lunar-world.webp"
              alt=""
              fill
              sizes="100vw"
              priority
            />
          </div>
          <Image
            className="courses-hero-portrait"
            src="/landing-v2/identity/matteo-polo-cutout-v1.webp"
            alt={t.portraitAlt}
            width={960}
            height={1200}
            sizes="(max-width: 799px) 70vw, 40vw"
            priority
          />
          <div className="courses-hero-inner">
            <nav className="marketing-breadcrumb" aria-label="Breadcrumb">
              <Link href={`/${locale}`}>{t.home}</Link>
              <span aria-hidden="true">/</span>
              <span>{t.crumb}</span>
            </nav>
            <h1 id="courses-heading">{t.hero}</h1>
            <p className="courses-intro">{t.intro}</p>
            <PilotPass copy={t.pass} locale={locale} />
          </div>
        </section>

        <div className="marketing-main courses-main">
          <section className="courses-chapter" aria-labelledby="courses-fit">
            <h2 id="courses-fit">{t.fitTitle}</h2>
            <ul className="courses-fit">
              {t.fit.map(([who, why]) => (
                <li key={who}>
                  <h3>{who}</h3>
                  <p>{why}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="courses-chapter" aria-labelledby="courses-learn">
            <h2 id="courses-learn">{t.learnTitle}</h2>
            <div className="courses-tracks">
              {t.tracks.map((track) => (
                <article key={track.id} className="courses-track">
                  <h3>{track.title}</h3>
                  <p>{track.audience}</p>
                  <ul>
                    {track.items.map((item) => (
                      <li key={item}>
                        <Check />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            className="courses-chapter courses-free"
            aria-labelledby="courses-free"
          >
            <h2 id="courses-free">{t.freeTitle}</h2>
            <div>
              <p className="courses-lead">{t.freeBody}</p>
              <dl className="courses-terms">
                {t.freePoints.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="courses-chapter" aria-labelledby="courses-how">
            <h2 id="courses-how">{t.howTitle}</h2>
            <ol className="courses-route">
              {t.process.map(([title, body]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="courses-chapter courses-area"
            aria-labelledby="courses-area"
          >
            <h2 id="courses-area">{t.areaTitle}</h2>
            <div className="courses-area-grid">
              <div>
                <p className="courses-lead">{t.areaBody}</p>
                <Link
                  className="hero-play courses-area-cta"
                  href={account}
                  prefetch={false}
                >
                  {t.areaCta}
                </Link>
              </div>
              <figure className="courses-area-mock">
                <div className="area-mock-frame" aria-hidden="true">
                  <div className="area-mock-player">
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      aria-hidden="true"
                    >
                      <circle
                        cx="22"
                        cy="22"
                        r="21"
                        fill="none"
                        stroke="currentColor"
                      />
                      <path d="M18 14v16l12-8z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="area-mock-title">{t.areaMock.title}</p>
                  <p className="area-mock-lesson">{t.areaMock.lesson}</p>
                  <ul>
                    {t.areaMock.rows.map((row) => (
                      <li key={row}>
                        <Check />
                        {row}
                      </li>
                    ))}
                  </ul>
                </div>
                <figcaption>{t.areaPreview}</figcaption>
              </figure>
            </div>
          </section>

          <section
            className="courses-chapter courses-teacher"
            aria-labelledby="courses-teacher"
          >
            <h2 id="courses-teacher">{t.teacherTitle}</h2>
            <div className="courses-teacher-grid">
              <Image
                src="/landing-v2/matteo-services-hero-closeup-v1.webp"
                alt=""
                width={560}
                height={640}
                sizes="(max-width: 799px) 50vw, 240px"
              />
              <div className="marketing-prose">
                {t.teacherBody.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="courses-links">
                  {t.teacherLinks.map(([label, target]) => (
                    <Link
                      key={target}
                      className="marketing-text-link"
                      href={teacherTargets[target]}
                      prefetch={target === 'cockpit' ? false : null}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="courses-chapter" aria-labelledby="courses-faq">
            <h2 id="courses-faq">{t.faqTitle}</h2>
            <div className="marketing-faq">
              {t.faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section
            className="marketing-contact"
            aria-labelledby="courses-contact"
          >
            <h2 id="courses-contact">{t.closeTitle}</h2>
            <p>{t.closeBody}</p>
            <div className="marketing-contact-actions">
              <Link
                className="booking-link"
                href="#posto"
                data-track="application_opened"
                data-placement="courses_footer"
              >
                {t.backToPass}
              </Link>
              <BookingPopup
                id="courses"
                className="hero-play"
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
            >
              {t.email}
            </Link>
          </section>
        </div>
      </main>
      <footer className="marketing-footer">
        <Link href={`/${locale}`}>{NAME}</Link>
        {(['websites', 'apps', 'ai'] as const).map((key) => (
          <Link key={key} href={MARKETING_PAGES[key].paths[locale]}>
            {MARKETING_PAGES[key].title[locale]}
          </Link>
        ))}
        <Link href={`/${locale}/cockpit`} prefetch={false}>
          {t.footerCockpit}
        </Link>
      </footer>
    </div>
  )
}
