import type { RefObject } from 'react'
import * as THREE from 'three'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type {
  CockpitSectionId,
  PlanetSection,
} from '@/lib/data/cockpit-sections'
import { setHud } from '@/lib/hooks/cockpit-store'
import {
  getInitialQuality,
  nextLowerPreset,
  QUALITY_PRESETS,
  type SceneQuality,
} from '@/lib/utils/scene-quality'
import { BlackHoleSimulation } from './blackhole/blackhole'
import { CAM_UP_LERP } from './camera/camera-constants'
import { updateFollowCamera } from './camera/follow-camera'
import { createAstronaut } from './player/astronaut'
import {
  BH_DEATH_RADIUS,
  DEATH_DURATION,
  RESPAWN_POS,
  VMAX_FLY,
} from './player/player-constants'
import { createInputController } from './player/player-input'
import {
  createPlayerState,
  lerpUpToWorld,
  projectForwardOntoUp,
  stepFlight,
  stepLanded,
  stepTransition,
  tryLand,
  tryTakeoff,
  updateNearestLocked,
} from './player/player-physics'
import { createThrusters } from './player/thrusters'
import { createAsteroids } from './three/asteroids'
import { createBackdropText } from './three/backdrop-text'
import { createExplosion } from './three/explosion'
import { createLights } from './three/lights'
import { createPlanets } from './three/planets'
import { createRenderer } from './three/renderer'

export type AstronautInstance = ReturnType<typeof createAstronaut>
export type ThrustersInstance = ReturnType<typeof createThrusters>
export type PlanetsInstance = ReturnType<typeof createPlanets>

/**
 * Refs the parent component holds onto so it can interact with the
 * world after mount (e.g. `updateLabels` on language change).
 *
 * `buildWorld` writes these on mount and clears them on dispose.
 */
export type BuildWorldRefs = {
  astronaut: RefObject<AstronautInstance | null>
  thrusters: RefObject<ThrustersInstance | null>
  planets: RefObject<PlanetsInstance | null>
  locked: RefObject<PlanetSection | null>
}

/**
 * React-bridge callbacks read every frame (or on edge events) via
 * `.current`. Keeping them in a ref lets the parent swap them on
 * re-render without rebuilding the WebGL world.
 */
export type BuildWorldHandlers = {
  onNearChange: (section: PlanetSection | null) => void
  onDockRequest: (section: PlanetSection) => void
}

export type BuildWorldArgs = {
  mount: HTMLDivElement
  sections: readonly PlanetSection[]
  initialLabels: Record<CockpitSectionId, string>
  startedRef: RefObject<boolean>
  handlersRef: RefObject<BuildWorldHandlers>
  refs: BuildWorldRefs
}

// On `started=true`, updateFollowCamera's internal lerp eases from this
// pose to the behind-and-above follow position over ~1s.
const INTRO_FORWARD = 3.5
const INTRO_HEIGHT = 1.8
const INTRO_LOOK_OFFSET = 1.0

// Adaptive quality: start at the highest tier and step down only when
// real measured fps stays below threshold for a sample window. Grace
// period absorbs the warm-up jitter; cooldown prevents oscillating
// downgrades when the threshold sits right around the measured fps.
const FPS_SAMPLE_INTERVAL_MS = 1000
const FPS_THRESHOLD = 40
const ADAPTIVE_GRACE_MS = 3000
const ADAPTIVE_COOLDOWN_MS = 2000

const PLAYER_COLLISION_R = 1.6

/**
 * Build the entire Three.js world inside `mount` and start the
 * requestAnimationFrame loop. Returns a cleanup function that
 * cancels the loop, disconnects observers, and disposes every
 * GPU-backed resource. Designed to be called from a `useEffect`.
 */
