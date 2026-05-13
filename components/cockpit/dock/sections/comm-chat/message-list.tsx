import { type CSSProperties, useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import MessageBubble from './message-bubble'
import type { ChatMessage } from './use-chat-stream'

type MessageListProps = {
  messages: ChatMessage[]
}

const LIST_STYLE: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  padding: 12,
  background: '#0a0908',
  border: '1px solid #000',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
  fontSize: 13,
  lineHeight: 1.6,
}

const GREETING_STYLE: CSSProperties = {
  color: 'var(--color-cockpit-text-dim)',
  fontStyle: 'italic',
  padding: '12px 14px',
  background: 'var(--color-cockpit-panel)',
  border: '1px dashed #2a2824',
}

/**
 * Scrolling chat transcript. Auto-scrolls to the bottom whenever the
 * messages array changes (including during streaming updates).
 */
export default function MessageList({ messages }: MessageListProps) {
  const t = useT()
  const ref = useRef<HTMLDivElement | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages re-scroll
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div ref={ref} style={LIST_STYLE}>
      {messages.length === 0 ? (
        <div style={GREETING_STYLE}>{t('cockpit.comm.greeting')}</div>
      ) : null}
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
    </div>
  )
}
