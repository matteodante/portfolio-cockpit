'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { cvPdfPath } from '@/lib/constants/site'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT, useUnlock } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  locale: Locale
  onContact: () => void
  onOpenChat: () => void
}

const STYLES = `
@keyframes menu-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.menu-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--accent);
  background: rgba(5,6,10,0.7);
  border: 1px solid color-mix(in oklab, var(--accent) 45%, transparent);
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 160ms ease;
}
.menu-btn:active {
  border-color: var(--accent);
}

.menu-sheet {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top, 24px) 22px env(safe-area-inset-bottom, 24px) 22px;
  background: rgba(5,6,10,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: menu-fade 220ms ease;
}
.menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 4px 32px;
}
.menu-head-title {
  font-family: var(--font-body), sans-serif;
  font-family: var(--font-display), sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  color: var(--color-cockpit-text);
}
.menu-close {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--color-cockpit-text-dim);
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  letter-spacing: 0;
  text-transform: none;
  padding: 8px;
  width: 44px;
  height: 44px;
  font-size: 24px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.menu-close:active { color: var(--accent); }

.menu-list {
  display: flex;
  flex-direction: column;
}
.menu-item {
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 22px 4px;
  font-family: var(--font-body), sans-serif;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: var(--color-cockpit-text);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: color 160ms ease;
  display: block;
}
.menu-item:active,
.menu-item:hover {
  color: var(--accent);
}

.menu-back {
  margin-top: auto;
  padding: 18px;
  appearance: none;
  background: var(--accent);
  border: 0;
  color: #0a0706;
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
`

function IconMenu() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
    >
      <title>menu</title>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

export default function MobileActions({
  locale,
  onContact,
  onOpenChat,
}: Props) {
  const t = useT()
  const { unlocked } = useUnlock()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab') return
      const controls =
        menuRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
      const first = controls?.[0]
      const last = controls?.[controls.length - 1]
      if (!(first && last)) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static css */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Link
        href={`/${locale}`}
        className="cockpit-home-avatar cockpit-home-avatar-mobile"
        aria-label={t('cockpit.mobile.backToHome')}
      >
        <BrandAvatar />
      </Link>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="menu-btn"
        aria-label={t('cockpit.mobile.menu')}
        style={{
          position: 'absolute',
          right: 14,
          top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          zIndex: 40,
          ['--accent' as string]: COCKPIT_ACCENT,
        }}
      >
        <IconMenu />
      </button>

      {open ? (
        <div
          className="menu-sheet"
          ref={menuRef}
          style={{ ['--accent' as string]: COCKPIT_ACCENT }}
          role="dialog"
          aria-modal="true"
          aria-label={t('cockpit.mobile.menu')}
        >
          <div className="menu-head">
            <span className="menu-head-title">{t('cockpit.mobile.menu')}</span>
            <button
              type="button"
              onClick={close}
              ref={closeRef}
              className="menu-close"
              aria-label={t('cockpit.mobile.backToGame')}
            >
              ×
            </button>
          </div>

          <div className="menu-list">
            <Link
              href={cvPdfPath(locale, unlocked) as `/${string}`}
              download
              className="menu-item"
              onClick={close}
            >
              {t('cockpit.mobile.downloadCv')}
            </Link>
            <button
              type="button"
              className="menu-item"
              onClick={() => {
                onOpenChat()
                close()
              }}
            >
              {t('cockpit.mobile.chat')}
            </button>
            <button
              type="button"
              className="menu-item"
              onClick={() => {
                onContact()
                close()
              }}
            >
              {t('cockpit.mobile.contact')}
            </button>
          </div>

          <div style={{ marginTop: 28 }}>
            <LanguageSwitcher locale={locale} cockpit />
          </div>

          <Link href={`/${locale}`} className="menu-back">
            {t('cockpit.mobile.backToHome')}
          </Link>
        </div>
      ) : null}
    </>
  )
}
