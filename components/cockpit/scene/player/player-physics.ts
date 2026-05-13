import * as THREE from 'three'
import type { PlanetSection } from '@/lib/data/cockpit-sections'
import type { PlayerPhase } from '@/lib/types/player'
import type { PlanetEntry } from '../three/planets'
import {
  ACCEL_FLY,
  BH_GRAV_RADIUS,
  BH_GRAV_STRENGTH,
  COLLISION_EXTRA,
  DRAG_TANG,
  LAND_DIST_EXTRA,
  LAND_GAP,
  LAND_VEL_MAX,
  RUN_MULT,
  TAKEOFF_BOOST,
  TAKEOFF_CLEARANCE,
  TRANS_DURATION,
  TURN_RATE_FLY,
  TURN_RATE_LANDED,
  VMAX_FLY,
  WALK_SPEED,
} from './player-constants'

export type PlayerState = {
  position: THREE.Vector3
  velocity: THREE.Vector3
  up: THREE.Vector3
  forward: THREE.Vector3
  phase: PlayerPhase
  nearestPlanet: PlanetEntry | null
  transitionStart: number
  transitionFromPos: THREE.Vector3
  transitionToPos: THREE.Vector3
  transitionFromUp: THREE.Vector3
  transitionToUp: THREE.Vector3
  transitionTarget: 'flying' | 'landed'
  transitionPlanet: PlanetEntry | null
  /** Target offset relative to the transition planet's current center, so the
   *  lerp destination tracks the planet as it orbits the black hole. */
  transitionToOffset: THREE.Vector3
  /** Magnitude of the BH gravity vector applied during the last `stepFlight`
   *  call (0 when outside `BH_GRAV_RADIUS` or in another phase). Drives the
   *  HUD gravity gauge. */
  lastGravity: number
}

export type PlayerInput = {
  forward: boolean
  back: boolean
  turnLeft: boolean
  turnRight: boolean
  run: boolean
}

export type NearestLocked = {
  nearest: PlanetEntry | null
  locked: PlanetSection | null
}

const WORLD_UP = new THREE.Vector3(0, 1, 0)
const LOCK_SURFACE_DIST = 14

const _nearestResult: NearestLocked = { nearest: null, locked: null }
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _c = new THREE.Vector3()
const _accel = new THREE.Vector3()

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

export function createPlayerState(
  startPos = new THREE.Vector3(0, 0, -114)
): PlayerState {
  return {
    position: startPos.clone(),
    velocity: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    forward: new THREE.Vector3(0, 0, 1),
    phase: 'flying',
    nearestPlanet: null,
    transitionStart: 0,
    transitionFromPos: new THREE.Vector3(),
    transitionToPos: new THREE.Vector3(),
    transitionFromUp: new THREE.Vector3(),
    transitionToUp: new THREE.Vector3(),
    transitionTarget: 'flying',
    transitionPlanet: null,
    transitionToOffset: new THREE.Vector3(),
    lastGravity: 0,
  }
}

/** Keep `forward` strictly tangential to `up` and unit length. */
export function projectForwardOntoUp(state: PlayerState): void {
  const fu = state.forward.dot(state.up)
  if (Math.abs(fu) > 0.0001) {
    state.forward.addScaledVector(state.up, -fu).normalize()
  }
  if (state.forward.lengthSq() < 0.0001) {
    if (Math.abs(state.up.x) < 0.9) state.forward.set(1, 0, 0)
    else state.forward.set(0, 1, 0)
    state.forward
      .addScaledVector(state.up, -state.forward.dot(state.up))
      .normalize()
  }
}

export function lerpUpToWorld(state: PlayerState, lerpFactor: number): void {
  state.up.lerp(WORLD_UP, lerpFactor).normalize()
}

/** Nearest planet (by center) and currently locked section (within surface distance). */
export function updateNearestLocked(
  state: PlayerState,
  planets: readonly PlanetEntry[]
): NearestLocked {
  let nearest: PlanetEntry | null = null
  let nearestDist = Number.POSITIVE_INFINITY
  let locked: PlanetSection | null = null
  let lockedSurfaceDist = Number.POSITIVE_INFINITY
  // biome-ignore lint/style/useForOf: hot path — avoid iterator allocation
  for (let i = 0; i < planets.length; i++) {
    const p = planets[i] as PlanetEntry
    const d = state.position.distanceTo(p.group.position)
    if (d < nearestDist) {
      nearestDist = d
      nearest = p
    }
    const sd = d - p.data.radius
    if (sd < LOCK_SURFACE_DIST && sd < lockedSurfaceDist) {
      lockedSurfaceDist = sd
      locked = p.data
    }
  }
  state.nearestPlanet = nearest
  _nearestResult.nearest = nearest
  _nearestResult.locked = locked
  return _nearestResult
}

