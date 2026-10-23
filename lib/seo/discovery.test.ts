import { beforeAll, describe, expect, test } from 'bun:test'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import robots from '@/app/robots'
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

// The sitemap reads the published articles. A temporary articles folder, with one article per blog link in
// llms.txt, keeps the test offline and checks that every listed article is one the sitemap would serve.
const ARTICLE_SLUGS = [
  ...LLMS_PUBLIC.matchAll(
    /\(https:\/\/matteodante\.it\/en\/blog\/(?<slug>[a-z0-9-]+)\)/g
  ),
].flatMap((match) => (match.groups?.slug ? [match.groups.slug] : []))

async function sitemap() {
  return (await import('@/app/sitemap')).default()
}

beforeAll(async () => {
  const dir = await mkdtemp(join(tmpdir(), 'articles-'))
  await Promise.all(
    ARTICLE_SLUGS.map((slug, index) =>
      writeFile(
        join(dir, `${slug}.md`),
        `---\ntitle: "${slug}"\nsubtitle: "About ${slug}."\ndate: 2026-10-${String(10 + index).padStart(2, '0')}\n${index === 0 ? 'updated: 2026-10-23\n' : ''}---\n\nBody.\n`
      )
    )
  )
  process.env.BLOG_LOCAL_DIR = dir
})

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

  test('all services are quoted on request without published price offers', () => {
    for (const locale of ['it', 'en'] as const) {
      for (const page of ['websites', 'apps', 'ai'] as const) {
        const service = marketingSchema(page, locale)['@graph'][1]
        expect(service).toMatchObject({ '@type': 'Service' })
        expect(service).not.toHaveProperty('offers')
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

  test('sitemap contains canonical public destinations and matching images', async () => {
    const entries = await sitemap()
    // Date-only revisions follow the author's calendar day, including before midnight UTC.
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date())
    expect(ARTICLE_SLUGS.length).toBeGreaterThan(0)
    expect(entries).toHaveLength(15 + ARTICLE_SLUGS.length)
    for (const slug of ARTICLE_SLUGS) {
      expect(entries.map((entry) => entry.url)).toContain(
        `${BASE_URL}/en/blog/${slug}`
      )
    }
    // The blog index is as fresh as its newest article, including a revision date.
    expect(
      entries.find((entry) => entry.url === `${BASE_URL}/en/blog`)?.lastModified
    ).toBe('2026-10-23')
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length)
    for (const entry of entries) {
      const url = new URL(entry.url)
      expect(url.origin).toBe(BASE_URL)
      expect(url.search).toBe('')
      expect(url.pathname).not.toStartWith('/api/')
      expect(entry.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Date.parse(String(entry.lastModified))).toBeLessThanOrEqual(
        Date.parse(today)
      )
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

  test('llms.txt has public canonical links, real booking and clear pricing', async () => {
    expect(LLMS_PUBLIC).toStartWith('# Matteo Dante\n\n> ')
    expect(LLMS_PUBLIC).toContain(CAL_BOOKING_URL)
    expect(LLMS_PUBLIC).not.toContain('300')
    expect(LLMS_PUBLIC).toContain('quoted on request')
    expect(LLMS_PUBLIC).not.toContain('/api/')
    expect(LLMS_PUBLIC).not.toContain('greenfield')
    const links = [
      ...LLMS_PUBLIC.matchAll(/\]\((?<url>https?:\/\/[^)]+)\)/g),
    ].map((match) => match.groups?.url)
    for (const entry of await sitemap()) expect(links).toContain(entry.url)
    for (const section of LLMS_PUBLIC.split('\n## ').slice(1)) {
      const [, ...lines] = section.split('\n')
      for (const line of lines.filter(Boolean)) {
        expect(line).toMatch(/^- \[[^\]]+\]\([^)]+\)/)
      }
    }
    expect(robots().rules).toEqual({
      userAgent: '*',
      allow: '/',
    })
  })
})
