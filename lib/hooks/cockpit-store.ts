import { create } from 'zustand'
import type { CockpitSectionId } from '@/lib/data/cockpit-sections'
import type { PlayerPhase } from '@/lib/types/player'

export type { PlayerPhase }

type HudState = {
  speed: number
  coords: readonly [number, number]
  gravity: number
  landed: boolean
  phase: PlayerPhase
  nearestId: CockpitSectionId | null
  /** Radians every planet has swept along its orbit, quantized by the
   *  writer. The mini radar rotates its static blip positions by it. */
  orbitAngle: number
}

const initialHud: HudState = {
  speed: 0,
  coords: [0, 0],
  gravity: 0,
  landed: false,
  phase: 'flying',
  nearestId: null,
  orbitAngle: 0,
}

/**
 * HUD store consumed by the chrome panels.
 *
 * The Three.js scene mutates this every frame from outside React.
 * Components subscribe to the slices they read. Direct subscribers
 * trigger renders only when the slice they read actually changes,
 * which is why writes go through {@link setHud} (which diffs first)
 * instead of `useHud.setState`.
 */
export const useHud = create<HudState>(() => initialHud)

const rawSet = useHud.setState

/**
 * Diff-then-write update for the HUD store.
 *
 * Called every frame from the RAF loop in `build-world.ts`.
 * Skipping the write when nothing changed is load-bearing for
 * performance — without it the scene would re-render React 60 times
 * per second even on a static frame.
 *
 * Use this instead of `useHud.setState`.
 */
export const setHud = (patch: Partial<HudState>): void => {
  const current = useHud.getState()
  const next = { ...patch }
  if (next.coords) {
    const [px, pz] = current.coords
    const [nx, nz] = next.coords
    // Re-use the previous tuple when equal, otherwise the fresh array
    // written alongside any other changed gauge (e.g. `orbitAngle`)
    // would re-render every `coords` subscriber on each orbit tick.
    if (px === nx && pz === nz) next.coords = current.coords
  }
  let dirty = false
  for (const key of Object.keys(next) as Array<keyof HudState>) {
    const value = next[key]
    if (value === undefined) continue
    if (current[key] !== value) {
      dirty = true
      break
    }
  }
  if (dirty) rawSet(next as HudState)
}

/** Reset the HUD to the initial state. Called when the scene tears down. */
export const resetHud = (): void => {
  rawSet(initialHud)
}
