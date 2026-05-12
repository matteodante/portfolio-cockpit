'use client'

import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useState,
} from 'react'
import MetalPanel from '@/components/cockpit/chrome/primitives/metal-panel'
import { CHAT_MAX_MESSAGE_LENGTH } from '@/lib/ai/limits'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
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
      <MetalPanel style={{ padding: 8 }} showRivets={false}>
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
              background: '#0a0908',
              border: '1px solid #000',
              color: 'var(--color-cockpit-text)',
              padding: '8px 10px',
              fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
              fontSize: 13,
              lineHeight: 1.5,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={sending}
            style={{
              padding: '10px 16px',
              background: canSubmit ? COCKPIT_ACCENT : '#2a2824',
              border: '1px solid #000',
              color: canSubmit ? '#000' : '#8a8680',
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {t('cockpit.comm.send').toUpperCase()}
          </button>
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
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
      </MetalPanel>
    </form>
  )
}
