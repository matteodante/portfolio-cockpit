'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BottomConsole from '@/components/cockpit/chrome/bottom-console'
import DeathOverlay from '@/components/cockpit/chrome/death-overlay'
import IntroOverlay from '@/components/cockpit/chrome/intro-overlay'
import MobileGameControls from '@/components/cockpit/chrome/mobile-game-controls'
import TopBar from '@/components/cockpit/chrome/top-bar'
import DockOverlay from '@/components/cockpit/dock/dock-overlay'
import { CockpitScene } from '@/components/cockpit/scene/cockpit-scene'
import { EMAIL_HREF } from '@/lib/constants/contact'
import { cvPdfPath } from '@/lib/constants/site'
import {
  COMM_SECTION,
  type CockpitSection,
  type CockpitSectionId,
  SECTIONS,
} from '@/lib/data/cockpit-sections'
import { useBackgroundMusic } from '@/lib/hooks/use-background-music'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { type TranslationKey, useT, useUnlock } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'

type Props = { locale: Locale }

// Module scope: `sectionLabels` identity drives a full label-texture
// rebuild in the scene, so nothing here may be re-allocated per render.
const ALL_SECTIONS: readonly CockpitSection[] = [...SECTIONS, COMM_SECTION]

/**
 * Top-level cockpit orchestrator.
 *
 * Owns the React state that the scene cannot own (`near`, `docked`,
 * `started`) and composes the imperative 3D scene, the HUD chrome,
 * and the dock overlay. The scene pushes state changes back here via
 * `onNearChange` / `onDockRequest` callbacks; HUD gauges are read
 * separately from the Zustand `useHud` store.
 *
 * `Escape` undocks. The shortcut lives here, not in the scene.
 */
export default function CockpitApp({ locale }: Props) {
  const t = useT()
  const { unlocked } = useUnlock()
  const [sceneUnavailable, setSceneUnavailable] = useState(false)
  const [near, setNear] = useState<CockpitSection | null>(null)
  const [docked, setDocked] = useState<CockpitSection | null>(null)
  const [started, setStarted] = useState(false)
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const contactSection = SECTIONS.find((s) => s.id === 'contact') ?? null
  const { muted, toggle: toggleMusic } = useBackgroundMusic(started)

  // ESC to undock
  useEffect(() => {
    if (!docked) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDocked(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [docked])

  const sectionLabels = useMemo(() => {
    const out = {} as Record<CockpitSectionId, string>
    for (const s of ALL_SECTIONS) {
      out[s.id] = t(`${s.i18nKey}.label` as TranslationKey)
    }
    return out
  }, [t])

  if (sceneUnavailable) {
    return (
      <main className="flight-fallback">
        <h1>{t('cockpit.flight.unavailable')}</h1>
        <p>{t('cockpit.flight.unavailableHint')}</p>
        <div className="flight-fallback-actions">
          <Link
            className="brand-button"
            href={cvPdfPath(locale, unlocked) as `/${string}`}
            download
          >
            {t('cockpit.mobile.downloadCv')}
          </Link>
          <Link
            className="brand-button"
            data-variant="secondary"
            href={EMAIL_HREF}
          >
            {t('cockpit.mobile.contact')}
          </Link>
        </div>
        <Link className="flight-return" href={`/${locale}`}>
          {t('cockpit.mobile.backToHome')}
        </Link>
      </main>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        background: 'var(--color-cockpit-bg)',
        overflow: 'hidden',
      }}
    >
      <CockpitScene
        sections={SECTIONS}
        sectionLabels={sectionLabels}
        started={started}
        docked={docked !== null || menuOpen}
        onNearChange={setNear}
        onDockRequest={setDocked}
        onUnavailable={() => setSceneUnavailable(true)}
      />
      {!started && (
        <IntroOverlay locale={locale} onStart={() => setStarted(true)} />
      )}
      {started && (
        <div className="cockpit-hud" inert={docked !== null}>
          <TopBar
            locale={locale}
            muted={muted}
            onToggleMusic={toggleMusic}
            onContact={() => {
              if (contactSection) setDocked(contactSection)
            }}
            onOpenChat={() => setDocked(COMM_SECTION)}
            onMenuChange={setMenuOpen}
          />
          <BottomConsole
            near={near}
            onDock={() => {
              if (near) setDocked(near)
            }}
            onOpenComm={() => setDocked(COMM_SECTION)}
          />
          {isMobile && !docked && !menuOpen && <MobileGameControls />}
        </div>
      )}
      {started && <DeathOverlay />}
      <DockOverlay
        section={docked}
        onClose={() => setDocked(null)}
        locale={locale}
      />
    </div>
  )
}