export function buildWorld(args: BuildWorldArgs): () => void {
  const { mount, sections, initialLabels, startedRef, handlersRef, refs } = args

  const initialQuality = getInitialQuality()
  let currentQuality: SceneQuality = initialQuality

  const W = () => mount.clientWidth || window.innerWidth
  const H = () => mount.clientHeight || window.innerHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x05060a)
  scene.fog = new THREE.Fog(0x05060a, 240, 660)

  const camera = new THREE.PerspectiveCamera(70, W() / H(), 0.1, 2000)
  camera.position.set(0, 16, -130)
  camera.lookAt(0, 0, 0)

  const rendererBundle = createRenderer({
    mount,
    scene,
    camera,
    initialWidth: W(),
    initialHeight: H(),
    quality: initialQuality,
  })

  const lights = createLights(scene)
  const blackHole = new BlackHoleSimulation(
    scene,
    {},
    {
      cubemapSize: initialQuality.cubemapSize,
      bhSteps: initialQuality.bhSteps,
    }
  )
  blackHole.create()
  const planets = createPlanets(scene, {
    sections,
    labels: initialLabels,
  })
  refs.planets.current = planets

  const astronaut = createAstronaut(scene, COCKPIT_ACCENT)
  refs.astronaut.current = astronaut
  const thrusters = createThrusters(scene, COCKPIT_ACCENT)
  refs.thrusters.current = thrusters
  const asteroids = createAsteroids(scene, {
    count: 10,
    innerRadius: 12,
    outerRadius: 95,
  })
  const explosion = createExplosion(scene)
  // Luminous "MATTEO DANTE" 3D sign sitting beyond the spawn point.
  // Acts as the title plate during the intro (the cinematic camera looks
  // toward -Z, so the astronaut sits silhouetted against the glyphs) and
  // becomes a back-rim light for the ship once the player flips around.
  const backdropText = createBackdropText(scene, rendererBundle.renderer, {
    position: new THREE.Vector3(0, 5, -250),
    size: 5,
  })

  const player = createPlayerState()
  let deathAt = 0
  const inputCtrl = createInputController({
    onDockKey: () => {
      if (player.phase === 'dead') return
      const locked = refs.locked.current
      if (locked) handlersRef.current.onDockRequest(locked)
    },
    touchTarget: rendererBundle.renderer.domElement,
  })

  const resize = () => {
    const w = W()
    const h = H()
    if (w === 0 || h === 0) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    rendererBundle.setSize(w, h)
    // gl_FragCoord in the BH shader is in physical pixels (DPR-scaled);
    // feed the matching resolution so the ray NDC math doesn't offset
    // the black hole toward a corner on high-DPR mobile screens.
    const dpr = rendererBundle.renderer.getPixelRatio()
    blackHole.onResize(w * dpr, h * dpr)
  }
  resize()
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(mount)

  let raf = 0
  const startedAt = performance.now()
  let last = startedAt
  let nearId: CockpitSectionId | null = null
  const _bhProj = new THREE.Vector3()
  const _camForward = new THREE.Vector3()
  const _bhFromCam = new THREE.Vector3()
  const _introPos = new THREE.Vector3()
  const _introLook = new THREE.Vector3()

  // Adaptive quality monitor state.
  let fpsSampleStart = startedAt
  let fpsSampleFrames = 0
  let lastDowngradeAt = 0

  const applyRuntimeQuality = (q: SceneQuality) => {
    currentQuality = q
    const dpr = Math.min(window.devicePixelRatio, q.dprMax)
    rendererBundle.renderer.setPixelRatio(dpr)
    rendererBundle.composer.setPixelRatio(dpr)
    // Re-emit setSize so bloom + composer targets pick up the new DPR.
    rendererBundle.setSize(W(), H())
    blackHole.onResize(W() * dpr, H() * dpr)
    rendererBundle.bloomPass.enabled = q.bloomEnabled
    rendererBundle.godRaysPass.enabled = q.godRaysEnabled
  }

  const stepGameplay = (
    now: number,
    dt: number,
    nearest: ReturnType<typeof updateNearestLocked>['nearest']
  ) => {
    if (player.phase === 'flying') lerpUpToWorld(player, CAM_UP_LERP)

    if (inputCtrl.consumeSpaceEdge()) {
      if (player.phase === 'flying') tryLand(player)
      else if (player.phase === 'landed') tryTakeoff(player)
    }

    projectForwardOntoUp(player)

    if (player.phase === 'flying') {
      stepFlight(player, inputCtrl.input, dt, planets.planets)
      const hitIdx = asteroids.checkCollision(
        player.position,
        PLAYER_COLLISION_R
      )
      const bhDeath = player.position.length() < BH_DEATH_RADIUS
      if (hitIdx !== -1 || bhDeath) {
        if (hitIdx !== -1) asteroids.hide(hitIdx)
        explosion.spawn(player.position)
        player.phase = 'dead'
        player.velocity.set(0, 0, 0)
        deathAt = now
      }
      return
    }
    if (player.phase === 'landed' && nearest) {
      stepLanded(player, inputCtrl.input, dt, nearest)
      return
    }
    if (player.phase === 'transitioning') {
      stepTransition(player, now)
      return
    }
    if (player.phase === 'dead' && (now - deathAt) / 1000 >= DEATH_DURATION) {
      player.position.set(RESPAWN_POS[0], RESPAWN_POS[1], RESPAWN_POS[2])
      player.velocity.set(0, 0, 0)
      player.up.set(0, 1, 0)
      player.forward.set(0, 0, 1)
      player.phase = 'flying'
      asteroids.reset()
    }
  }

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now

    // Move world objects FIRST so a landed player pins to the planet's
    // current-frame position. Otherwise stepLanded computes the player
    // pose using last frame's planet position and the camera renders
    // both one tick out of sync → visible jitter.
    planets.update(dt)
    asteroids.update(dt)
    explosion.update(dt)
    backdropText.update(dt)

    const { nearest, locked } = updateNearestLocked(player, planets.planets)

    if (startedRef.current) stepGameplay(now, dt, nearest)

    astronaut.setTransform(player.position, player.forward, player.up)
    const speed = player.velocity.length()
    astronaut.update(dt, { phase: player.phase, speed, maxSpeed: VMAX_FLY })
    thrusters.update(dt, {
      flying: player.phase === 'flying',
      speed,
      position: player.position,
      forward: player.forward,
      up: player.up,
    })
    // 0..1 pulse synced with the shader-side disc turbulence cycle. Drives
    // the disc + ring lights so planet rim lighting breathes with the BH.
    const glowPulse = 0.5 + Math.sin(now * 0.00125) * 0.5
    lights.setDiskGlow(glowPulse)
    blackHole.update(dt, camera)

    if (startedRef.current) {
      updateFollowCamera({
        camera,
        position: player.position,
        forward: player.forward,
        up: player.up,
        phase: player.phase,
      })
    } else {
      // Recomputed every frame so the pose tracks the astronaut's idle
      // bob and survives resizes.
      _introPos
        .copy(player.position)
        .addScaledVector(player.forward, INTRO_FORWARD)
        .addScaledVector(player.up, INTRO_HEIGHT)
      camera.position.copy(_introPos)
      camera.up.copy(player.up)
      _introLook
        .copy(player.position)
        .addScaledVector(player.up, INTRO_LOOK_OFFSET)
      camera.lookAt(_introLook)
    }

    // god-rays lightPos in [0,1] screen space, gated by a forward
    // dot-product so the rays disappear when the BH is behind the camera
    // (NDC z alone is ambiguous past the far plane).
    camera.getWorldDirection(_camForward)
    _bhFromCam.set(0, 0, 0).sub(camera.position)
    const bhInFront = _camForward.dot(_bhFromCam) > 0
    _bhProj.set(0, 0, 0).project(camera)
    rendererBundle.godRaysPass.uniforms.lightPos.value.set(
      _bhProj.x * 0.5 + 0.5,
      _bhProj.y * 0.5 + 0.5
    )
    rendererBundle.godRaysPass.uniforms.visibility.value = bhInFront ? 1 : 0

    // Cubemap feeds planet lensing in the BH shader. Skipped during intro
    // (cinematic camera doesn't see the BH), when the BH is behind the
    // main camera, and when the adaptive quality monitor turned cubemap
    // off — each saves a full extra scene render per frame.
    if (currentQuality.cubemapEnabled && startedRef.current && bhInFront) {
      blackHole.updateCubemap(rendererBundle.renderer)
    }

    const nowNearId: CockpitSectionId | null = locked ? locked.id : null
    if (nowNearId !== nearId) {
      nearId = nowNearId
      refs.locked.current = locked
      handlersRef.current.onNearChange(locked)
    }

    setHud({
      speed,
      coords: [player.position.x, player.position.z],
      gravity: player.lastGravity,
      landed: player.phase === 'landed',
      phase: player.phase,
      nearestId: nowNearId,
    })

    rendererBundle.composer.render()

    // Adaptive quality: sample fps over a 1s window. After the warmup
    // grace period, if the average drops below FPS_THRESHOLD and the
    // cooldown has elapsed since the last downgrade, step down one
    // tier — a single device that struggles on `high` will end up
    // settling at the highest tier it can sustain.
    fpsSampleFrames += 1
    const sampleElapsed = now - fpsSampleStart
    if (sampleElapsed >= FPS_SAMPLE_INTERVAL_MS) {
      const elapsedSinceStart = now - startedAt
      if (
        elapsedSinceStart > ADAPTIVE_GRACE_MS &&
        now - lastDowngradeAt > ADAPTIVE_COOLDOWN_MS
      ) {
        const avgFps = (fpsSampleFrames * 1000) / sampleElapsed
        if (avgFps < FPS_THRESHOLD) {
          const next = nextLowerPreset(currentQuality.preset)
          if (next) {
            applyRuntimeQuality(QUALITY_PRESETS[next])
            lastDowngradeAt = now
          }
        }
      }
      fpsSampleFrames = 0
      fpsSampleStart = now
    }

    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    resizeObserver.disconnect()

    inputCtrl.dispose()
    thrusters.dispose()
    astronaut.dispose()
    explosion.dispose()
    asteroids.dispose()
    backdropText.dispose()
    planets.dispose()
    blackHole.dispose()
    lights.dispose()
    rendererBundle.dispose()

    refs.astronaut.current = null
    refs.thrusters.current = null
    refs.planets.current = null
  }
}
