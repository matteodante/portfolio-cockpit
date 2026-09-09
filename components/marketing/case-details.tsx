import Image from 'next/image'
import Link from 'next/link'
import { MARKETING_COPY } from '@/components/marketing/marketing-copy'
import type { Locale } from '@/lib/i18n/config'

export default function CaseDetails({ locale }: { locale: Locale }) {
  const t = MARKETING_COPY[locale]
  return (
    <>
      <dl className="marketing-facts">
        <div>
          <dt>{t.client}</dt>
          <dd>PiùUDITO</dd>
        </div>
        <div>
          <dt>{t.role}</dt>
          <dd>{t.roleValue}</dd>
        </div>
        <div>
          <dt>{t.context}</dt>
          <dd>{t.contextValue}</dd>
        </div>
      </dl>
      <section
        className="marketing-sites"
        aria-label={
          locale === 'it' ? 'I tre siti realizzati' : 'The three websites'
        }
      >
        <Link
          href="https://www.piuudito.it/"
          target="_blank"
          rel="noopener noreferrer"
          data-track="project_opened"
          data-project="piuudito"
          data-placement="case_body"
        >
          piuudito.it
        </Link>
        <Link
          href="https://www.piuuditogroup.it/"
          target="_blank"
          rel="noopener noreferrer"
          data-track="project_opened"
          data-project="piuuditogroup"
          data-placement="case_body"
        >
          piuuditogroup.it
        </Link>
        <Link
          href="https://www.fabiotomassetti.it/"
          target="_blank"
          rel="noopener noreferrer"
          data-track="project_opened"
          data-project="fabio"
          data-placement="case_body"
        >
          fabiotomassetti.it
        </Link>
      </section>
      <div className="marketing-related-sites">
        <Link
          href="https://www.piuuditogroup.it/"
          target="_blank"
          rel="noopener noreferrer"
          data-track="project_opened"
          data-project="piuuditogroup"
          data-placement="case_body"
        >
          <Image
            src="/landing-v2/piuudito/group.jpg"
            width={1440}
            height={1000}
            alt={
              locale === 'it'
                ? 'Il sito PiùUDITO Group realizzato da Matteo Dante'
                : 'The PiùUDITO Group website built by Matteo Dante'
            }
            sizes="(max-width: 799px) 100vw, 560px"
            quality={90}
          />
          <span>PiùUDITO Group</span>
        </Link>
        <Link
          href="https://www.fabiotomassetti.it/"
          target="_blank"
          rel="noopener noreferrer"
          data-track="project_opened"
          data-project="fabio"
          data-placement="case_body"
        >
          <Image
            src="/landing-v2/piuudito/fabio.jpg"
            width={1440}
            height={1000}
            alt={
              locale === 'it'
                ? 'Il sito di Fabio Tomassetti realizzato da Matteo Dante'
                : 'Fabio Tomassetti’s website built by Matteo Dante'
            }
            sizes="(max-width: 799px) 100vw, 560px"
            quality={90}
          />
          <span>Fabio Tomassetti</span>
        </Link>
      </div>
      <section
        className="marketing-section marketing-story"
        aria-labelledby="marketing-story"
      >
        <div className="marketing-prose">
          <h2 id="marketing-story">{t.storyTitle}</h2>
          <p>{t.storyBody}</p>
          <p>{t.storyNote}</p>
          <Link
            className="marketing-text-link"
            href="https://www.piuudito.it/it/contatti"
            target="_blank"
            rel="noopener noreferrer"
            data-track="project_opened"
            data-project="piuudito"
            data-placement="case_body"
          >
            {t.live}
          </Link>
        </div>
        <Image
          src="/landing-v2/piuudito/mobile.jpg"
          width={390}
          height={844}
          alt={t.mobileAlt}
          sizes="(max-width: 799px) 280px, 320px"
          quality={90}
        />
      </section>
    </>
  )
}
