import Image from 'next/image'
import Link from 'next/link'
import BrandsSection from '@/components/landing/brands-section'
import HeroIdentity from '@/components/landing/hero-identity'
import { makeT } from '@/components/landing/i18n'
import LandingMotion from '@/components/landing/landing-motion'
import ServicesSection from '@/components/landing/services-section'
import WorkSequence from '@/components/landing/work-sequence'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import {
  CAL_BOOKING_URL,
  EMAIL_HREF,
  GITHUB_URL,
  GYMTREE_APP_STORE_URL,
  GYMTREE_APP_STORE_URL_IT,
  LINKEDIN_URL,
  MAESTRO_APP_STORE_URL,
  MAESTRO_APP_STORE_URL_IT,
  NAME,
} from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'

function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookingLink({
  label,
  compact = false,
}: {
  label: string
  compact?: boolean
}) {
  const className = compact
    ? 'booking-link booking-link-compact'
    : 'booking-link'
  return (
    <Link
      href={CAL_BOOKING_URL}
      className={className}
      data-track="booking_opened"
    >
      {label}
      <Arrow />
    </Link>
  )
}

const PROJECTS = [
  {
    id: 'maestro',
    name: 'Maestro',
    en: MAESTRO_APP_STORE_URL,
    it: MAESTRO_APP_STORE_URL_IT,
  },
  {
    id: 'gymtree',
    name: 'GymTree',
    en: GYMTREE_APP_STORE_URL,
    it: GYMTREE_APP_STORE_URL_IT,
  },
] as const

export default function LandingPage({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  const sections = ['intro', 'services', 'brands', 'work', 'contact'].map(
    (id) => ({
      id,
      label: t(`home.nav.${id}`),
    })
  )

  return (
    <LandingMotion
      className=""
      sections={sections}
      labels={{
        navigation: t('home.nav.label'),
        section: t('home.nav.section'),
        scroll: t('home.scroll'),
        pause: t('home.motion.pause'),
        resume: t('home.motion.resume'),
      }}
    >
      <Link className="landing-skip" href="#services">
        {t('home.skip')}
      </Link>
      <header className="landing-header">
        <Link className="landing-brand" href={`/${locale}`} aria-label={NAME}>
          <BrandAvatar />
          <span>{NAME}</span>
        </Link>
        <nav
          className="landing-header-links"
          aria-label={t('home.header.label')}
        >
          <Link
            className="landing-work-link"
            href={MARKETING_PAGES.websites.paths[locale]}
            data-track="service_opened"
            data-placement="header"
            data-service="web"
          >
            {t('home.nav.services')}
          </Link>
          <Link className="landing-work-link" href="#work">
            {t('home.nav.work')}
          </Link>
          <LanguageSwitcher locale={locale} />
          <BookingLink label={t('home.book')} compact />
        </nav>
      </header>

      <main id="main-content">
        <section
          id="intro"
          className="hero-scene"
          data-cinema-scene
          aria-labelledby="intro-heading"
        >
          <div className="cinema-stage hero-stage">
            <div className="cinema-world" aria-hidden="true">
              <div className="hero-landscape">
                <Image
                  src="/landing-v2/lunar-world.webp"
                  alt=""
                  fill
                  priority
                  quality={90}
                  sizes="100vw"
                />
              </div>
              <HeroIdentity />
            </div>
            <div className="hero-shade" aria-hidden="true" />
            <div className="hero-composition">
              <div className="hero-copy">
                <h1 id="intro-heading" className="hero-name">
                  <span>Matteo</span>
                  <strong>
                    Dante<span className="name-period">.</span>
                  </strong>
                </h1>
                <p className="hero-role">{t('home.hero.role')}</p>
                <p className="hero-offer">
                  {t('home.hero.line1')}
                  <br />
                  {t('home.hero.line2')}
                </p>
                <div className="hero-actions">
                  <BookingLink label={t('home.book')} />
                  <Link
                    className="hero-play"
                    href={`/${locale}/cockpit`}
                    prefetch={false}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m8 5 11 7-11 7V5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('home.hero.play')}
                  </Link>
                </div>
                <p className="hero-experience">{t('home.hero.experience')}</p>
              </div>
            </div>
          </div>
        </section>

        <ServicesSection locale={locale} />

        <BrandsSection locale={locale} />

        <section
          id="work"
          className="flight-stop"
          aria-labelledby="work-heading"
        >
          <WorkSequence title={t('home.work.title')} />
          <div className="flight-panel">
            <div className="work-composition">
              <Link
                href={MARKETING_PAGES.piuudito.paths[locale]}
                className="website-proof"
                data-track="case_study_opened"
                data-project="piuudito"
                data-placement="home_work"
              >
                <Image
                  src="/landing-v2/piuudito/desktop.jpg"
                  width={1440}
                  height={1000}
                  alt={t('home.work.piuudito.alt')}
                  sizes="(max-width: 799px) 100vw, 640px"
                  quality={90}
                />
                <div>
                  <h3>PiùUDITO</h3>
                  <p>{t('home.work.piuudito.body')}</p>
                  <span>
                    {t('home.work.piuudito.open')}
                    <Arrow />
                  </span>
                </div>
              </Link>
              <div className="project-pair" data-parallax>
                {PROJECTS.map((project) => (
                  <Link
                    key={project.id}
                    href={project[locale]}
                    className={`project-proof project-proof-${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} — ${t('home.work.open')}`}
                    data-track="project_opened"
                    data-placement="home_work"
                    data-project={project.id}
                  >
                    <div className="project-screens">
                      {[1, 2].map((index) => (
                        <Image
                          key={index}
                          src={`/landing-v2/${project.id}${locale === 'en' ? '-en' : ''}-${index}.jpg`}
                          alt={t(`home.work.${project.id}.alt${index}`)}
                          width={221}
                          height={480}
                          quality={90}
                          sizes="(max-width: 799px) 120px, 160px"
                        />
                      ))}
                      <span className="project-open">
                        <Arrow />
                      </span>
                    </div>
                    <div className="project-title-row">
                      <h3>{project.name}</h3>
                      <span>
                        App Store <Arrow />
                      </span>
                    </div>
                    <p>{t(`home.work.${project.id}.body`)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="flight-stop"
          aria-labelledby="contact-heading"
        >
          <div className="contact-landscape" data-parallax aria-hidden="true">
            <Image
              src="/landing-v2/lunar-world.webp"
              alt=""
              fill
              quality={90}
              sizes="100vw"
            />
          </div>
          <div className="flight-panel">
            <div className="contact-composition">
              <h2 id="contact-heading">
                {t('home.contact.line1')}
                <br />
                <span>{t('home.contact.line2')}</span>
              </h2>
              <p className="section-lead">{t('home.contact.body')}</p>
              <BookingLink label={t('home.book')} />
              <Link
                className="contact-email"
                href={EMAIL_HREF}
                data-track="contact_clicked"
                data-placement="home_contact"
              >
                {t('home.contact.email')}
              </Link>
              <div className="contact-socials">
                <Link href={LINKEDIN_URL}>LinkedIn</Link>
                <Link href={GITHUB_URL}>GitHub</Link>
              </div>
              <Link
                className="cockpit-invitation"
                href={`/${locale}/cockpit`}
                prefetch={false}
              >
                <span>{t('home.cockpit')}</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </LandingMotion>
  )
}
