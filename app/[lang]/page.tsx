import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import LandingPage from '@/components/landing/landing-page'
import { isValidLocale } from '@/lib/i18n/config'
import { getLandingPageSchema } from '@/lib/seo/schemas'
import { socialImages } from '@/lib/seo/social'
import '@/components/landing/landing.css'

type PageProps = { params: Promise<{ lang: string }> }

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const inherited = await parent
  // Explicit page images take precedence over Next's file-based defaults.
  return {
    openGraph: {
      ...inherited.openGraph,
      images: socialImages('home', lang),
    },
    twitter: {
      ...inherited.twitter,
      images: socialImages('home', lang),
    },
  }
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
