'use client'

import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { externalActions } from '@/components/cockpit/chrome/bottom-console/external-actions'
import CockpitButton from '@/components/cockpit/chrome/cockpit-button'
import LanguageSwitcher from '@/components/cockpit/chrome/language-switcher'
import BrandAvatar from '@/components/shared/brand-avatar'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT, useUnlock } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

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
    <div className="cockpit-intro">
      <header className="cockpit-intro-header">
        <Link
          href={`/${locale}`}
          className="cockpit-brand"
          aria-label={t('cockpit.mobile.backToHome')}
        >
          <BrandAvatar />
          <span>Matteo Dante</span>
        </Link>
        <LanguageSwitcher currentLocale={locale} />
      </header>
      <div className="cockpit-intro-copy">
        <h1>{t('cockpit.intro.subtitle')}</h1>
        <form onSubmit={handleSubmit}>
          <label className="cockpit-access-label" htmlFor="cv-access-code">
            {t('cockpit.intro.unlock.label')}
          </label>
          <div className="cockpit-access-row">
            <input
              id="cv-access-code"
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder={t('cockpit.intro.unlock.placeholder')}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (status !== 'idle' && status !== 'submitting')
                  setStatus('idle')
              }}
              disabled={unlocked || status === 'submitting'}
            />
            <button
              type="submit"
              className="brand-button"
              disabled={isSubmitDisabled}
            >
              {status === 'submitting'
                ? `${t('cockpit.intro.unlock.button')}…`
                : t('cockpit.intro.unlock.button')}
            </button>
          </div>
          <p
            className="cockpit-access-hint"
            aria-live="polite"
            style={feedback ? { color: feedback.color } : undefined}
          >
            {feedback ? feedback.text : t('cockpit.intro.unlock.hint')}
          </p>
        </form>
        <div className="cockpit-intro-actions">
          <CockpitButton onClick={onStart}>
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
