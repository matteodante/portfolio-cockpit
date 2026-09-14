import { describe, expect, test } from 'bun:test'
import * as THREE from 'three'
import { createThrusters } from '@/components/cockpit/scene/player/thrusters'

function runFlight(hz: number) {
  const scene = new THREE.Scene()
  const thrusters = createThrusters(scene, '#ff6b35')
  const input = {
    flying: true,
    speed: 20,
    position: new THREE.Vector3(),
    forward: new THREE.Vector3(0, 0, 1),
    up: new THREE.Vector3(0, 1, 0),
  }
  const original = scene.children[0] as THREE.Points
  for (let frame = 0; frame < hz * 2; frame++) {
    input.position.z = (frame * input.speed) / hz
    thrusters.update(1 / hz, input)
  }
  return { scene, thrusters, input, original }
}

describe('pooled jet trail', () => {
  test('continuous flight keeps one bounded GPU object and releases it', () => {
    const { scene, thrusters, original } = runFlight(144)
    expect(scene.children).toEqual([original])
    expect(original.visible).toBe(true)
    expect(
      original.geometry.getAttribute('position').count
    ).toBeLessThanOrEqual(64)
    const sizes = original.geometry.getAttribute('particleSize').array
    expect([...sizes].every(Number.isFinite)).toBe(true)
    thrusters.dispose()
    expect(scene.children).toHaveLength(0)
  })

  test('emission density stays consistent across 30, 60 and 144 Hz', () => {
    const counts = [30, 60, 144].map((hz) => {
      const { thrusters, original } = runFlight(hz)
      const sizes = original.geometry.getAttribute('particleSize').array
      const alive = [...sizes].filter((size) => size > 0.001).length
      thrusters.dispose()
      return alive
    })
    expect(Math.min(...counts)).toBeGreaterThan(30)
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(2)
  })

  test('stopping flight drains the trail and removes its draw', () => {
    const { thrusters, input, original } = runFlight(60)
    input.flying = false
    for (let frame = 0; frame < 60; frame++) thrusters.update(1 / 60, input)
    expect(original.visible).toBe(false)
    thrusters.dispose()
  })
})
