import type { Locale } from '@/lib/i18n/config'

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://matteodante.it'

export const SITE_NAME = 'Matteo Dante · Portfolio'
export const SITE_TITLE = 'Matteo Dante · Senior Software Engineer'

export const ICON_PATH = '/icon.png'
/** Square portrait used for schema.org Person.image (Google rich-results
 *  spec wants ≥600×600). `/icon.png` is too small for this purpose. */
export const PERSON_IMAGE_PATH = '/images/profile-pic.jpeg'

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
