/**
 * Schema.org JSON-LD definitions for matteodante.it
 * Person + WebSite structured data for AI/search-engine ranking.
 */

import type { Person, WebSite, WithContext } from 'schema-dts'
import { EMAIL_HREF, SOCIAL_URLS } from '@/lib/constants/contact'
import {
  BIRTH_DATE,
  FAMILY_NAME,
  FULL_NAME,
  GIVEN_NAME,
  JOB_TITLE_LONG,
  JOB_TITLE_SHORT,
  LANGUAGES,
  LOCATION_CITY,
  LOCATION_COUNTRY,
  LOCATION_COUNTRY_CODE,
  YEARS_EXPERIENCE,
} from '@/lib/constants/identity'
import {
  BASE_URL,
  CV_MARKDOWN_PATHS,
  PERSON_IMAGE_PATH,
  SITE_NAME,
} from '@/lib/constants/site'

import { BCP47_LOCALE, type Locale } from '@/lib/i18n/config'

const SCHEMA_CONTEXT = 'https://schema.org' as const

const PERSON_DESCRIPTION: Record<Locale, string> = {
  en: 'Senior software engineer with 8+ years building production systems across military aviation, high-traffic consumer platforms, telecom, and retail. One of the principal engineers on a greenfield pilot-training platform at Pilatus Aircraft Ltd, deployed on-premise at air-force bases. Daily AI-assisted workflow with Claude Code and custom tooling; shipped production LLM agents, RAG pipelines, and structured-output generation.',
  it: 'Senior software engineer con oltre 8 anni di esperienza nello sviluppo di sistemi in produzione nei settori aviazione militare, piattaforme consumer ad alto traffico, telecomunicazioni e retail. Tra gli ingegneri principali di una piattaforma greenfield di addestramento piloti presso Pilatus Aircraft Ltd, deployata on-premise presso basi aeree. Workflow quotidiano AI-assisted con Claude Code e tooling custom; ha rilasciato in produzione agenti LLM, pipeline RAG e generazione di output strutturati.',
}

const CV_DOC_NAME: Record<Locale, string> = {
  en: 'Curriculum Vitae (English)',
  it: 'Curriculum Vitae (Italiano)',
}

/**
 * Person schema — represents Matteo Dante as a professional.
 * The primary entity for ranking on AI-driven candidate search systems.
 */
export function getPersonSchema(locale: Locale): WithContext<Person> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': BASE_URL },
    name: FULL_NAME,
    givenName: GIVEN_NAME,
    familyName: FAMILY_NAME,
    jobTitle: JOB_TITLE_LONG,
    description: PERSON_DESCRIPTION[locale],
    url: BASE_URL,
    email: EMAIL_HREF,
    image: `${BASE_URL}${PERSON_IMAGE_PATH}`,
    nationality: {
      '@type': 'Country',
      name: 'Italy',
    },
    birthDate: BIRTH_DATE,
    address: {
      '@type': 'PostalAddress',
      addressCountry: LOCATION_COUNTRY_CODE,
    },
    knowsLanguage: [...LANGUAGES],
    knowsAbout: [
      'TypeScript',
      'Node.js',
      'Laravel',
      'PHP',
      '.NET',
      'Java',
      'React',
      'React 19',
      'Next.js',
      'React Native',
      'Expo',
      'Vue',
      'Hono',
      'tRPC',
      'Express',
      'PostgreSQL',
      'MySQL',
      'Microsoft SQL Server',
      'Redis',
      'Prisma ORM',
      'Microfrontends',
      'Module Federation',
      'Docker',
      'Turborepo',
      'Vercel',
      'Railway',
      'CI/CD',
      'OpenAI API',
      'Anthropic Claude API',
      'LLM Agents',
      'Retrieval-Augmented Generation (RAG)',
      'Vector Embeddings',
      'BM25',
      'Reciprocal Rank Fusion',
      'Cross-Encoder Reranking',
      'Structured Outputs',
      'Web Security (OWASP)',
      'Authentication (OAuth, JWT)',
      'IBM AS/400',
      'BullMQ',
      'Vitest',
      'Sentry',
      'Stripe',
      'Three.js',
      'WebGL',
      'GSAP',
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Unitelma Sapienza University, Rome',
        url: 'https://www.unitelmasapienza.it/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Istituto E. Fermi',
      },
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Pilatus Aircraft Ltd',
      url: 'https://www.pilatus-aircraft.com/',
      address: {
        '@type': 'PostalAddress',
        addressLocality: LOCATION_CITY,
        addressCountry: LOCATION_COUNTRY_CODE,
      },
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: JOB_TITLE_SHORT,
      occupationLocation: {
        '@type': 'Country',
        name: LOCATION_COUNTRY,
      },
      skills:
        'TypeScript, React, .NET, Module Federation microfrontends, on-premise deployment, defense-industry quality standards, AI-assisted workflow, production LLM agents, RAG pipelines',
      experienceRequirements: `${YEARS_EXPERIENCE} years`,
    },
    sameAs: [...SOCIAL_URLS],
    subjectOf: [
      {
        '@type': 'DigitalDocument',
        name: CV_DOC_NAME.en,
        url: `${BASE_URL}${CV_MARKDOWN_PATHS.en}`,
        encodingFormat: 'text/markdown',
        inLanguage: BCP47_LOCALE.en,
      },
      {
        '@type': 'DigitalDocument',
        name: CV_DOC_NAME.it,
        url: `${BASE_URL}${CV_MARKDOWN_PATHS.it}`,
        encodingFormat: 'text/markdown',
        inLanguage: BCP47_LOCALE.it,
      },
    ],
  }
}

/**
 * WebSite schema — represents the site as a personal portfolio website.
 */
export function getWebSiteSchema(locale: Locale): WithContext<WebSite> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: BASE_URL,
    description: `${FULL_NAME}'s interactive 3D portfolio with embedded streaming AI assistant. Senior software engineer focused on full-stack and backend.`,
    inLanguage: BCP47_LOCALE[locale],
    author: { '@id': `${BASE_URL}/#person` },
    publisher: { '@id': `${BASE_URL}/#person` },
  }
}

/**
 * Helper: Person + WebSite as a single Organization-style graph object.
 * Easier for crawlers that prefer @graph syntax.
 */
export function getJsonLdGraph(locale: Locale) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [getPersonSchema(locale), getWebSiteSchema(locale)] as Array<
      Person | WebSite
    >,
  }
}
