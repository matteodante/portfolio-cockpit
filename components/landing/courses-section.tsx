import type { Route } from 'next'
import Link from 'next/link'
import { makeT } from '@/components/landing/i18n'
import LearningOrbit from '@/components/shared/learning-orbit'
import type { Locale } from '@/lib/i18n/config'
import { accountPath, COURSES_PATHS } from '@/lib/seo/courses-page'

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

/** The courses on the home: the offer in two lines, the way to the courses page and to the course area. */
export default function CoursesSection({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  return (
    <section
      id="courses"
      className="flight-stop"
      aria-labelledby="courses-home-heading"
    >
      <div className="flight-panel">
        <div className="courses-home">
          <LearningOrbit className="courses-home-orbit" />
          <div className="courses-home-copy">
            <h2 id="courses-home-heading">
              {t('home.courses.line1')}
              <br />
              <span>{t('home.courses.line2')}</span>
            </h2>
            <p className="section-lead">{t('home.courses.body')}</p>
            <div className="courses-home-actions">
              <Link
                className="booking-link"
                href={COURSES_PATHS[locale]}
                data-track="service_opened"
                data-placement="home_courses"
              >
                {t('home.courses.cta')}
                <Arrow />
              </Link>
              <Link
                className="courses-home-area"
                href={accountPath(locale) as Route}
              >
                {t('home.courses.area')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
