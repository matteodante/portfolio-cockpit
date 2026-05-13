import * as THREE from 'three'
import { FullScreenQuad, Pass } from 'three/examples/jsm/postprocessing/Pass.js'

// Two-pass occlusion-style god rays:
//   1. Accumulate radial samples at HALF resolution → rays target.
//   2. Upsample (linear filter) and add over the scene at full res.
// The expensive 24-tap loop runs at 1/4 the pixels of the previous
// single-pass version, then bilinear upsampling hides the resolution
// drop in the composite step.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const RAYS_FRAG = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 lightPos;
  uniform float decay;
  uniform float density;
  uniform float weight;
  varying vec2 vUv;

  const int SAMPLES = 24;

  void main() {
    vec2 texCoord = vUv;
    vec2 delta = (vUv - lightPos) * density / float(SAMPLES);
    float illum = 1.0;
    vec3 rays = vec3(0.0);

    for (int i = 0; i < SAMPLES; i++) {
      texCoord -= delta;
      rays += texture2D(tDiffuse, texCoord).rgb * illum * weight;
      illum *= decay;
    }
    gl_FragColor = vec4(rays, 1.0);
  }
`

const COMPOSITE_FRAG = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tRays;
  uniform float exposure;
  uniform float visibility;
  varying vec2 vUv;

  void main() {
    vec3 scene = texture2D(tScene, vUv).rgb;
    // Early-out when the BH is offscreen — skip the rays texture lookup
    // entirely and just pass the scene through.
    if (visibility < 0.001) {
      gl_FragColor = vec4(scene, 1.0);
      return;
    }
    vec3 rays = texture2D(tRays, vUv).rgb;
    gl_FragColor = vec4(scene + rays * exposure * visibility, 1.0);
  }
`

export class GodRaysPass extends Pass {
  /** Public interface kept compatible with the previous single-pass
   *  ShaderPass: callers write `lightPos.value.set(...)` and
   *  `visibility.value = ...` and never see the internal split. */
  readonly uniforms: {
    lightPos: { value: THREE.Vector2 }
    visibility: { value: number }
  }

  private readonly raysTarget: THREE.WebGLRenderTarget
  private readonly raysMaterial: THREE.ShaderMaterial
  private readonly raysQuad: FullScreenQuad
  private readonly compositeMaterial: THREE.ShaderMaterial
  private readonly compositeQuad: FullScreenQuad
  // Direct references to the texture uniforms so the render loop can
  // write them without going through the indexed `.uniforms[name]`
  // lookup (which TS treats as `IUniform | undefined`).
  private readonly raysDiffuseUniform: { value: THREE.Texture | null }
  private readonly compositeSceneUniform: { value: THREE.Texture | null }
  private readonly compositeRaysUniform: { value: THREE.Texture | null }

  constructor() {
    super()

    const sharedLightPos = { value: new THREE.Vector2(0.5, 0.5) }
    const sharedVisibility = { value: 1.0 }
    this.uniforms = {
      lightPos: sharedLightPos,
      visibility: sharedVisibility,
    }

    this.raysTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
    })

    this.raysDiffuseUniform = { value: null }
    this.raysMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: this.raysDiffuseUniform,
        lightPos: sharedLightPos,
        decay: { value: 0.95 },
        density: { value: 0.6 },
        weight: { value: 0.3 },
      },
      vertexShader: VERT,
      fragmentShader: RAYS_FRAG,
    })
    this.raysQuad = new FullScreenQuad(this.raysMaterial)

    this.compositeSceneUniform = { value: null }
    this.compositeRaysUniform = { value: this.raysTarget.texture }
    this.compositeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tScene: this.compositeSceneUniform,
        tRays: this.compositeRaysUniform,
        exposure: { value: 0.05 },
        visibility: sharedVisibility,
      },
      vertexShader: VERT,
      fragmentShader: COMPOSITE_FRAG,
    })
    this.compositeQuad = new FullScreenQuad(this.compositeMaterial)
  }

  override setSize(width: number, height: number): void {
    this.raysTarget.setSize(
      Math.max(1, Math.floor(width / 2)),
      Math.max(1, Math.floor(height / 2))
    )
  }

  override render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ): void {
    // Step 1: rays at half-res. LinearFilter on the target lets the
    // composite step bilinear-upsample for free.
    this.raysDiffuseUniform.value = readBuffer.texture
    renderer.setRenderTarget(this.raysTarget)
    this.raysQuad.render(renderer)

    // Step 2: composite at full-res into writeBuffer (or screen).
    // Re-bind the rays texture each frame: a future setSize that resizes
    // (or replaces) the render target's texture would otherwise leave a
    // stale reference here.
    this.compositeSceneUniform.value = readBuffer.texture
    this.compositeRaysUniform.value = this.raysTarget.texture
    if (this.renderToScreen === true) {
      renderer.setRenderTarget(null)
    } else {
      renderer.setRenderTarget(writeBuffer)
      if (this.clear === true) renderer.clear()
    }
    this.compositeQuad.render(renderer)
  }

  override dispose(): void {
    this.raysTarget.dispose()
    this.raysMaterial.dispose()
    this.raysQuad.dispose()
    this.compositeMaterial.dispose()
    this.compositeQuad.dispose()
  }
}

export function createGodRaysPass(): GodRaysPass {
  return new GodRaysPass()
}