export function beginTransition(
  state: PlayerState,
  target: 'flying' | 'landed',
  planet: PlanetEntry
): void {
  state.phase = 'transitioning'
  state.transitionStart = performance.now()
  state.transitionTarget = target
  state.transitionPlanet = planet
  state.transitionFromPos.copy(state.position)
  state.transitionFromUp.copy(state.up)

  _a.copy(state.position).sub(planet.group.position)
  const d = _a.length() || 0.0001
  _a.multiplyScalar(1 / d)

  if (target === 'landed') {
    state.transitionToOffset
      .copy(_a)
      .multiplyScalar(planet.data.radius + LAND_GAP)
    state.transitionToPos
      .copy(planet.group.position)
      .add(state.transitionToOffset)
    state.transitionToUp.copy(_a)
    return
  }

  // Takeoff: land in the planets' flight plane (world-up tangent).
  _b.copy(_a).addScaledVector(WORLD_UP, -_a.dot(WORLD_UP))
  if (_b.lengthSq() < 0.0001) {
    _b.copy(state.forward).addScaledVector(
      WORLD_UP,
      -state.forward.dot(WORLD_UP)
    )
  }
  if (_b.lengthSq() < 0.0001) _b.set(1, 0, 0)
  _b.normalize()
  state.transitionToOffset
    .copy(_b)
    .multiplyScalar(planet.data.radius + LAND_GAP + TAKEOFF_CLEARANCE)
  state.transitionToPos
    .copy(planet.group.position)
    .add(state.transitionToOffset)
  state.transitionToUp.copy(WORLD_UP)
}

/** Returns true if a landing was initiated. */
export function tryLand(state: PlayerState): boolean {
  const nearest = state.nearestPlanet
  if (!nearest) return false
  const center = nearest.group.position
  _a.copy(state.position).sub(center)
  const d = _a.length()
  const surfaceDist = d - nearest.data.radius
  if (surfaceDist > LAND_DIST_EXTRA) return false

  _b.copy(state.velocity)
  if (d > 0.0001) {
    _c.copy(_a).multiplyScalar(1 / d)
    const vRadial = _b.dot(_c)
    if (Math.abs(vRadial) > LAND_VEL_MAX) return false
  }
  beginTransition(state, 'landed', nearest)
  return true
}

/** Returns true if a takeoff was initiated. */
export function tryTakeoff(state: PlayerState): boolean {
  const planet = state.nearestPlanet
  if (!planet) return false
  beginTransition(state, 'flying', planet)

  // Seed planar velocity so post-takeoff flight stays on planet plane.
  _a.copy(state.forward).addScaledVector(WORLD_UP, -state.forward.dot(WORLD_UP))
  if (_a.lengthSq() < 0.0001) {
    _a.copy(state.position).sub(planet.group.position)
    _a.addScaledVector(WORLD_UP, -_a.dot(WORLD_UP))
  }
  if (_a.lengthSq() < 0.0001) _a.set(1, 0, 0)
  state.velocity.copy(_a.normalize()).multiplyScalar(TAKEOFF_BOOST)
  return true
}

function turn(
  state: PlayerState,
  input: PlayerInput,
  dt: number,
  rate: number
): void {
  const dir = (input.turnRight ? 1 : 0) - (input.turnLeft ? 1 : 0)
  if (dir === 0) return
  const ang = -dir * rate * dt
  const cos = Math.cos(ang)
  const sin = Math.sin(ang)
  _a.copy(state.forward)
  _b.crossVectors(state.up, _a)
  state.forward
    .copy(_a)
    .multiplyScalar(cos)
    .addScaledVector(_b, sin)
    .normalize()
  projectForwardOntoUp(state)
}

