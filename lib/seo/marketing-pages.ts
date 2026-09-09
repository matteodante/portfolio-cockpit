import type { Metadata } from 'next'
import { BASE_URL } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'

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
      it: 'Siti web su misura per professionisti, startup e piccole imprese in Italia e Ticino. Da 300 €, con un interlocutore diretto. Guarda il progetto PiùUDITO.',
      en: 'Custom websites for professionals, startups and small businesses in Italy, Ticino and beyond. From €300, working directly with Matteo. Explore PiùUDITO.',
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
  const url = `${BASE_URL}${content.paths[locale]}`
  const title = content.title[locale]
  const description = content.description[locale]
  const image =
    page === 'apps' || page === 'ai'
      ? `${BASE_URL}/${locale}/opengraph-image`
      : `${BASE_URL}/landing-v2/piuudito/desktop.jpg`
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        it: `${BASE_URL}${content.paths.it}`,
        en: `${BASE_URL}${content.paths.en}`,
        'x-default': `${BASE_URL}${content.paths.en}`,
      },
    },
    openGraph: {
      title: `${title} · Matteo Dante`,
      description,
      url,
      type: 'website',
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export function marketingSchema(page: MarketingPage, locale: Locale) {
  const content = MARKETING_PAGES[page]
  const url = `${BASE_URL}${content.paths[locale]}`
  const entity = {
    '@id': `${url}#subject`,
    '@type': page === 'piuudito' ? 'CreativeWork' : 'Service',
    name: content.title[locale],
    description: content.description[locale],
    url,
    ...(page !== 'piuudito'
      ? {
          serviceType: content.title.en,
          provider: { '@id': `${BASE_URL}/#person` },
          areaServed: ['Italy', 'Ticino'],
        }
      : {
          creator: { '@id': `${BASE_URL}/#person` },
          about: [
            'https://www.piuudito.it/',
            'https://www.piuuditogroup.it/',
            'https://www.fabiotomassetti.it/',
          ].map((site) => ({ '@type': 'WebSite', url: site })),
        }),
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: content.title[locale],
        description: content.description[locale],
        inLanguage: locale,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        mainEntity: { '@id': entity['@id'] },
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
  }
}
