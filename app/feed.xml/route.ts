import { BLOG_COPY, BLOG_PATH, FEED_PATH } from '@/components/blog/blog-chrome'
import { getArticles } from '@/lib/blog/source'
import { BASE_URL } from '@/lib/constants/site'

// RSS 2.0 feed of the blog (https://www.rssboard.org/rss-specification), with the self link and permalink guids
// the RSS profile recommends. Built with the blog pages from content/blog/.
export const dynamic = 'force-static'

const ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
}
const escapeXml = (text: string) =>
  text.replace(/[<>&"']/g, (char) => ESCAPES[char] ?? char)

/** A YYYY-MM-DD day as the RFC 822 date RSS expects, at midnight UTC. */
const rfc822 = (day: string) => new Date(`${day}T00:00:00Z`).toUTCString()

export async function GET(): Promise<Response> {
  const articles = await getArticles()
  const blog = `${BASE_URL}${BLOG_PATH}`
  const items = articles.map((article) => {
    const url = `${blog}/${article.slug}`
    return [
      '<item>',
      `<title>${escapeXml(article.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${rfc822(article.date)}</pubDate>`,
      `<description>${escapeXml(article.subtitle)}</description>`,
      '</item>',
    ].join('')
  })
  const newest = articles
    .map((article) => article.updated ?? article.date)
    .sort()
    .at(-1)
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(BLOG_COPY.metaTitle)}</title>`,
    `<link>${blog}</link>`,
    `<description>${escapeXml(BLOG_COPY.metaDescription)}</description>`,
    '<language>en</language>',
    `<atom:link href="${BASE_URL}${FEED_PATH}" rel="self" type="application/rss+xml"/>`,
    newest ? `<lastBuildDate>${rfc822(newest)}</lastBuildDate>` : '',
    ...items,
    '</channel>',
    '</rss>',
  ].join('')
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control':
        'public, max-age=300, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
