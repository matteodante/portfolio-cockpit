import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LandingHero from '@/components/landing/landing-hero'
import LandingSections, {
  LandingHeader,
} from '@/components/landing/landing-sections'
import { EMAIL, EMAIL_HREF } from '@/lib/constants/contact'
import {
  HERO_POSTER,
  HERO_POSTER_MOBILE,
  LANDING_SECTION_IDS,
} from '@/lib/constants/hero'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'
import { getLandingPageSchema } from '@/lib/seo/schemas'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

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
      {/* The hero poster is the LCP element, but the video element picks its
          poster client-side, so the preload scanner can never discover the
          right file. Emit the hint server-side instead. The media queries
          mirror the hero's own isMobile() predicate (landing-hero.tsx —
          portrait AND (coarse pointer OR ≤860px)); keep them in sync, or the
          preload fetches a file the hero never asks for and the LCP image is
          downloaded twice. Written as comma-separated plain queries on
          purpose: the MQ4 `not (…)` complement is unparsable in Safari < 16.4,
          which invalidates the whole media list and silently drops the
          preload. Uncovered corner: portrait ≥861px with no hover and no
          pointer (TV, keyboard-only) matches neither link — no preload, still
          loads at mount. */}
      <link
        rel="preload"
        as="image"
        href={HERO_POSTER}
        media="(orientation: landscape), (orientation: portrait) and (min-width: 861px) and (pointer: fine), (orientation: portrait) and (min-width: 861px) and (hover: hover)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HERO_POSTER_MOBILE}
        media="(orientation: portrait) and (hover: none) and (pointer: coarse), (orientation: portrait) and (max-width: 860px)"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw <script> injection (Next.js docs pattern)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c'),
        }}
      />
      {/* Server-rendered copy for crawlers: the hero overlay and the visible
          sections use the same translation keys as this block — no drift. */}
      <div className="sr-only">
        <h1>{t('landing.seo.h1')}</h1>
        {LANDING_SECTION_IDS.map((id) => (
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
      <LandingHeader locale={locale} />
      <main>
        <LandingHero locale={locale} />
        <LandingSections locale={locale} />
      </main>
    </>
  )
}