/** Flight physics. May initiate a landing on collision. */
export function stepFlight(
  state: PlayerState,
  input: PlayerInput,
  dt: number,
  planets: readonly PlanetEntry[]
): void {
  turn(state, input, dt, TURN_RATE_FLY)

  _accel.set(0, 0, 0)
  if (input.forward) _accel.addScaledVector(state.forward, ACCEL_FLY)
  if (input.back) _accel.addScaledVector(state.forward, -ACCEL_FLY * 0.7)

  // Black hole gravity: radial pull toward the origin with 1/d^2 falloff,
  // gated to BH_GRAV_RADIUS so distant flight is unaffected.
  const distBh = state.position.length()
  if (distBh < BH_GRAV_RADIUS && distBh > 0.0001) {
    const g = BH_GRAV_STRENGTH / Math.max(distBh * distBh, 1)
    _accel.addScaledVector(state.position, -g / distBh)
    state.lastGravity = g
  } else {
    state.lastGravity = 0
  }

  state.velocity.addScaledVector(_accel, dt)
  state.velocity.multiplyScalar(DRAG_TANG ** (dt * 60))

  const speed = state.velocity.length()
  if (speed > VMAX_FLY) state.velocity.multiplyScalar(VMAX_FLY / speed)

  state.position.addScaledVector(state.velocity, dt)

  // Hard collision triggers an immediate landing.
  for (const p of planets) {
    _a.copy(state.position).sub(p.group.position)
    const d = _a.length()
    const minR = p.data.radius + COLLISION_EXTRA
    if (d < minR) {
      const d1 = d || 0.0001
      _a.multiplyScalar(1 / d1)
      state.position.copy(p.group.position).addScaledVector(_a, minR)
      state.velocity.set(0, 0, 0)
      beginTransition(state, 'landed', p)
      break
    }
  }
}

/** Walking on the planet surface. Pins the player to `nearest`. */
export function stepLanded(
  state: PlayerState,
  input: PlayerInput,
  dt: number,
  nearest: PlanetEntry
): void {
  // Follow the planet as a rigid body: rotate the player's local offset by
  // the planet's self-spin and translate it by the orbital step, so the
  // surface never slides under the astronaut's feet.
  const dSpin = nearest.group.rotation.y - nearest.prevRotationY
  _a.copy(state.position).sub(nearest.prevPosition)
  _a.applyAxisAngle(WORLD_UP, dSpin)
  state.position.copy(nearest.group.position).add(_a)
  state.forward.applyAxisAngle(WORLD_UP, dSpin)

  turn(state, input, dt, TURN_RATE_LANDED)

  const walk = input.run ? WALK_SPEED * RUN_MULT : WALK_SPEED
  let moveScale = 0
  if (input.forward) moveScale += 1
  if (input.back) moveScale -= 0.7

  if (moveScale !== 0) {
    state.velocity.copy(state.forward).multiplyScalar(walk * moveScale)
  } else {
    state.velocity.set(0, 0, 0)
  }

  state.position.addScaledVector(state.velocity, dt)

  _a.copy(state.position).sub(nearest.group.position)
  const d = _a.length() || 0.0001
  _a.multiplyScalar(1 / d)
  state.position
    .copy(nearest.group.position)
    .addScaledVector(_a, nearest.data.radius + LAND_GAP)
  state.up.copy(_a)
  projectForwardOntoUp(state)
}

/** Animate land/takeoff lerp. Returns true when the transition finishes. */
export function stepTransition(state: PlayerState, now: number): boolean {
  const elapsed = (now - state.transitionStart) / 1000
  const t = THREE.MathUtils.clamp(elapsed / TRANS_DURATION, 0, 1)
  const e = easeInOutCubic(t)

  // Track the (possibly moving) planet so the lerp target stays aligned
  // with its surface even while it orbits.
  if (state.transitionPlanet) {
    state.transitionToPos
      .copy(state.transitionPlanet.group.position)
      .add(state.transitionToOffset)
  }

  state.position.lerpVectors(state.transitionFromPos, state.transitionToPos, e)
  state.up
    .copy(state.transitionFromUp)
    .lerp(state.transitionToUp, e)
    .normalize()

  projectForwardOntoUp(state)

  if (t < 1) return false

  state.phase = state.transitionTarget
  if (state.phase === 'landed' && state.transitionPlanet) {
    state.velocity.set(0, 0, 0)
    const p = state.transitionPlanet
    _a.copy(state.position).sub(p.group.position)
    const d = _a.length() || 0.0001
    _a.multiplyScalar(1 / d)
    state.position
      .copy(p.group.position)
      .addScaledVector(_a, p.data.radius + LAND_GAP)
    state.up.copy(_a)
  }
  state.transitionPlanet = null
  return true
}
