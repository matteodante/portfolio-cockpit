import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import { z } from 'zod'
import { readingMinutes, renderMarkdown } from '@/lib/blog/markdown'

// Articles are Markdown files in the `articles/` folder of the public profile repository, each starting with
// YAML frontmatter (see Frontmatter). Publishing one is a push there: pages revalidate every hour. The blog and
// its articles are in English only.
// BLOG_LOCAL_DIR=<path to that folder> reads a local checkout instead, to preview before pushing.

const OWNER = 'matteodante'
const REPO = 'matteodante'
const BRANCH = 'main'
const DIR = 'articles'

export const ARTICLES_REVALIDATE = 3600
export const ARTICLES_REPO_URL = `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/${DIR}`
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${DIR}/`
const BLOB_BASE = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${DIR}/`
const LOCAL_DIR = process.env.BLOG_LOCAL_DIR

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const Frontmatter = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  date: z.coerce.date(),
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
  cover: { src: string; alt: string } | null
  minutes: number
  sourceUrl: string
}

export type Article = ArticleSummary & { html: string; hasDiagrams: boolean }

function github(url: string) {
  const headers: Record<string, string> = { 'User-Agent': 'matteodante.it' }
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return fetch(url, { headers, next: { revalidate: ARTICLES_REVALIDATE } })
}

async function listFiles(): Promise<string[]> {
  if (LOCAL_DIR) return readdir(LOCAL_DIR)
  const res = await github(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIR}?ref=${BRANCH}`
  )
  if (!res.ok)
    throw new Error(
      `Listing the articles failed: GitHub answered ${res.status}`
    )
  const entries = (await res.json()) as { name: string; type: string }[]
  return entries
    .filter((entry) => entry.type === 'file')
    .map((entry) => entry.name)
}

async function readText(file: string): Promise<string | null> {
  if (LOCAL_DIR)
    return readFile(join(LOCAL_DIR, file), 'utf8').catch(() => null)
  const res = await github(RAW_BASE + file)
  if (res.status === 404) return null
  if (!res.ok)
    throw new Error(`Reading ${file} failed: GitHub answered ${res.status}`)
  return res.text()
}

/** A relative path in the article as a URL the page can load. Local previews inline images. */
async function assetUrl(path: string) {
  if (!LOCAL_DIR) return new URL(path, RAW_BASE).href
  const bytes = await readFile(join(LOCAL_DIR, path))
  const extension = path.slice(path.lastIndexOf('.') + 1).toLowerCase()
  const type =
    { png: 'image/png', webp: 'image/webp', avif: 'image/avif' }[extension] ??
    'image/jpeg'
  return `data:${type};base64,${bytes.toString('base64')}`
}

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
    cover: fm.cover
      ? { src: await assetUrl(fm.cover), alt: fm.coverAlt }
      : null,
    minutes: readingMinutes(content),
    sourceUrl: `${BLOB_BASE}${slug}.md`,
  }
  return { summary, content }
})

/** Published articles, newest first. Files without valid frontmatter, or marked draft, are not listed. */
export const getArticles = cache(async (): Promise<ArticleSummary[]> => {
  const slugs = (await listFiles())
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
      asset: (src) => new URL(src, RAW_BASE).href,
    })
    return { ...article.summary, html, hasDiagrams }
  }
)
