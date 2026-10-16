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
    { id: 'home', paths: HOME_PATHS, lastModified: '2026-10-14' },
    ...Object.entries(MARKETING_PAGES).map(([id, page]) => ({
      id,
      paths: page.paths,
      lastModified: id === 'websites' ? '2026-10-14' : '2026-09-09',
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
    // The blog is in English only; its articles come from GitHub and are reached from this page.
    { url: `${BASE_URL}/en/blog`, lastModified: '2026-10-16' },
    ...locales.map((locale) => ({
      url: `${BASE_URL}${CV_MARKDOWN_PATHS[locale]}`,
      lastModified: '2026-07-08',
    })),
  ]
}
