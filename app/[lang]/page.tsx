import { notFound } from 'next/navigation'
import LandingPage from '@/components/landing/landing-page'
import { isValidLocale } from '@/lib/i18n/config'
import { getLandingPageSchema } from '@/lib/seo/schemas'
import '@/components/landing/landing.css'

type PageProps = { params: Promise<{ lang: string }> }

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
