import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import type { SceneQuality } from '@/lib/utils/scene-quality'
import { createGodRaysPass, type GodRaysPass } from './god-rays'

type RendererBundle = {
  renderer: THREE.WebGLRenderer
  composer: EffectComposer
  bloomPass: UnrealBloomPass
  godRaysPass: GodRaysPass
  setSize(width: number, height: number): void
  dispose(): void
}

type CreateRendererOptions = {
  mount: HTMLElement
  scene: THREE.Scene
  camera: THREE.Camera
  initialWidth: number
  initialHeight: number
  quality: SceneQuality
}

export function createRenderer({
  mount,
  scene,
  camera,
  initialWidth,
  initialHeight,
  quality,
}: CreateRendererOptions): RendererBundle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  const pixelRatio = Math.min(window.devicePixelRatio, quality.dprMax)
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(initialWidth, initialHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.16
  // Touch flight controls own every drag on the canvas.
  renderer.domElement.style.touchAction = 'none'
  mount.appendChild(renderer.domElement)

  const composer = new EffectComposer(renderer)
  composer.setPixelRatio(pixelRatio)
  composer.setSize(initialWidth, initialHeight)
  composer.addPass(new RenderPass(scene, camera))

  // Bloom + god-rays passes always exist so the adaptive monitor can
  // toggle them via `pass.enabled` instead of recreating the composer.
  // EffectComposer skips disabled passes entirely.
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(initialWidth, initialHeight),
    // strength · radius · threshold — tuned to spread the disc + photon
    // ring glow into the surrounding pixels so the BH drives the scene's
    // mood. Threshold sits above average planet albedo so planets don't
    // themselves over-bloom.
    0.55,
    0.42,
    0.62
  )
  bloomPass.enabled = quality.bloomEnabled
  composer.addPass(bloomPass)

  const godRaysPass = createGodRaysPass()
  godRaysPass.enabled = quality.godRaysEnabled
  composer.addPass(godRaysPass)

  return {
    renderer,
    composer,
    bloomPass,
    godRaysPass,
    setSize(width, height) {
      renderer.setSize(width, height)
      // composer.setSize forwards to every pass (including bloom) with the
      // effective width/height × pixel ratio. Don't call bloomPass.setSize
      // directly — it would override the scaled resolution.
      composer.setSize(width, height)
    },
    dispose() {
      // composer.dispose() only frees its own targets; pass-owned targets
      // (e.g. bloom) have to be released explicitly.
      for (const pass of composer.passes) {
        ;(pass as { dispose?: () => void }).dispose?.()
      }
      composer.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    },
  }
}

export type { RendererBundle }
