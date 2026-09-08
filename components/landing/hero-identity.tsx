'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
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
    if (!(host && canvas && landing)) return
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
      const draw = () => {
        const frame = identityFrame(elapsed)
        renderer.draw(frame.progress, frame.strength, elapsed / 1000)
        return frame
      }
      const cancel = () => {
        if (running) elapsed += performance.now() - last
        window.cancelAnimationFrame(raf)
        window.clearTimeout(timer)
        running = false
      }
      const tick = (now: number) => {
        elapsed += now - last
        last = now
        const frame = draw()
        if (frame.wait > 0) {
          timer = window.setTimeout(() => {
            raf = window.requestAnimationFrame(tick)
          }, frame.wait)
        } else raf = window.requestAnimationFrame(tick)
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
      draw()
      sync()
      cleanup = () => {
        cancel()
        intersection.disconnect()
        mode.disconnect()
        resize.disconnect()
        document.removeEventListener('visibilitychange', sync)
        canvas.removeEventListener('webglcontextlost', onContextLost)
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
