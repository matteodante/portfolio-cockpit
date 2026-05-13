import * as THREE from 'three'
import type { PlayerPhase } from '@/lib/types/player'
import {
  CAM_BACK_FLY,
  CAM_BACK_LANDED,
  CAM_HEIGHT_FLY,
  CAM_HEIGHT_LANDED,
  CAM_LOOK_OFFSET,
  CAM_POS_LERP_FLY,
  CAM_POS_LERP_LANDED,
  CAM_UP_LERP,
} from './camera-constants'

const WORLD_UP = new THREE.Vector3(0, 1, 0)

// Reused scratch vectors.
const _target = new THREE.Vector3()
const _up = new THREE.Vector3()
const _look = new THREE.Vector3()

type FollowParams = {
  camera: THREE.PerspectiveCamera
  position: THREE.Vector3
  forward: THREE.Vector3
  up: THREE.Vector3
  phase: PlayerPhase
}

/**
 * Third-person follow rig: camera sits behind + above the player, smoothly
 * interpolated, with its `up` vector blending to the player's up so the
 * image stays upright during land/takeoff transitions.
 */
export function updateFollowCamera({
  camera,
  position,
  forward,
  up,
  phase,
}: FollowParams): void {
  const height = phase === 'landed' ? CAM_HEIGHT_LANDED : CAM_HEIGHT_FLY
  const back = phase === 'landed' ? CAM_BACK_LANDED : CAM_BACK_FLY
  const posLerp = phase === 'landed' ? CAM_POS_LERP_LANDED : CAM_POS_LERP_FLY

  _target
    .copy(position)
    .addScaledVector(up, height)
    .addScaledVector(forward, -back)
  camera.position.lerp(_target, posLerp)

  _up.copy(camera.up).lerp(up, CAM_UP_LERP).normalize()
  camera.up.copy(_up.lengthSq() > 0.0001 ? _up : WORLD_UP)

  _look.copy(position).addScaledVector(up, CAM_LOOK_OFFSET)
  camera.lookAt(_look)
}
