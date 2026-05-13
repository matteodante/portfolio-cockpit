export type QualityPreset = 'low' | 'mid' | 'high'

export type SceneQuality = {
  preset: QualityPreset
  /** Hard cap for renderer + composer pixel ratio. Lowering this is the
   *  single biggest fragment-cost saving on retina/high-DPR displays. */
  dprMax: number
  /** Iterations of the BH ray-march loop in the fragment shader.
   *  Compile-time only — changing it requires recompiling the shader,
   *  so we only honor it on the initial preset (URL override). */
  bhSteps: number
  bloomEnabled: boolean
  godRaysEnabled: boolean
  /** When false, the BH won't sample lensed planets. Disc + photon ring
   *  still render — only the "scene reflection" effect is dropped. */
  cubemapEnabled: boolean
  /** Per-face cubemap resolution. Compile-time only (recreating the
   *  WebGLCubeRenderTarget at runtime is heavy), so only honored on
   *  the initial preset. */
  cubemapSize: number
}

export const QUALITY_PRESETS: Record<QualityPreset, SceneQuality> = {
  low: {
    preset: 'low',
    dprMax: 1,
    bhSteps: 28,
    bloomEnabled: false,
    godRaysEnabled: false,
    cubemapEnabled: false,
    cubemapSize: 64,
  },
  mid: {
    preset: 'mid',
    dprMax: 1.5,
    bhSteps: 48,
    bloomEnabled: true,
    godRaysEnabled: true,
    cubemapEnabled: true,
    cubemapSize: 128,
  },
  high: {
    preset: 'high',
    dprMax: 2,
    bhSteps: 64,
    bloomEnabled: true,
    godRaysEnabled: true,
    cubemapEnabled: true,
    cubemapSize: 128,
  },
}

const TIER_ORDER: readonly QualityPreset[] = ['high', 'mid', 'low']

/** Initial preset: always `high` unless the user pins one via
 *  `?quality=low|mid|high`. The adaptive monitor in the scene loop
 *  downgrades runtime when measured fps stays below threshold. */
export function getInitialQuality(): SceneQuality {
  if (typeof window === 'undefined') return QUALITY_PRESETS.high
  const override = new URLSearchParams(window.location.search).get('quality')
  if (override === 'low' || override === 'mid' || override === 'high') {
    return QUALITY_PRESETS[override]
  }
  return QUALITY_PRESETS.high
}

/** Returns the next-lower tier, or null when already at the lowest. */
export function nextLowerPreset(current: QualityPreset): QualityPreset | null {
  const idx = TIER_ORDER.indexOf(current)
  if (idx === -1) {
    throw new Error(`Unknown quality preset: ${current}`)
  }
  if (idx === TIER_ORDER.length - 1) return null
  return TIER_ORDER[idx + 1] ?? null
}
