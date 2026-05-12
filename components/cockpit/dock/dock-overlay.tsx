'use client'

import { useEffect, useId, useRef } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { type TranslationKey, useT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import Screw from '../chrome/primitives/screw'
import DockContent from './dock-content'

type DockOverlayProps = {
  section: CockpitSection | null
  onClose: () => void
  locale: Locale
}

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function DockOverlay({
  section,
  onClose,
  locale,
}: DockOverlayProps) {
  const t = useT()
  const isMobile = useIsMobile()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Focus trap + focus return: capture the previously focused element on
  // open, focus the close button, restrict Tab cycling to the dialog, and
  // restore focus when the dialog closes.
  useEffect(() => {
    if (!section) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!(first && last)) return
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [section])

  if (!section) return null

  const label = t(`${section.i18nKey}.label` as TranslationKey)
  const title = t(`${section.i18nKey}.title` as TranslationKey)
  const sub = t(`${section.i18nKey}.sub` as TranslationKey)
  // The chat section owns its own scroll container; letting the body
  // scroll too steals touch events on iOS.
  const innerScroll = section.id === 'comm'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fade-in 0.3s ease',
      }}
    >
      {/* Backdrop — click-outside dismisses, but keyboard users use ESC or
          the dedicated close button so it doesn't need to be focusable. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5,6,10,0.75)',
          backdropFilter: 'blur(12px)',
        }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          background: 'var(--color-cockpit-panel)',
          border: isMobile ? 'none' : `1px solid ${COCKPIT_ACCENT}`,
          boxShadow: isMobile
            ? 'none'
            : `0 0 60px ${COCKPIT_ACCENT}4d, inset 0 1px 0 rgba(255,255,255,0.08)`,
          width: isMobile ? '100vw' : 'min(760px, 92vw)',
          height: isMobile ? '100dvh' : undefined,
          maxHeight: isMobile ? '100dvh' : '85vh',
          padding: 0,
          position: 'relative',
          color: 'var(--color-cockpit-text)',
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: 'var(--color-cockpit-panel-light)',
            padding: isMobile
              ? 'calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px'
              : '12px 20px',
            borderBottom: '1px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <span
            style={{ fontSize: 10, letterSpacing: 2, color: COCKPIT_ACCENT }}
          >
            {t('cockpit.hud.docked')} · {label}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={t('cockpit.controls.undockBtn')}
            style={{
              background: 'transparent',
              border: '1px solid #444',
              color: 'var(--color-cockpit-text-dim)',
              fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
              fontSize: 11,
              padding: '4px 10px',
              cursor: 'pointer',
              letterSpacing: 1,
            }}
          >
            {t('cockpit.controls.undockBtn')}
          </button>
        </div>

        <div
          style={{
            padding: isMobile
              ? '20px 18px calc(env(safe-area-inset-bottom, 0px) + 20px)'
              : 28,
            overflowY: innerScroll ? 'hidden' : 'auto',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2
            id={titleId}
            style={{
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: isMobile ? 26 : 34,
              fontWeight: 600,
              letterSpacing: -0.5,
              color: 'var(--color-cockpit-text)',
              margin: 0,
              marginBottom: 2,
            }}
          >
            {title}
          </h2>
          <div
            style={{
              fontSize: 12,
              color: 'var(--color-cockpit-text-dim)',
              letterSpacing: 1,
              marginBottom: 20,
            }}
          >
            {sub}
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--color-cockpit-text)',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <DockContent section={section} locale={locale} />
          </div>
        </div>

        {isMobile ? null : (
          <>
            <Screw
              size={14}
              style={{ position: 'absolute', top: 10, left: 10 }}
            />
            <Screw
              size={14}
              style={{ position: 'absolute', top: 10, right: 10 }}
            />
            <Screw
              size={14}
              style={{ position: 'absolute', bottom: 10, left: 10 }}
            />
            <Screw
              size={14}
              style={{ position: 'absolute', bottom: 10, right: 10 }}
            />
          </>
        )}
      </div>
    </div>
  )
}
