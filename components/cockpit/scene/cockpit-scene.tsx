'use client'

/**
 * Cockpit Scene — vanilla Three.js, imperative.
 *
 * One useEffect builds the entire WebGL world on mount and tears it
 * down on unmount. The build happens in `./build-world.ts`; this
 * file is the React shell that wires refs/handlers and mounts the
 * canvas. Everything inside `buildWorld` runs outside React's
 * render cycle: a `requestAnimationFrame` loop drives physics,
 * rendering, and post-processing at the display refresh rate.
 *
 * React bridge:
 *   - `onNearChange(section)` fires when the locked planet changes,
 *     so the chrome can show the approach banner.
 *   - `onDockRequest(section)` fires when the player presses E while
 *     locked onto a planet, so the orchestrator can open the overlay.
 *   - `useHud` (Zustand) carries the per-frame gauges (speed, coords,
 *     gravity, phase). Writes go through `setHud`, which diffs before
 *     mutating so 60 Hz calls don't translate to 60 Hz renders.
 *
 * RAF loop, per frame: see the doc on `buildWorld`.
 *
 * Why not R3F: the scene predates a pure-React 3D model and the
 * imperative loop is intentional — bypassing the reconciler keeps the
 * 60fps budget intact and notifies React only on phase / near / dock
 * transitions, where re-rendering chrome is fine.
 */

import { useEffect, useRef } from 'react'
import type {
  CockpitSectionId,
  PlanetSection,
} from '@/lib/data/cockpit-sections'
import {
  type AstronautInstance,
  buildWorld,
  type PlanetsInstance,
  type ThrustersInstance,
} from './build-world'

type Props = {
  /** Planet definitions. Captured at mount; later changes don't tear
   *  down the WebGL context. */
  sections: readonly PlanetSection[]
  /** Localized planet labels keyed by section id. Re-applied on
   *  language change without rebuilding the scene. */
  sectionLabels: Record<CockpitSectionId, string>
  /** `false` during the intro cinematic; `true` once the player has
   *  begun flying. Drives camera framing and input gating. */
  started: boolean
  /** Called when the locked section changes (entering or leaving the
   *  docking range of a planet). Pass `null` to clear. */
  onNearChange: (section: PlanetSection | null) => void
  /** Called when the player presses E while locked onto a planet.
   *  The orchestrator decides whether to actually open the overlay. */
  onDockRequest: (section: PlanetSection) => void
}

export function CockpitScene({
  sections,
  sectionLabels,
  started,
  onNearChange,
  onDockRequest,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  const astronautRef = useRef<AstronautInstance | null>(null)
  const thrustersRef = useRef<ThrustersInstance | null>(null)
  const planetsRef = useRef<PlanetsInstance | null>(null)
  const lockedRef = useRef<PlanetSection | null>(null)

  const handlersRef = useRef({ onNearChange, onDockRequest })
  handlersRef.current.onNearChange = onNearChange
  handlersRef.current.onDockRequest = onDockRequest

  const startedRef = useRef(started)
  startedRef.current = started

  const mountLabelsRef = useRef(sectionLabels)
  // Captured at mount — re-renders must not tear down the WebGL context.
  const initialSectionsRef = useRef(sections)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    return buildWorld({
      mount,
      sections: initialSectionsRef.current,
      initialLabels: mountLabelsRef.current,
      startedRef,
      handlersRef,
      refs: {
        astronaut: astronautRef,
        thrusters: thrustersRef,
        planets: planetsRef,
        locked: lockedRef,
      },
    })
  }, [])

  useEffect(() => {
    mountLabelsRef.current = sectionLabels
    planetsRef.current?.updateLabels(sectionLabels)
  }, [sectionLabels])

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    />
  )
}
