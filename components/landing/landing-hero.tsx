'use client'

import { useEffect, useRef } from 'react'
import { makeT } from '@/components/landing/i18n'
import {
  fontsSettled,
  gsap,
  MQ,
  SplitText,
  useGSAP,
} from '@/components/landing/motion'
import {
  HERO_CLIP,
  HERO_CLIP_MOBILE,
  HERO_LOOP_SECONDS,
  HERO_POSTER,
  HERO_POSTER_MOBILE,
} from '@/lib/constants/hero'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'

/**
 * Scroll length of the hero in viewport-heights. The sticky viewport pins for
 * (TRACK_VH - 1) screens of scrolling while the clip scrubs from 0 to 1.
 */
const TRACK_VH = 5

/** Source clip frame grid (the ascent clip is encoded at 30 fps). */
const FRAME = 1 / 30

/**
 * Rest state of the title glow, and the dead version the entrance ignites it
 * from. Declared once and used BOTH in the JSX style and as the tween's end
 * value: GSAP has to land on a string React would have written itself, or the
 * inline style it leaves behind quietly diverges from the rendered one.
 */
const TITLE_GLOW = `0 0 48px ${COCKPIT_ACCENT}2e`
const TITLE_GLOW_OFF = `0 0 0px ${COCKPIT_ACCENT}00`

/** Same contract as TITLE_GLOW — the eyebrow's tracking is tweened into it. */
const EYEBROW_TRACKING = '0.32em'
const EYEBROW_TRACKING_FROM = '0.06em'

/**
 * Mid-flight line dissolve. It resolves out of a blur and tightens from
 * (MID_TRACKING + MID_TRACKING_SPREAD) onto its rest tracking as it fades in,
 * then reverses on the way out — a focus pull rather than a plain opacity ramp.
 */
const MID_TRACKING = 0.04
const MID_TRACKING_SPREAD = 0.1
const MID_BLUR = 6

/** How far the clip creeps toward the viewer across the full ascent. */
const VIDEO_ZOOM = 0.06

/**
 * The clip is one timeline in two acts (see lib/constants/hero.ts): a
 * seamless resting loop, then the ascent. At rest the video PLAYS natively
 * (scrubbing 30fps footage at low speed steps visibly frame to frame — real
 * playback is the only smooth idle). The seam frame is shared by both acts,
 * so the loop wrap, the loop→scrub handover and the scrub→loop return all
 * land on identical pixels: one continuous animation, never a cut or fade.
 * SEAM_GUARD is how far before the seam the loop acts (one wrap or one
 * handover decision per pass); scrolling accelerates playback up to
 * ACCEL_MAX so the handover point arrives quickly while the overlays
 * (driven by their own clock) already respond to the scroll.
 */
const SEAM_GUARD = 0.07
const ACCEL_MAX = 4
const SCROLLED_EPS = 0.002

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

/** `gsap.core.Tween`, spelled without reaching for the global namespace. */
type Pulse = ReturnType<typeof gsap.to>

