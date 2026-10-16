import Link from 'next/link'
import {
  ArticleByline,
  ArticleCover,
  ArticleMeta,
  BLOG_COPY,
  BLOG_PATH,
  BlogHeader,
  BookCall,
} from '@/components/blog/blog-chrome'
import MermaidDiagrams from '@/components/blog/mermaid-diagrams'
import type { Article } from '@/lib/blog/source'

export default function ArticleView({ article }: { article: Article }) {
  return (
    <div className="landing blog-page">
      <BlogHeader />
      <main id="main-content" className="article">
        <nav className="article-back" aria-label={BLOG_COPY.backNav}>
          <Link href={BLOG_PATH}>{BLOG_COPY.back}</Link>
        </nav>
        <header className="article-head">
          <h1>{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>
          <ArticleMeta article={article} />
        </header>
        <div className="article-cover">
          <ArticleCover
            article={article}
            priority
            sizes="(max-width: 1240px) 100vw, 1180px"
          />
        </div>
        <div
          className="article-body"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown from the owner's own repository, rendered on the server without raw HTML
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
        {article.hasDiagrams && <MermaidDiagrams />}
        <footer className="article-foot">
          <ArticleByline />
          <p className="article-foot-links">
            <Link href={BLOG_PATH}>{BLOG_COPY.back}</Link>
            <a href={article.sourceUrl}>{BLOG_COPY.source}</a>
          </p>
          <div className="article-foot-cta">
            <p>{BLOG_COPY.cta}</p>
            <BookCall />
          </div>
        </footer>
      </main>
    </div>
  )
}
