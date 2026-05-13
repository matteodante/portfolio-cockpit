import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { PlayerPhase } from '@/lib/types/player'
import { disposeSceneGraph } from '../three/dispose-helpers'

const ASTRO_MODEL_PATH = '/models/astronaut.glb'
const ASTRO_TARGET_HEIGHT = 2.25
const ASTRO_FOOT_Y = -0.55

const BOB_AMP_FLY = 0.07
const BOB_AMP_LANDED = 0.04
const ROLL_AMP_FLY = 0.04
const ROLL_AMP_LANDED = 0.025
const IDLE_RATE_FLY = 1.8
const IDLE_RATE_LANDED = 1.2
const THRUST_LEAN_FACTOR = 0.05

type AstronautBundle = {
  group: THREE.Group
  setTransform(
    position: THREE.Vector3,
    forward: THREE.Vector3,
    up: THREE.Vector3
  ): void
  update(
    dt: number,
    opts: { phase: PlayerPhase; speed: number; maxSpeed: number }
  ): void
  setAccent(color: THREE.Color): void
  dispose(): void
}

function buildFallbackAstronaut(accent: THREE.Color) {
  const fallback = new THREE.Group()

  const helmetMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.3,
  })
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.2,
    metalness: 0.9,
    emissive: accent.clone(),
    emissiveIntensity: 0.3,
  })
  const suitMat = new THREE.MeshStandardMaterial({
    color: 0xe8e8e8,
    roughness: 0.7,
    metalness: 0.1,
  })
  const bootMat = new THREE.MeshStandardMaterial({
    color: 0xbbbbbb,
    roughness: 0.8,
  })
  const packMat = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.6,
  })
  const chestMat = new THREE.MeshStandardMaterial({
    color: accent.clone(),
    emissive: accent.clone(),
    emissiveIntensity: 0.6,
  })

  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    helmetMat
  )
  helmet.position.y = 1.6
  fallback.add(helmet)

  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI, 0, Math.PI),
    visorMat
  )
  visor.position.set(0, 1.6, 0.15)
  visor.rotation.y = -Math.PI / 2
  fallback.add(visor)

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.55), suitMat)
  torso.position.y = 0.8
  fallback.add(torso)

  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.3), packMat)
  pack.position.set(0, 0.9, -0.4)
  fallback.add(pack)

  for (const side of [-1, 1] as const) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), suitMat)
    arm.position.set(side * 0.6, 0.75, 0)
    fallback.add(arm)
  }
  for (const side of [-1, 1] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), suitMat)
    leg.position.set(side * 0.2, -0.05, 0)
    fallback.add(leg)
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.45), bootMat)
    boot.position.set(side * 0.2, -0.55, 0.05)
    fallback.add(boot)
  }

  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.02), chestMat)
  chest.position.set(0, 1.1, 0.29)
  fallback.add(chest)

  return { group: fallback, accentMaterials: [visorMat, chestMat] }
}

export function createAstronaut(
  scene: THREE.Scene,
  accentHex: string
): AstronautBundle {
  const accentColor = new THREE.Color(accentHex)

  const group = new THREE.Group()
  const visualGroup = new THREE.Group()
  group.add(visualGroup)
  scene.add(group)

  const { group: fallback, accentMaterials } =
    buildFallbackAstronaut(accentColor)
  visualGroup.add(fallback)

  const _look = new THREE.Vector3()
  const _mat = new THREE.Matrix4()
  const _yawFix = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    Math.PI
  )

  let idleTime = 0
  let mixer: THREE.AnimationMixer | null = null
  let loadedModel: THREE.Object3D | null = null
  let disposed = false

  const loader = new GLTFLoader()
  loader.load(
    ASTRO_MODEL_PATH,
    (gltf) => {
      if (disposed) return
      const model = gltf.scene
      loadedModel = model

      // Feet land at ASTRO_FOOT_Y so the follow-camera lookAt offset matches.
      const bounds = new THREE.Box3().setFromObject(model)
      if (!bounds.isEmpty()) {
        const size = new THREE.Vector3()
        bounds.getSize(size)
        const normalizedHeight = Math.max(size.y, 0.0001)
        const scale = ASTRO_TARGET_HEIGHT / normalizedHeight
        model.scale.setScalar(scale)
        bounds.setFromObject(model)
        const centerX = (bounds.min.x + bounds.max.x) * 0.5
        const centerZ = (bounds.min.z + bounds.max.z) * 0.5
        model.position.x -= centerX
        model.position.z -= centerZ
        model.position.y += ASTRO_FOOT_Y - bounds.min.y
      }

      fallback.visible = false
      visualGroup.add(model)

      const firstClip = gltf.animations[0]
      if (firstClip) {
        mixer = new THREE.AnimationMixer(model)
        mixer.clipAction(firstClip).play()
      }
    },
    undefined,
    () => {
      fallback.visible = true
    }
  )

  return {
    group,
    setTransform(position, forward, up) {
      group.position.copy(position)
      _look.copy(group.position).add(forward)
      _mat.lookAt(group.position, _look, up)
      group.quaternion.setFromRotationMatrix(_mat)
      group.quaternion.multiply(_yawFix)
    },
    update(dt, { phase, speed, maxSpeed }) {
      if (mixer) mixer.update(dt)
      const flying = phase === 'flying'
      idleTime += dt * (flying ? IDLE_RATE_FLY : IDLE_RATE_LANDED)
      const bobAmp = flying ? BOB_AMP_FLY : BOB_AMP_LANDED
      const rollAmp = flying ? ROLL_AMP_FLY : ROLL_AMP_LANDED
      const thrustLean = flying ? (speed / maxSpeed) * THRUST_LEAN_FACTOR : 0
      visualGroup.position.y = Math.sin(idleTime * 2.0) * bobAmp
      visualGroup.rotation.z = Math.sin(idleTime) * rollAmp - thrustLean
    },
    setAccent(color) {
      for (const mat of accentMaterials) {
        mat.color.copy(color)
        mat.emissive.copy(color)
        mat.needsUpdate = true
      }
    },
    dispose() {
      disposed = true
      if (mixer) {
        mixer.stopAllAction()
        if (loadedModel) mixer.uncacheRoot(loadedModel)
      }
      scene.remove(group)
      disposeSceneGraph(fallback)
      if (loadedModel) disposeSceneGraph(loadedModel)
    },
  }
}
