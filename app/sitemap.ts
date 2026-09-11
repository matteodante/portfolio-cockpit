import type { MetadataRoute } from 'next'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'
import { locales } from '@/lib/i18n/config'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'
import {
  COCKPIT_PATHS,
  HOME_PATHS,
  languageAlternates,
} from '@/lib/seo/page-metadata'
import { type SocialPage, socialImageUrl } from '@/lib/seo/social'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { id: 'home', paths: HOME_PATHS, lastModified: '2026-09-10' },
    ...Object.entries(MARKETING_PAGES).map(([id, page]) => ({
      id,
      paths: page.paths,
      lastModified: '2026-09-09',
    })),
    { id: 'cockpit', paths: COCKPIT_PATHS, lastModified: '2026-09-10' },
  ]
  // Dates reflect published content revisions, not builds (see
  // docs/seo/search-console.md). Update only after meaningful page changes.
  return [
    ...pages.flatMap(({ id, paths, lastModified }) =>
      locales.map((locale) => ({
        url: `${BASE_URL}${paths[locale]}`,
        lastModified,
        alternates: { languages: languageAlternates(paths) },
        images: [socialImageUrl(id as SocialPage, locale)],
      }))
    ),
    ...locales.map((locale) => ({
      url: `${BASE_URL}${CV_MARKDOWN_PATHS[locale]}`,
      lastModified: '2026-07-08',
    })),
  ]
}
