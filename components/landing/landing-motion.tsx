'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'

type LandingMotionProps = {
  children: ReactNode
  className: string
  sections: readonly { id: string; label: string }[]
  labels: {
    navigation: string
    section: string
    scroll: string
    pause: string
    resume: string
  }
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))

function makeStars() {
  let seed = 1729
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  return Array.from({ length: 700 }, () => ({
    x: random(),
    y: random(),
    radius: 0.3 + random() * 0.8,
    opacity: 0.12 + random() * 0.4,
  }))
}

export default function LandingMotion({
  children,
  className,
  sections,
  labels,
}: LandingMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const configureRef = useRef<(() => void) | null>(null)
  const pausedRef = useRef(false)
  const [paused, setPaused] = useState(false)
  const [eligible, setEligible] = useState(false)
  const [current, setCurrent] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!(root && canvas)) return
    gsap.registerPlugin(ScrollTrigger)

    const drawing = canvas.getContext('2d')
    const stars = makeStars()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stops = sections.flatMap(({ id }, index) => {
      const element = root.querySelector<HTMLElement>(`#${id}`)
      return element ? [{ element, index, top: 0 }] : []
    })
    let context: gsap.Context | undefined
    let triggers: ScrollTrigger[] = []
    let width = window.innerWidth
    let height = window.innerHeight
    let scrollEnd = 1
    let active = 0
    let cinema = false
    let refreshTimer = 0
    let mounted = true

    const measure = () => {
      width = window.innerWidth
      height = window.innerHeight
      for (const stop of stops) {
        stop.top = stop.element.getBoundingClientRect().top + window.scrollY
      }
      scrollEnd = Math.max(1, document.documentElement.scrollHeight - height)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      drawing?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const updateChrome = () => {
      if (document.hidden) return
      const scroll = window.scrollY
      let next = 0
      for (const stop of stops) {
        if (scroll + 100 >= stop.top) next = stop.index
      }
      if (next !== active) {
        active = next
        setCurrent(next)
      }
      root.toggleAttribute('data-scrolled', scroll > 80)
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${clamp(scroll / scrollEnd)})`
      }
      if (hintRef.current) {
        hintRef.current.style.visibility =
          scroll < height * 0.12 ? '' : 'hidden'
      }
      if (!drawing) return
      drawing.clearRect(0, 0, width, height)
      drawing.fillStyle = '#f2ede3'
      const travel = cinema ? scroll * 0.025 : 0
      for (const star of stars) {
        const y = (((star.y * height - travel) % height) + height) % height
        drawing.globalAlpha = star.opacity
        drawing.beginPath()
        drawing.arc(star.x * width, y, star.radius, 0, Math.PI * 2)
        drawing.fill()
      }
      drawing.globalAlpha = 1
    }
    const sync = () => {
      ScrollTrigger.update()
      for (const trigger of triggers) trigger.getTween()?.progress(1)
      updateChrome()
    }
    const onLayout = () => {
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => {
        if (document.hidden) return
        ScrollTrigger.refresh()
        sync()
      }, 80)
    }
    const configure = () => {
      measure()
      const scroll = window.scrollY
      let anchor = 0
      for (let i = 1; i < stops.length; i++) {
        if ((stops[i]?.top ?? 0) <= scroll) anchor = i
      }
      const start = stops[anchor]?.top ?? 0
      const end = stops[anchor + 1]?.top ?? scrollEnd + height
      const fraction = clamp((scroll - start) / Math.max(1, end - start))
      const previousMode = cinema
      context?.revert()
      triggers = []
      cinema = !(reducedMotion.matches || pausedRef.current)
      setEligible(!reducedMotion.matches)
      if (cinema) root.setAttribute('data-cinema', 'true')
      else root.removeAttribute('data-cinema')
      measure()
      // Only mode changes reposition the page, never mobile address-bar resizes.
      if (cinema !== previousMode && scroll > 0) {
        const newStart = stops[anchor]?.top ?? 0
        const newEnd = stops[anchor + 1]?.top ?? scrollEnd + height
        window.scrollTo({
          top: newStart + fraction * (newEnd - newStart),
          behavior: 'instant',
        })
      }
      context = gsap.context(() => {
        triggers.push(
          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: updateChrome,
            onRefresh: () => {
              measure()
              updateChrome()
            },
          })
        )
        if (!cinema) return
        for (const element of root.querySelectorAll<HTMLElement>(
          '[data-cinema-scene], [data-parallax]'
        )) {
          const scene = element.hasAttribute('data-cinema-scene')
          const stage = element.querySelector<HTMLElement>('.cinema-stage')
          const property = scene ? '--scene-progress' : '--parallax-progress'
          const timeline = gsap
            .timeline({
              scrollTrigger: {
                trigger: element,
                start: scene ? 'top top' : 'top bottom',
                end: scene
                  ? () =>
                      `+=${Math.max(1, element.offsetHeight - (stage?.offsetHeight ?? height))}`
                  : 'bottom top',
                scrub: 0.3,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              element,
              { [property]: 0 },
              {
                [property]: 1,
                duration: 1,
                ease: 'none',
              }
            )
          if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger)
        }
      }, root)
      sync()
      if (document.hidden) {
        for (const trigger of triggers) trigger.disable(false)
      }
    }
    const onVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(refreshTimer)
        for (const trigger of triggers) trigger.disable(false)
      } else {
        for (const trigger of triggers) trigger.enable(false, false)
        onLayout()
      }
    }

    configure()
    configureRef.current = configure
    root.setAttribute('data-interactive', 'true')
    let observedSize = ''
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const size = `${entry.contentRect.width}:${entry.contentRect.height}`
      if (size === observedSize) return
      observedSize = size
      onLayout()
    })
    observer.observe(root.querySelector('main') ?? root)
    void document.fonts.ready.then(() => {
      if (mounted) onLayout()
    })
    root.addEventListener('load', onLayout, true)
    window.addEventListener('resize', onLayout)
    window.addEventListener('hashchange', sync)
    reducedMotion.addEventListener('change', configure)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      mounted = false
      window.clearTimeout(refreshTimer)
      observer.disconnect()
      context?.revert()
      root.removeEventListener('load', onLayout, true)
      window.removeEventListener('resize', onLayout)
      window.removeEventListener('hashchange', sync)
      reducedMotion.removeEventListener('change', configure)
      document.removeEventListener('visibilitychange', onVisibility)
      configureRef.current = null
      root.removeAttribute('data-interactive')
      root.removeAttribute('data-cinema')
      root.removeAttribute('data-scrolled')
    }
  }, [sections])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navRef.current?.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div ref={rootRef} className={`landing ${className}`}>
      <canvas
        ref={canvasRef}
        className="landing-stars"
        aria-hidden="true"
        tabIndex={-1}
      />
      {children}
      <nav
        ref={navRef}
        className="landing-section-nav"
        aria-label={labels.navigation}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMenuOpen(false)
        }}
      >
        <button
          ref={triggerRef}
          className="landing-section-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{labels.section}</span>
          <span>{sections[current]?.label}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="m3 7.5 3-3 3 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <ol id={menuId} className="landing-section-menu" hidden={!menuOpen}>
          {sections.map((section, index) => (
            <li key={section.id}>
              <Link
                href={`#${section.id}`}
                aria-current={current === index ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {section.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <div className="landing-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <div ref={hintRef} className="landing-scroll-hint" aria-hidden="true">
        <span>{labels.scroll}</span>
        <span />
      </div>
      {eligible && (
        <button
          className="landing-motion-toggle"
          type="button"
          onClick={() => {
            const next = !pausedRef.current
            pausedRef.current = next
            setPaused(next)
            configureRef.current?.()
          }}
        >
          {paused ? labels.resume : labels.pause}
        </button>
      )}
    </div>
  )
}
