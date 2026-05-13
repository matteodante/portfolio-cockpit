'use client'

import { useEffect, useState } from 'react'
import {
  COMM_SECTION,
  type CockpitSection,
  type CockpitSectionId,
  SECTIONS,
} from '@/lib/data/cockpit-sections'
import { useBackgroundMusic } from '@/lib/hooks/use-background-music'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { type TranslationKey, useT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import BottomConsole from './chrome/bottom-console'
import CockpitFrame from './chrome/cockpit-frame'
import DeathOverlay from './chrome/death-overlay'
import IntroOverlay from './chrome/intro-overlay'
import LeftConsole from './chrome/left-console'
import MobileActions from './chrome/mobile-actions'
import MobileGameControls from './chrome/mobile-game-controls'
import MusicToggle from './chrome/music-toggle'
import RightConsole from './chrome/right-console'
import TopBar, { ApproachBanner } from './chrome/top-bar'
import DockOverlay from './dock/dock-overlay'
import { CockpitScene } from './scene/cockpit-scene'

type Props = { locale: Locale }

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
  const [near, setNear] = useState<CockpitSection | null>(null)
  const [docked, setDocked] = useState<CockpitSection | null>(null)
  const [started, setStarted] = useState(false)
  const isMobile = useIsMobile()
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

  const sectionLabels: Record<CockpitSectionId, string> = (() => {
    const out = {} as Record<CockpitSectionId, string>
    for (const s of SECTIONS) {
      out[s.id] = t(`${s.i18nKey}.label` as TranslationKey)
    }
    return out
  })()

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
        onNearChange={setNear}
        onDockRequest={setDocked}
      />
      {!started && (
        <IntroOverlay locale={locale} onStart={() => setStarted(true)} />
      )}
      {started && isMobile && (
        <>
          <MobileActions
            locale={locale}
            onContact={() => {
              if (contactSection) setDocked(contactSection)
            }}
            onOpenChat={() => setDocked(COMM_SECTION)}
          />
          {docked ? null : (
            <MobileGameControls onOpenChat={() => setDocked(COMM_SECTION)} />
          )}
        </>
      )}
      {started && !isMobile && (
        <>
          <CockpitFrame />
          <TopBar near={near} />
          <LeftConsole />
          <RightConsole locale={locale} />
          <BottomConsole
            near={near}
            locale={locale}
            onDock={() => {
              if (near) setDocked(near)
            }}
            onOpenComm={() => setDocked(COMM_SECTION)}
          />
          {near && !docked ? <ApproachBanner near={near} /> : null}
        </>
      )}
      <DeathOverlay />
      {started && !docked && (
        <MusicToggle
          muted={muted}
          onToggle={toggleMusic}
          ariaLabel={t(
            muted ? 'cockpit.audio.toggleOff' : 'cockpit.audio.toggleOn'
          )}
        />
      )}
      <DockOverlay
        section={docked}
        onClose={() => setDocked(null)}
        locale={locale}
      />
    </div>
  )
}
