import Link from 'next/link'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT } from '@/lib/i18n'
import type { ChatMessage } from './use-chat-stream'

type MessageBubbleProps = { message: ChatMessage }

const MD_COMPONENTS: Components = {
  p: ({ children }) => (
    <p style={{ margin: '0 0 8px', lineHeight: 1.55 }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ margin: '0 0 8px', paddingLeft: 18 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ margin: '0 0 8px', paddingLeft: 18 }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 2, lineHeight: 1.55 }}>{children}</li>
  ),
  strong: ({ children }) => (
    <strong style={{ color: 'var(--color-cockpit-accent)', fontWeight: 600 }}>
      {children}
    </strong>
  ),
  em: ({ children }) => <em style={{ color: '#eae2d3' }}>{children}</em>,
  a: ({ href, children }) => (
    <Link
      href={
        (href ?? '#') as `/${string}` | `https://${string}` | `http://${string}`
      }
      target="_blank"
      rel="noreferrer"
      style={{
        color: 'var(--color-cockpit-hud-green)',
        textDecoration: 'underline',
      }}
    >
      {children}
    </Link>
  ),
  code: ({ children }) => (
    <code
      style={{
        background: '#0a0908',
        border: '1px solid #2a2824',
        padding: '0 4px',
        borderRadius: 2,
        fontSize: 12,
      }}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre
      style={{
        background: '#0a0908',
        border: '1px solid #2a2824',
        padding: 8,
        margin: '0 0 8px',
        overflowX: 'auto',
        fontSize: 12,
      }}
    >
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <div
      style={{
        fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
        fontSize: 14,
        margin: '4px 0 6px',
        color: '#eae2d3',
      }}
    >
      {children}
    </div>
  ),
  h2: ({ children }) => (
    <div
      style={{
        fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
        fontSize: 13,
        margin: '4px 0 6px',
        color: '#eae2d3',
      }}
    >
      {children}
    </div>
  ),
  h3: ({ children }) => (
    <div
      style={{
        fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
        fontSize: 12,
        margin: '4px 0 6px',
        color: '#eae2d3',
      }}
    >
      {children}
    </div>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        margin: '0 0 8px',
        paddingLeft: 10,
        borderLeft: '2px solid #2a2824',
        color: 'var(--color-cockpit-text-dim)',
      }}
    >
      {children}
    </blockquote>
  ),
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const t = useT()
  const isUser = message.role === 'user'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: isUser ? COCKPIT_ACCENT : '#6aff9e',
          letterSpacing: 2,
          marginBottom: 3,
        }}
      >
        {isUser ? 'YOU' : 'ASSISTANT'}
      </div>
      <div
        aria-live={isUser ? undefined : 'polite'}
        style={{
          maxWidth: '85%',
          padding: '8px 12px',
          background: isUser ? '#1f1c18' : '#14120f',
          border: `1px solid ${isUser ? COCKPIT_ACCENT : '#2a2824'}`,
          color: 'var(--color-cockpit-text)',
          wordBreak: 'break-word',
        }}
      >
        {renderBody(message.content, isUser, t('cockpit.comm.thinking'))}
      </div>
    </div>
  )
}

function renderBody(content: string, isUser: boolean, thinking: string) {
  if (!content) {
    return (
      <span
        style={{ color: 'var(--color-cockpit-text-dim)', fontStyle: 'italic' }}
      >
        {thinking}
      </span>
    )
  }
  if (isUser) {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
  }
  return <ReactMarkdown components={MD_COMPONENTS}>{content}</ReactMarkdown>
}
