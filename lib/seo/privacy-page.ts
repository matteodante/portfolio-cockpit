import type { Metadata } from 'next'
import { PRIVACY_COPY } from '@/components/legal/privacy-copy'
import { PRIVACY_PATHS } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'
import { pageMetadata } from '@/lib/seo/page-metadata'

export function privacyMetadata(locale: Locale): Metadata {
  const t = PRIVACY_COPY[locale]
  return pageMetadata({
    page: 'home',
    locale,
    paths: PRIVACY_PATHS,
    title: t.metaTitle,
    description: t.metaDescription,
  })
}
