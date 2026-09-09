import { describe, expect, test } from 'bun:test'
import { BASE_URL } from '@/lib/constants/site'
import {
  MARKETING_PAGES,
  type MarketingPage,
  marketingMetadata,
  marketingSchema,
  resolveMarketingPage,
} from '@/lib/seo/marketing-pages'
import { socialImages } from '@/lib/seo/social'

describe('localized commercial pages', () => {
  test('canonical origin is the public domain even in local previews', () => {
    expect(BASE_URL).toBe('https://matteodante.it')
  })
  test('each route has its own canonical and equivalent-language links', () => {
    for (const page of Object.keys(MARKETING_PAGES) as MarketingPage[]) {
      for (const locale of ['it', 'en'] as const) {
        const paths = MARKETING_PAGES[page].paths
        const metadata = marketingMetadata(page, locale)
        expect(resolveMarketingPage(paths[locale])).toBe(page)
        const image = socialImages(page, locale)
        expect(metadata.openGraph?.images).toEqual(image)
        expect(metadata.twitter?.images).toEqual(image)
        expect(image[0]?.url).toBe(
          `${BASE_URL}/social/${locale}/${page}.png?v=portrait-5`
        )
        expect(metadata.alternates?.canonical).toBe(
          `${BASE_URL}${paths[locale]}`
        )
        expect(metadata.alternates?.languages?.it).toBe(
          `${BASE_URL}${paths.it}`
        )
        expect(metadata.alternates?.languages?.en).toBe(
          `${BASE_URL}${paths.en}`
        )
        expect(marketingSchema(page, locale)['@graph'][0]?.['@id']).toBe(
          `${BASE_URL}${paths[locale]}`
        )
      }
    }
  })
  test('mixed-language paths and unknown pages do not resolve', () => {
    expect(
      resolveMarketingPage('/en/servizi/sviluppo-siti-web')
    ).toBeUndefined()
    expect(resolveMarketingPage('/it/projects/piuudito')).toBeUndefined()
    expect(resolveMarketingPage('/it/servizi/unknown')).toBeUndefined()
  })
})
