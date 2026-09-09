import { notFound } from 'next/navigation'
import MarketingPageContent from '@/components/marketing/marketing-page'
import { isValidLocale } from '@/lib/i18n/config'
import {
  MARKETING_PAGES,
  marketingMetadata,
  marketingSchema,
  resolveMarketingPage,
} from '@/lib/seo/marketing-pages'
import '@/components/landing/landing.css'
import '@/components/marketing/marketing.css'

type Props = {
  params: Promise<{ lang: string; section: string; slug: string }>
}

export function generateStaticParams() {
  return Object.values(MARKETING_PAGES).flatMap((page) =>
    Object.values(page.paths).map((path) => {
      const [, lang, section, slug] = path.split('/')
      return { lang, section, slug }
    })
  )
}

async function resolve(params: Props['params']) {
  const { lang, section, slug } = await params
  if (!isValidLocale(lang)) notFound()
  const page = resolveMarketingPage(`/${lang}/${section}/${slug}`)
  if (!page) notFound()
  return { locale: lang, page }
}

export async function generateMetadata({ params }: Props) {
  const { locale, page } = await resolve(params)
  return marketingMetadata(page, locale)
}

export default async function Page({ params }: Props) {
  const { locale, page } = await resolve(params)
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static, escaped JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(marketingSchema(page, locale)).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <MarketingPageContent locale={locale} page={page} />
    </>
  )
}
