import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LandingWorld from '@/components/landing/landing-world'
import { EMAIL, EMAIL_HREF } from '@/lib/constants/contact'
import { swStill, swStillMobile } from '@/lib/constants/scroll-world'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'
import { getLandingPageSchema } from '@/lib/seo/schemas'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

const SEO_SECTION_IDS = ['intro', 'webapp', 'ai', 'web', 'contact'] as const

type PageProps = { params: Promise<{ lang: string }> }

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  const locale = lang as Locale
  const m = MESSAGES[locale]
  const t = (key: string) => m[key] ?? key

  const pageSchema = getLandingPageSchema(locale)

  return (
    <>
      {/* The first scene's still is the LCP element, but the scroll world builds its
          DOM client-side, so the preload scanner can never discover it. Emit the hint
          server-side instead. Split on ORIENTATION, not width: the engine picks the
          portrait encode via `isMobile() && innerHeight >= innerWidth`, so a
          width-only query preloads the wrong file (and double-downloads) on a
          landscape phone and on a portrait tablet. */}
      <link
        rel="preload"
        as="image"
        href={swStill('intro')}
        media="(orientation: landscape)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={swStillMobile('intro')}
        media="(orientation: portrait)"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw <script> injection (Next.js docs pattern)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c'),
        }}
      />
      {/* Server-rendered copy for crawlers: the scroll world below builds its
          DOM client-side, so without this block the page is empty to non-JS
          bots. Same translation keys as the world — no drift. */}
      <div className="sr-only">
        <h1>{t('landing.seo.h1')}</h1>
        {SEO_SECTION_IDS.map((id) => (
          <section key={id}>
            <h2>{t(`landing.${id}.title`)}</h2>
            <p>{t(`landing.${id}.body`)}</p>
          </section>
        ))}
        <Link href={`/${locale}/cockpit` as Route}>
          {t('landing.cta.primary')}
        </Link>
        <a href={EMAIL_HREF}>{EMAIL}</a>
      </div>
      <LandingWorld locale={locale} />
    </>
  )
}
