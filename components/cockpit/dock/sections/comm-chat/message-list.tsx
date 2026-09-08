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
  background: 'var(--color-cockpit-bg)',
  border: '1px solid var(--color-cockpit-border)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontFamily: 'var(--font-body), sans-serif',
  fontSize: 13,
  lineHeight: 1.6,
}

const GREETING_STYLE: CSSProperties = {
  color: 'var(--color-cockpit-text-dim)',
  fontStyle: 'italic',
  padding: '12px 14px',
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
