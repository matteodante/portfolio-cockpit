'use client'

import Link from 'next/link'
import { useRef } from 'react'
import ControlsPanel from '@/components/cockpit/chrome/bottom-console/controls-panel'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { GITHUB_URL } from '@/lib/constants/contact'
import { cvDownloadFilename, cvPdfPath } from '@/lib/constants/site'
import { type CockpitSection, SECTIONS } from '@/lib/data/cockpit-sections'
import { type TranslationKey, useT, useUnlock } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  locale: Locale
  onOpenSection: (section: CockpitSection) => void
  onOpenChat: () => void
  onOpenChange: (open: boolean) => void
}

/** Shared navigation: native dialog owns focus trapping, Escape and return. */
export default function CockpitMenu({
  locale,
  onOpenSection,
  onOpenChat,
  onOpenChange,
}: Props) {
  const t = useT()
  const { unlocked } = useUnlock()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = () => dialogRef.current?.close()
  return (
    <>
      <button
        type="button"
        className="flight-icon-button"
        aria-label={t('cockpit.mobile.menu')}
        onClick={() => {
          dialogRef.current?.showModal()
          onOpenChange(true)
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        className="flight-menu"
        aria-label={t('cockpit.mobile.menu')}
        onClose={() => onOpenChange(false)}
      >
        <div className="flight-menu-heading">
          <h2>{t('cockpit.mobile.menu')}</h2>
          <button
            type="button"
            className="flight-icon-button"
            onClick={close}
            aria-label={t('cockpit.mobile.backToGame')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <nav
          className="flight-menu-links"
          aria-label={t('cockpit.mobile.commandDeck')}
        >
          <Link
            href={cvPdfPath(locale, unlocked) as `/${string}`}
            download
            onClick={(event) => {
              event.currentTarget.download = cvDownloadFilename()
              close()
            }}
          >
            {t('cockpit.mobile.downloadCv')}
          </Link>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                close()
                onOpenSection(section)
              }}
            >
              {t(`${section.i18nKey}.label` as TranslationKey)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              close()
              onOpenChat()
            }}
          >
            {t('cockpit.controls.openAiBtn')}
          </button>
          <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
        </nav>
        <ControlsPanel />
        <div className="flight-menu-footer">
          <LanguageSwitcher locale={locale} cockpit />
          <Link href={`/${locale}`}>{t('cockpit.mobile.backToHome')}</Link>
        </div>
      </dialog>
    </>
  )
}
