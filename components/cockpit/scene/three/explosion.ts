import * as THREE from 'three'

const PARTICLE_COUNT = 40
const LIFE = 1.1
const BURST_SPEED = 18

type Particle = {
  alive: boolean
  life: number
  vel: THREE.Vector3
}

export type ExplosionBundle = {
  points: THREE.Points
  spawn(pos: THREE.Vector3): void
  update(dt: number): void
  dispose(): void
}

export function createExplosion(scene: THREE.Scene): ExplosionBundle {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
    alive: false,
    life: 0,
    vel: new THREE.Vector3(),
  }))

  // Hide all particles by zeroing color (additive blending → invisible).
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    colors[i * 3] = 0
    colors[i * 3 + 1] = 0
    colors[i * 3 + 2] = 0
  }
  ;(geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true

  return {
    points,
    spawn(pos) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i] as Particle
        p.alive = true
        p.life = LIFE
        // Random direction on unit sphere.
        const theta = Math.random() * Math.PI * 2
        const cosPhi = 2 * Math.random() - 1
        const sinPhi = Math.sqrt(1 - cosPhi * cosPhi)
        const speed = BURST_SPEED * (0.5 + Math.random() * 0.9)
        p.vel.set(
          sinPhi * Math.cos(theta) * speed,
          sinPhi * Math.sin(theta) * speed,
          cosPhi * speed
        )
        positions[i * 3] = pos.x
        positions[i * 3 + 1] = pos.y
        positions[i * 3 + 2] = pos.z
        // Warm ember gradient.
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.75
        colors[i * 3 + 2] = 0.35
      }
      ;(geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
        true
      ;(geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
    },
    update(dt) {
      let anyAlive = false
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i] as Particle
        if (!p.alive) continue
        anyAlive = true
        p.life -= dt
        if (p.life <= 0) {
          p.alive = false
          colors[i * 3] = 0
          colors[i * 3 + 1] = 0
          colors[i * 3 + 2] = 0
          continue
        }
        const ix = i * 3
        positions[ix] = (positions[ix] as number) + p.vel.x * dt
        positions[ix + 1] = (positions[ix + 1] as number) + p.vel.y * dt
        positions[ix + 2] = (positions[ix + 2] as number) + p.vel.z * dt
        // Slow down (exponential drag) so particles ease out.
        p.vel.multiplyScalar(0.92 ** (dt * 60))
        const k = p.life / LIFE
        const fade = k * k
        colors[i * 3] = 1.0 * fade
        colors[i * 3 + 1] = 0.75 * fade
        colors[i * 3 + 2] = 0.35 * fade
      }
      if (anyAlive) {
        ;(geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
          true
        ;(geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
      }
    },
    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    },
  }
}
