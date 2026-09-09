import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'

const COPY = {
  it: {
    body: 'Progetto personale. Ho progettato e sviluppato questo sito: una landing bilingue, animazioni su misura e un CV 3D da giocare. Puoi esplorare entrambe le esperienze.',
    home: 'Esplora la homepage',
    play: 'Prova il cockpit 3D',
    landingAlt:
      'Copertina di matteodante.it con il ritratto approvato di Matteo e i suoi servizi',
    cockpitAlt:
      'Il cockpit di Matteo su mobile: astronauta, pianeti e controlli di gioco',
  },
  en: {
    body: 'Personal project. I designed and built this website: a bilingual landing page, custom animation and a playable 3D CV. You can explore both experiences.',
    home: 'Explore the homepage',
    play: 'Try the 3D cockpit',
    landingAlt:
      'The matteodante.it cover featuring Matteo’s approved portrait and services',
    cockpitAlt:
      'Matteo’s cockpit on mobile: astronaut, planets and game controls',
  },
} as const

export default function PortfolioEvidence({
  locale,
  placement,
}: {
  locale: Locale
  placement: 'home_work' | 'service_proof'
}) {
  const t = COPY[locale]
  return (
    <article className="website-proof portfolio-proof">
      <div className="portfolio-proof-views">
        <Image
          src={`/landing-v2/portfolio/website-${locale}-v4.webp`}
          alt={t.landingAlt}
          width={1200}
          height={630}
          sizes="(max-width: 799px) 72vw, 460px"
          quality={90}
        />
        <Image
          src="/landing-v2/portfolio/cockpit-mobile.jpg"
          alt={t.cockpitAlt}
          width={390}
          height={844}
          sizes="(max-width: 799px) 22vw, 140px"
          quality={90}
        />
      </div>
      <div>
        <h3>matteodante.it + Cockpit</h3>
        <p>{t.body}</p>
        <div className="portfolio-proof-actions">
          <Link
            className="hero-play"
            href={`/${locale}/cockpit`}
            prefetch={false}
            data-track="project_opened"
            data-placement={placement}
            data-project="portfolio_cockpit"
          >
            {t.play}
          </Link>
          {placement === 'service_proof' && (
            <Link
              className="text-link"
              href={`/${locale}`}
              prefetch={false}
              data-track="project_opened"
              data-placement={placement}
              data-project="portfolio_website"
            >
              {t.home}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
