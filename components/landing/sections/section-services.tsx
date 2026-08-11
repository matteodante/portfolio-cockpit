'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { makeT } from '@/components/landing/i18n'
import {
  fontsSettled,
  gsap,
  MQ,
  SplitText,
  useGSAP,
} from '@/components/landing/motion'
import { ART_SIZE, SERVICE_ART } from '@/lib/constants/landing-assets'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'

type ServiceId = keyof typeof SERVICE_ART

/**
 * One editorial scene per service. `side` is where the toy render sits on
 * desktop — the copy takes the opposite column and flushes to the outer page
 * edge, so every scene has one clean margin and one ragged edge facing the
 * art. The ghost numeral always bleeds off the same outer edge as the art.
 */
type Scene = { id: ServiceId; num: string; side: 'left' | 'right' }

const SCENES: readonly Scene[] = [
  { id: 'webapp', num: '01', side: 'right' },
  { id: 'ai', num: '02', side: 'left' },
  { id: 'web', num: '03', side: 'right' },
]

const TAGS = [1, 2, 3] as const

/**
 * Per-breakpoint motion budget. The three depths never share a value: the
 * ghost numeral drifts *down* the page as you scroll (slower than the page →
 * far away), the art drifts *up* (faster than the page → close), and the copy
 * rides at page speed in between. Mobile keeps the same choreography at
 * roughly half the amplitude so a thumb-scroll never feels seasick.
 */
type Depth = {
  /** ± yPercent of the ghost numeral across the scene's scroll span. */
  ghost: number
  /** ± xPercent lateral drift of the ghost numeral. */
  ghostX: number
  /** ± yPercent of the art, applied in the opposite direction. */
  art: number
  /** ± px of the idle zero-g bob. */
  float: number
  /** ± degrees of the idle tilt. */
  tilt: number
  /** px rise for the body / chip entrance. */
  rise: number
}

const DEPTH_DT: Depth = {
  ghost: 26,
  ghostX: 4,
  art: 12,
  float: 11,
  tilt: 1.4,
  rise: 26,
}

const DEPTH_MOBILE: Depth = {
  ghost: 15,
  ghostX: 2,
  art: 7,
  float: 7,
  tilt: 1,
  rise: 18,
}

