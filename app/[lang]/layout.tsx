import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Space_Grotesk, Unbounded } from 'next/font/google'
import { notFound } from 'next/navigation'
import MarketingAnalytics from '@/components/analytics/marketing-analytics'
import VercelAnalytics from '@/components/analytics/vercel-analytics'
import { validMeasurementId } from '@/lib/analytics/client'
import {
  EMAIL_HREF,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  NAME,
} from '@/lib/constants/contact'
import { BASE_URL, CV_MARKDOWN_PATHS, SITE_NAME } from '@/lib/constants/site'
import { I18nProvider } from '@/lib/i18n'
import { isValidLocale, type Locale, locales } from '@/lib/i18n/config'
import { getJsonLdGraph } from '@/lib/seo/schemas'
import { HOME_METADATA } from '@/lib/seo/social'
import '@/lib/styles/css/index.css'

const display = Unbounded({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-unbounded',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const body = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const locale = lang as Locale
  const t = HOME_METADATA[locale]

  return {
    metadataBase: new URL(BASE_URL),
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {},
    title: { default: t.title, template: `%s · ${NAME}` },
    description: t.description,
    applicationName: SITE_NAME,
    authors: [{ name: NAME, url: BASE_URL }],
    creator: NAME,
    publisher: NAME,
    category: 'technology',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

const NOSCRIPT_COPY: Record<Locale, string> = {
  en: 'This site requires JavaScript for the interactive experience.',
  it: 'Questo sito richiede JavaScript per l’esperienza interattiva.',
}

function renderNoscriptHtml(locale: Locale): string {
  const message = NOSCRIPT_COPY[locale]
  return `<div data-cockpit-noscript style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center;font-family:system-ui,sans-serif"><div style="max-width:480px"><h1 style="font-size:1.5rem;margin-bottom:1rem">${NAME}</h1><p style="margin-bottom:1rem;opacity:0.8">${message}</p><ul style="list-style:none;padding:0;line-height:1.8"><li><a href="${CV_MARKDOWN_PATHS[locale]}">CV (Markdown)</a></li><li><a href="${LINKEDIN_URL}">LinkedIn</a></li><li><a href="${GITHUB_URL}">GitHub</a></li><li><a href="${EMAIL_HREF}">Email</a></li></ul></div></div>`
}

export const viewport: Viewport = {
  themeColor: '#05060a',
  colorScheme: 'dark',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params

  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const jsonLd = getJsonLdGraph(locale)
  const className = `${display.variable} ${mono.variable} ${body.variable}`

  return (
    <html
      lang={lang}
      dir="ltr"
      data-theme="cockpit"
      className={className}
      suppressHydrationWarning
    >
      <head>
        <link rel="describedby" href="/llms.txt" type="text/plain" />
        <link rel="me" href={GITHUB_URL} />
        <link rel="me" href={LINKEDIN_URL} />
        <link rel="me" href={INSTAGRAM_URL} />
        <link rel="me" href={EMAIL_HREF} />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw <script> injection (Next.js docs pattern)
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body
        style={{
          background: '#05060a',
          color: '#f2ede3',
          margin: 0,
        }}
      >
        <I18nProvider locale={locale}>{children}</I18nProvider>
        <noscript
          // biome-ignore lint/security/noDangerouslySetInnerHtml: noscript fallback cannot use next/link (no JS)
          dangerouslySetInnerHTML={{
            __html: renderNoscriptHtml(locale),
          }}
        />
        <VercelAnalytics />
        <MarketingAnalytics
          id={validMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)}
          locale={locale}
        />
      </body>
    </html>
  )
}
