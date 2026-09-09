import type { Metadata } from 'next'
import { NAME } from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { type Locale, locales, OG_LOCALE } from '@/lib/i18n/config'
import { type SocialPage, socialImages } from '@/lib/seo/social'

export const HOME_PATHS = { en: '/en', it: '/it' } as const
export const COCKPIT_PATHS = {
  en: '/en/cockpit',
  it: '/it/cockpit',
} as const

export function languageAlternates(paths: Record<Locale, string>) {
  return {
    en: `${BASE_URL}${paths.en}`,
    it: `${BASE_URL}${paths.it}`,
    'x-default': `${BASE_URL}${paths.en}`,
  }
}

/** Page-owned metadata prevents inherited home canonicals and image defaults. */
export function pageMetadata({
  page,
  locale,
  title,
  description,
  paths,
}: {
  page: SocialPage
  locale: Locale
  title: string
  description: string
  paths: Record<Locale, string>
}): Metadata {
  const url = `${BASE_URL}${paths[locale]}`
  const images = socialImages(page, locale)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(paths) },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales
        .filter((language) => language !== locale)
        .map((language) => OG_LOCALE[language]),
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}