const STYLES = `
.lp-services {
  position: relative;
  z-index: 0;
}

.lp-services-scene {
  position: relative;
  overflow: hidden;
  padding:
    14svh calc(env(safe-area-inset-right, 0px) + 6vw)
    14svh calc(env(safe-area-inset-left, 0px) + 6vw);
}

.lp-services-inner {
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 7vw, 62px);
  width: 100%;
  max-width: 1560px;
  margin: 0 auto;
}

/* --- copy column ------------------------------------------------------- */

.lp-services-copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  container-type: inline-size;
}

.lp-services-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 clamp(16px, 1.8vw, 24px);
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: clamp(11px, 1.1vw, 14px);
  line-height: 1.4;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--lp-services-accent, #ff6b35);
}

.lp-services-rule {
  flex: none;
  width: clamp(28px, 4vw, 56px);
  height: 1px;
  background: var(--lp-services-accent, #ff6b35);
  transform-origin: left center;
}

.lp-services-eyebrow-mask {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 2px;
}

/* Blockified so the masked slide-up actually transforms — inline boxes
   ignore transforms. */
.lp-services-eyebrow-text {
  display: inline-block;
}

/* The headline is sized by its own column, not by the viewport: the grid
   flips proportions per scene and Orbitron caps are wide, so a vw-based
   clamp overflows the narrow side somewhere between 800 and 1100px. 11cqi
   guarantees ~9em of measure — enough for the longest single word in either
   language. The vw line above it is the fallback for engines without
   container queries. */
.lp-services-title {
  max-width: 12em;
  margin: 0 0 clamp(20px, 2.4vw, 32px);
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(34px, 8.4vw, 56px);
  font-size: clamp(34px, 11cqi, 62px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  text-wrap: balance;
  color: #f2ede3;
  text-shadow: 0 0 64px rgba(255, 107, 53, 0.18);
}

/* SplitText clones each line into a mask with overflow:clip and no clip
   margin, which shaves the tail off commas and parentheses at 1.05 leading.
   The negative margin cancels the padding, so the clip box grows downward
   without touching the typeset line spacing. The class name is GSAP's: it
   suffixes the linesClass option with -mask. */
.lp-services-line-mask {
  margin-bottom: -0.1em;
  padding-bottom: 0.1em;
}

.lp-services-body {
  max-width: 560px;
  margin: 0 0 clamp(28px, 3.4vw, 42px);
  font-family: var(--font-rajdhani), system-ui, sans-serif;
  font-size: clamp(17px, 1.6vw, 21px);
  line-height: 1.55;
  text-wrap: pretty;
  color: #8f8a97;
}

.lp-services-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lp-services-tag {
  padding: 7px 14px;
  border: 1px solid rgba(242, 237, 227, 0.22);
  border-radius: 999px;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #f2ede3;
}

/* --- stage: ghost numeral + toy render ---------------------------------- */

.lp-services-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sized and offset so the numeral crowns the toy and gets partly eclipsed by
   it, with only a few pixels of bleed past the viewport — big enough to be a
   background plane, never so big that it stops reading as 01 / 02 / 03. */
.lp-services-ghost {
  position: absolute;
  top: -8%;
  z-index: 0;
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(130px, 40vw, 260px);
  font-weight: 700;
  line-height: 0.76;
  letter-spacing: 0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(242, 237, 227, 0.14);
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
}

.lp-services-scene[data-side='right'] .lp-services-ghost {
  right: -8%;
}

.lp-services-scene[data-side='left'] .lp-services-ghost {
  left: -8%;
}

.lp-services-art {
  position: relative;
  z-index: 1;
  width: min(74vw, 380px);
}

.lp-services-art-float {
  position: relative;
  display: block;
}

/* Sits *behind* the render, so it is only ever seen through the feathered
   edge below — the stops keep the halo off the centre, where the opaque toy
   would swallow it, and ride the perimeter instead. Kept under 0.08 alpha and
   spread over five stops: the renders already carry their own rim light, and
   a two-stop version bands visibly on a near-black canvas. */
.lp-services-glow {
  position: absolute;
  inset: -22%;
  z-index: 0;
  display: block;
  background: radial-gradient(
    closest-side,
    rgba(255, 107, 53, 0) 30%,
    rgba(255, 107, 53, 0.035) 50%,
    rgba(255, 107, 53, 0.075) 66%,
    rgba(255, 107, 53, 0.055) 80%,
    rgba(255, 107, 53, 0.02) 91%,
    rgba(255, 107, 53, 0) 100%
  );
  pointer-events: none;
}

/* The renders are opaque squares carrying their own faint starfield, and that
   sky sits a few levels lighter and bluer than the canvas — rgb(3,11,18)
   against #05060a. Unmasked it reads as a literal tile of different sky
   (verified in-browser: it is obvious, not subtle). Two layers dissolve it:
   an eased fade on all four edges, intersected so the corners fade twice, and
   a per-scene elliptical vignette that drops the leftover field to ~16% while
   leaving the subject untouched. Browsers without mask-composite fall back to
   the union — no visible mask, i.e. the plain unmasked baseline. */
.lp-services-img {
  --lp-edge:
    linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.45) 8%, #000 17%, #000 83%, rgba(0, 0, 0, 0.45) 92%, transparent 100%),
    linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 8%, #000 17%, #000 83%, rgba(0, 0, 0, 0.45) 92%, transparent 100%);
  --lp-vignette: radial-gradient(33% 38% at 50% 50%, #000 0 82%, rgba(0, 0, 0, 0.16) 150%);

  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  -webkit-mask-image: var(--lp-edge), var(--lp-vignette);
  mask-image: var(--lp-edge), var(--lp-vignette);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

/* Vignette radii measured off each render's subject bounds: the phone is tall
   and narrow, the bot compact, the shop planet wide and low. Re-render the art
   and these want re-measuring (bump VERSION in landing-assets.ts). */
.lp-services-scene[data-art='webapp'] .lp-services-img {
  --lp-vignette: radial-gradient(30% 44% at 50% 50%, #000 0 82%, rgba(0, 0, 0, 0.16) 150%);
}

.lp-services-scene[data-art='ai'] .lp-services-img {
  --lp-vignette: radial-gradient(30% 34% at 50% 50%, #000 0 82%, rgba(0, 0, 0, 0.16) 150%);
}

.lp-services-scene[data-art='web'] .lp-services-img {
  --lp-vignette: radial-gradient(36% 33% at 50% 50%, #000 0 82%, rgba(0, 0, 0, 0.16) 150%);
}

/* --- portrait: art crowns the copy -------------------------------------- */

@media (max-width: 799px) {
  .lp-services-stage {
    order: -1;
  }

  .lp-services-scene[data-side='right'] .lp-services-stage {
    justify-content: flex-end;
  }

  .lp-services-scene[data-side='left'] .lp-services-stage {
    justify-content: flex-start;
  }
}

/* --- desktop: two-column cinematic scene -------------------------------- */

@media (min-width: 800px) {
  .lp-services-scene {
    display: flex;
    align-items: center;
    min-height: 112svh;
    padding-block: 10svh;
  }

  .lp-services-inner {
    display: grid;
    align-items: center;
    gap: clamp(40px, 5.6vw, 104px);
  }

  .lp-services-scene[data-side='right'] .lp-services-inner {
    grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  }

  .lp-services-scene[data-side='left'] .lp-services-inner {
    grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
  }

  .lp-services-scene[data-side='right'] .lp-services-copy {
    grid-area: 1 / 1;
  }

  .lp-services-scene[data-side='right'] .lp-services-stage {
    grid-area: 1 / 2;
  }

  .lp-services-scene[data-side='left'] .lp-services-copy {
    grid-area: 1 / 2;
    text-align: right;
  }

  .lp-services-scene[data-side='left'] .lp-services-stage {
    grid-area: 1 / 1;
  }

  .lp-services-scene[data-side='left'] .lp-services-eyebrow {
    flex-direction: row-reverse;
  }

  .lp-services-scene[data-side='left'] .lp-services-rule {
    transform-origin: right center;
  }

  .lp-services-scene[data-side='left'] .lp-services-title,
  .lp-services-scene[data-side='left'] .lp-services-body {
    margin-left: auto;
  }

  .lp-services-scene[data-side='left'] .lp-services-tags {
    justify-content: flex-end;
  }

  .lp-services-title {
    font-size: clamp(38px, 4.9vw, 88px);
    font-size: clamp(38px, 11cqi, 88px);
  }

  .lp-services-art {
    width: min(100%, 500px);
  }

  .lp-services-ghost {
    top: -16%;
    font-size: clamp(160px, 20vw, 330px);
    -webkit-text-stroke-width: 1.5px;
  }
}

/* Only the two permanently scrubbed layers get promoted; the entrance tweens
   run once and are not worth a compositor layer each. */
@media (prefers-reduced-motion: no-preference) {
  .lp-services-ghost,
  .lp-services-art {
    will-change: transform;
  }
}
`

