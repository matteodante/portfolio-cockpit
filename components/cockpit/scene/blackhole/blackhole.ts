import * as THREE from 'three'
import { BLACK_HOLE_DEFAULTS, type BlackHoleConfig } from './blackhole-config'
import { BLACK_HOLE_FRAG, BLACK_HOLE_VERT } from './blackhole-shader'

type BlackHoleOptions = {
  /** Cubemap face resolution in pixels. Halving this is a 4× saving on
   *  the per-frame extra render that feeds planet lensing. */
  cubemapSize?: number
  /** Number of iterations of the disc raymarch loop in the fragment
   *  shader. Lower = grainier disc, cheaper fragment cost. */
  bhSteps?: number
}

type UniformRec = {
  resolution: { value: THREE.Vector2 }
  time: { value: number }
  camPos: { value: THREE.Vector3 }
  camBasis: { value: THREE.Matrix3 }
  bhMass: { value: number }
  diskInner: { value: number }
  diskOuter: { value: number }
  diskTilt: { value: number }
  diskBrightness: { value: number }
  diskRotSpeed: { value: number }
  maxRayDistance: { value: number }
  stepSize: { value: number }
  lensingStrength: { value: number }
  sceneCube: { value: THREE.CubeTexture | null }
}

export type { BlackHoleConfig } from './blackhole-config'

export class BlackHoleSimulation {
  readonly config: Required<BlackHoleConfig>
  readonly uniforms: UniformRec
  /** Scene cubemap centered at the BH — sampled by the shader with the
   *  deflected ray direction to show gravitationally lensed planets. */
  readonly sceneCubeTarget: THREE.WebGLCubeRenderTarget
  readonly cubeCamera: THREE.CubeCamera
  mesh: THREE.Mesh | null = null
  private readonly scene: THREE.Scene

  private readonly bhSteps: number

  constructor(
    scene: THREE.Scene,
    config: BlackHoleConfig = {},
    options: BlackHoleOptions = {}
  ) {
    this.scene = scene
    this.config = { ...BLACK_HOLE_DEFAULTS, ...config }
    this.bhSteps = options.bhSteps ?? 64

    const cubemapSize = options.cubemapSize ?? 128
    // RGBA half-float so bloom / tone-mapping stays HDR. Lensing is a thin
    // annulus, so even 64–128² is perceptually invariant.
    this.sceneCubeTarget = new THREE.WebGLCubeRenderTarget(cubemapSize, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      generateMipmaps: false,
    })
    this.cubeCamera = new THREE.CubeCamera(1, 1500, this.sceneCubeTarget)

    this.uniforms = {
      resolution: { value: new THREE.Vector2(1, 1) },
      time: { value: 0 },
      camPos: { value: new THREE.Vector3() },
      camBasis: { value: new THREE.Matrix3() },
      bhMass: { value: this.config.blackHoleMass },
      diskInner: { value: this.config.diskInnerRadius },
      diskOuter: { value: this.config.diskOuterRadius },
      diskTilt: { value: this.config.diskTiltAngle },
      diskBrightness: { value: this.config.diskBrightness },
      diskRotSpeed: { value: this.config.diskRotationSpeed },
      maxRayDistance: { value: this.config.maxRayDistance },
      stepSize: { value: this.config.stepSize },
      lensingStrength: { value: this.config.lensingStrength },
      sceneCube: { value: this.sceneCubeTarget.texture },
    }
  }

  create() {
    if (this.mesh) return
    const geo = new THREE.SphereGeometry(this.config.sphereRadius, 32, 32)
    // Patch the disc raymarch step count based on quality preset. WebGL
    // requires the loop bound to be a constant, so we string-substitute
    // before compiling.
    const fragSrc = BLACK_HOLE_FRAG.replace(
      'const int STEPS = 64;',
      `const int STEPS = ${this.bhSteps};`
    )
    const mat = new THREE.ShaderMaterial({
      vertexShader: BLACK_HOLE_VERT,
      fragmentShader: fragSrc,
      uniforms: this.uniforms as unknown as Record<string, THREE.IUniform>,
      side: THREE.BackSide,
      // Depth is written by the shader (gl_FragDepth) so BH shadow / disc
      // pixels sit at the origin's depth — opaque planets behind get
      // correctly occluded; sky pixels sit at the far plane.
      depthWrite: true,
      depthTest: true,
    })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -1
    this.scene.add(this.mesh)
  }

  update(dt: number, camera: THREE.Camera) {
    this.uniforms.time.value += dt
    this.uniforms.camPos.value.copy(camera.position)
    this.uniforms.camBasis.value.setFromMatrix4(camera.matrixWorld)
  }

  onResize(width: number, height: number) {
    this.uniforms.resolution.value.set(width, height)
  }

  updateParams(patch: BlackHoleConfig) {
    const map: Partial<Record<keyof BlackHoleConfig, keyof UniformRec>> = {
      blackHoleMass: 'bhMass',
      diskInnerRadius: 'diskInner',
      diskOuterRadius: 'diskOuter',
      diskBrightness: 'diskBrightness',
      diskRotationSpeed: 'diskRotSpeed',
      diskTiltAngle: 'diskTilt',
      maxRayDistance: 'maxRayDistance',
      stepSize: 'stepSize',
      lensingStrength: 'lensingStrength',
    }
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue
      const uKey = map[key as keyof BlackHoleConfig]
      if (!uKey) continue
      ;(this.uniforms[uKey] as { value: number }).value = value as number
      ;(this.config as Record<string, number>)[key] = value as number
    }
  }

  /** Render the scene (without the BH mesh) into the cubemap so the shader
   *  can look up lensed planets along the deflected ray direction. Call
   *  once per frame BEFORE the main composer render. */
  updateCubemap(renderer: THREE.WebGLRenderer) {
    if (!this.mesh) {
      this.cubeCamera.update(renderer, this.scene)
      return
    }
    const wasVisible = this.mesh.visible
    this.mesh.visible = false
    this.cubeCamera.update(renderer, this.scene)
    this.mesh.visible = wasVisible
  }

  dispose() {
    this.sceneCubeTarget.dispose()
    if (!this.mesh) return
    this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    ;(this.mesh.material as THREE.Material).dispose()
    this.mesh = null
  }
}
