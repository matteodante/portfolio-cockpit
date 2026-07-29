import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Orbitron, Rajdhani } from 'next/font/google'
import { notFound } from 'next/navigation'
import {
  EMAIL_HREF,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  NAME,
} from '@/lib/constants/contact'
import { BASE_URL, CV_MARKDOWN_PATHS, SITE_NAME } from '@/lib/constants/site'
import { I18nProvider } from '@/lib/i18n'
import {
  isValidLocale,
  type Locale,
  locales,
  OG_LOCALE,
} from '@/lib/i18n/config'
import { getJsonLdGraph } from '@/lib/seo/schemas'
import '@/lib/styles/css/index.css'

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Matteo Dante · Freelance Software Engineer & AI Consultant',
    description:
      'Websites, apps, AI consulting and custom software. Senior engineer, 8+ years across aviation, telecom, and consumer platforms — plus a playable 3D cockpit CV. EN/IT.',
  },
  it: {
    title: 'Matteo Dante · Software Engineer Freelance & Consulente AI',
    description:
      'Siti, app, consulenza AI e software su misura. Senior engineer, 8+ anni tra aviazione, telco e piattaforme consumer — con un CV giocabile in cockpit 3D. EN/IT.',
  },
}

const SHARED_KEYWORDS = [
  'Matteo Dante',
  'CV',
  'Curriculum Vitae',
  'TypeScript',
  'Next.js',
  'React',
  'Node.js',
  'LLM',
  'RAG',
  'OpenAI',
  'Anthropic',
  'Three.js',
  'WebGL',
]

const KEYWORDS: Record<Locale, string[]> = {
  en: [
    ...SHARED_KEYWORDS,
    'Freelance Software Engineer',
    'AI Consultant',
    'Web Development',
    'App Development',
    'Interactive CV',
    'Cockpit Portfolio',
    'Senior Software Engineer',
    'Full-Stack Developer',
    'Backend Engineer',
    'Switzerland',
  ],
  it: [
    ...SHARED_KEYWORDS,
    'Software Engineer Freelance',
    'Sviluppatore Freelance',
    'Consulente AI',
    'Sviluppo Siti Web',
    'Sviluppo App',
    'CV Interattivo',
    'Portfolio Cockpit',
    'Senior Software Engineer',
    'Sviluppatore Full-Stack',
    'Svizzera',
  ],
}

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-orbitron',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
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
  const t = META[locale]
  const url = `${BASE_URL}/${locale}`

  return {
    metadataBase: new URL(BASE_URL),
    title: { default: t.title, template: `%s · ${NAME}` },
    description: t.description,
    applicationName: SITE_NAME,
    authors: [{ name: NAME, url: BASE_URL }],
    creator: NAME,
    publisher: NAME,
    keywords: KEYWORDS[locale],
    category: 'technology',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en`,
        it: `${BASE_URL}/it`,
        'x-default': `${BASE_URL}/en`,
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
  return `<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center;font-family:system-ui,sans-serif"><div style="max-width:480px"><h1 style="font-size:1.5rem;margin-bottom:1rem">${NAME}</h1><p style="margin-bottom:1rem;opacity:0.8">${message}</p><ul style="list-style:none;padding:0;line-height:1.8"><li><a href="${CV_MARKDOWN_PATHS[locale]}">CV (Markdown)</a></li><li><a href="${LINKEDIN_URL}">LinkedIn</a></li><li><a href="${GITHUB_URL}">GitHub</a></li><li><a href="${EMAIL_HREF}">Email</a></li></ul></div></div>`
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
  const className = `${orbitron.variable} ${mono.variable} ${rajdhani.variable} dark`

  return (
    <html lang={lang} dir="ltr" className={className} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="text/markdown"
          hrefLang="en"
          href={CV_MARKDOWN_PATHS.en}
          title={`${NAME} — CV (English, Markdown)`}
        />
        <link
          rel="alternate"
          type="text/markdown"
          hrefLang="it"
          href={CV_MARKDOWN_PATHS.it}
          title={`${NAME} — CV (Italiano, Markdown)`}
        />
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
          color: '#d4cfc5',
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
