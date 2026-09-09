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
    { id: 'home', paths: HOME_PATHS },
    ...Object.entries(MARKETING_PAGES).map(([id, page]) => ({
      id,
      paths: page.paths,
    })),
    { id: 'cockpit', paths: COCKPIT_PATHS },
  ]
  // No build-time timestamps: lastmod should describe a real content revision.
  return [
    ...pages.flatMap(({ id, paths }) =>
      locales.map((locale) => ({
        url: `${BASE_URL}${paths[locale]}`,
        alternates: { languages: languageAlternates(paths) },
        images: [socialImageUrl(id as SocialPage, locale)],
      }))
    ),
    ...locales.map((locale) => ({
      url: `${BASE_URL}${CV_MARKDOWN_PATHS[locale]}`,
    })),
  ]
}
