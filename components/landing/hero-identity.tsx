'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { createIdentityPointer } from '@/components/landing/identity-pointer'
import { identityFrame } from '@/components/landing/identity-timing'

const ASTRONAUT = '/landing-v2/identity/astronaut.webp'
const MATTEO = '/landing-v2/identity/matteo.webp'

export default function HeroIdentity() {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const landing = host?.closest('.landing')
    const stage = host?.closest('.hero-stage')
    if (!(host && canvas && landing && stage)) return
    let destroyed = false
    let cleanup: (() => void) | undefined

    const start = async () => {
      const [{ createIdentityRenderer }, images] = await Promise.all([
        import('@/components/landing/identity-renderer'),
        Promise.all(
          [ASTRONAUT, MATTEO].map(async (src) => {
            const image = new window.Image()
            image.src = src
            await image.decode()
            return image
          })
        ),
      ])
      if (destroyed) return
      const renderer = createIdentityRenderer(canvas, images)
      if (!renderer) return
      let elapsed = 0
      let last = 0
      let raf = 0
      let timer = 0
      let visible = false
      let running = false
      let contextLost = false
      const pointer = createIdentityPointer()
      const finePointer = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
      )
      const draw = () => {
        const frame = identityFrame(elapsed)
        const interaction = pointer.sample(performance.now())
        renderer.draw(
          frame.progress,
          frame.strength,
          elapsed / 1000,
          interaction
        )
        return interaction.strength > 0 ? 0 : frame.wait
      }
      const cancel = () => {
        if (running) elapsed += performance.now() - last
        window.cancelAnimationFrame(raf)
        window.clearTimeout(timer)
        running = false
        pointer.reset()
      }
      const tick = (now: number) => {
        elapsed += now - last
        last = now
        const wait = draw()
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
        dragging: boolean
      ) => {
        if (
          !(running && visible) ||
          document.hidden ||
          (target instanceof Element &&
            target.closest('a, button, input, select, textarea, summary'))
        )
          return
        const bounds = canvas.getBoundingClientRect()
        const x = (clientX - bounds.left) / bounds.width
        const y = 1 - (clientY - bounds.top) / bounds.height
        if (x < 0 || x > 1 || y < 0 || y > 1) return
        pointer.move(x, y, performance.now(), dragging)
        wake()
      }
      const onPointerMove = (event: Event) => {
        if (!(event instanceof PointerEvent)) return
        // Passive touchmove continues through native scrolling/pointercancel.
        if (event.pointerType === 'touch') return
        if (event.pointerType === 'mouse' && !finePointer.matches) return
        movePointer(
          event.clientX,
          event.clientY,
          event.target,
          (event.buttons & 1) !== 0
        )
      }
      const onPointerDown = (event: Event) => {
        if (!(event instanceof PointerEvent && event.isPrimary)) return
        movePointer(event.clientX, event.clientY, event.target, true)
      }
      const resetPointer = () => {
        pointer.reset()
        if (running) wake()
      }
      const onPointerLeave = (event: Event) => {
        // Touch release keeps its short fade; the browser emits leave on lift.
        if (event instanceof PointerEvent && event.pointerType !== 'touch') {
          resetPointer()
        }
      }
      const onTouchMove = (event: Event) => {
        if (!(event instanceof TouchEvent)) return
        if (event.touches.length !== 1) {
          resetPointer()
          return
        }
        const touch = event.touches.item(0)
        if (touch) movePointer(touch.clientX, touch.clientY, event.target, true)
      }
      const sync = () => {
        const enabled =
          !contextLost && landing.getAttribute('data-cinema') === 'true'
        host.toggleAttribute('data-identity-ready', enabled)
        if (!enabled) {
          cancel()
          elapsed = 0
          if (!contextLost) draw()
        } else if (visible && !document.hidden && !running) {
          running = true
          last = performance.now()
          raf = window.requestAnimationFrame(tick)
        } else if ((!visible || document.hidden) && running) cancel()
      }
      const intersection = new IntersectionObserver(
        ([entry]) => {
          visible = entry?.isIntersecting ?? false
          sync()
        },
        { threshold: 0.05 }
      )
      intersection.observe(host)
      const mode = new MutationObserver(sync)
      mode.observe(landing, {
        attributes: true,
        attributeFilter: ['data-cinema'],
      })
      const resize = new ResizeObserver(draw)
      resize.observe(host)
      const onContextLost = () => {
        contextLost = true
        cancel()
        host.removeAttribute('data-identity-ready')
      }
      document.addEventListener('visibilitychange', sync)
      canvas.addEventListener('webglcontextlost', onContextLost)
      stage.addEventListener('pointermove', onPointerMove, { passive: true })
      stage.addEventListener('pointerdown', onPointerDown, { passive: true })
      stage.addEventListener('touchmove', onTouchMove, { passive: true })
      stage.addEventListener('pointerleave', onPointerLeave)
      window.addEventListener('blur', resetPointer)
      finePointer.addEventListener('change', resetPointer)
      draw()
      sync()
      cleanup = () => {
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
        window.removeEventListener('blur', resetPointer)
        finePointer.removeEventListener('change', resetPointer)
        host.removeAttribute('data-identity-ready')
        renderer.dispose()
      }
    }
    // A blocked image, module, or unavailable GPU leaves the server poster intact.
    void start().catch(() => host.removeAttribute('data-identity-ready'))
    return () => {
      destroyed = true
      cleanup?.()
    }
  }, [])

  return (
    <div ref={hostRef} className="hero-identity" aria-hidden="true">
      <Image src={ASTRONAUT} alt="" fill priority unoptimized />
      <canvas ref={canvasRef} />
    </div>
  )
}
