'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useChatStream } from '@/components/cockpit/dock/sections/comm-chat/use-chat-stream'
import { CHAT_MAX_MESSAGE_LENGTH } from '@/lib/ai/limits'
import { CAL_BOOKING_URL } from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'
import '@/components/landing/home-assistant.css'

function Helmet() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M7 22V14a9 9 0 0 1 18 0v8l-4 5H11l-4-5Z" />
      <rect x="9.5" y="11" width="13" height="10" rx="4" />
      <path d="M12 14h5M4 15v6m24-6v6M12 27v2h8v-2" />
    </svg>
  )
}
function Arrow({ close = false }: { close?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={close ? 'm6 6 12 12M18 6 6 18' : 'M5 12h14m-6-6 6 6-6 6'} />
    </svg>
  )
}

export default function HomeAssistant({ locale }: { locale: Locale }) {
  const it = locale === 'it'
  const userLabel = it ? 'Tu' : 'You'
  const assistantLabel = it ? 'Assistente AI' : 'AI assistant'
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const { messages, sending, error, send } = useChatStream(locale, 'home')
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  const wasOpen = useRef(false)
  const suggestions = it
    ? ['Vorrei un sito web', 'Cosa puoi fare con l’AI?', 'Parlami di Matteo']
    : ['I need a website', 'What can you do with AI?', 'Tell me about Matteo']

  useEffect(() => {
    if (open) input.current?.focus({ preventScroll: true })
    else if (wasOpen.current) launcher.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])
  useEffect(() => {
    if (messages.length && open && follow.current && transcript.current) {
      transcript.current.scrollTop = transcript.current.scrollHeight
    }
  }, [messages, open])

  const close = () => {
    setOpen(false)
  }
  const submit = (value: string) => {
    if (!value.trim() || sending) return
    follow.current = true
    input.current?.focus({ preventScroll: true })
    setDraft('')
    void send(value)
  }

  return (
    <aside
      className="home-assistant"
      data-open={open}
      aria-label={it ? 'Assistente AI di Matteo' : 'Matteo’s AI assistant'}
    >
      <section
        className="assistant-panel"
        id="home-assistant-panel"
        hidden={!open}
        aria-labelledby="assistant-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            close()
          }
        }}
      >
        <header className="assistant-header">
          <span className="assistant-emblem">
            <Helmet />
          </span>
          <div>
            <h2 id="assistant-title">
              {it ? 'Assistente di Matteo' : 'Matteo’s assistant'}
            </h2>
            <p>{it ? 'AI, con i piedi per terra.' : 'AI. Down to earth.'}</p>
          </div>
          <button
            type="button"
            className="assistant-icon-button"
            onClick={close}
            aria-label={it ? 'Chiudi chat' : 'Close chat'}
          >
            <Arrow close />
          </button>
        </header>
        <div
          className="assistant-transcript"
          ref={transcript}
          onScroll={() => {
            const el = transcript.current
            if (el)
              follow.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 64
          }}
        >
          <div className="assistant-welcome">
            <h3>{it ? 'Da quale idea partiamo?' : 'What’s your idea?'}</h3>
            <p>
              {it
                ? 'Ti aiuto a conoscere Matteo e a capire come può dare forma al tuo progetto.'
                : 'Get to know Matteo and explore how he can bring your project to life.'}
            </p>
          </div>
          {messages.length === 0 && (
            <div className="assistant-suggestions">
              {suggestions.map((text) => (
                <button type="button" key={text} onClick={() => submit(text)}>
                  {text}
                  <Arrow />
                </button>
              ))}
            </div>
          )}
          <div
            className="assistant-messages"
            role="log"
            aria-label={it ? 'Conversazione' : 'Conversation'}
            aria-live="polite"
            aria-busy={sending}
          >
            {messages
              .filter((message) => message.content)
              .map((message) => (
                <div
                  className="assistant-message"
                  data-role={message.role}
                  key={message.id}
                >
                  <span>
                    {message.role === 'user' ? userLabel : assistantLabel}
                  </span>
                  <p>{message.content}</p>
                </div>
              ))}
          </div>
          {sending && (
            <p className="assistant-status" role="status">
              {it ? 'Sto preparando una risposta…' : 'Preparing a reply…'}
            </p>
          )}
          {error && (
            <div className="assistant-error" role="alert">
              <p>
                {it
                  ? 'La risposta non è arrivata. Riprova tra poco, oppure prenota direttamente una chiamata.'
                  : 'The reply couldn’t be completed. Try again shortly, or book a call directly.'}
              </p>
              <button
                type="button"
                disabled={sending}
                onClick={() => {
                  const last = messages.findLast(
                    (message) => message.role === 'user'
                  )
                  if (last) submit(last.content)
                }}
              >
                {it ? 'Riprova' : 'Try again'}
              </button>
            </div>
          )}
        </div>
        <div className="assistant-bottom">
          <Link
            className="assistant-booking"
            href={CAL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="booking_opened"
            data-placement="home_assistant"
          >
            <span>{it ? 'Prenota una chiamata' : 'Book a call'}</span>
            <Arrow />
          </Link>
          <form
            className="assistant-composer"
            onSubmit={(event) => {
              event.preventDefault()
              submit(draft)
            }}
          >
            <label className="assistant-sr-only" htmlFor="assistant-message">
              {it ? 'Il tuo messaggio' : 'Your message'}
            </label>
            <textarea
              ref={input}
              id="assistant-message"
              rows={2}
              maxLength={CHAT_MAX_MESSAGE_LENGTH}
              value={draft}
              placeholder={
                it ? 'Raccontami la tua idea…' : 'Tell me about your idea…'
              }
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  submit(draft)
                }
              }}
            />
            <button
              className="assistant-send"
              type="submit"
              disabled={sending || !draft.trim()}
              aria-label={it ? 'Invia messaggio' : 'Send message'}
            >
              <Arrow />
            </button>
          </form>
          <p className="assistant-privacy">
            {it
              ? 'Risposte AI: possono contenere errori. I messaggi vengono elaborati da OpenAI. Non inserire dati sensibili.'
              : 'AI replies may contain mistakes. Messages are processed by OpenAI. Don’t share sensitive data.'}
          </p>
        </div>
      </section>
      <button
        className="assistant-launcher"
        type="button"
        ref={launcher}
        aria-label={it ? 'Chiedi all’AI' : 'Ask the AI'}
        aria-expanded={open}
        aria-controls="home-assistant-panel"
        onClick={() => {
          if (open) close()
          else setOpen(true)
        }}
      >
        <Helmet />
        <svg
          className="assistant-launcher-chat"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M20 14a3 3 0 0 1-3 3H9l-5 4V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8Z" />
          <path d="M8 8h8M8 12h5" />
        </svg>
        <span className="assistant-launcher-label">
          {it ? 'Chiedi all’AI' : 'Ask the AI'}
        </span>
        <span className="assistant-launcher-mark" aria-hidden="true" />
      </button>
    </aside>
  )
}
