import type { Graph, Person, WebPage, WebSite, WithContext } from 'schema-dts'
import { CAL_BOOKING_URL, EMAIL, SOCIAL_URLS } from '@/lib/constants/contact'
import {
  FAMILY_NAME,
  FULL_NAME,
  GIVEN_NAME,
  JOB_TITLE_LONG,
  LANGUAGES,
  LOCATION_COUNTRY_CODE,
} from '@/lib/constants/identity'
import {
  BASE_URL,
  CV_MARKDOWN_PATHS,
  PERSON_IMAGE_PATH,
} from '@/lib/constants/site'
import { BCP47_LOCALE, type Locale } from '@/lib/i18n/config'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'
import {
  COCKPIT_METADATA,
  HOME_METADATA,
  socialSchemaImage,
} from '@/lib/seo/social'

const SCHEMA_CONTEXT = 'https://schema.org' as const

// Public identity only: detailed career scope belongs behind the CV gate.
const PERSON_DESCRIPTION: Record<Locale, string> = {
  en: 'Matteo Dante is a freelance software engineer based in Switzerland. He builds websites, apps, custom software and AI automation for professionals, startups and businesses in Italy, Ticino and beyond.',
  it: 'Matteo Dante è un software engineer freelance con base in Svizzera. Realizza siti web, app, software su misura e automazioni AI per professionisti, startup e imprese in Italia, Ticino e oltre.',
}

export function getPersonSchema(locale: Locale) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: FULL_NAME,
    givenName: GIVEN_NAME,
    familyName: FAMILY_NAME,
    jobTitle: JOB_TITLE_LONG,
    description: PERSON_DESCRIPTION[locale],
    url: `${BASE_URL}/${locale}`,
    email: EMAIL,
    image: `${BASE_URL}${PERSON_IMAGE_PATH}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: LOCATION_COUNTRY_CODE,
    },
    knowsLanguage: [...LANGUAGES],
    knowsAbout: [
      'Website development',
      'Mobile app development',
      'Custom software',
      'AI automation',
      'TypeScript',
      'React',
      'Next.js',
      'React Native',
      'LLM agents',
      'Retrieval-augmented generation',
    ],
    sameAs: [...SOCIAL_URLS],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Project enquiries',
      email: EMAIL,
      url: CAL_BOOKING_URL,
      availableLanguage: [...LANGUAGES],
    },
    subjectOf: (['en', 'it'] as const).map((language) => ({
      '@type': 'DigitalDocument',
      name: language === 'it' ? 'CV — profilo pubblico' : 'CV — public profile',
      url: `${BASE_URL}${CV_MARKDOWN_PATHS[language]}`,
      encodingFormat: 'text/markdown',
      inLanguage: BCP47_LOCALE[language],
    })),
  } satisfies WithContext<Person>
}

export function getWebSiteSchema(locale: Locale): WithContext<WebSite> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: FULL_NAME,
    url: BASE_URL,
    description: HOME_METADATA[locale].description,
    inLanguage: [BCP47_LOCALE.en, BCP47_LOCALE.it],
    image: socialSchemaImage('home', locale),
    author: { '@id': `${BASE_URL}/#person` },
    publisher: { '@id': `${BASE_URL}/#person` },
  }
}

// The homepage presents freelance services and work, rather than a CV profile.
export function getLandingPageSchema(locale: Locale): WithContext<WebPage> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebPage',
    '@id': `${BASE_URL}/${locale}`,
    url: `${BASE_URL}/${locale}`,
    name: HOME_METADATA[locale].title,
    description: HOME_METADATA[locale].description,
    inLanguage: BCP47_LOCALE[locale],
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#person` },
    primaryImageOfPage: socialSchemaImage('home', locale),
    significantLink: Object.values(MARKETING_PAGES).map(
      (page) => `${BASE_URL}${page.paths[locale]}`
    ),
  }
}

export function getCockpitPageSchema(locale: Locale): WithContext<WebPage> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebPage',
    '@id': `${BASE_URL}/${locale}/cockpit`,
    url: `${BASE_URL}/${locale}/cockpit`,
    name: COCKPIT_METADATA[locale].title,
    description: COCKPIT_METADATA[locale].description,
    inLanguage: BCP47_LOCALE[locale],
    isPartOf: { '@id': `${BASE_URL}/#website` },
    mainEntity: { '@id': `${BASE_URL}/#person` },
    primaryImageOfPage: socialSchemaImage('cockpit', locale),
  }
}

export function getJsonLdGraph(locale: Locale): Graph {
  const { '@context': _personContext, ...person } = getPersonSchema(locale)
  const { '@context': _websiteContext, ...website } = getWebSiteSchema(locale)
  return { '@context': SCHEMA_CONTEXT, '@graph': [person, website] }
}
