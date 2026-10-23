import type { Metadata } from 'next'
import type { Graph } from 'schema-dts'
import { NAME } from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { BCP47_LOCALE, type Locale } from '@/lib/i18n/config'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { socialSchemaImage } from '@/lib/seo/social'

export const COURSES_PATHS = { it: '/it/corsi', en: '/en/courses' } as const

/** The signed-in course area: private pages, never indexed. */
export const accountPath = (locale: Locale, ...parts: string[]) =>
  ['', locale, 'account', ...parts].join('/')

const TITLE = {
  it: 'Corsi di AI uno a uno e in piccoli gruppi',
  en: 'One-to-one and small-group AI courses',
}
const DESCRIPTION = {
  it: 'Corsi di intelligenza artificiale con Matteo Dante: AI per sviluppatori e AI per il lavoro, uno a uno o in piccoli gruppi. Posti pilota gratuiti.',
  en: 'AI courses with Matteo Dante: AI for developers and AI for work, one-to-one or in small groups. Free pilot places and recordings in your course area.',
}

export function coursesMetadata(locale: Locale): Metadata {
  return pageMetadata({
    page: 'courses',
    locale,
    paths: COURSES_PATHS,
    title: `${TITLE[locale]} · ${NAME}`,
    description: DESCRIPTION[locale],
  })
}

export function coursesSchema(locale: Locale) {
  const url = `${BASE_URL}${COURSES_PATHS[locale]}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: TITLE[locale],
        description: DESCRIPTION[locale],
        inLanguage: BCP47_LOCALE[locale],
        primaryImageOfPage: socialSchemaImage('courses', locale),
        isPartOf: { '@id': `${BASE_URL}/#website` },
        mainEntity: { '@id': `${url}#subject` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#subject`,
        name: TITLE[locale],
        description: DESCRIPTION[locale],
        url,
        serviceType: TITLE[locale],
        provider: { '@id': `${BASE_URL}/#person` },
        image: socialSchemaImage('courses', locale),
      },
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
            name: TITLE[locale],
            item: url,
          },
        ],
      },
    ],
  } satisfies Graph
}
