'use client'

import Link from 'next/link'
import CockpitMenu from '@/components/cockpit/chrome/mobile-actions'
import MusicToggle from '@/components/cockpit/chrome/music-toggle'
import BrandAvatar from '@/components/shared/brand-avatar'
import LanguageSwitcher from '@/components/shared/language-switcher'
import { cvDownloadFilename, cvPdfPath } from '@/lib/constants/site'
import { useT, useUnlock } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

type Props = {
  locale: Locale
  muted: boolean
  onToggleMusic: () => void
  onContact: () => void
  onOpenChat: () => void
  onMenuChange: (open: boolean) => void
}

export default function TopBar({
  locale,
  muted,
  onToggleMusic,
  onContact,
  onOpenChat,
  onMenuChange,
}: Props) {
  const t = useT()
  const { unlocked } = useUnlock()
  return (
    <header className="flight-header">
      <Link
        href={`/${locale}`}
        className="flight-identity"
        aria-label={t('cockpit.mobile.backToHome')}
      >
        <BrandAvatar />
        <span>
          Matteo Dante<small>{t('cockpit.flight.playableCv')}</small>
        </span>
      </Link>
      <nav
        className="flight-header-actions"
        aria-label={t('cockpit.mobile.menu')}
      >
        <Link
          href={cvPdfPath(locale, unlocked) as `/${string}`}
          download
          onClick={(event) => {
            event.currentTarget.download = cvDownloadFilename()
          }}
          className="flight-desktop-link"
        >
          {t('cockpit.mobile.downloadCv')}
        </Link>
        <button
          type="button"
          className="flight-desktop-link"
          onClick={onContact}
        >
          {t('cockpit.mobile.contact')}
        </button>
        <div className="flight-desktop-language">
          <LanguageSwitcher locale={locale} cockpit />
        </div>
        <MusicToggle
          muted={muted}
          onToggle={onToggleMusic}
          ariaLabel={t(
            muted ? 'cockpit.audio.toggleOff' : 'cockpit.audio.toggleOn'
          )}
        />
        <CockpitMenu
          locale={locale}
          onContact={onContact}
          onOpenChat={onOpenChat}
          onOpenChange={onMenuChange}
        />
      </nav>
    </header>
  )
}
