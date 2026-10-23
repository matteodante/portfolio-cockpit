import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/blog/source'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'
import { locales } from '@/lib/i18n/config'
import { COURSES_PATHS } from '@/lib/seo/courses-page'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'
import {
  COCKPIT_PATHS,
  HOME_PATHS,
  languageAlternates,
} from '@/lib/seo/page-metadata'
import { type SocialPage, socialImageUrl } from '@/lib/seo/social'

// Articles come from GitHub (lib/blog/source.ts): the sitemap revalidates with the blog.
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles()
  const pages = [
    { id: 'home', paths: HOME_PATHS, lastModified: '2026-10-14' },
    ...Object.entries(MARKETING_PAGES).map(([id, page]) => ({
      id,
      paths: page.paths,
      lastModified: id === 'websites' ? '2026-10-14' : '2026-09-09',
    })),
    { id: 'courses', paths: COURSES_PATHS, lastModified: '2026-10-23' },
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
    // The blog is in English only. Its index moves with the newest article; each article carries its own
    // publication date, or its `updated` date after a substantial revision.
    {
      url: `${BASE_URL}/en/blog`,
      lastModified:
        articles
          .map((article) => article.updated ?? article.date)
          .sort()
          .at(-1) ?? '2026-10-23',
    },
    ...articles.map((article) => ({
      url: `${BASE_URL}/en/blog/${article.slug}`,
      lastModified: article.updated ?? article.date,
    })),
    ...locales.map((locale) => ({
      url: `${BASE_URL}${CV_MARKDOWN_PATHS[locale]}`,
      lastModified: '2026-07-08',
    })),
  ]
}
