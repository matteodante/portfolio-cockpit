import type { Locale } from '@/lib/i18n/config'

const COPY = {
  it: {
    title: 'Esperienza in azienda',
    pilatus: 'Senior Full-Stack Software Engineer nel settore aviazione.',
    dontouch: 'Backend Engineer su una piattaforma consumer ad alto traffico.',
  },
  en: {
    title: 'Experience within company teams',
    pilatus: 'Senior Full-Stack Software Engineer in the aviation sector.',
    dontouch: 'Backend Engineer on a high-traffic consumer platform.',
  },
} as const

export default function TeamExperience({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  return (
    <section className="team-proof" aria-labelledby="team-proof-heading">
      <h3 id="team-proof-heading">{t.title}</h3>
      <dl className="team-proof-roles">
        <div>
          <dt>Pilatus Aircraft</dt>
          <dd>{t.pilatus}</dd>
        </div>
        <div>
          <dt>DonTouch</dt>
          <dd>{t.dontouch}</dd>
        </div>
      </dl>
    </section>
  )
}
