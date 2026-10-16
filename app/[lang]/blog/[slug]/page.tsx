import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import type { BlogPosting, WithContext } from 'schema-dts'
import ArticleView from '@/components/blog/article-view'
import { articlePath } from '@/components/blog/blog-chrome'
import { getArticle, getArticles } from '@/lib/blog/source'
import { NAME } from '@/lib/constants/contact'
import { BASE_URL } from '@/lib/constants/site'
import { BCP47_LOCALE, isValidLocale, OG_LOCALE } from '@/lib/i18n/config'
import '@/components/landing/landing.css'
import '@/components/blog/blog.css'

// The blog is in English only: /it/blog/<slug> redirects here. Articles come from GitHub (lib/blog/source.ts):
// pages are rebuilt at most once an hour, and an article pushed after the build renders on its first visit.
export const revalidate = 300

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
    : undefined
  return {
    title: { absolute: `${article.title} · ${NAME}` },
    description: article.subtitle,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.subtitle,
      url,
      siteName: NAME,
      locale: OG_LOCALE.en,
      publishedTime: article.date,
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
  const schema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.subtitle,
    datePublished: article.date,
    inLanguage: BCP47_LOCALE.en,
    author: { '@type': 'Person', name: NAME, url: BASE_URL },
    url: `${BASE_URL}${articlePath(article.slug)}`,
    ...(article.cover && { image: article.cover.src }),
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
