import type { MetadataRoute } from 'next'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'
import { locales } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const languages: Record<string, string> = {
    en: `${BASE_URL}/en`,
    it: `${BASE_URL}/it`,
    'x-default': `${BASE_URL}/en`,
  }
  const localeEntries: MetadataRoute.Sitemap = locales.map((lang) => ({
    url: `${BASE_URL}/${lang}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
    alternates: { languages },
  }))
  return [
    ...localeEntries,
    {
      url: `${BASE_URL}${CV_MARKDOWN_PATHS.en}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}${CV_MARKDOWN_PATHS.it}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
