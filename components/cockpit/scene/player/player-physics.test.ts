import { expect, spyOn, test } from 'bun:test'
import * as THREE from 'three'
import {
  beginTransition,
  createPlayerState,
  stepTransition,
} from '@/components/cockpit/scene/player/player-physics'
import type { PlanetEntry } from '@/components/cockpit/scene/three/planets'
import { SECTIONS } from '@/lib/data/cockpit-sections'

function planetFixture(): PlanetEntry {
  const data = SECTIONS[0]
  if (!data) throw new Error('A planet is required for the landing test')
  return {
    data,
    group: new THREE.Group(),
    mesh: new THREE.Mesh(
      new THREE.SphereGeometry(data.radius),
      new THREE.MeshStandardMaterial()
    ),
    sprite: new THREE.Sprite(),
    spriteMaterial: new THREE.SpriteMaterial(),
    landMesh: null,
    orbit: { radius: 0, phase: 0, angularSpeed: 0, y: 0 },
    prevPosition: new THREE.Vector3(),
    prevRotationY: 0,
  }
}

test('landing and takeoff preserve progress across a long menu pause', () => {
  const planet = planetFixture()
  const clock = spyOn(performance, 'now').mockReturnValue(1_000)
  try {
    for (const target of ['landed', 'flying'] as const) {
      const state = createPlayerState(
        new THREE.Vector3(0, planet.data.radius + 5, 0)
      )
      beginTransition(state, target, planet)
      expect(stepTransition(state, 0.25)).toBe(false)
      const pausedPosition = state.position.clone()
      clock.mockReturnValue(61_000)
      expect(stepTransition(state, 0)).toBe(false)
      expect(state.position.equals(pausedPosition)).toBe(true)
      expect(stepTransition(state, 0.25)).toBe(false)
      expect(stepTransition(state, 0.25)).toBe(true)
      expect(state.phase).toBe(target)
    }
  } finally {
    clock.mockRestore()
    planet.mesh.geometry.dispose()
    planet.mesh.material.dispose()
    planet.sprite.material.dispose()
    planet.spriteMaterial.dispose()
  }
})
