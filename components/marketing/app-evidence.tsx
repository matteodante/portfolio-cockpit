import Image from 'next/image'
import Link from 'next/link'
import { makeT } from '@/components/landing/i18n'
import {
  GYMTREE_APP_STORE_URL,
  GYMTREE_APP_STORE_URL_IT,
  MAESTRO_APP_STORE_URL,
  MAESTRO_APP_STORE_URL_IT,
} from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'

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

export default function AppEvidence({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  return (
    <div className="marketing-app-evidence">
      {PROJECTS.map((project) => (
        <Link
          key={project.id}
          href={project[locale]}
          className={`project-proof project-proof-${project.id}`}
          target="_blank"
          rel="noopener noreferrer"
          data-track="project_opened"
          data-placement="service_proof"
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
                sizes="(max-width: 799px) 120px, 160px"
                quality={90}
              />
            ))}
          </div>
          <div className="project-title-row">
            <h2>{project.name}</h2>
            <span>
              App Store{' '}
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
                />
              </svg>
            </span>
          </div>
          <p>{t(`home.work.${project.id}.body`)}</p>
          <span className="marketing-project-kind">
            {locale === 'it' ? 'Prodotto personale' : 'Personal product'}
          </span>
        </Link>
      ))}
    </div>
  )
}
