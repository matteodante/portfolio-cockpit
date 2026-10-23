import { notFound } from 'next/navigation'
import PrivacyPage from '@/components/legal/privacy-page'
import { isValidLocale, locales } from '@/lib/i18n/config'
import { privacyMetadata } from '@/lib/seo/privacy-page'
import '@/components/landing/landing.css'
import '@/components/marketing/marketing.css'
import '@/components/legal/privacy.css'

type Props = { params: Promise<{ lang: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  return privacyMetadata(lang)
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  return <PrivacyPage locale={lang} />
}
