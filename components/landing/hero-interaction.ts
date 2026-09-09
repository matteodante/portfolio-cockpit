import { createHeroUi } from '@/components/landing/hero-ui'
import {
  createIdentityPointer,
  type IdentityInput,
} from '@/components/landing/identity-pointer'
import type { createIdentityRenderer } from '@/components/landing/identity-renderer'
import { identityFrame } from '@/components/landing/identity-timing'

/** One input/animation lifecycle for photographic and decorative DOM effects. */
export function createHeroInteraction(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  sources: readonly string[]
) {
  const stage = host.closest('.hero-stage')
  const landing = host.closest('.landing')
  if (!(stage instanceof HTMLElement && landing)) return

  const ui = createHeroUi(stage)
  const pointer = createIdentityPointer()
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  let renderer: ReturnType<typeof createIdentityRenderer> = null
  let destroyed = false
  let contextLost = false
  let elapsed = 0
  let last = 0
  let raf = 0
  let timer = 0
  let visible = false
  let running = false

  const draw = (now: number) => {
    const frame = identityFrame(elapsed)
    const interaction = pointer.sample(now)
    const ready = renderer !== null && !contextLost
    if (ready)
      renderer?.draw(
        frame.progress,
        frame.strength,
        elapsed / 1000,
        interaction
      )
    ui.draw(interaction.strength, now, ready ? frame.strength : 0)
    if (interaction.strength > 0) return 0
    // UI interaction remains available if a photo or the GPU cannot initialize.
    return ready ? frame.wait : null
  }
  const cancel = () => {
    if (running) elapsed += performance.now() - last
    window.cancelAnimationFrame(raf)
    window.clearTimeout(timer)
    running = false
    pointer.reset()
    ui.reset()
  }
  const tick = (now: number) => {
    elapsed += now - last
    last = now
    const wait = draw(now)
    if (wait === null) return
    if (wait > 0) {
      timer = window.setTimeout(() => {
        raf = window.requestAnimationFrame(tick)
      }, wait)
    } else raf = window.requestAnimationFrame(tick)
  }
  const wake = () => {
    window.clearTimeout(timer)
    window.cancelAnimationFrame(raf)
    raf = window.requestAnimationFrame(tick)
  }
  const movePointer = (
    clientX: number,
    clientY: number,
    target: EventTarget | null,
    input: IdentityInput
  ) => {
    if (!(running && visible) || document.hidden) return
    const bounds = canvas.getBoundingClientRect()
    if (!(bounds.width && bounds.height)) return
    const now = performance.now()
    // Coordinates may sit outside the photo while crossing the title or CTA.
    // The shader's local field then naturally falls outside its visible plate.
    pointer.move(
      (clientX - bounds.left) / bounds.width,
      1 - (clientY - bounds.top) / bounds.height,
      now,
      input
    )
    ui.move(target, clientX, clientY, now)
    wake()
  }
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    if (event.pointerType === 'mouse' && !finePointer.matches) return
    movePointer(
      event.clientX,
      event.clientY,
      event.target,
      (event.buttons & 1) !== 0 ? 'drag' : 'hover'
    )
  }
  const onPointerDown = (event: PointerEvent) => {
    if (!event.isPrimary) return
    movePointer(
      event.clientX,
      event.clientY,
      event.target,
      event.pointerType === 'touch' ? 'touch' : 'drag'
    )
  }
  const resetPointer = () => {
    pointer.reset()
    ui.reset()
    if (running) wake()
  }
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') resetPointer()
  }
  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      resetPointer()
      return
    }
    const touch = event.touches.item(0)
    if (touch) movePointer(touch.clientX, touch.clientY, event.target, 'touch')
  }
  const sync = () => {
    const enabled = landing.getAttribute('data-cinema') === 'true'
    host.toggleAttribute(
      'data-identity-ready',
      enabled && renderer !== null && !contextLost
    )
    if (!enabled) {
      cancel()
      elapsed = 0
    } else if (visible && !document.hidden && !running) {
      running = true
      last = performance.now()
      raf = window.requestAnimationFrame(tick)
    } else if ((!visible || document.hidden) && running) cancel()
  }
  const onContextLost = () => {
    contextLost = true
    host.removeAttribute('data-identity-ready')
    if (running) wake()
  }
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false
      sync()
    },
    { threshold: 0.05 }
  )
  intersection.observe(stage)
  const mode = new MutationObserver(sync)
  mode.observe(landing, { attributes: true, attributeFilter: ['data-cinema'] })
  const resize = new ResizeObserver(resetPointer)
  resize.observe(stage)
  document.addEventListener('visibilitychange', sync)
  canvas.addEventListener('webglcontextlost', onContextLost)
  stage.addEventListener('pointermove', onPointerMove, { passive: true })
  stage.addEventListener('pointerdown', onPointerDown, { passive: true })
  // Keep receiving native scroll gestures after the browser's pointercancel.
  stage.addEventListener('touchmove', onTouchMove, { passive: true })
  stage.addEventListener('pointerleave', onPointerLeave)
  stage.addEventListener('focusin', resetPointer)
  window.addEventListener('blur', resetPointer)
  finePointer.addEventListener('change', resetPointer)
  sync()

  const load = async () => {
    const [{ createIdentityRenderer }, images] = await Promise.all([
      import('@/components/landing/identity-renderer'),
      Promise.all(
        sources.map(async (src) => {
          const image = new window.Image()
          image.src = src
          await image.decode()
          return image
        })
      ),
    ])
    if (destroyed) return
    renderer = createIdentityRenderer(canvas, images)
    elapsed = 0
    last = performance.now()
    sync()
    if (running) wake()
  }
  void load().catch(() => host.removeAttribute('data-identity-ready'))

  return () => {
    destroyed = true
    cancel()
    intersection.disconnect()
    mode.disconnect()
    resize.disconnect()
    document.removeEventListener('visibilitychange', sync)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    stage.removeEventListener('pointermove', onPointerMove)
    stage.removeEventListener('pointerdown', onPointerDown)
    stage.removeEventListener('touchmove', onTouchMove)
    stage.removeEventListener('pointerleave', onPointerLeave)
    stage.removeEventListener('focusin', resetPointer)
    window.removeEventListener('blur', resetPointer)
    finePointer.removeEventListener('change', resetPointer)
    host.removeAttribute('data-identity-ready')
    renderer?.dispose()
  }
}
