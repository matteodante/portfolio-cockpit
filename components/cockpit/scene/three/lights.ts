import * as THREE from 'three'

type LightsBundle = {
  /** Primary radial glow from the accretion disc — pulse via `setDiskGlow`. */
  diskLight: THREE.PointLight
  /** Cool "photon ring" kicker that picks out silhouette highlights. */
  ringLight: THREE.PointLight
  /** Apply a [0..1] pulse multiplier to the disc + ring glow. */
  setDiskGlow(pulse: number): void
  dispose(): void
}

const DISK_COLOR = 0xffa060
const RING_COLOR = 0xc7d4ff

// Linear falloff (decay=1) so the disc-lit side of every planet picks up
// a warm rim even at ~95u away, balanced against the neutral sky fill.
const DISK_BASE = 180
const DISK_AMPL = 55
const RING_BASE = 60
const RING_AMPL = 18

export function createLights(scene: THREE.Scene): LightsBundle {
  // Neutral, shadowless fill preserves material colour on the night side.
  // Reuse the existing light budget: no shadow maps or extra light passes.
  const ambient = new THREE.AmbientLight(0xc3d1e6, 0.2)
  const skyFill = new THREE.HemisphereLight(0xf2f4ff, 0x697b94, 0.7)

  // Cold counter-rim (a distant cold star) so silhouettes stay readable
  // on the BH-shadowed side.
  const rim = new THREE.DirectionalLight(0xd7e6ff, 0.9)
  rim.position.set(-45, 65, -110)

  // Accretion-disc PointLight at the origin. `distance: 0` + `decay: 1`
  // gives linear falloff with no hard cutoff — the warm rim reaches
  // every planet in the scene.
  const diskLight = new THREE.PointLight(DISK_COLOR, DISK_BASE, 0, 1)

  // Cool accent slightly above the disc axis — picks out the photon-ring
  // side the shader renders blueish.
  const ringLight = new THREE.PointLight(RING_COLOR, RING_BASE, 0, 1)
  ringLight.position.set(0, 2.5, 0)

  const all = [ambient, skyFill, rim, diskLight, ringLight]
  for (const l of all) scene.add(l)

  return {
    diskLight,
    ringLight,
    setDiskGlow(pulse) {
      const p = Math.max(0, Math.min(1, pulse))
      diskLight.intensity = DISK_BASE + p * DISK_AMPL
      ringLight.intensity = RING_BASE + p * RING_AMPL
    },
    dispose() {
      for (const l of all) scene.remove(l)
    },
  }
}
