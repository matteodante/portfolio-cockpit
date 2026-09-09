import type { Locale } from '@/lib/i18n/config'

// Previews keep the production canonical instead of publishing localhost URLs.
export const BASE_URL = 'https://matteodante.it'

export const SITE_NAME = 'Matteo Dante'
export const SITE_TITLE = 'Matteo Dante · Senior Software Engineer'

export const ICON_PATH = '/icon.png'
/** Color hero portrait based on the owner's latest face/body references. */
export const PERSON_IMAGE_PATH = '/landing-v2/matteo-portrait-v4.webp'

export const CV_MARKDOWN_PATHS: Record<Locale, string> = {
  en: '/resume/cv.md',
  it: '/resume/cv.it.md',
}

/** Static skeletal PDF — public, no access code required. */
export const cvPublicPdfPath = (locale: Locale) =>
  `/resume/cv-${locale}.pdf` as const

/** Gated full PDF — served by /api/cv/pdf/[locale] after unlock. */
export const cvPrivatePdfPath = (locale: Locale) =>
  `/api/cv/pdf/${locale}` as const

export const cvPdfPath = (locale: Locale, unlocked: boolean) =>
  unlocked ? cvPrivatePdfPath(locale) : cvPublicPdfPath(locale)
