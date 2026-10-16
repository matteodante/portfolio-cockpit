import { describe, expect, test } from 'bun:test'
import { readingMinutes, renderMarkdown } from '@/lib/blog/markdown'

const resolve = {
  link: (href: string) => `LINK(${href})`,
  asset: (src: string) => `ASSET(${src})`,
}

describe('renderMarkdown', () => {
  test('drops the leading title, which the page renders itself', async () => {
    const { html } = await renderMarkdown(
      '# Title\n\nFirst paragraph.\n\n# Later',
      resolve
    )
    expect(html).not.toContain('<h1>Title</h1>')
    expect(html).toContain('<p>First paragraph.</p>')
    expect(html).toContain('<h1 id="later">Later</h1>')
  })

  test('turns mermaid blocks into figures drawn in the browser, with the source escaped', async () => {
    const { html, hasDiagrams } = await renderMarkdown(
      '```mermaid\nflowchart LR\n  A --> B<script>\n```',
      resolve
    )
    expect(hasDiagrams).toBe(true)
    expect(html).toContain(
      '<figure class="article-diagram"><pre class="mermaid">'
    )
    expect(html).toContain('A --> B&#x3C;script>')
    expect(html).not.toContain('<script>')
  })

  test('resolves relative links and images, keeps external ones', async () => {
    const { html } = await renderMarkdown(
      '[other](other.md) [site](https://example.com) [here](#part) ![chart](images/chart.png)',
      resolve
    )
    expect(html).toContain('href="LINK(other.md)"')
    expect(html).toContain('href="https://example.com" rel="noopener"')
    expect(html).toContain('href="#part"')
    expect(html).toContain('src="ASSET(images/chart.png)"')
  })

  test('wraps tables so they scroll on narrow screens', async () => {
    const { html } = await renderMarkdown(
      '| a | b |\n|---|---|\n| 1 | 2 |',
      resolve
    )
    expect(html).toContain('<div class="article-table"><table>')
  })

  test('does not render raw HTML from the Markdown', async () => {
    const { html } = await renderMarkdown(
      'Hello <img src=x onerror=alert(1)>',
      resolve
    )
    expect(html).not.toContain('onerror')
  })
})

describe('readingMinutes', () => {
  test('counts 220 words a minute, at least one', () => {
    expect(readingMinutes('word '.repeat(1100))).toBe(5)
    expect(readingMinutes('short')).toBe(1)
  })
})
