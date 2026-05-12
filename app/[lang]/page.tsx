import { notFound } from 'next/navigation'
import CockpitLauncher from '@/components/cockpit/cockpit-launcher'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'

type PageProps = { params: Promise<{ lang: string }> }

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  return <CockpitLauncher locale={lang as Locale} />
}
