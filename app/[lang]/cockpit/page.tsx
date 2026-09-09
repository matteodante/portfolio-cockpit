import '@/components/cockpit/cockpit.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { preload } from 'react-dom'
import CockpitLauncher from '@/components/cockpit/cockpit-launcher'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { COCKPIT_PATHS, pageMetadata } from '@/lib/seo/page-metadata'
import { getCockpitPageSchema } from '@/lib/seo/schemas'
import { COCKPIT_METADATA } from '@/lib/seo/social'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const metadata = pageMetadata({
    page: 'cockpit',
    locale: lang,
    paths: COCKPIT_PATHS,
    ...COCKPIT_METADATA[lang],
  })
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: { 'text/markdown': `${BASE_URL}${CV_MARKDOWN_PATHS[lang]}` },
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
