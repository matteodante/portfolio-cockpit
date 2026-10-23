import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BLOG_COPY, BLOG_PATH, FEED_PATH } from '@/components/blog/blog-chrome'
import BlogIndex from '@/components/blog/blog-index'
import { getArticles } from '@/lib/blog/source'
import { NAME } from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { isValidLocale, OG_LOCALE } from '@/lib/i18n/config'
import { socialImages } from '@/lib/seo/social'
import '@/components/landing/landing.css'
import '@/components/blog/blog.css'

// The blog is in English only: /it/blog redirects here. The list is built from content/blog/ (lib/blog/source.ts).

type Props = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return [{ lang: 'en' }]
}

export function generateMetadata(): Metadata {
  const url = `${BASE_URL}${BLOG_PATH}`
  const images = socialImages('home', 'en')
  return {
    title: { absolute: BLOG_COPY.metaTitle },
    description: BLOG_COPY.metaDescription,
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': [
          { url: `${BASE_URL}${FEED_PATH}`, title: BLOG_COPY.metaTitle },
        ],
      },
    },
    openGraph: {
      type: 'website',
      title: BLOG_COPY.metaTitle,
      description: BLOG_COPY.metaDescription,
      url,
      siteName: NAME,
      locale: OG_LOCALE.en,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: BLOG_COPY.metaTitle,
      description: BLOG_COPY.metaDescription,
      images,
    },
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  if (lang !== 'en') permanentRedirect(BLOG_PATH)
  return <BlogIndex articles={await getArticles()} />
}
