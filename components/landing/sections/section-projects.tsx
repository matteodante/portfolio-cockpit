'use client'

import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { makeT } from '@/components/landing/i18n'
import {
  fontsSettled,
  gsap,
  MQ,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from '@/components/landing/motion'
import {
  CLAUDE_LOCAL_DOCS_REPO_URL,
  GYMTREE_APP_STORE_URL,
  GYMTREE_APP_STORE_URL_IT,
  MAESTRO_APP_STORE_URL,
  MAESTRO_APP_STORE_URL_IT,
  PORTFOLIO_REPO_URL,
} from '@/lib/constants/contact'
import { ART_SIZE, PROJECT_ART } from '@/lib/constants/landing-assets'
import type { Locale } from '@/lib/i18n/config'

type ProjectId = keyof typeof PROJECT_ART

/** Hangar order: the two shipped apps first, then the two public repos. */
const ORDER = [
  'maestro',
  'gymtree',
  'claudeLocalDocs',
  'portfolio',
] as const satisfies readonly ProjectId[]

/** Max lean, in degrees, of the velocity-driven skew on the track. */
const SKEW_MAX = 3

const projectHref = (id: ProjectId, locale: Locale) => {
  if (id === 'maestro') {
    return locale === 'it' ? MAESTRO_APP_STORE_URL_IT : MAESTRO_APP_STORE_URL
  }
  if (id === 'gymtree') {
    return locale === 'it' ? GYMTREE_APP_STORE_URL_IT : GYMTREE_APP_STORE_URL
  }
  if (id === 'claudeLocalDocs') return CLAUDE_LOCAL_DOCS_REPO_URL
  return PORTFOLIO_REPO_URL
}

const pad = (n: number) => String(n).padStart(2, '0')

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Two layouts share one DOM.
 *
 * Base (mobile, reduced motion, before hydration): a normal column — intro,
 * a native horizontal snap carousel, the readout, outro. `display: contents`
 * on the track lifts its children into the stage's flex column so `order`
 * can slot the readout between the carousel and the outro.
 *
 * `[data-mode='pin']` (set by the desktop branch of matchMedia): the track
 * becomes one long flex row, the carousel dissolves into it (`display:
 * contents` again, this time so its cards become track children), and the
 * readout floats at the bottom of the pinned stage.
 */
const CSS = `
.lp-projects {
  --lp-accent: #ff6b35;
  --lp-ink: #f2ede3;
  --lp-dim: #8f8a97;
  --lp-line: rgba(242, 237, 227, 0.22);
  --lp-panel: rgba(20, 18, 15, 0.55);
  --lp-panel-hi: rgba(31, 28, 24, 0.8);
  --lp-card: min(76vw, 340px);
  --lp-pl: calc(env(safe-area-inset-left, 0px) + 6vw);
  --lp-pr: calc(env(safe-area-inset-right, 0px) + 6vw);
  position: relative;
  display: block;
}

@media (min-width: 800px) {
  .lp-projects { --lp-card: clamp(300px, 24vw, 396px); }
}

.lp-projects-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(34px, 6vh, 62px);
  padding-top: 14vh;
  padding-bottom: 14vh;
}

.lp-projects-track { display: contents; }

.lp-projects-intro { order: 1; }
.lp-projects-rack { order: 2; }
.lp-projects-instrument { order: 3; }
.lp-projects-outro { order: 4; }

.lp-projects-intro,
.lp-projects-outro,
.lp-projects-instrument {
  padding-left: var(--lp-pl);
  padding-right: var(--lp-pr);
}

/* ---------- intro panel ---------- */

.lp-projects-eyebrow {
  display: block;
  margin-bottom: clamp(18px, 2.6vh, 28px);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: clamp(11px, 1.1vw, 14px);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--lp-accent);
}

.lp-projects-title {
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(40px, 5.6vw, 82px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--lp-ink);
  max-width: 8em;
  text-shadow: 0 0 48px rgba(255, 107, 53, 0.18);
}

.lp-projects-lede {
  margin-top: clamp(20px, 3vh, 30px);
  font-family: var(--font-rajdhani), system-ui, sans-serif;
  font-size: clamp(17px, 1.6vw, 21px);
  line-height: 1.55;
  color: var(--lp-dim);
  max-width: 460px;
}

.lp-projects-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: clamp(22px, 3.4vh, 36px);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 11px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--lp-dim);
}

.lp-projects-hint-mark { color: var(--lp-accent); }

.lp-projects-hint-dt { display: none; }
[data-mode='pin'] .lp-projects-hint-dt { display: flex; }
[data-mode='pin'] .lp-projects-hint-mb { display: none; }

/* ---------- the rack ---------- */

.lp-projects-rack {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-left: var(--lp-pl);
  scroll-padding-right: var(--lp-pr);
  /* The vertical padding is headroom for the hover halo — the scroller
     clips at its padding box, and a flush box would shear the glow off. */
  padding: 18px var(--lp-pr) 18px var(--lp-pl);
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.lp-projects-rack::-webkit-scrollbar { display: none; }

.lp-projects-rack:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 3px;
}

.lp-projects-bay {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  width: var(--lp-card);
  scroll-snap-align: start;
}

/* End-aligned so the last card is reachable under mandatory snapping. */
.lp-projects-bay:last-child { scroll-snap-align: end; }

.lp-projects-ghost {
  display: none;
  position: absolute;
  top: -0.44em;
  left: -0.16em;
  z-index: 0;
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(120px, 15vw, 240px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(242, 237, 227, 0.14);
  pointer-events: none;
  user-select: none;
}

[data-mode='pin'] .lp-projects-ghost { display: block; }

/* ---------- card ---------- */

.lp-projects-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--lp-line);
  background: var(--lp-panel);
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.lp-projects-card:focus-within {
  border-color: rgba(255, 107, 53, 0.6);
  background: var(--lp-panel-hi);
  box-shadow: 0 0 34px rgba(255, 107, 53, 0.16);
}

@media (hover: hover) {
  .lp-projects-card:hover {
    border-color: rgba(255, 107, 53, 0.6);
    background: var(--lp-panel-hi);
    box-shadow: 0 0 34px rgba(255, 107, 53, 0.16);
    transform: translateY(-2px);
  }
  .lp-projects-card:hover .lp-projects-link { color: var(--lp-accent); }
  .lp-projects-card:hover .lp-projects-arrow {
    transform: translate(2px, -2px);
  }
  .lp-projects-card:hover .lp-projects-art img { transform: scale(1.04); }
}

.lp-projects-art {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-bottom: 1px solid rgba(242, 237, 227, 0.12);
  background: #05060a;
}

/* Bigger than its frame on every axis: the toy is cropped by the top edge
   and stands on the panel line, with side slack for the parallax drift. */
.lp-projects-art-inner {
  position: absolute;
  top: -35%;
  right: -9%;
  left: -9%;
}

.lp-projects-art img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.4s ease;
}

.lp-projects-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  padding: clamp(15px, 1.2vw, 20px);
}

.lp-projects-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lp-projects-idx {
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: var(--lp-dim);
}

.lp-projects-badge {
  padding: 6px 11px;
  border: 1px solid var(--lp-line);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--lp-ink);
}

.lp-projects-name {
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(18px, 1.5vw, 23px);
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--lp-ink);
}

.lp-projects-desc {
  font-family: var(--font-rajdhani), system-ui, sans-serif;
  font-size: clamp(15px, 1.05vw, 16px);
  line-height: 1.5;
  color: var(--lp-dim);
}

.lp-projects-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--lp-ink);
  text-decoration: none;
  transition: color 0.15s ease;
}

/* The label is the only link; this overlay makes the whole panel its target. */
.lp-projects-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.lp-projects-link:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 3px;
}

.lp-projects-arrow {
  display: inline-block;
  color: var(--lp-accent);
  transition: transform 0.15s ease;
}

/* ---------- readout ---------- */

.lp-projects-instrument {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 28px);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--lp-dim);
}

.lp-projects-count { white-space: nowrap; }
.lp-projects-count-now { color: var(--lp-ink); }

.lp-projects-bar {
  position: relative;
  flex: 1 1 auto;
  height: 2px;
  background: rgba(242, 237, 227, 0.12);
}

.lp-projects-bar-fill {
  position: absolute;
  inset: 0;
  display: block;
  background: var(--lp-accent);
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.55);
  transform: scaleX(0);
  transform-origin: left center;
}

.lp-projects-active {
  max-width: 34%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
}

@media (max-width: 799px) {
  .lp-projects-active { display: none; }
}

/* ---------- outro panel ---------- */

.lp-projects-outro-line {
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(24px, 3.2vw, 44px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--lp-ink);
  max-width: 10em;
}

.lp-projects-cta {
  display: inline-flex;
  align-items: center;
  margin-top: clamp(24px, 4vh, 40px);
  padding: 18px 34px;
  border-radius: 999px;
  background: var(--lp-accent);
  box-shadow: 0 0 42px rgba(255, 107, 53, 0.33);
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(13px, 1.3vw, 16px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0b0812;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.lp-projects-cta:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 3px;
}

@media (hover: hover) {
  .lp-projects-cta:hover {
    transform: translateY(-1px);
    box-shadow:
      0 0 18px rgba(255, 107, 53, 0.67),
      0 0 56px rgba(255, 107, 53, 0.4);
  }
}

/* ---------- pinned horizontal mode ---------- */

[data-mode='pin'] .lp-projects-stage {
  height: 100svh;
  flex-direction: row;
  align-items: center;
  gap: 0;
  padding: 0 0 clamp(76px, 12vh, 128px);
  /* clip, not hidden: hidden makes the stage a scrollport, and the UA's
     focus scroll-into-view would offset it under the scrub's nose with no
     way back. clip clips identically but cannot scroll. */
  overflow: clip;
}

[data-mode='pin'] .lp-projects-track {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: clamp(28px, 3.4vw, 64px);
  width: max-content;
  padding-left: var(--lp-pl);
  padding-right: var(--lp-pr);
  will-change: transform;
}

[data-mode='pin'] .lp-projects-rack {
  display: contents;
}

/* The cards become track children here, so the flow-mode order values have
   to drop back to source order or they'd jump ahead of the intro. */
[data-mode='pin'] .lp-projects-intro,
[data-mode='pin'] .lp-projects-outro {
  flex: 0 0 auto;
  order: 0;
  padding: 0;
}

[data-mode='pin'] .lp-projects-intro { width: min(50vw, 620px); }
[data-mode='pin'] .lp-projects-outro { width: min(42vw, 520px); }

/* Content-sized with a floor: the panels never clip their own copy on a
   short window, and the rack still reads as one rank of equal instruments. */
[data-mode='pin'] .lp-projects-bay {
  min-height: min(62svh, 540px);
}

[data-mode='pin'] .lp-projects-bay:nth-child(even) {
  margin-top: clamp(18px, 4vh, 48px);
}

/* Laptop-short windows: crop the toy harder rather than push the link out
   of the pinned stage. */
@media (min-width: 800px) and (max-height: 680px) {
  .lp-projects-art { aspect-ratio: 16 / 9; }
  .lp-projects-art-inner { top: -55%; }
}

[data-mode='pin'] .lp-projects-instrument {
  position: absolute;
  right: var(--lp-pr);
  bottom: clamp(26px, 5vh, 52px);
  left: var(--lp-pl);
  padding: 0;
}
`

export default function SectionProjects({ locale }: { locale: Locale }) {
  const t = makeT(locale)

  const scope = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rackRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const section = scope.current
      const stage = stageRef.current
      const track = trackRef.current
      const rack = rackRef.current
      const bar = barRef.current
      const count = countRef.current
      const active = activeRef.current
      if (!(section && stage && track && rack && bar && count && active)) return

      const pick = <T extends HTMLElement>(sel: string) =>
        Array.from(section.querySelectorAll<T>(sel))

      const bays = pick('.lp-projects-bay')
      const arts = pick('.lp-projects-art-inner')
      const ghosts = pick('.lp-projects-ghost')
      const leaves = pick('.lp-projects-panel, .lp-projects-bay')
      const names = ORDER.map((id) => t(`projects.${id}.title`))

      /** The only writer of the readout — every branch feeds this. */
      const paint = (progress: number, index: number) => {
        bar.style.transform = `scaleX(${clamp01(progress)})`
        const n = pad(index + 1)
        if (count.textContent !== n) count.textContent = n
        const name = names[index]
        if (name && active.textContent !== name) active.textContent = name
      }

      /** Card centres in `base`'s content coordinates. */
      const centersIn = (base: HTMLElement, scrolled: number) => {
        const origin = base.getBoundingClientRect().left - scrolled
        return bays.map((bay) => {
          const r = bay.getBoundingClientRect()
          return r.left - origin + r.width / 2
        })
      }

      const nearest = (centers: number[], x: number) => {
        let best = 0
        let min = Number.POSITIVE_INFINITY
        for (const [i, c] of centers.entries()) {
          const d = Math.abs(c - x)
          if (d < min) {
            min = d
            best = i
          }
        }
        return best
      }

      const mm = gsap.matchMedia()

      mm.add({ dt: MQ.dt, mobile: MQ.mobile, reduce: MQ.reduce }, (ctx) => {
        const reduce = Boolean(ctx.conditions?.reduce)
        const pinned = Boolean(ctx.conditions?.dt) && !reduce
        const cleanups: Array<() => void> = []
        let disposed = false

        // Masked line reveal on the giant title. Split after the webfont
        // lands or the line boxes are measured against the fallback.
        if (!reduce) {
          const heading =
            section.querySelector<HTMLElement>('.lp-projects-title')
          if (heading) {
            let split: SplitText | null = null
            cleanups.push(() => split?.revert())
            void fontsSettled().then(() => {
              if (disposed) return
              ctx.add(() => {
                // Halo off while masked — the line clip boxes would frame it
                // as grey rectangles — and back on once the split reverts.
                heading.style.textShadow = 'none'
                split = new SplitText(heading, { type: 'lines', mask: 'lines' })
                gsap.from(split.lines, {
                  yPercent: 118,
                  duration: 1.05,
                  ease: 'expo.out',
                  stagger: 0.075,
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 82%',
                    once: true,
                  },
                  // Hand the heading back as one element: free reflow on
                  // resize, and the ambient halo returns unclipped.
                  onComplete: () => {
                    split?.revert()
                    split = null
                    heading.style.textShadow = ''
                  },
                })
                // The split rewrote the heading's line boxes underneath the
                // pin: re-measure before the scrub distance is trusted.
                ScrollTrigger.refresh()
              })
            })
          }
        }

        if (pinned) {
          // Rewind the carousel before it stops being a scroll container,
          // or a resize back to flow mode restores a stale offset.
          rack.scrollLeft = 0
          section.dataset.mode = 'pin'

          let dist = 1
          let stageW = stage.clientWidth
          let centers: number[] = []
          // Called by the function-based `x`/`end`, i.e. on every refresh —
          // so the per-frame handler below never has to read layout.
          const measure = () => {
            stageW = stage.clientWidth
            dist = Math.max(1, track.offsetWidth - stageW)
            return dist
          }

          const skewTo = gsap.quickTo(leaves, 'skewX', {
            duration: 0.5,
            ease: 'power3.out',
          })
          // One reusable timer, restarted per tick — allocating a fresh
          // delayedCall on every scrub frame is a tween insert/remove at
          // 60/s. The lean is quantised for the same reason: retargeting
          // six quickTo tweens for a sub-0.1° change paints nothing.
          let leanAt = 0
          const settle = gsap
            .delayedCall(0.14, () => {
              leanAt = 0
              skewTo(0)
            })
            .pause()

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${measure()}`,
              pin: stage,
              anticipatePin: 1,
              scrub: 0.55,
              invalidateOnRefresh: true,
              onRefresh: () => {
                centers = centersIn(track, 0)
              },
              onUpdate: (self) => {
                paint(
                  self.progress,
                  nearest(centers, dist * self.progress + stageW / 2)
                )
                // The rack leans into the scroll and eases back when it stops.
                const lean =
                  Math.round(
                    gsap.utils.clamp(
                      -SKEW_MAX,
                      SKEW_MAX,
                      self.getVelocity() / -280
                    ) * 10
                  ) / 10
                if (lean !== leanAt) {
                  leanAt = lean
                  skewTo(lean)
                }
                settle.restart(true)
              },
            },
          })

          // Three speeds: the bay numbers lag furthest behind, the art
          // trails inside its frame, the panels ride the track itself.
          tl.to(track, { x: () => -measure(), ease: 'none' }, 0)
            .fromTo(arts, { xPercent: -4 }, { xPercent: 4, ease: 'none' }, 0)
            .fromTo(
              ghosts,
              { xPercent: -16 },
              { xPercent: 16, ease: 'none' },
              0
            )

          // Tabbing to a card off-screen would otherwise let the browser
          // scroll the pinned stage to an arbitrary place; drive the scrub
          // to the position that centres the focused panel instead.
          let raf = 0
          const onFocusIn = (e: FocusEvent) => {
            const st = tl.scrollTrigger
            const el = e.target
            if (!(st && el instanceof Element)) return
            const panel = el.closest('.lp-projects-bay, .lp-projects-panel')
            if (!panel) return
            const r = panel.getBoundingClientRect()
            const origin = track.getBoundingClientRect().left
            const p = clamp01(
              (r.left - origin + r.width / 2 - stageW / 2) / dist
            )
            const y = st.start + (st.end - st.start) * p
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => window.scrollTo(0, y))
          }
          track.addEventListener('focusin', onFocusIn)

          const st = tl.scrollTrigger
          if (st) {
            centers = centersIn(track, 0)
            paint(
              st.progress,
              nearest(centers, dist * st.progress + stageW / 2)
            )
          }

          cleanups.push(() => {
            track.removeEventListener('focusin', onFocusIn)
            cancelAnimationFrame(raf)
            settle.kill()
            delete section.dataset.mode
          })
        } else {
          // Native carousel: the rack scrolls itself, JS only reads it.
          rack.setAttribute('tabindex', '0')

          let centers = centersIn(rack, rack.scrollLeft)
          let rackWidth = rack.clientWidth
          let raf = 0
          let queued = false

          // The bays themselves are never transformed (only the inner art
          // is), so their centres in content coordinates are stable between
          // resizes — scrollLeft is the only per-frame read needed.
          const drift = () => {
            if (reduce) return
            const mid = rack.scrollLeft + rackWidth / 2
            for (const [i, art] of arts.entries()) {
              const center = centers[i]
              if (center === undefined) continue
              const off = (center - mid) / rackWidth
              const shift = gsap.utils.clamp(-4, 4, -off * 5)
              art.style.transform = `translate3d(${shift.toFixed(2)}%, 0, 0)`
            }
          }

          const sync = () => {
            const span = rack.scrollWidth - rack.clientWidth
            const p = span > 0 ? rack.scrollLeft / span : 0
            const index = nearest(
              centers,
              rack.scrollLeft + rack.clientWidth / 2
            )
            drift()
            paint(p, index)
          }

          const onScroll = () => {
            if (queued) return
            queued = true
            raf = requestAnimationFrame(() => {
              queued = false
              sync()
            })
          }
          const onResize = () => {
            centers = centersIn(rack, rack.scrollLeft)
            rackWidth = rack.clientWidth
            sync()
          }

          rack.addEventListener('scroll', onScroll, { passive: true })
          window.addEventListener('resize', onResize)
          sync()

          cleanups.push(() => {
            rack.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
            cancelAnimationFrame(raf)
            rack.removeAttribute('tabindex')
            for (const art of arts) art.style.transform = ''
          })
        }

        return () => {
          disposed = true
          for (const fn of cleanups) fn()
        }
      })

      return () => mm.revert()
    },
    { scope }
  )

  const first = ORDER[0]

  return (
    <section
      ref={scope}
      className="lp-projects"
      aria-labelledby="lp-projects-heading"
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static css */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div ref={stageRef} className="lp-projects-stage">
        <div ref={trackRef} className="lp-projects-track">
          <div className="lp-projects-panel lp-projects-intro">
            <span className="lp-projects-eyebrow">
              {t('landing.projects.eyebrow')}
            </span>
            <h2 id="lp-projects-heading" className="lp-projects-title">
              {t('landing.projects.title')}
            </h2>
            <p className="lp-projects-lede">{t('landing.projects.body')}</p>
            <p className="lp-projects-hint lp-projects-hint-dt">
              <span>{t('landing.projects.hintScroll')}</span>
              <span className="lp-projects-hint-mark" aria-hidden="true">
                ↓
              </span>
            </p>
            <p className="lp-projects-hint lp-projects-hint-mb">
              <span>{t('landing.projects.hintSwipe')}</span>
              <span className="lp-projects-hint-mark" aria-hidden="true">
                →
              </span>
            </p>
          </div>

          {/* A named <section> is the region landmark; the mobile branch
              adds tabindex so the scroller is keyboard-operable. */}
          <section
            ref={rackRef}
            className="lp-projects-rack"
            aria-label={t('landing.projects.rackLabel')}
          >
            {ORDER.map((id, i) => (
              <div className="lp-projects-bay" key={id}>
                <span className="lp-projects-ghost" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <article className="lp-projects-card">
                  <div className="lp-projects-art">
                    <div className="lp-projects-art-inner">
                      <Image
                        src={PROJECT_ART[id]}
                        alt=""
                        aria-hidden="true"
                        width={ART_SIZE}
                        height={ART_SIZE}
                        sizes="(max-width: 799px) 76vw, 400px"
                        loading="eager"
                      />
                    </div>
                  </div>
                  <div className="lp-projects-body">
                    <div className="lp-projects-meta">
                      <span className="lp-projects-idx">{pad(i + 1)}</span>
                      <span className="lp-projects-badge">
                        {t(`projects.${id}.badge`)}
                      </span>
                    </div>
                    <h3 className="lp-projects-name">
                      {t(`projects.${id}.title`)}
                    </h3>
                    <p className="lp-projects-desc">
                      {t(`projects.${id}.desc`)}
                    </p>
                    <a
                      className="lp-projects-link"
                      href={projectHref(id, locale)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t(`projects.${id}.title`)} — ${t(
                        `projects.${id}.link`
                      )}`}
                    >
                      <span>{t(`projects.${id}.link`)}</span>
                      <span className="lp-projects-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </section>

          <div className="lp-projects-panel lp-projects-outro">
            <p className="lp-projects-outro-line">
              {t('landing.projects.outro')}
            </p>
            <Link
              href={`/${locale}/cockpit` as Route}
              className="lp-projects-cta"
            >
              {t('landing.cta.primary')}
            </Link>
          </div>
        </div>

        {/* Instrument readout — mirrors what the cards already say, so it
            stays out of the accessibility tree. */}
        <div className="lp-projects-instrument" aria-hidden="true">
          <span className="lp-projects-count">
            <span ref={countRef} className="lp-projects-count-now">
              01
            </span>
            {` / ${pad(ORDER.length)}`}
          </span>
          <span className="lp-projects-bar">
            <span ref={barRef} className="lp-projects-bar-fill" />
          </span>
          <span ref={activeRef} className="lp-projects-active">
            {t(`projects.${first}.title`)}
          </span>
        </div>
      </div>
    </section>
  )
}
