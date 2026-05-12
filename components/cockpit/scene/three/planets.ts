import * as THREE from 'three'
import type {
  CockpitSectionId,
  PlanetSection,
} from '@/lib/data/cockpit-sections'
import { disposeSceneGraph } from './dispose-helpers'
import {
  buildLabelTexture,
  loadPlanetTexture,
  PLANET_TEXTURES,
} from './textures'

export type PlanetEntry = {
  group: THREE.Group
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>
  data: PlanetSection
  landMesh: THREE.Mesh | null
  sprite: THREE.Sprite
  spriteMaterial: THREE.SpriteMaterial
  orbit: {
    radius: number
    phase: number
    angularSpeed: number
    y: number
  }
  /** Position at the end of the previous update. A landed player uses the
   *  `group.position - prevPosition` delta to translate with the planet. */
  prevPosition: THREE.Vector3
  /** `group.rotation.y` before the current frame's self-spin was applied —
   *  lets a landed player rotate with the surface instead of sliding on it. */
  prevRotationY: number
}

type PlanetsBundle = {
  planets: PlanetEntry[]
  update(dt: number): void
  updateLabels(labels: Record<CockpitSectionId, string>): void
  dispose(): void
}

function buildPlanet(
  section: PlanetSection,
  textureLoader: THREE.TextureLoader,
  label: string,
  collectTexture: (tex: THREE.Texture) => void
): PlanetEntry {
  const group = new THREE.Group()
  group.position.set(section.pos[0], section.pos[1], section.pos[2])

  const sectionTextures = PLANET_TEXTURES[section.id]
  const colorMap = sectionTextures
    ? loadPlanetTexture(textureLoader, sectionTextures.color)
    : null
  if (colorMap) collectTexture(colorMap)

  const geometry = new THREE.SphereGeometry(section.radius, 48, 32)
  const material = new THREE.MeshStandardMaterial({
    color: section.color,
    emissive: section.emissive,
    emissiveIntensity: 0.12,
    roughness: section.isEarth ? 0.85 : 0.78,
    metalness: 0.08,
    map: colorMap,
  })
  const mesh = new THREE.Mesh(geometry, material)
  group.add(mesh)

  let landMesh: THREE.Mesh | null = null
  if (section.isEarth) {
    const cloudMap = sectionTextures?.clouds
      ? loadPlanetTexture(textureLoader, sectionTextures.clouds)
      : null
    if (cloudMap) collectTexture(cloudMap)

    const cloudGeo = new THREE.SphereGeometry(section.radius * 1.012, 48, 32)
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: cloudMap,
      emissive: 0x8fb7ff,
      emissiveIntensity: 0.06,
      transparent: true,
      opacity: 0.45,
      roughness: 0.95,
      metalness: 0,
      depthWrite: false,
    })
    landMesh = new THREE.Mesh(cloudGeo, cloudMat)
    group.add(landMesh)

    const atmoGeo = new THREE.SphereGeometry(section.radius * 1.08, 32, 24)
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      depthWrite: false,
    })
    group.add(new THREE.Mesh(atmoGeo, atmoMat))
  }

  if (section.ring) {
    const ringGeo = new THREE.RingGeometry(
      section.radius * 1.4,
      section.radius * 1.9,
      64
    )
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x887766,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2 - 0.25
    group.add(ring)
  }

  const labelTex = buildLabelTexture(label)
  const spriteMaterial = new THREE.SpriteMaterial({
    map: labelTex,
    transparent: true,
    depthTest: false,
  })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(12, 3, 1)
  sprite.position.y = section.radius + 4
  group.add(sprite)

  const x = section.pos[0]
  const z = section.pos[2]
  const radius = Math.hypot(x, z)
  const phase = Math.atan2(z, x)
  // Uniform angular speed for every planet — keeps relative angles constant
  // so orbits never cross. One lap ≈ 90s.
  const angularSpeed = (2 * Math.PI) / 90
  const orbit = { radius, phase, angularSpeed, y: section.pos[1] }

  return {
    group,
    mesh,
    data: section,
    landMesh,
    sprite,
    spriteMaterial,
    orbit,
    prevPosition: group.position.clone(),
    prevRotationY: group.rotation.y,
  }
}

type CreatePlanetsOptions = {
  sections: readonly PlanetSection[]
  labels: Record<CockpitSectionId, string>
}

// Build all planets for the given sections, add them to the scene and
// return an update/dispose handle.
export function createPlanets(
  scene: THREE.Scene,
  { sections, labels }: CreatePlanetsOptions
): PlanetsBundle {
  const textureLoader = new THREE.TextureLoader()
  const loadedTextures: THREE.Texture[] = []
  const planets: PlanetEntry[] = []

  for (const section of sections) {
    const label = labels[section.id] ?? section.id
    const entry = buildPlanet(section, textureLoader, label, (tex) =>
      loadedTextures.push(tex)
    )
    scene.add(entry.group)
    planets.push(entry)
  }

  return {
    planets,
    update(dt) {
      for (const p of planets) {
        p.prevRotationY = p.group.rotation.y
        p.prevPosition.copy(p.group.position)
        p.group.rotation.y += dt * 0.08
        if (p.landMesh) p.landMesh.rotation.y += dt * 0.05
        p.orbit.phase += p.orbit.angularSpeed * dt
        p.group.position.set(
          p.orbit.radius * Math.cos(p.orbit.phase),
          p.orbit.y,
          p.orbit.radius * Math.sin(p.orbit.phase)
        )
      }
    },
    updateLabels(next) {
      for (const p of planets) {
        const oldTex = p.spriteMaterial.map
        const newTex = buildLabelTexture(next[p.data.id] ?? p.data.id)
        p.spriteMaterial.map = newTex
        p.spriteMaterial.needsUpdate = true
        if (oldTex) oldTex.dispose()
      }
    },
    dispose() {
      for (const p of planets) {
        scene.remove(p.group)
        disposeSceneGraph(p.group)
        if (p.spriteMaterial.map) p.spriteMaterial.map.dispose()
      }
      for (const tex of loadedTextures) tex.dispose()
    },
  }
}
