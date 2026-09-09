import type { Metadata } from 'next'
import type { CreativeWork, Graph, Service } from 'schema-dts'
import { NAME } from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { BCP47_LOCALE, type Locale } from '@/lib/i18n/config'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { socialSchemaImage } from '@/lib/seo/social'

export const MARKETING_PAGES = {
  apps: {
    paths: {
      it: '/it/servizi/sviluppo-app-software',
      en: '/en/services/app-software-development',
    },
    title: {
      it: 'Sviluppo app e software su misura',
      en: 'Custom app and software development',
    },
    description: {
      it: 'App mobile, applicazioni web e software su misura per startup e imprese. Un interlocutore diretto, dal progetto al rilascio. Scopri Maestro e GymTree.',
      en: 'Mobile apps, web applications and custom software for startups and businesses. Work directly with Matteo, from project to release. Explore Maestro and GymTree.',
    },
  },
  ai: {
    paths: {
      it: '/it/servizi/automazioni-ai',
      en: '/en/services/ai-automation',
    },
    title: {
      it: 'Automazioni AI e assistenti su misura per aziende',
      en: 'AI automation and custom assistants for businesses',
    },
    description: {
      it: 'Automazioni, assistenti AI e ricerca sui documenti per professionisti e aziende. Parti da un processo concreto. Guarda le integrazioni in Maestro e GymTree.',
      en: 'Automation, AI assistants and document search for professionals and businesses. Start with a real workflow. Explore the AI features in Maestro and GymTree.',
    },
  },
  websites: {
    paths: {
      it: '/it/servizi/sviluppo-siti-web',
      en: '/en/services/web-development',
    },
    title: {
      it: 'Sviluppo siti web per professionisti e imprese',
      en: 'Website development for professionals and small businesses',
    },
    description: {
      it: 'Siti web per professionisti, startup e imprese in Italia e Ticino, da 300 €. Esplora PiùUDITO, questo sito e il cockpit 3D realizzati da Matteo Dante.',
      en: 'Custom websites for professionals, startups and businesses, from €300. Explore PiùUDITO, this website and the 3D cockpit built by Matteo Dante.',
    },
  },
  piuudito: {
    paths: { it: '/it/progetti/piuudito', en: '/en/projects/piuudito' },
    title: {
      it: 'PiùUDITO: tre siti web realizzati',
      en: 'PiùUDITO: three website projects',
    },
    description: {
      it: 'Tre siti realizzati da Matteo Dante per PiùUDITO: piuudito.it, piuuditogroup.it e fabiotomassetti.it. Esplora il lavoro pubblicato.',
      en: 'Three websites built by Matteo Dante for PiùUDITO: piuudito.it, piuuditogroup.it and fabiotomassetti.it. Explore the published work.',
    },
  },
} as const

export type MarketingPage = keyof typeof MARKETING_PAGES

export function resolveMarketingPage(path: string): MarketingPage | undefined {
  return (Object.keys(MARKETING_PAGES) as MarketingPage[]).find((key) =>
    Object.values(MARKETING_PAGES[key].paths).some((value) => value === path)
  )
}

export function marketingMetadata(
  page: MarketingPage,
  locale: Locale
): Metadata {
  const content = MARKETING_PAGES[page]
  return pageMetadata({
    page,
    locale,
    paths: content.paths,
    title: `${content.title[locale]} · ${NAME}`,
    description: content.description[locale],
  })
}

export function marketingSchema(page: MarketingPage, locale: Locale) {
  const content = MARKETING_PAGES[page]
  const url = `${BASE_URL}${content.paths[locale]}`
  const details = {
    '@id': `${url}#subject`,
    name: content.title[locale],
    description: content.description[locale],
    url,
    mainEntityOfPage: { '@id': url },
    image: socialSchemaImage(page, locale),
  }
  const entity: Service | CreativeWork =
    page === 'piuudito'
      ? {
          ...details,
          '@type': 'CreativeWork',
          creator: { '@id': `${BASE_URL}/#person` },
          inLanguage: BCP47_LOCALE[locale],
          about: { '@type': 'Organization', name: 'PiùUDITO' },
          hasPart: (
            [
              ['PiùUDITO', 'https://www.piuudito.it/'],
              ['PiùUDITO Group', 'https://www.piuuditogroup.it/'],
              ['Fabio Tomassetti', 'https://www.fabiotomassetti.it/'],
            ] as const
          ).map(([name, site]) => ({
            '@type': 'WebSite',
            name,
            url: site,
            creator: { '@id': `${BASE_URL}/#person` },
          })),
        }
      : {
          ...details,
          '@type': 'Service',
          serviceType: content.title[locale],
          provider: { '@id': `${BASE_URL}/#person` },
          areaServed: [
            { '@type': 'Country', name: 'Italy' },
            {
              '@type': 'AdministrativeArea',
              name: 'Ticino',
              containedInPlace: { '@type': 'Country', name: 'Switzerland' },
            },
          ],
          ...(page === 'websites'
            ? {
                offers: {
                  '@type': 'Offer',
                  url,
                  priceSpecification: {
                    '@type': 'PriceSpecification',
                    minPrice: 300,
                    priceCurrency: 'EUR',
                  },
                  seller: { '@id': `${BASE_URL}/#person` },
                },
              }
            : {}),
        }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        primaryImageOfPage: socialSchemaImage(page, locale),
        '@id': url,
        url,
        name: content.title[locale],
        description: content.description[locale],
        inLanguage: BCP47_LOCALE[locale],
        isPartOf: { '@id': `${BASE_URL}/#website` },
        mainEntity: { '@id': details['@id'] },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      entity,
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: content.title[locale],
            item: url,
          },
        ],
      },
    ],
  } satisfies Graph
}
