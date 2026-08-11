import { notFound } from 'next/navigation'
import { makeT } from '@/components/landing/i18n'
import LandingHero from '@/components/landing/landing-hero'
import LandingSections, {
  LandingHeader,
} from '@/components/landing/landing-sections'
import { HERO_POSTER, HERO_POSTER_MOBILE } from '@/lib/constants/hero'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getLandingPageSchema } from '@/lib/seo/schemas'

type PageProps = { params: Promise<{ lang: string }> }

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  const locale = lang as Locale
  const t = makeT(locale)

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
      {/* Only copy with no visible counterpart lives here now: the GSAP
          sections server-render their own headings and body text, so
          duplicating them sr-only would read every heading twice. The SEO h1
          (name + role) and the intro pitch are the two orphans. */}
      <div className="sr-only">
        <h1>{t('landing.seo.h1')}</h1>
        <p>{t('landing.intro.body')}</p>
      </div>
      <LandingHeader locale={locale} />
      <main>
        <LandingHero locale={locale} />
        <LandingSections locale={locale} />
      </main>
    </>
  )
}
