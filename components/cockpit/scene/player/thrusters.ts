import * as THREE from 'three'

const MAX_PARTICLES = 64
const PARTICLE_LIFE = 0.6
const PAIRS_PER_SECOND = 30
const SIDES = [-1, 1] as const

type ThrusterInput = {
  flying: boolean
  speed: number
  position: THREE.Vector3
  forward: THREE.Vector3
  up: THREE.Vector3
}

/** Both jets share one bounded pool and one draw, with no per-frame
 *  objects, materials, textures or geometry allocations. */
export function createThrusters(scene: THREE.Scene, accentHex: string) {
  const positions = new Float32Array(MAX_PARTICLES * 3)
  const sizes = new Float32Array(MAX_PARTICLES)
  const lives = new Float32Array(MAX_PARTICLES)
  const geometry = new THREE.BufferGeometry()
  const positionAttribute = new THREE.BufferAttribute(positions, 3).setUsage(
    THREE.DynamicDrawUsage
  )
  const sizeAttribute = new THREE.BufferAttribute(sizes, 1).setUsage(
    THREE.DynamicDrawUsage
  )
  geometry.setAttribute('position', positionAttribute)
  geometry.setAttribute('particleSize', sizeAttribute)
  const color = new THREE.Color(accentHex)
  const viewportHeight = { value: 1 }
  const material = new THREE.ShaderMaterial({
    uniforms: { accent: { value: color }, viewportHeight },
    vertexShader: `
      attribute float particleSize;
      uniform float viewportHeight;
      varying float vLife;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = clamp(particleSize * projectionMatrix[1][1]
          * viewportHeight * 0.5 / max(0.1, -viewPosition.z), 0.0, 32.0);
        vLife = particleSize / 0.42;
      }`,
    fragmentShader: `
      uniform vec3 accent;
      varying float vLife;
      #include <common>
      void main() {
        float radius = length(gl_PointCoord - 0.5) * 2.0;
        float glow = 1.0 - smoothstep(0.05, 1.0, radius);
        float core = 1.0 - smoothstep(0.0, 0.4, radius);
        gl_FragColor = vec4(mix(accent, vec3(1.0, 0.88, 0.62), core),
          glow * glow * vLife * 0.8);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  points.visible = false
  const viewport = new THREE.Vector4()
  points.onBeforeRender = (renderer) => {
    viewportHeight.value = renderer.getCurrentViewport(viewport).w
    material.uniformsNeedUpdate = true
  }
  scene.add(points)

  const previous = new THREE.Vector3()
  const source = new THREE.Vector3()
  const right = new THREE.Vector3()
  let cursor = 0
  let emission = 0
  let emitting = false

  return {
    update(dt: number, input: ThrusterInput) {
      let alive = false
      for (let i = 0; i < MAX_PARTICLES; i++) {
        lives[i] = Math.max(0, (lives[i] ?? 0) - dt)
        sizes[i] = 0.42 * ((lives[i] ?? 0) / PARTICLE_LIFE) ** 1.4
        if ((lives[i] ?? 0) > 0) alive = true
      }
      const active = input.flying && input.speed > 1
      if (!emitting) previous.copy(input.position)
      if (active) {
        emission += dt * PAIRS_PER_SECOND
        const pairs = Math.floor(emission)
        emission -= pairs
        right.crossVectors(input.forward, input.up).normalize()
        for (let pair = 0; pair < pairs; pair++) {
          source
            .lerpVectors(previous, input.position, (pair + 1) / pairs)
            .addScaledVector(input.forward, -0.55)
            .addScaledVector(input.up, 0.6)
          for (const side of SIDES) {
            const offset = cursor * 3
            positions[offset] = source.x + right.x * side * 0.25
            positions[offset + 1] = source.y + right.y * side * 0.25
            positions[offset + 2] = source.z + right.z * side * 0.25
            lives[cursor] = PARTICLE_LIFE
            sizes[cursor] = 0.42
            cursor = (cursor + 1) % MAX_PARTICLES
            alive = true
          }
        }
      } else {
        emission = 0
      }
      previous.copy(input.position)
      emitting = active
      points.visible = alive
      if (alive) {
        positionAttribute.needsUpdate = true
        sizeAttribute.needsUpdate = true
      }
    },
    setAccent(value: THREE.Color) {
      color.copy(value)
    },
    dispose() {
      scene.remove(points)
      geometry.dispose()
      material.dispose()
    },
  }
}
