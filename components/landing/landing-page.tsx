import Image from 'next/image'
import Link from 'next/link'
import { makeT } from '@/components/landing/i18n'
import LandingMotion from '@/components/landing/landing-motion'
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
  if (!CAL_BOOKING_URL) {
    return (
      <button type="button" className={className} disabled>
        {label}
        <Arrow />
      </button>
    )
  }
  return (
    <Link href={CAL_BOOKING_URL} className={className}>
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
  const sections = ['intro', 'services', 'work', 'contact'].map((id) => ({
    id,
    label: t(`home.nav.${id}`),
  }))

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
              <div className="hero-helmet">
                <Image
                  src="/landing-v2/astronaut.webp"
                  alt=""
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 799px) 120vw, 75vw"
                />
              </div>
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
                  <Link className="hero-play" href={`/${locale}/cockpit`}>
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
            <p className="hero-chapter" aria-hidden="true">
              <span>{t('home.cinema.line1')}</span>
              <strong>{t('home.cinema.line2')}</strong>
            </p>
          </div>
        </section>

        <section
          id="services"
          className="flight-stop"
          aria-labelledby="services-heading"
        >
          <div className="flight-panel">
            <div className="services-composition">
              <div className="services-intro" data-parallax>
                <figure className="hero-portrait">
                  <div className="portrait-image">
                    <Image
                      src="/landing-v2/matteo-portrait-v2.webp"
                      alt={t('home.portrait.alt')}
                      width={768}
                      height={768}
                      quality={90}
                      sizes="(max-width: 799px) 150px, 220px"
                    />
                  </div>
                  <figcaption>{t('home.portrait.caption')}</figcaption>
                </figure>
                <div className="services-intro-copy">
                  <h2 id="services-heading">
                    {t('home.services.line1')}
                    <br />
                    <span>{t('home.services.line2')}</span>
                  </h2>
                  <p className="section-lead">{t('home.services.body')}</p>
                </div>
              </div>
              <div className="service-list">
                {['web', 'app', 'ai'].map((id) => (
                  <div className="service-item" key={id}>
                    <h3>{t(`home.services.${id}.title`)}</h3>
                    <p>{t(`home.services.${id}.body`)}</p>
                  </div>
                ))}
              </div>
              <Link className="text-link" href="#work">
                {t('home.services.proof')}
                <Arrow />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="flight-stop"
          aria-labelledby="work-heading"
        >
          <div className="work-scene" data-cinema-scene>
            <div className="cinema-stage work-stage">
              <div className="work-backdrop" aria-hidden="true">
                <Image
                  src="/landing-v2/lunar-world.webp"
                  alt=""
                  fill
                  sizes="100vw"
                  quality={90}
                />
              </div>
              <div className="work-media" aria-hidden="true">
                <Image
                  src="/landing-v2/astronaut.webp"
                  alt=""
                  fill
                  quality={90}
                  sizes="100vw"
                />
              </div>
              <div className="work-shade" aria-hidden="true" />
              <h2 id="work-heading">{t('home.work.title')}</h2>
            </div>
          </div>
          <div className="flight-panel">
            <div className="work-composition">
              <div className="project-pair" data-parallax>
                {PROJECTS.map((project) => (
                  <Link
                    key={project.id}
                    href={project[locale]}
                    className={`project-proof project-proof-${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} — ${t('home.work.open')}`}
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
              <p className="work-note">{t('home.work.note')}</p>
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
              <Link className="contact-email" href={EMAIL_HREF}>
                {t('home.contact.email')}
              </Link>
              <div className="contact-socials">
                <Link href={LINKEDIN_URL}>LinkedIn</Link>
                <Link href={GITHUB_URL}>GitHub</Link>
              </div>
              <Link className="cockpit-invitation" href={`/${locale}/cockpit`}>
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
