'use client'

import { useEffect, useRef, useState } from 'react'
import { CHAT_MAX_MESSAGES } from '@/lib/ai/limits'
import { useT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

export type ChatRole = 'user' | 'assistant'
export type ChatMessage = { id: string; role: ChatRole; content: string }

function createId(): string {
  return crypto.randomUUID()
}

type ChatStream = {
  messages: ChatMessage[]
  sending: boolean
  error: string | null
  /** Append a user message and stream the assistant reply from /api/chat. */
  send(text: string): Promise<void>
}

/**
 * Owns the chat transcript + the fetch → reader streaming loop against
 * `/api/chat`. Cancels the in-flight request on unmount.
 */
export function useChatStream(locale: Locale): ChatStream {
  const t = useT()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const send = async (text: string): Promise<void> => {
    // Guard via ref so a second send() fired inside the same tick can't
    // race past the `sending` state update.
    if (abortRef.current) return
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    }
    const assistantId = createId()

    // Keep history under the server cap. We append the new user msg + an
    // empty assistant placeholder, so reserve 2 slots from the budget.
    const base = messages.slice(-(CHAT_MAX_MESSAGES - 2))
    const nextHistory: ChatMessage[] = [
      ...base,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ]

    setMessages(nextHistory)
    setError(null)
    setSending(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          locale,
          messages: nextHistory
            .filter((m) => m.id !== assistantId)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!(res.ok && res.body)) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let done = false
      while (!done) {
        const chunk = await reader.read()
        done = chunk.done
        if (chunk.value) {
          accumulated += decoder.decode(chunk.value, { stream: true })
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m
            )
          )
        }
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
      setError(t('cockpit.comm.error'))
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setSending(false)
      abortRef.current = null
    }
  }

  return { messages, sending, error, send }
}
