import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { updateFollowCamera } from '@/components/cockpit/scene/camera/follow-camera'

test('camera settles at the same rate on 30, 60 and 144 Hz displays', () => {
  const positions = [30, 60, 144].map((hz) => {
    const camera = new THREE.PerspectiveCamera()
    for (let frame = 0; frame < hz; frame++) {
      updateFollowCamera({
        camera,
        position: new THREE.Vector3(10, 0, 20),
        forward: new THREE.Vector3(0, 0, 1),
        up: new THREE.Vector3(0, 1, 0),
        phase: 'flying',
        dt: 1 / hz,
      })
    }
    return camera.position
  })
  expect(positions[0]?.distanceTo(positions[1] as THREE.Vector3)).toBeLessThan(
    0.000001
  )
  expect(positions[0]?.distanceTo(positions[2] as THREE.Vector3)).toBeLessThan(
    0.000001
  )
})
