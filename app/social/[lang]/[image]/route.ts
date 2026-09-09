import { isValidLocale, locales } from '@/lib/i18n/config'
import { SOCIAL_PAGES } from '@/lib/seo/social'
import { renderSocialImage } from '@/lib/seo/social-image'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    SOCIAL_PAGES.map((page) => ({ lang, image: `${page}.png` }))
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; image: string }> }
) {
  const { lang, image } = await params
  const page = SOCIAL_PAGES.find((value) => `${value}.png` === image)
  if (!(isValidLocale(lang) && page)) return new Response(null, { status: 404 })
  return renderSocialImage(page, lang)
}
