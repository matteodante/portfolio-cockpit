import Link from 'next/link'
import {
  ArticleCover,
  ArticleMeta,
  articlePath,
  BLOG_COPY,
  BlogHeader,
} from '@/components/blog/blog-chrome'
import type { ArticleSummary } from '@/lib/blog/source'

export default function BlogIndex({
  articles,
}: {
  articles: ArticleSummary[]
}) {
  return (
    <div className="landing blog-page">
      <BlogHeader />
      <main id="main-content" className="blog-main">
        <header className="blog-intro">
          <h1>{BLOG_COPY.title}</h1>
          <p>{BLOG_COPY.lead}</p>
        </header>
        {articles.length === 0 ? (
          <p className="blog-empty">{BLOG_COPY.empty}</p>
        ) : (
          <ol className="blog-list" aria-label={BLOG_COPY.title}>
            {articles.map((article, index) => (
              <li key={article.slug}>
                <Link className="blog-entry" href={articlePath(article.slug)}>
                  <ArticleCover
                    article={article}
                    priority={index === 0}
                    sizes="(max-width: 1000px) 100vw, 60vw"
                  />
                  <div className="blog-entry-text">
                    <ArticleMeta article={article} />
                    <h2>{article.title}</h2>
                    <p className="blog-entry-subtitle">{article.subtitle}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  )
}
