import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LandingWorld from '@/components/landing/landing-world'
import { EMAIL, EMAIL_HREF } from '@/lib/constants/contact'
import {
  SCROLL_WORLD_SECTION_IDS,
  swStill,
  swStillMobile,
} from '@/lib/constants/scroll-world'
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
      {/* The first scene's still is the LCP element, but the scroll world builds its
          DOM client-side, so the preload scanner can never discover it. Emit the hint
          server-side instead. The media queries mirror the engine's own predicate
          (scrub-engine.js:85-89 — portrait AND (coarse pointer OR ≤860px)); keep them
          in sync if isMobile() changes, or the preload fetches a file the engine never
          asks for and the LCP image is downloaded twice. Written as comma-separated
          plain queries on purpose: the MQ4 `not (…)` complement is unparsable in
          Safari < 16.4, which invalidates the whole media list and silently drops the
          preload. Uncovered corner: portrait ≥861px with no hover and no pointer
          (TV, keyboard-only) matches neither link — no preload, still loads at mount. */}
      <link
        rel="preload"
        as="image"
        href={swStill('intro')}
        media="(orientation: landscape), (orientation: portrait) and (min-width: 861px) and (pointer: fine), (orientation: portrait) and (min-width: 861px) and (hover: hover)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={swStillMobile('intro')}
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
      {/* Server-rendered copy for crawlers: the scroll world below builds its
          DOM client-side, so without this block the page is empty to non-JS
          bots. Same translation keys as the world — no drift. */}
      <div className="sr-only">
        <h1>{t('landing.seo.h1')}</h1>
        {SCROLL_WORLD_SECTION_IDS.map((id) => (
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
