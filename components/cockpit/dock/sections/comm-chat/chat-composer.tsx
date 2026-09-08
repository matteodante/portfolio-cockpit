'use client'

import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useState,
} from 'react'
import { CHAT_MAX_MESSAGE_LENGTH } from '@/lib/ai/limits'
import { useT } from '@/lib/i18n'

type ChatComposerProps = {
  sending: boolean
  onSend(text: string): void
}

/** Multiline textarea + Send button with Enter/Shift+Enter handling. */
export default function ChatComposer({ sending, onSend }: ChatComposerProps) {
  const t = useT()
  const [input, setInput] = useState('')

  const canSubmit = !sending && input.trim().length > 0

  const submit = (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!canSubmit) return
    onSend(input)
    setInput('')
  }

  const handleKey = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={submit}>
      <div style={{ paddingTop: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) =>
              setInput(e.target.value.slice(0, CHAT_MAX_MESSAGE_LENGTH))
            }
            onKeyDown={handleKey}
            placeholder={t('cockpit.comm.placeholder')}
            rows={2}
            maxLength={CHAT_MAX_MESSAGE_LENGTH}
            disabled={sending}
            style={{
              flex: 1,
              resize: 'none',
              background: 'var(--color-cockpit-bg)',
              border: '1px solid var(--color-cockpit-border)',
              color: 'var(--color-cockpit-text)',
              padding: '8px 10px',
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: 16,
              lineHeight: 1.5,
            }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={sending}
            className="brand-button"
            style={{ padding: '10px 16px', minHeight: 44, fontSize: 13 }}
          >
            {t('cockpit.comm.send')}
          </button>
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: 9,
            color: 'var(--color-cockpit-text-dim)',
            letterSpacing: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>ENTER ▸ SEND · SHIFT+ENTER ▸ NEWLINE</span>
          <span>
            {input.length}/{CHAT_MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>
    </form>
  )
}
