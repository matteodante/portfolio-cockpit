'use client'

import type { Locale } from '@/lib/i18n/config'
import ChatComposer from './chat-composer'
import ChatHeader from './chat-header'
import MessageList from './message-list'
import { useChatStream } from './use-chat-stream'

type CommChatProps = { locale: Locale }

/**
 * Dock section hosting the AI chat. Owns nothing itself — the transcript
 * and streaming lifecycle live in {@link useChatStream}; the UI is split
 * across header / message list / composer components.
 */
export default function CommChat({ locale }: CommChatProps) {
  const { messages, sending, error, send } = useChatStream(locale)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1,
        minHeight: 0,
      }}
    >
      <ChatHeader sending={sending} />
      <MessageList messages={messages} />
      {error ? <ErrorBanner message={error} /> : null}
      <ChatComposer sending={sending} onSend={(text) => void send(text)} />
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '6px 10px',
        background: '#1a0808',
        border: '1px solid #ff5252',
        color: 'var(--color-cockpit-hud-red)',
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        fontSize: 11,
        letterSpacing: 1,
      }}
    >
      {message}
    </div>
  )
}
