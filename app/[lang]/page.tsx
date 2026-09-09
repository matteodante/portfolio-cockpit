import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LandingPage from '@/components/landing/landing-page'
import { isValidLocale } from '@/lib/i18n/config'
import { HOME_PATHS, pageMetadata } from '@/lib/seo/page-metadata'
import { getLandingPageSchema } from '@/lib/seo/schemas'
import { HOME_METADATA } from '@/lib/seo/social'
import '@/components/landing/landing.css'

type PageProps = { params: Promise<{ lang: string }> }

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  // Explicit page images take precedence over Next's file-based defaults.
  return pageMetadata({
    page: 'home',
    locale: lang,
    paths: HOME_PATHS,
    ...HOME_METADATA[lang],
  })
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getLandingPageSchema(lang)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <LandingPage locale={lang} />
    </>
  )
}
