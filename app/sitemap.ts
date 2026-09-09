import type { MetadataRoute } from 'next'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'
import { locales } from '@/lib/i18n/config'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {
    en: `${BASE_URL}/en`,
    it: `${BASE_URL}/it`,
    'x-default': `${BASE_URL}/en`,
  }
  const cockpitLanguages: Record<string, string> = {
    en: `${BASE_URL}/en/cockpit`,
    it: `${BASE_URL}/it/cockpit`,
    'x-default': `${BASE_URL}/en/cockpit`,
  }
  const localeEntries: MetadataRoute.Sitemap = locales.map((lang) => ({
    url: `${BASE_URL}/${lang}`,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: { languages },
  }))
  const cockpitEntries: MetadataRoute.Sitemap = locales.map((lang) => ({
    url: `${BASE_URL}/${lang}/cockpit`,
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: { languages: cockpitLanguages },
  }))
  return [
    ...localeEntries,
    ...cockpitEntries,
    ...Object.values(MARKETING_PAGES).flatMap((page) =>
      Object.values(page.paths).map((path) => ({
        url: `${BASE_URL}${path}`,
        alternates: {
          languages: {
            it: `${BASE_URL}${page.paths.it}`,
            en: `${BASE_URL}${page.paths.en}`,
            'x-default': `${BASE_URL}${page.paths.en}`,
          },
        },
      }))
    ),
    {
      url: `${BASE_URL}${CV_MARKDOWN_PATHS.en}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}${CV_MARKDOWN_PATHS.it}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
