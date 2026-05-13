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
// a clearly warm rim even at ~95u away. With intensity 60, a planet at
// d=90 receives 60/90 ≈ 0.67 — comparable to a direct-sun kick.
const DISK_BASE = 450
const DISK_AMPL = 140
const RING_BASE = 110
const RING_AMPL = 40

export function createLights(scene: THREE.Scene): LightsBundle {
  // Ambient + hemi global fill so the BH-shadowed side of planets stays
  // visible and the overall scene reads brighter. Higher than the
  // previous tuning at the cost of slightly less BH-driven contrast.
  const ambient = new THREE.AmbientLight(0x1a2030, 0.4)
  const skyFill = new THREE.HemisphereLight(0x9fb8e8, 0x0f1018, 0.32)

  // Cold counter-rim (a distant cold star) so silhouettes stay readable
  // on the BH-shadowed side.
  const rim = new THREE.DirectionalLight(0x6688ff, 0.55)
  rim.position.set(-50, 18, -60)

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
