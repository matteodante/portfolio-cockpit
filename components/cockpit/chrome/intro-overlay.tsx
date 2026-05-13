'use client'

import { type FormEvent, useState } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT, useUnlock } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import { externalActions } from './bottom-console/external-actions'
import CockpitButton from './cockpit-button'
import LanguageSwitcher from './language-switcher'

type IntroOverlayProps = {
  locale: Locale
  onStart: () => void
}

type UnlockState = 'idle' | 'submitting' | 'success' | 'invalid' | 'error'

export default function IntroOverlay({ locale, onStart }: IntroOverlayProps) {
  const t = useT()
  const { unlocked, applyUnlock } = useUnlock()
  const { downloadCv } = externalActions(locale, unlocked)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<UnlockState>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (status === 'submitting' || password.length === 0) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setStatus('success')
        setPassword('')
        await applyUnlock()
      } else if (res.status === 401) {
        setStatus('invalid')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const feedback = (() => {
    if (status === 'invalid')
      return { text: t('cockpit.intro.unlock.invalid'), color: '#ff6b6b' }
    if (status === 'error')
      return { text: t('cockpit.intro.unlock.error'), color: '#ff6b6b' }
    if (status === 'success' || unlocked)
      return { text: t('cockpit.intro.unlock.success'), color: COCKPIT_ACCENT }
    return null
  })()

  const isSubmitDisabled =
    unlocked || status === 'submitting' || password === ''

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse at 28% 75%, rgba(5,6,10,0) 0%, rgba(5,6,10,0.7) 100%)',
        animation: 'fade-in 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 16px)',
          pointerEvents: 'auto',
        }}
      >
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 'calc(env(safe-area-inset-left, 0px) + 6vw)',
          right: 'calc(env(safe-area-inset-right, 0px) + 6vw)',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 9vh)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 22,
          maxWidth: 'min(680px, 92vw)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
            fontSize: 'clamp(28px, 4.6vw, 54px)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            color: '#f4f1ea',
            margin: 0,
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
            textShadow: `0 0 32px ${COCKPIT_ACCENT}33`,
          }}
        >
          {t('cockpit.intro.subtitle')}
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            width: '100%',
            maxWidth: 420,
            pointerEvents: 'auto',
          }}
        >
          <label
            htmlFor="cv-access-code"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: 2,
              color: '#a8a098',
              textTransform: 'uppercase',
            }}
          >
            {t('cockpit.intro.unlock.label')}
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              id="cv-access-code"
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder={t('cockpit.intro.unlock.placeholder')}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (status !== 'idle' && status !== 'submitting') {
                  setStatus('idle')
                }
              }}
              disabled={unlocked || status === 'submitting'}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.45)',
                border: `1px solid ${COCKPIT_ACCENT}44`,
                color: '#f4f1ea',
                fontFamily: 'var(--font-mono), monospace',
                // 16px+ keeps iOS Safari from auto-zooming on focus.
                fontSize: 16,
                padding: '10px 12px',
                outline: 'none',
                borderRadius: 2,
              }}
            />
            <button
              type="submit"
              disabled={isSubmitDisabled}
              style={{
                background: COCKPIT_ACCENT,
                border: 'none',
                color: '#05060a',
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 700,
                padding: '10px 16px',
                cursor: isSubmitDisabled ? 'default' : 'pointer',
                opacity: isSubmitDisabled ? 0.5 : 1,
                borderRadius: 2,
              }}
            >
              {t('cockpit.intro.unlock.button')}
            </button>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: 0.5,
              color: feedback?.color ?? '#7a7268',
              minHeight: 14,
            }}
          >
            {feedback?.text ?? t('cockpit.intro.unlock.hint')}
          </div>
        </form>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 4,
            flexWrap: 'wrap',
            pointerEvents: 'auto',
          }}
        >
          <CockpitButton onClick={onStart} variant="primary">
            {t('cockpit.intro.start')}
          </CockpitButton>
          <CockpitButton onClick={downloadCv} variant="secondary">
            {t('cockpit.actions.downloadCv')}
          </CockpitButton>
        </div>
      </div>
    </div>
  )
}
