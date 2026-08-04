'use client'

import { useEffect, useRef } from 'react'
import {
  HERO_CLIP,
  HERO_CLIP_MOBILE,
  HERO_POSTER,
  HERO_POSTER_MOBILE,
} from '@/lib/constants/hero'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

/**
 * Scroll length of the hero in viewport-heights. The sticky viewport pins for
 * (TRACK_VH - 1) screens of scrolling while the clip scrubs from 0 to 1.
 */
const TRACK_VH = 5

/** Source clip frame grid (the ascent clip is encoded at 30 fps). */
const FRAME = 1 / 30

/**
 * Mirrors the preload media queries emitted server-side in page.tsx
 * (portrait AND (coarse pointer OR ≤860px)). Keep them in sync or the LCP
 * poster gets downloaded twice.
 */
const isMobile = () =>
  window.matchMedia('(orientation: portrait)').matches &&
  (window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    window.matchMedia('(max-width: 860px)').matches)

const noop = () => undefined

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

/** 0→1 ramp of `v` across [a, b]. */
const ramp = (v: number, a: number, b: number) => clamp((v - a) / (b - a))

export default function LandingHero({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const video = videoRef.current
    if (!(track && video)) return

    const mobile = isMobile()
    // The poster paints as the sticky container's background, not as the
    // <video poster> attribute: a server-rendered poster can't know the
    // viewport, so it would double-download on mobile (the preload fetches
    // the right file, the attribute the wrong one). The preload has already
    // cached this URL, so the background paints immediately and stays
    // visible under the video until the first frame decodes.
    if (stickyRef.current) {
      const poster = mobile ? HERO_POSTER_MOBILE : HERO_POSTER
      stickyRef.current.style.backgroundImage = `url("${poster}")`
    }
    video.src = mobile ? HERO_CLIP_MOBILE : HERO_CLIP
    // Phones get a coarser seek grid: every seek is a decode, and mobile
    // decoders are the ones that fall over first.
    const step = mobile ? FRAME * 2 : FRAME
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // WebKit never decodes a paused blob/file video until it has been played
    // once; prime with a muted play()+pause() so the first seek paints instead
    // of showing a blank frame. Harmless on Blink/Gecko.
    const prime = () => {
      try {
        const p = video.play()
        if (p) {
          p.then(() => video.pause()).catch(noop)
        }
      } catch {
        // Autoplay refusal / detached media element: nothing to recover.
      }
    }

    const onMeta = () => {
      // Nudge off t=0 so the first real seek is never a no-op.
      try {
        video.currentTime = 0.0001
      } catch {
        // Seeking before metadata: the scrub loop will retry next frame.
      }
      prime()
    }
    video.addEventListener('loadedmetadata', onMeta)

    const reveal = () => {
      video.style.opacity = '1'
    }
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(reveal)
    } else {
      video.addEventListener('loadeddata', reveal, { once: true })
    }

    // iOS refuses play() before the first user gesture; re-prime on it so the
    // first scrub seek is instant.
    const onFirstGesture = () => prime()
    window.addEventListener('pointerdown', onFirstGesture, {
      once: true,
      passive: true,
    })
    window.addEventListener('touchstart', onFirstGesture, {
      once: true,
      passive: true,
    })

    let raf = 0
    let cur = 0
    let lastSeek = -1
    let lastT = 0

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const rect = track.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const target = total > 0 ? clamp(-rect.top / total) : 0

      // Frame-rate-independent smoothing: a fixed per-frame lerp chases twice
      // as fast on a 120 Hz screen; normalising by elapsed time makes the
      // scrub feel the same everywhere.
      const dt = lastT ? Math.min(now - lastT, 100) : 16.7
      lastT = now
      const k = reduce ? 1 : 1 - (1 - 0.18) ** (dt / 16.7)
      cur += (target - cur) * k

      // The lerp advances unconditionally and only the seek waits for the
      // decoder — gating the lerp on `seeking` too would freeze the scrub
      // exactly while it is being driven hardest.
      if (!video.seeking && video.duration) {
        // Quantise to the source frame grid and dedupe: seeking inside the
        // frame already on screen costs a decode and paints nothing.
        const t = Math.round((clamp(cur, 0, 0.999) * video.duration) / step)
        if (t !== lastSeek) {
          lastSeek = t
          try {
            video.currentTime = t * step
          } catch {
            // Decoder busy: the next loop tick reissues the seek.
          }
        }
      }

      if (introRef.current) {
        const out = 1 - ramp(cur, 0.05, 0.26)
        introRef.current.style.opacity = String(out)
        introRef.current.style.transform = `translateY(${cur * -140}px)`
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - ramp(cur, 0, 0.06))
      }
      if (midRef.current) {
        const mid = Math.min(ramp(cur, 0.38, 0.48), 1 - ramp(cur, 0.66, 0.76))
        midRef.current.style.opacity = String(mid)
      }
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${target})`
        // The hairline tracks the flight only — once the ascent completes
        // and the page scrolls on into the sections, a full-width fixed bar
        // would just sit painted over the header forever.
        progressRef.current.style.opacity = target >= 0.999 ? '0' : '1'
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('loadeddata', reveal)
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('touchstart', onFirstGesture)
      // Release the decoder.
      video.removeAttribute('src')
      try {
        video.load()
      } catch {
        // Already detached — nothing to release.
      }
    }
  }, [])

  const m = MESSAGES[locale]
  const t = (key: string) => m[key] ?? key

  return (
    <section
      ref={trackRef}
      style={{ position: 'relative', height: `${TRACK_VH * 100}svh` }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          backgroundColor: '#05060a',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Progress hairline */}
        <div
          ref={progressRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: COCKPIT_ACCENT,
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'opacity 0.3s ease',
            zIndex: 40,
          }}
        />

        {/* Intro block */}
        <div
          ref={introRef}
          style={{
            position: 'absolute',
            left: 'calc(env(safe-area-inset-left, 0px) + 6vw)',
            right: 'calc(env(safe-area-inset-right, 0px) + 6vw)',
            top: '16svh',
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 'clamp(11px, 1.1vw, 14px)',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: COCKPIT_ACCENT,
              margin: '0 0 18px',
            }}
          >
            {t('landing.intro.eyebrow')}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: 'clamp(38px, 7.4vw, 118px)',
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              color: '#f2ede3',
              margin: 0,
              maxWidth: '14em',
              textShadow: `0 0 48px ${COCKPIT_ACCENT}2e`,
            }}
          >
            {t('landing.intro.title')}
          </h1>
        </div>

        {/* Mid-flight line — pinned above the astronaut, never over him. */}
        <div
          ref={midRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '14svh',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: 0,
            pointerEvents: 'none',
            padding: '0 6vw',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: 'clamp(26px, 4.6vw, 72px)',
              fontWeight: 600,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#f2ede3',
              margin: 0,
              textShadow: '0 2px 40px rgba(5, 6, 10, 0.8)',
            }}
          >
            {t('landing.hero.mid')}
          </p>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 26px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            pointerEvents: 'none',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#8f8a97',
          }}
        >
          <span>{t('landing.hint')}</span>
          <span aria-hidden style={{ color: COCKPIT_ACCENT }}>
            ▼
          </span>
        </div>
      </div>
    </section>
  )
}
