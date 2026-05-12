import * as THREE from 'three'

const PARTICLE_LIFE = 0.6
const EMIT_CHANCE = 0.6
const SPAWN_OFFSET_BACK = 0.7
const SPAWN_OFFSET_UP = 0.2
const SPAWN_JITTER = 0.3
const MIN_SPEED = 1
const FADE_MULT = 1.5
const SHRINK = 0.95
const MAX_PARTICLES = 96

type Particle = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
  life: number
}

type ThrusterBundle = {
  material: THREE.MeshBasicMaterial
  update(
    dt: number,
    opts: {
      flying: boolean
      speed: number
      position: THREE.Vector3
      forward: THREE.Vector3
      up: THREE.Vector3
    }
  ): void
  setAccent(color: THREE.Color): void
  dispose(): void
}

export function createThrusters(
  scene: THREE.Scene,
  accentHex: string
): ThrusterBundle {
  const accentColor = new THREE.Color(accentHex)
  const geometry = new THREE.SphereGeometry(0.15, 6, 4)
  const material = new THREE.MeshBasicMaterial({
    color: accentColor.clone(),
    transparent: true,
    opacity: 0.8,
  })
  const particles: Particle[] = []
  const _offset = new THREE.Vector3()

  const spawn = (
    position: THREE.Vector3,
    forward: THREE.Vector3,
    up: THREE.Vector3
  ): Particle => {
    const pMat = material.clone()
    pMat.opacity = 0.9
    const pMesh = new THREE.Mesh(geometry, pMat)
    _offset.copy(forward).multiplyScalar(-SPAWN_OFFSET_BACK)
    pMesh.position
      .copy(position)
      .add(_offset)
      .addScaledVector(up, SPAWN_OFFSET_UP)
    pMesh.position.x += (Math.random() - 0.5) * SPAWN_JITTER
    pMesh.position.y += (Math.random() - 0.5) * SPAWN_JITTER
    pMesh.position.z += (Math.random() - 0.5) * SPAWN_JITTER
    scene.add(pMesh)
    return { mesh: pMesh, life: PARTICLE_LIFE }
  }

  const removeAt = (i: number) => {
    const p = particles[i]
    if (!p) return
    scene.remove(p.mesh)
    p.mesh.material.dispose()
    // Swap-and-pop: O(1) removal without shifting the tail.
    const last = particles.length - 1
    if (i !== last) particles[i] = particles[last] as Particle
    particles.pop()
  }

  return {
    material,
    update(dt, { flying, speed, position, forward, up }) {
      if (
        flying &&
        speed > MIN_SPEED &&
        particles.length < MAX_PARTICLES &&
        Math.random() < EMIT_CHANCE
      ) {
        particles.push(spawn(position, forward, up))
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        if (!p) continue
        p.life -= dt
        p.mesh.material.opacity = Math.max(0, p.life * FADE_MULT)
        p.mesh.scale.multiplyScalar(SHRINK)
        if (p.life <= 0) removeAt(i)
      }
    },
    setAccent(color) {
      material.color.copy(color)
      material.needsUpdate = true
    },
    dispose() {
      for (const p of particles) {
        scene.remove(p.mesh)
        p.mesh.material.dispose()
      }
      particles.length = 0
      geometry.dispose()
      material.dispose()
    },
  }
}
