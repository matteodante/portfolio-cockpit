import { describe, expect, test } from 'bun:test'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { CAL_BOOKING_URL } from '@/lib/constants/contact'
import { BASE_URL, PERSON_IMAGE_PATH } from '@/lib/constants/site'
import { BCP47_LOCALE, type Locale } from '@/lib/i18n/config'
import { LLMS_PUBLIC } from '@/lib/seo/llms-content'
import {
  MARKETING_PAGES,
  type MarketingPage,
  marketingMetadata,
  marketingSchema,
} from '@/lib/seo/marketing-pages'
import { HOME_PATHS, pageMetadata } from '@/lib/seo/page-metadata'
import {
  getCockpitPageSchema,
  getJsonLdGraph,
  getLandingPageSchema,
  getPersonSchema,
} from '@/lib/seo/schemas'
import { HOME_METADATA, socialImageUrl } from '@/lib/seo/social'

function objects(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(objects)
  if (!value || typeof value !== 'object') return []
  const object = value as Record<string, unknown>
  return [object, ...Object.values(object).flatMap(objects)]
}

describe('public search discovery', () => {
  test('page metadata agrees across canonical, languages and social formats', () => {
    for (const locale of ['it', 'en'] as const) {
      const pages = [
        pageMetadata({
          page: 'home',
          locale,
          paths: HOME_PATHS,
          ...HOME_METADATA[locale],
        }),
        ...Object.keys(MARKETING_PAGES).map((page) =>
          marketingMetadata(page as MarketingPage, locale)
        ),
      ]
      for (const metadata of pages) {
        const graph = metadata.openGraph
        expect(metadata.alternates?.canonical).toEqual(graph?.url)
        expect(graph?.title).toEqual(metadata.twitter?.title)
        expect(JSON.stringify(metadata.title)).toBe(
          JSON.stringify({ absolute: graph?.title })
        )
        expect(graph?.images).toEqual(metadata.twitter?.images)
        expect(graph?.locale).toBe(locale === 'it' ? 'it_IT' : 'en_US')
        expect(graph?.alternateLocale).toEqual([
          locale === 'it' ? 'en_US' : 'it_IT',
        ])
        expect(metadata.alternates?.languages?.[locale]).toBe(graph?.url)
        expect(metadata.alternates?.languages?.['x-default']).toBe(
          metadata.alternates?.languages?.en
        )
      }
    }
  })

  test('public JSON-LD links resolve and stays within public profile scope', () => {
    for (const locale of ['it', 'en'] as const) {
      const shared = getJsonLdGraph(locale)['@graph']
      const pages = [
        [getLandingPageSchema(locale)],
        [getCockpitPageSchema(locale)],
        ...Object.keys(MARKETING_PAGES).map(
          (page) => marketingSchema(page as MarketingPage, locale)['@graph']
        ),
      ]
      for (const page of pages) {
        const nodes = objects([...shared, ...page])
        const entities = new Set(
          nodes.filter((node) => node['@type']).map((node) => node['@id'])
        )
        for (const node of nodes) {
          if (Object.keys(node).length === 1 && node['@id']) {
            expect(entities.has(node['@id'])).toBe(true)
          }
        }
      }
      const person = getPersonSchema(locale)
      expect(person.image).toBe(`${BASE_URL}${PERSON_IMAGE_PATH}`)
      expect(person).not.toHaveProperty('alumniOf')
      expect(person).not.toHaveProperty('hasOccupation')
      expect(JSON.stringify(shared)).not.toContain('greenfield')
      expect(getLandingPageSchema(locale)['@type']).toBe('WebPage')
      expect(getLandingPageSchema(locale).inLanguage).toBe(BCP47_LOCALE[locale])
    }
  })

  test('website offer is a starting price; other services have no invented price', () => {
    for (const locale of ['it', 'en'] as const) {
      expect(marketingSchema('websites', locale)['@graph'][1]).toMatchObject({
        '@type': 'Service',
        offers: {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: 300,
            priceCurrency: 'EUR',
          },
        },
      })
      for (const page of ['apps', 'ai'] as const) {
        expect(marketingSchema(page, locale)['@graph'][1]).not.toHaveProperty(
          'offers'
        )
      }
      expect(marketingSchema('piuudito', locale)['@graph'][1]).toMatchObject({
        '@type': 'CreativeWork',
        about: { '@type': 'Organization', name: 'PiùUDITO' },
        hasPart: [
          { url: 'https://www.piuudito.it/' },
          { url: 'https://www.piuuditogroup.it/' },
          { url: 'https://www.fabiotomassetti.it/' },
        ],
      })
    }
  })

  test('sitemap contains canonical public destinations and matching images', () => {
    const entries = sitemap()
    expect(entries).toHaveLength(14)
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length)
    for (const entry of entries) {
      const url = new URL(entry.url)
      expect(url.origin).toBe(BASE_URL)
      expect(url.search).toBe('')
      expect(url.pathname).not.toStartWith('/api/')
      expect(entry).not.toHaveProperty('lastModified')
      if (entry.alternates) {
        const locale = url.pathname.split('/')[1] as Locale
        expect(entry.alternates.languages?.[locale]).toBe(entry.url)
        expect(entry.images).toHaveLength(1)
      }
    }
    expect(
      entries.find((entry) => entry.url === `${BASE_URL}/it`)?.images
    ).toEqual([socialImageUrl('home', 'it')])
  })

  test('llms.txt has public canonical links, real booking and clear pricing', () => {
    expect(LLMS_PUBLIC).toStartWith('# Matteo Dante\n\n> ')
    expect(LLMS_PUBLIC).toContain(CAL_BOOKING_URL)
    expect(LLMS_PUBLIC).toContain('starts from EUR 300')
    expect(LLMS_PUBLIC).toContain('quoted on request')
    expect(LLMS_PUBLIC).not.toContain('/api/')
    expect(LLMS_PUBLIC).not.toContain('greenfield')
    const links = [
      ...LLMS_PUBLIC.matchAll(/\]\((?<url>https?:\/\/[^)]+)\)/g),
    ].map((match) => match.groups?.url)
    for (const entry of sitemap()) expect(links).toContain(entry.url)
    for (const section of LLMS_PUBLIC.split('\n## ').slice(1)) {
      const [, ...lines] = section.split('\n')
      for (const line of lines.filter(Boolean)) {
        expect(line).toMatch(/^- \[[^\]]+\]\([^)]+\)/)
      }
    }
    expect(robots().rules).toEqual({
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    })
  })
})
