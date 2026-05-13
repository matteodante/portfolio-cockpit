import * as THREE from 'three'

type AsteroidsOptions = {
  count?: number
  innerRadius?: number
  outerRadius?: number
}

type AsteroidState = {
  alive: boolean
  r: number
  // Orthonormal basis of the orbital plane, in world coords.
  u: THREE.Vector3
  v: THREE.Vector3
  phase: number
  angularSpeed: number
  scale: number
  spinAxis: THREE.Vector3
  spinSpeed: number
  // Local tumbling quaternion, advanced each frame.
  spin: THREE.Quaternion
  // Bounding-sphere radius in world units = baseGeoRadius * scale.
  radius: number
}

export type AsteroidsBundle = {
  mesh: THREE.InstancedMesh
  update(dt: number): void
  /** Returns the instance index hit by a sphere at `pos` with `radius`, or -1. */
  checkCollision(pos: THREE.Vector3, radius: number): number
  getPosition(idx: number, target: THREE.Vector3): THREE.Vector3
  hide(idx: number): void
  reset(): void
  dispose(): void
}

// Hash-based radial displacement seeded by the icosphere unit direction,
// so duplicated-per-face vertices keep identical displacement (no seams).
function rockyDisplace(geometry: THREE.BufferGeometry, amount = 0.35): void {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    // Seeded by raw position — identical for all faces sharing this corner.
    const h = Math.abs(
      Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453
    )
    const n = h - Math.floor(h)
    const f = 1 + (n - 0.5) * amount * 2
    pos.setXYZ(i, x * f, y * f, z * f)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
}

function buildAsteroidGeometry(): THREE.BufferGeometry {
  // Detail 1 = 80 faces; enough rocky silhouette without overdraw for 50 instances.
  const geo = new THREE.IcosahedronGeometry(1, 1)
  rockyDisplace(geo, 0.45)
  return geo
}

function randomOrbitBasis(
  state: AsteroidState,
  rng: () => number,
  tiltSpread: number
): void {
  // Tilt axis: mostly near the disc plane (y≈1) but with scatter, so some
  // asteroids arrive from above/below and can surprise the player.
  const tilt = (rng() - 0.5) * tiltSpread
  const yaw = rng() * Math.PI * 2
  const nx = Math.sin(tilt) * Math.cos(yaw)
  const ny = Math.cos(tilt)
  const nz = Math.sin(tilt) * Math.sin(yaw)
  const normal = new THREE.Vector3(nx, ny, nz).normalize()

  // Pick any vector not parallel to normal to derive u.
  const ref =
    Math.abs(normal.y) < 0.9
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0)
  state.u.copy(ref).cross(normal).normalize()
  state.v.copy(normal).cross(state.u).normalize()
}

function seededRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

const _m = new THREE.Matrix4()
const _pos = new THREE.Vector3()
const _scaleV = new THREE.Vector3()
const _qStep = new THREE.Quaternion()
const _zero = new THREE.Vector3(0, 0, 0)

export function createAsteroids(
  scene: THREE.Scene,
  opts: AsteroidsOptions = {}
): AsteroidsBundle {
  const count = opts.count ?? 50
  const innerRadius = opts.innerRadius ?? 12
  const outerRadius = opts.outerRadius ?? 60

  const geometry = buildAsteroidGeometry()
  const material = new THREE.MeshStandardMaterial({
    color: 0x6b5a4a,
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true,
    emissive: 0x120d08,
  })
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  mesh.frustumCulled = false
  mesh.castShadow = false
  mesh.receiveShadow = false
  scene.add(mesh)

  const rng = seededRng(1337)
  const states: AsteroidState[] = []
  for (let i = 0; i < count; i++) {
    const s: AsteroidState = {
      alive: true,
      r: innerRadius + rng() * (outerRadius - innerRadius),
      u: new THREE.Vector3(),
      v: new THREE.Vector3(),
      phase: rng() * Math.PI * 2,
      angularSpeed: 0,
      scale: 0.5 + rng() * 1.6,
      spinAxis: new THREE.Vector3(
        rng() - 0.5,
        rng() - 0.5,
        rng() - 0.5
      ).normalize(),
      spinSpeed: (rng() - 0.5) * 1.6,
      spin: new THREE.Quaternion(),
      radius: 0,
    }
    // Kepler-like: inner orbits faster. k chosen so inner ≈ 0.22 rad/s.
    s.angularSpeed = (rng() < 0.5 ? 1 : -1) * (7.6 / s.r)
    s.radius = s.scale
    randomOrbitBasis(s, rng, 0.9)
    states.push(s)
  }

  const writeMatrix = (i: number, state: AsteroidState): void => {
    if (!state.alive) {
      _m.makeScale(0, 0, 0)
      mesh.setMatrixAt(i, _m)
      return
    }
    const c = Math.cos(state.phase)
    const s = Math.sin(state.phase)
    _pos
      .copy(state.u)
      .multiplyScalar(c * state.r)
      .addScaledVector(state.v, s * state.r)
    _scaleV.setScalar(state.scale)
    _m.compose(_pos, state.spin, _scaleV)
    mesh.setMatrixAt(i, _m)
  }

  // Seed the first frame so nothing pops from the origin on first render.
  for (let i = 0; i < count; i++) writeMatrix(i, states[i] as AsteroidState)
  mesh.instanceMatrix.needsUpdate = true

  const _target = new THREE.Vector3()

  return {
    mesh,
    update(dt) {
      for (let i = 0; i < count; i++) {
        const st = states[i] as AsteroidState
        if (!st.alive) continue
        st.phase += st.angularSpeed * dt
        _qStep.setFromAxisAngle(st.spinAxis, st.spinSpeed * dt)
        st.spin.multiplyQuaternions(_qStep, st.spin)
        writeMatrix(i, st)
      }
      mesh.instanceMatrix.needsUpdate = true
    },
    checkCollision(pos, playerRadius) {
      for (let i = 0; i < count; i++) {
        const st = states[i] as AsteroidState
        if (!st.alive) continue
        const c = Math.cos(st.phase)
        const s = Math.sin(st.phase)
        _target
          .copy(st.u)
          .multiplyScalar(c * st.r)
          .addScaledVector(st.v, s * st.r)
        const dx = _target.x - pos.x
        const dy = _target.y - pos.y
        const dz = _target.z - pos.z
        const sum = st.radius + playerRadius
        if (dx * dx + dy * dy + dz * dz < sum * sum) return i
      }
      return -1
    },
    getPosition(idx, target) {
      const st = states[idx] as AsteroidState | undefined
      if (!st) return target.copy(_zero)
      const c = Math.cos(st.phase)
      const s = Math.sin(st.phase)
      return target
        .copy(st.u)
        .multiplyScalar(c * st.r)
        .addScaledVector(st.v, s * st.r)
    },
    hide(idx) {
      const st = states[idx] as AsteroidState | undefined
      if (!st) return
      st.alive = false
      _m.makeScale(0, 0, 0)
      mesh.setMatrixAt(idx, _m)
      mesh.instanceMatrix.needsUpdate = true
    },
    reset() {
      for (let i = 0; i < count; i++) {
        const st = states[i] as AsteroidState
        st.alive = true
        writeMatrix(i, st)
      }
      mesh.instanceMatrix.needsUpdate = true
    },
    dispose() {
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
      mesh.dispose()
    },
  }
}
