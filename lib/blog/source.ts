import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import { z } from 'zod'
import { readingMinutes, renderMarkdown } from '@/lib/blog/markdown'
import { PORTFOLIO_REPO_URL } from '@/lib/constants/contact'

// Articles are Markdown files in content/blog/ of this repository, each starting with YAML frontmatter (see
// Frontmatter); their images are in public/blog/images/. The build reads them from disk and renders every page, so
// publishing one is a commit here and a deploy. The blog and its articles are in English only. Writing rules:
// content/blog/AGENTS.md.
// BLOG_LOCAL_DIR=<folder> reads another folder instead (the tests use it for fixtures).

const DIR = 'content/blog'
const BLOB_BASE = `${PORTFOLIO_REPO_URL}/blob/main/${DIR}/`
// Paths stay literal so the server bundle traces only this folder (next.config.ts also includes it).
const inArticles = (file = '') => {
  const local = process.env.BLOG_LOCAL_DIR
  return local
    ? join(/* turbopackIgnore: true */ local, file)
    : join(process.cwd(), 'content', 'blog', file)
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const Frontmatter = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  date: z.coerce.date(),
  // Set only after a substantial revision: it becomes dateModified in the page's metadata and the sitemap.
  updated: z.coerce.date().optional(),
  cover: z.string().trim().min(1).optional(),
  coverAlt: z.string().trim().default(''),
  draft: z.boolean().default(false),
})

export type ArticleSummary = {
  slug: string
  title: string
  subtitle: string
  /** YYYY-MM-DD */
  date: string
  /** YYYY-MM-DD, present only after a substantial revision */
  updated?: string
  cover: { src: string; alt: string } | null
  minutes: number
  sourceUrl: string
}

export type Article = ArticleSummary & { html: string; hasDiagrams: boolean }

const readText = (file: string) =>
  readFile(inArticles(file), 'utf8').catch(() => null)

/** A path relative to the article (`images/cover.jpg`) as the URL public/blog/ serves it from. */
const assetUrl = (path: string) =>
  new URL(path, 'https://matteodante.it/blog/').pathname

const loadArticle = cache(async (slug: string) => {
  if (!SLUG.test(slug)) return null
  const text = await readText(`${slug}.md`)
  if (text === null) return null
  const { data, content } = matter(text)
  const parsed = Frontmatter.safeParse(data)
  if (!parsed.success || parsed.data.draft) return null
  const fm = parsed.data
  const summary: ArticleSummary = {
    slug,
    title: fm.title,
    subtitle: fm.subtitle,
    date: fm.date.toISOString().slice(0, 10),
    ...(fm.updated && { updated: fm.updated.toISOString().slice(0, 10) }),
    cover: fm.cover ? { src: assetUrl(fm.cover), alt: fm.coverAlt } : null,
    minutes: readingMinutes(content),
    sourceUrl: `${BLOB_BASE}${slug}.md`,
  }
  return { summary, content }
})

/** Published articles, newest first. Files without valid frontmatter, or marked draft, are not listed. */
export const getArticles = cache(async (): Promise<ArticleSummary[]> => {
  const slugs = (await readdir(inArticles()))
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -3))
    .filter((slug) => SLUG.test(slug))
  const loaded = await Promise.all(slugs.map((slug) => loadArticle(slug)))
  return loaded
    .flatMap((article) => (article ? [article.summary] : []))
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
    )
})

export const getArticle = cache(
  async (slug: string): Promise<Article | null> => {
    const article = await loadArticle(slug)
    if (!article) return null
    const { html, hasDiagrams } = await renderMarkdown(article.content, {
      link: (href) => {
        const other = /^(?:\.\/)?(?<slug>[a-z0-9-]+)\.md(?<hash>#.*)?$/.exec(
          href
        )?.groups
        return other
          ? `/en/blog/${other.slug}${other.hash ?? ''}`
          : new URL(href, BLOB_BASE).href
      },
      asset: assetUrl,
    })
    return { ...article.summary, html, hasDiagrams }
  }
)