export default function SectionServices({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const root = scope.current
      let mm: ReturnType<typeof gsap.matchMedia> | null = null
      let cancelled = false
      const cleanup = () => {
        cancelled = true
        mm?.revert()
      }
      if (!(root && contextSafe)) return cleanup

      const build = contextSafe(() => {
        mm = gsap.matchMedia()
        mm.add({ dt: MQ.dt, mobile: MQ.mobile, reduce: MQ.reduce }, (mmCtx) => {
          const splits: SplitText[] = []
          const revertSplits = () => {
            for (const split of splits) split.revert()
          }

          // Reduced motion: the scenes are already fully composed and readable
          // at rest, so the branch builds nothing at all — no splits, no
          // scrubs, no hidden start states to recover from.
          if (mmCtx.conditions?.reduce === true) return revertSplits

          const d = mmCtx.conditions?.dt === true ? DEPTH_DT : DEPTH_MOBILE
          const scenes = gsap.utils.toArray<HTMLElement>(
            '.lp-services-scene',
            root
          )

          scenes.forEach((scene, i) => {
            const ghost = scene.querySelector<HTMLElement>('.lp-services-ghost')
            const art = scene.querySelector<HTMLElement>('.lp-services-art')
            const float = scene.querySelector<HTMLElement>(
              '.lp-services-art-float'
            )
            const glow = scene.querySelector<HTMLElement>('.lp-services-glow')
            const title = scene.querySelector<HTMLElement>('.lp-services-title')
            const rule = scene.querySelector<HTMLElement>('.lp-services-rule')
            const eyebrow = scene.querySelector<HTMLElement>(
              '.lp-services-eyebrow-text'
            )
            const body = scene.querySelector<HTMLElement>('.lp-services-body')
            const inner = scene.querySelector<HTMLElement>('.lp-services-inner')
            const chips = gsap.utils.toArray<HTMLElement>(
              '.lp-services-tag',
              scene
            )
            if (!(ghost && art && float && glow && title && rule && eyebrow)) {
              return
            }
            if (!(body && inner)) return

            // +1 when the art sits on the right — every drift, tilt and lateral
            // offset mirrors with the composition instead of repeating it.
            const out = scene.dataset.side === 'left' ? -1 : 1
            const span = {
              trigger: scene,
              start: 'top bottom',
              end: 'bottom top',
            } as const

            // Layer 1 (deepest): the numeral falls behind the page.
            gsap.fromTo(
              ghost,
              { yPercent: -d.ghost, xPercent: d.ghostX * out },
              {
                yPercent: d.ghost,
                xPercent: -d.ghostX * out,
                ease: 'none',
                scrollTrigger: { ...span, scrub: true },
              }
            )

            // Layer 2: the toy overtakes the page in the other direction.
            gsap.fromTo(
              art,
              { yPercent: d.art },
              {
                yPercent: -d.art,
                ease: 'none',
                scrollTrigger: { ...span, scrub: true },
              }
            )

            // Idle zero-g loops, desynchronised by scene so the three toys
            // never bob in lockstep, and parked while off-screen.
            const idle = { ...span, toggleActions: 'play pause resume pause' }
            gsap.fromTo(
              float,
              { y: -d.float, rotation: -d.tilt * out },
              {
                y: d.float,
                rotation: d.tilt * out,
                duration: 4.6 + i * 0.7,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                scrollTrigger: { ...idle },
              }
            )
            gsap.fromTo(
              glow,
              { scale: 0.93, opacity: 0.7 },
              {
                scale: 1.08,
                opacity: 1,
                duration: 5.9 + i * 0.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                scrollTrigger: { ...idle },
              }
            )

            // Entrance. Everything is `from`, so the resting DOM is the
            // finished scene: if this code never runs, nothing is hidden.
            // Triggered off the content block, never the scene — a 112svh
            // scene's top crosses 78% while its centred content is still a
            // full screen below the fold, so the reveal would play unseen.
            const tl = gsap.timeline({
              scrollTrigger: { trigger: inner, start: 'top 78%', once: true },
            })
            tl.from(ghost, { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
            tl.from(
              art,
              { opacity: 0, scale: 0.9, duration: 1.3, ease: 'expo.out' },
              0.05
            )
            tl.from(rule, { scaleX: 0, duration: 0.8, ease: 'expo.out' }, 0.05)
            tl.from(
              eyebrow,
              { yPercent: 110, duration: 0.75, ease: 'expo.out' },
              0.12
            )

            // The ambient halo would be clipped into visible rectangles by
            // the per-line mask boxes, so it stays off until the reveal
            // lands and the heading is handed back as one element.
            title.style.textShadow = 'none'
            const split = new SplitText(title, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'lp-services-line',
            })
            splits.push(split)
            tl.from(
              split.lines,
              {
                yPercent: 116,
                duration: 1.15,
                ease: 'expo.out',
                stagger: 0.085,
                // Hand the heading back to the browser once it has landed:
                // plain text re-wraps correctly on resize, split lines do not.
                onComplete: () => {
                  split.revert()
                  title.style.textShadow = ''
                },
              },
              0.16
            )

            tl.from(
              body,
              { y: d.rise, opacity: 0, duration: 0.95, ease: 'expo.out' },
              0.42
            )
            if (chips.length > 0) {
              tl.from(
                chips,
                {
                  y: d.rise * 0.7,
                  opacity: 0,
                  duration: 0.8,
                  ease: 'expo.out',
                  stagger: 0.075,
                },
                0.52
              )
            }
          })

          return revertSplits
        })
      })

      // Splitting against a fallback face measures the wrong line boxes, so
      // every reveal waits for the real Orbitron metrics.
      fontsSettled().then(() => {
        if (!cancelled) build()
      })

      return cleanup
    },
    { scope }
  )

  return (
    <div
      ref={scope}
      className="lp-services"
      style={{ ['--lp-services-accent' as string]: COCKPIT_ACCENT }}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static css */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {SCENES.map(({ id, num, side }) => (
        <section
          key={id}
          className="lp-services-scene"
          data-side={side}
          data-art={id}
          aria-labelledby={`lp-service-${id}`}
        >
          <div className="lp-services-inner">
            <div className="lp-services-copy">
              <p className="lp-services-eyebrow">
                <span className="lp-services-rule" aria-hidden />
                <span className="lp-services-eyebrow-mask">
                  <span className="lp-services-eyebrow-text">
                    {t(`landing.${id}.eyebrow`)}
                  </span>
                </span>
              </p>
              <h2 id={`lp-service-${id}`} className="lp-services-title">
                {t(`landing.${id}.title`)}
              </h2>
              <p className="lp-services-body">{t(`landing.${id}.body`)}</p>
              <ul className="lp-services-tags">
                {TAGS.map((n) => (
                  <li key={n} className="lp-services-tag">
                    {t(`landing.${id}.tag${n}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lp-services-stage">
              <span className="lp-services-ghost" aria-hidden>
                {num}
              </span>
              <div className="lp-services-art">
                <div className="lp-services-art-float">
                  <span className="lp-services-glow" aria-hidden />
                  <Image
                    className="lp-services-img"
                    src={SERVICE_ART[id]}
                    alt=""
                    aria-hidden
                    width={ART_SIZE}
                    height={ART_SIZE}
                    sizes="(min-width: 800px) 500px, 76vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
