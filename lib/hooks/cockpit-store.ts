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
}

const initialHud: HudState = {
  speed: 0,
  coords: [0, 0],
  gravity: 0,
  landed: false,
  phase: 'flying',
  nearestId: null,
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
 * Called every frame from the RAF loop in `cockpit-scene.tsx`.
 * Skipping the write when nothing changed is load-bearing for
 * performance — without it the scene would re-render React 60 times
 * per second even on a static frame.
 *
 * Use this instead of `useHud.setState`.
 */
export const setHud = (patch: Partial<HudState>): void => {
  const current = useHud.getState()
  let dirty = false
  for (const key of Object.keys(patch) as Array<keyof HudState>) {
    const next = patch[key]
    if (next === undefined) continue
    const prev = current[key]
    if (key === 'coords') {
      const p = prev as readonly [number, number]
      const n = next as readonly [number, number]
      if (p[0] !== n[0] || p[1] !== n[1]) {
        dirty = true
        break
      }
    } else if (prev !== next) {
      dirty = true
      break
    }
  }
  if (dirty) rawSet(patch as HudState)
}

/** Reset the HUD to the initial state. Called when the scene tears down. */
export const resetHud = (): void => {
  rawSet(initialHud)
}
