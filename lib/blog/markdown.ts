import type { Element, ElementContent, Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

export type LinkResolver = {
  /** A relative link in the article (another article, a file in the repo). */
  link: (href: string) => string
  /** A relative image path in the article. */
  asset: (src: string) => string | Promise<string>
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i

/** The page renders the title itself: a leading first-level heading is dropped. */
function remarkDropLeadingTitle() {
  return (tree: MdastRoot) => {
    const first = tree.children[0]
    if (first?.type === 'heading' && first.depth === 1) tree.children.shift()
  }
}

/** ```mermaid blocks become <figure><pre class="mermaid">, drawn in the browser by MermaidDiagrams. */
function remarkMermaid() {
  return (tree: MdastRoot) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid' || !parent || index === undefined) return
      const figure: ElementContent = {
        type: 'element',
        tagName: 'pre',
        properties: { className: ['mermaid'] },
        children: [{ type: 'text', value: node.value }],
      }
      parent.children[index] = {
        type: 'paragraph',
        children: [],
        data: {
          hName: 'figure',
          hProperties: { className: ['article-diagram'] },
          hChildren: [figure],
        },
      }
      return SKIP
    })
  }
}

/** Relative links and images point at the repository; tables scroll on their own on narrow screens. */
function rehypeArticleLinks(resolve: LinkResolver) {
  return async (tree: HastRoot) => {
    const images: Element[] = []
    visit(tree, 'element', (node: Element, index, parent) => {
      const props = node.properties
      if (node.tagName === 'a' && typeof props.href === 'string') {
        if (!EXTERNAL.test(props.href)) props.href = resolve.link(props.href)
        else if (/^https?:/i.test(props.href)) props.rel = ['noopener']
      }
      if (node.tagName === 'img' && typeof props.src === 'string') {
        images.push(node)
        props.loading = 'lazy'
        props.decoding = 'async'
      }
      if (node.tagName === 'p') {
        const content = node.children.filter(
          (child) => child.type !== 'text' || child.value.trim() !== ''
        )
        const imageOnly =
          content.length > 0 &&
          content.every(
            (child) => child.type === 'element' && child.tagName === 'img'
          )
        if (imageOnly) {
          node.tagName = 'figure'
          props.className = ['article-preview']
          if (content.length > 1) {
            props.className.push('article-preview-gallery')
          }
        }
      }
      if (node.tagName === 'table' && parent && index !== undefined) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['article-table'] },
          children: [node],
        }
        return SKIP
      }
      return undefined
    })
    await Promise.all(
      images.map(async (node) => {
        const src = node.properties.src
        if (typeof src === 'string' && !EXTERNAL.test(src)) {
          node.properties.src = await resolve.asset(src)
        }
      })
    )
  }
}

export async function renderMarkdown(markdown: string, resolve: LinkResolver) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDropLeadingTitle)
    .use(remarkMermaid)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeArticleLinks, resolve)
    .use(rehypePrettyCode, { theme: 'vesper', keepBackground: false })
    .use(rehypeStringify)
    .process(markdown)
  const html = String(file)
  return { html, hasDiagrams: html.includes('class="mermaid"') }
}

/** Minutes at 220 words a minute, never less than one. */
export function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
