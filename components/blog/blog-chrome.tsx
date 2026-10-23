import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { makeT } from '@/components/landing/i18n'
import { BookingLink } from '@/components/landing/landing-page'
import BrandAvatar from '@/components/shared/brand-avatar'
import type { ArticleSummary } from '@/lib/blog/source'
import { NAME } from '@/lib/constants/contact'
import { COURSES_PATHS } from '@/lib/seo/courses-page'

// The blog is in English only (owner's decision, 2026-10-16): it lives under /en, and /it/blog redirects there.

export const BLOG_PATH = '/en/blog' as Route
export const articlePath = (slug: string) => `/en/blog/${slug}` as Route
/** The RSS feed (app/feed.xml/route.ts): a file, not a page, so it is linked with a plain anchor. */
export const FEED_PATH = '/feed.xml'

export const BLOG_COPY = {
  title: 'Articles',
  lead: 'Long-form notes on software I have built: how it works, what broke along the way and what I measured.',
  metaTitle: `Articles · ${NAME}`,
  metaDescription:
    'Long-form articles by Matteo Dante on building software: how it works, what broke along the way and what was measured.',
  empty: 'No articles yet.',
  back: 'All articles',
  source: 'Read the source on GitHub',
  feed: 'RSS feed',
  byline: 'Written by Matteo Dante',
  role: 'Senior software engineer in Switzerland: websites, apps and AI in production.',
  cta: 'Want to talk about a project?',
  backNav: 'Articles navigation',
  minutes: (n: number) => `${n}-minute read`,
} as const

const t = makeT('en')

export function BlogHeader() {
  return (
    <>
      <Link className="landing-skip" href="#main-content">
        {t('home.skip')}
      </Link>
      <header className="landing-header">
        <Link className="landing-brand" href="/en" aria-label={NAME}>
          <BrandAvatar />
          <span>{NAME}</span>
        </Link>
        <nav
          className="landing-header-links"
          aria-label={t('home.header.label')}
        >
          <Link
            className="landing-work-link landing-header-courses"
            href={COURSES_PATHS.en}
          >
            {t('home.nav.courses')}
          </Link>
          <Link
            className="landing-work-link landing-blog-link blog-nav-current"
            href={BLOG_PATH}
            aria-current="page"
          >
            {t('home.nav.blog')}
          </Link>
          <BookingLink
            label={t('home.book')}
            shortLabel={t('home.book.short')}
            compact
          />
        </nav>
      </header>
    </>
  )
}

export function BookCall() {
  return <BookingLink label={t('home.book')} />
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

export function ArticleMeta({ article }: { article: ArticleSummary }) {
  return (
    <p className="blog-meta">
      <time dateTime={article.date}>
        {DATE_FORMAT.format(new Date(`${article.date}T00:00:00Z`))}
      </time>
      <span>{BLOG_COPY.minutes(article.minutes)}</span>
    </p>
  )
}

/** The cover in its frame. The image drifts a little inside the frame as the page scrolls (CSS only). */
export function ArticleCover({
  article,
  sizes,
  priority = false,
}: {
  article: ArticleSummary
  sizes: string
  priority?: boolean
}) {
  if (!article.cover) return null
  return (
    <div className="blog-cover">
      <Image
        src={article.cover.src}
        alt={article.cover.alt}
        fill
        sizes={sizes}
        priority={priority}
      />
    </div>
  )
}

export function ArticleByline() {
  return (
    <div className="blog-byline">
      <Image
        className="blog-byline-avatar"
        src="/landing-v2/matteo-avatar-v5.webp"
        alt=""
        width={56}
        height={56}
        sizes="56px"
      />
      <div>
        <p className="blog-byline-name">{BLOG_COPY.byline}</p>
        <p className="blog-byline-role">{BLOG_COPY.role}</p>
      </div>
    </div>
  )
}
