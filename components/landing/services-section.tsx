import Image from 'next/image'
import Link from 'next/link'
import { makeT } from '@/components/landing/i18n'
import { PERSON_IMAGE_PATH } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'

const SERVICE_PAGE = { web: 'websites', app: 'apps', ai: 'ai' } as const

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

export default function ServicesSection({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  return (
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
                  src={PERSON_IMAGE_PATH}
                  alt={t('home.portrait.alt')}
                  width={960}
                  height={1200}
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
            {(['web', 'app', 'ai'] as const).map((id) => (
              <div className="service-item" key={id}>
                <h3>{t(`home.services.${id}.title`)}</h3>
                <p>{t(`home.services.${id}.body`)}</p>
                <div className="service-price">
                  {id === 'web' ? (
                    <>
                      <span>{t('home.services.from')}</span>
                      <strong>300 €</strong>
                    </>
                  ) : (
                    <strong>{t('home.services.onRequest')}</strong>
                  )}
                </div>

                <Link
                  className="service-booking"
                  href={MARKETING_PAGES[SERVICE_PAGE[id]].paths[locale]}
                  data-track="service_opened"
                  data-placement="services"
                  data-service={id}
                >
                  {t(`home.services.${id}.details`)}
                  <Arrow />
                </Link>
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
  )
}
