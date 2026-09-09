import { defaultLocale, isValidLocale, locales } from '@/lib/i18n/config'
import { renderSocialImage } from '@/lib/seo/social-image'

export const alt = 'Matteo Dante — Websites, apps & AI / Siti web, app e AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return renderSocialImage('home', isValidLocale(lang) ? lang : defaultLocale)
}
