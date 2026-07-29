import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { preload } from 'react-dom'
import CockpitLauncher from '@/components/cockpit/cockpit-launcher'
import { BASE_URL, SITE_NAME } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale, locales, OG_LOCALE } from '@/lib/i18n/config'
import { getCockpitPageSchema } from '@/lib/seo/schemas'

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Cockpit — the playable CV',
    description:
      'Fly a 3D cockpit through Matteo Dante’s career: planets are CV sections, with a streaming AI assistant on board. Interactive Three.js experience. EN/IT.',
  },
  it: {
    title: 'Cockpit — il CV giocabile',
    description:
      'Pilota un cockpit 3D attraverso la carriera di Matteo Dante: i pianeti sono le sezioni del CV, con assistente AI in streaming a bordo. Esperienza interattiva Three.js. EN/IT.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const locale = lang as Locale
  const t = META[locale]
  const url = `${BASE_URL}/${locale}/cockpit`

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en/cockpit`,
        it: `${BASE_URL}/it/cockpit`,
        'x-default': `${BASE_URL}/en/cockpit`,
      },
    },
    openGraph: {
      type: 'website',
      title: t.title,
      description: t.description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
  }
}

type PageProps = { params: Promise<{ lang: string }> }

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  // Start the GLB fetch in parallel with the cockpit JS chunk instead of
  // after it arrives. Lives here (not the layout) so the landing skips it.
  preload('/models/astronaut.glb', { as: 'fetch', crossOrigin: 'anonymous' })
  const pageSchema = getCockpitPageSchema(lang as Locale)
  return (
    <div data-viewport-lock>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw <script> injection (Next.js docs pattern)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c'),
        }}
      />
      <CockpitLauncher locale={lang as Locale} />
    </div>
  )
}