export default function LandingHero({ locale }: { locale: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const midTextRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<SVGSVGElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  // Written by the entrance timeline once the hint has landed, read by the
  // scrub loop so the bob can be parked while the hint is scrolled away.
  const pulseRef = useRef<Pulse | null>(null)

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

    const tryPlay = () => {
      try {
        const p = video.play()
        if (p) p.catch(noop)
      } catch {
        // Autoplay refusal: the rAF keeps re-asking; until then the frame
        // (or the poster background) stands still — the old behavior.
      }
    }

    const onMeta = () => {
      if (reduce) {
        // No resting act under reduced motion: park on the seam frame, the
        // ascent's own first frame, and let the k=1 scrub own everything.
        try {
          video.currentTime = HERO_LOOP_SECONDS + 0.0001
        } catch {
          // Seeking before metadata: the scrub loop will retry next frame.
        }
        prime()
        return
      }
      // Nudge off t=0 so the wrap seek is never a no-op, then start the
      // resting act.
      try {
        video.currentTime = 0.0001
      } catch {
        // Seeking before metadata: the loop below will retry.
      }
      tryPlay()
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

    // iOS refuses play() before the first user gesture; use it to resume the
    // resting act (or re-prime the decoder when scrubbing).
    const onFirstGesture = () => {
      if (!reduce && video.paused) {
        tryPlay()
      } else {
        prime()
      }
    }
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
    // The video's own scrub clock. `cur` answers to the overlays (instant
    // scroll feedback); `vcur` starts at the seam on handover and chases the
    // same target, so the footage fast-forwards continuously instead of
    // jumping — both clocks converge within a few hundred ms.
    let vcur = 0
    let mode: 'loop' | 'scrub' = reduce ? 'scrub' : 'loop'
    let firstTick = true
    let lastSeek = -1
    let lastT = 0
    // The two scrub-driven style writes below are deduped on a quantised
    // value, so a settled scrub stops touching the DOM entirely instead of
    // repainting a blur and a zoom for every frame the page is idle.
    let lastZoom = -1
    let lastMid = -1

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

      if (video.duration) {
        const ascentLen = video.duration - HERO_LOOP_SECONDS
        const scrolled = target > SCROLLED_EPS

        // A tick with no visible history — first ever (load restoration,
        // deep anchor) or the first after un-parking — has no continuity to
        // protect: nothing relevant was on screen. Hard-sync the scrub.
        if (firstTick) {
          firstTick = false
          if (!reduce && scrolled) {
            mode = 'scrub'
            vcur = target
            cur = target
            lastSeek = -1
            video.playbackRate = 1
            if (!video.paused) video.pause()
          }
        }

        if (mode === 'loop') {
          // Resting act: native playback. Scroll urgency accelerates the
          // transport toward the seam — the one frame the ascent shares.
          const rate = scrolled ? Math.min(ACCEL_MAX, 1 + target * 24) : 1
          if (video.playbackRate !== rate) video.playbackRate = rate
          if (video.currentTime >= HERO_LOOP_SECONDS - SEAM_GUARD) {
            if (scrolled) {
              video.pause()
              video.playbackRate = 1
              mode = 'scrub'
              vcur = 0
              lastSeek = -1
            } else {
              // Wrap: first and last loop frames are identical.
              try {
                video.currentTime = 0.0001
              } catch {
                // Decoder busy: retried next tick.
              }
            }
          } else if (video.paused && !document.hidden) {
            tryPlay()
          }
        } else if (
          !reduce &&
          target <= SCROLLED_EPS &&
          vcur <= 0.004 &&
          !video.seeking
        ) {
          // Back at the top with the footage settled on the seam: hand the
          // frame back to the resting act.
          mode = 'loop'
          lastSeek = -1
          try {
            video.currentTime = 0.0001
          } catch {
            // Decoder busy: retried next tick.
          }
          tryPlay()
        }

        // The lerp advances unconditionally and only the seek waits for the
        // decoder — gating the lerp on `seeking` too would freeze the scrub
        // exactly while it is being driven hardest.
        if (mode === 'scrub') {
          vcur += (target - vcur) * k
          if (!video.seeking) {
            // Quantise to the source frame grid and dedupe: seeking inside
            // the frame already on screen costs a decode and paints nothing.
            const seconds = Math.min(
              HERO_LOOP_SECONDS + clamp(vcur, 0, 0.9995) * ascentLen,
              video.duration - step
            )
            const t = Math.round(seconds / step)
            if (t !== lastSeek) {
              lastSeek = t
              try {
                video.currentTime = t * step
              } catch {
                // Decoder busy: the next loop tick reissues the seek.
              }
            }
          }
        }
      }

      // Slow push-in over the whole ascent. The clip's own motion goes quiet
      // in places; a 6% creep keeps the frame breathing there without
      // touching the seek math. Scaling up only ever crops, so the poster
      // underneath is never exposed. Decorative on top of the scrub itself,
      // so reduced motion keeps the frame steady.
      const zoom = Math.round(cur * 1000)
      if (!reduce && zoom !== lastZoom) {
        lastZoom = zoom
        const s = 1 + (zoom / 1000) * VIDEO_ZOOM
        video.style.transform = `scale(${s.toFixed(5)})`
      }

      if (introRef.current) {
        const out = 1 - ramp(cur, 0.05, 0.26)
        introRef.current.style.opacity = String(out)
        // The parallax drift is decoration; the fade alone carries the state
        // under reduced motion. translate3d keeps the blurred-glow headline
        // on the compositor instead of re-rasterising it every frame.
        if (!reduce) {
          introRef.current.style.transform = `translate3d(0, ${cur * -140}px, 0)`
        }
      }
      if (hintRef.current) {
        const vis = 1 - ramp(cur, 0, 0.06)
        hintRef.current.style.opacity = String(vis)
        // The bob is an infinite tween: park it while the hint is scrolled
        // away rather than pay for a style write on every frame of the
        // flight. Read back from GSAP so the state is self-correcting.
        const pulse = pulseRef.current
        const want = vis > 0.01
        if (pulse && pulse.paused() === want) pulse.paused(!want)
      }
      if (midRef.current) {
        const mid = Math.min(ramp(cur, 0.38, 0.48), 1 - ramp(cur, 0.66, 0.76))
        midRef.current.style.opacity = String(mid)
        const text = midTextRef.current
        const q = Math.round(mid * 200)
        // The focus pull (blur + tracking) is decorative; under reduced
        // motion the line simply fades.
        if (!reduce && text && q !== lastMid) {
          lastMid = q
          const p = q / 200
          const blur = (1 - p) * MID_BLUR
          // Dropped to `none` only at the hidden end, where a zero blur would
          // otherwise hold a compositor layer for the whole scroll. Not at the
          // visible end: text inside a filter layer loses subpixel AA, so
          // removing the filter there would pop the glyph weight on screen.
          text.style.filter = p === 0 ? 'none' : `blur(${blur.toFixed(2)}px)`
          const tracking = MID_TRACKING + (1 - p) * MID_TRACKING_SPREAD
          text.style.letterSpacing = `${tracking.toFixed(4)}em`
        }
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

    // The loop's getBoundingClientRect read is a forced layout every frame,
    // paid for the entire page once GSAP has dirtied styles in the same
    // frame. Nothing the loop writes can change while the track is fully
    // off-screen, so park it there and resume on re-entry.
    let parked = false
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      if (entry.isIntersecting === parked) {
        parked = !entry.isIntersecting
        if (parked) {
          cancelAnimationFrame(raf)
          if (mode === 'loop') video.pause()
        } else {
          lastT = 0
          // Let the first tick re-derive the mode from the actual scroll
          // position — re-entering mid-ascent must not show the loop.
          firstTick = true
          if (mode === 'loop') tryPlay()
          raf = requestAnimationFrame(loop)
        }
      }
    })
    io.observe(track)

    return () => {
      io.disconnect()
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

  // Entrance. Deliberately not a ScrollTrigger: the hero drives everything
  // from the rAF above, and this fires once at load. It only ever touches
  // CHILDREN of the elements that loop writes to (intro container, hint
  // container), so the two never fight over the same style property.
  useGSAP(
    () => {
      const eyebrow = eyebrowRef.current
      const title = titleRef.current
      const hint = hintRef.current
      const arrow = arrowRef.current
      if (!(eyebrow && title && hint && arrow)) return

      const mm = gsap.matchMedia()

      mm.add(MQ.motionOk, () => {
        const items = Array.from(hint.children)

        // Everything below is hidden HERE, inside the motion-ok branch, and
        // never in the JSX: reduced motion (and no-JS) gets the rest state
        // painted straight from the server markup. useGSAP runs in a layout
        // effect, so this beats first paint — no flash of the rest state.
        gsap.set([eyebrow, ...items], { opacity: 0 })
        gsap.set(title, { opacity: 0, textShadow: TITLE_GLOW_OFF })

        // Created here (not inside the timeline callback) so it is collected
        // by this context and reverted with it.
        const pulse = gsap.to(arrow, {
          y: 5,
          duration: 1.15,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        })

        let split: SplitText | null = null
        let tl: ReturnType<typeof gsap.timeline> | null = null
        let live = true

        const rest = () => {
          gsap.set(title, { opacity: 1, textShadow: TITLE_GLOW })
          gsap.set(eyebrow, { opacity: 1, letterSpacing: EYEBROW_TRACKING })
          gsap.set(items, { opacity: 1, y: 0 })
          // The bob is killed, not reverted, so park the arrow by hand or it
          // stays frozen wherever the yoyo happened to be.
          gsap.set(arrow, { y: 0 })
        }

        const unsplit = () => {
          if (!split) return
          split.revert()
          split = null
          // revert() restores the original markup; re-assert the two props
          // the timeline still owns rather than trusting what it put back.
          gsap.set(title, { opacity: 1, textShadow: TITLE_GLOW_OFF })
        }

        const start = () => {
          if (!live) return
          split = SplitText.create(title, { type: 'lines', mask: 'lines' })
          gsap.set(title, { opacity: 1 })

          tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
          tl.fromTo(
            split.lines,
            { yPercent: 118 },
            { yPercent: 0, duration: 1.15, stagger: 0.09 },
            0
          )
            // Tracking is a layout property, so this is the one exception to
            // transforms-and-opacity: a single short line, in a box whose
            // width is already fixed by the intro block, tweened once.
            // Both endpoints are em so GSAP keeps the unit and lands exactly
            // on the value React rendered.
            .fromTo(
              eyebrow,
              { opacity: 0, letterSpacing: EYEBROW_TRACKING_FROM },
              { opacity: 1, letterSpacing: EYEBROW_TRACKING, duration: 1.2 },
              0.05
            )
            // Drop the masks BEFORE the glow ignites — a 48px halo inside an
            // overflow-clipped line box seams at every line break.
            .add(unsplit)
            .to(title, {
              textShadow: TITLE_GLOW,
              duration: 1.1,
              ease: 'power2.out',
            })
            .fromTo(
              items,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
              '<0.05'
            )
            .add(() => {
              pulse.play()
              pulseRef.current = pulse
            })
        }

        fontsSettled().then(start)

        return () => {
          live = false
          pulseRef.current = null
          pulse.kill()
          tl?.kill()
          unsplit()
          // Killing mid-flight freezes inline styles wherever they were, so
          // hand the rest state back explicitly. Never clearProps: React owns
          // the inline tracking and glow, and it will not re-render to
          // restore them.
          rest()
        }
      })

      return () => {
        mm.revert()
      }
    },
    { scope: stickyRef }
  )

  const t = makeT(locale)

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
            ref={eyebrowRef}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 'clamp(11px, 1.1vw, 14px)',
              letterSpacing: EYEBROW_TRACKING,
              textTransform: 'uppercase',
              color: COCKPIT_ACCENT,
              margin: '0 0 18px',
            }}
          >
            {t('landing.intro.eyebrow')}
          </p>
          <h1
            ref={titleRef}
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
              textShadow: TITLE_GLOW,
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
            ref={midTextRef}
            style={{
              fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
              fontSize: 'clamp(26px, 4.6vw, 72px)',
              fontWeight: 600,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              letterSpacing: `${MID_TRACKING}em`,
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
          <span aria-hidden style={{ display: 'flex' }}>
            <svg
              ref={arrowRef}
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1.4 1.4 7.5 7.4 13.6 1.4"
                stroke={COCKPIT_ACCENT}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  )
}
