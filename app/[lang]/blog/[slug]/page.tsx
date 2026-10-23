import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import type { BlogPosting, WithContext } from 'schema-dts'
import ArticleView from '@/components/blog/article-view'
import {
  articlePath,
  BLOG_COPY,
  BLOG_PATH,
  FEED_PATH,
} from '@/components/blog/blog-chrome'
import { getArticle, getArticles } from '@/lib/blog/source'
import { NAME } from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { BCP47_LOCALE, isValidLocale, OG_LOCALE } from '@/lib/i18n/config'
import { socialImages } from '@/lib/seo/social'
import '@/components/landing/landing.css'
import '@/components/blog/blog.css'

// The blog is in English only: /it/blog/<slug> redirects here. Every article in content/blog/ is rendered at
// build time (lib/blog/source.ts).

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(({ slug }) => ({ lang: 'en', slug }))
}

async function resolve(params: Props['params']) {
  const { lang, slug } = await params
  if (!isValidLocale(lang)) notFound()
  if (lang !== 'en') permanentRedirect(articlePath(slug))
  const article = await getArticle(slug)
  if (!article) notFound()
  return article
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await resolve(params)
  const url = `${BASE_URL}${articlePath(article.slug)}`
  const images = article.cover
    ? [{ url: article.cover.src, alt: article.cover.alt }]
    : socialImages('home', 'en')
  return {
    title: { absolute: `${article.title} · ${NAME}` },
    description: article.subtitle,
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': [
          { url: `${BASE_URL}${FEED_PATH}`, title: BLOG_COPY.metaTitle },
        ],
      },
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.subtitle,
      url,
      siteName: NAME,
      locale: OG_LOCALE.en,
      publishedTime: article.date,
      ...(article.updated && { modifiedTime: article.updated }),
      authors: [NAME],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle,
      images,
    },
  }
}

export default async function Page({ params }: Props) {
  const article = await resolve(params)
  const url = `${BASE_URL}${articlePath(article.slug)}`
  // The author and publisher point at the Person node the locale layout injects on every page.
  const schema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: article.title,
    description: article.subtitle,
    datePublished: `${article.date}T00:00:00+00:00`,
    dateModified: `${article.updated ?? article.date}T00:00:00+00:00`,
    inLanguage: BCP47_LOCALE.en,
    author: { '@id': `${BASE_URL}/#person` },
    publisher: { '@id': `${BASE_URL}/#person` },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${BASE_URL}${BLOG_PATH}#blog`,
      name: BLOG_COPY.metaTitle,
      url: `${BASE_URL}${BLOG_PATH}`,
    },
    ...(article.cover && { image: [`${BASE_URL}${article.cover.src}`] }),
  }
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static, escaped JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <ArticleView article={article} />
    </>
  )
}
