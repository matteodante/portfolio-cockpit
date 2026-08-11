'use client'

import type { CSSProperties } from 'react'
import { useRef } from 'react'
import { makeT } from '@/components/landing/i18n'
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/components/landing/motion'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'

const INK = '#f2ede3'

/**
 * The translation ships the vocabulary as ONE string with words joined by
 * ' · '. The ribbon splits on that character and draws its own mark between
 * them, so the separator is a design decision, not a translated glyph.
 */
const ITEM_SEPARATOR = '·'

/**
 * The single rhythm unit of the ribbon: word → mark → word all sit exactly
 * this far apart, including across the seam between the two copies.
 */
const GAP = 'clamp(20px, 2.2vw, 40px)'

/**
 * Words dissolve into the void instead of being guillotined by the edge. Kept
 * short (≈one letter wide) so the static reduced-motion row still opens on a
 * legible first word.
 */
const EDGE_FADE =
  'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)'

/** Seconds for one copy of the ribbon to travel its own width. */
const LOOP_SECONDS_DT = 36
const LOOP_SECONDS_MOBILE = 22

/** Ceiling of the scroll-velocity surge, as a multiple of the resting speed. */
const MAX_SURGE = 1.3

/** Velocity (px/s) that maxes the surge out. */
const SURGE_FULL_AT = 2600

/** Idle time before the ribbon eases back down to its resting speed. */
const SETTLE_MS = 150

/** Surge is retargeted in steps this size, not every scroll frame. */
const SURGE_STEP = 0.05

const wordStyle: CSSProperties = {
  fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
  fontSize: 'clamp(28px, 5vw, 76px)',
  fontWeight: 700,
  // Orbitron's ascent/descent overflow a 1.0 line box; the transport clips
  // anything that leaves it, so give the glyphs their full em back.
  lineHeight: 1.18,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
}

/** Solid hull voice. */
const solidWordStyle: CSSProperties = { ...wordStyle, color: INK }

/**
 * Every other word drops to an outline so the ribbon carries two planes of
 * brightness instead of one flat wall of ivory. The stroke alpha is the floor
 * that still clears 3:1 against Deep Space at these sizes — do not lower it.
 */
const ghostWordStyle: CSSProperties = {
  ...wordStyle,
  color: 'transparent',
  WebkitTextStroke: '1px rgba(242, 237, 227, 0.46)',
}

const markStyle: CSSProperties = {
  flex: 'none',
  width: 'clamp(6px, 0.55vw, 10px)',
  height: 'clamp(6px, 0.55vw, 10px)',
  background: COCKPIT_ACCENT,
  transform: 'rotate(45deg)',
  boxShadow: `0 0 12px ${COCKPIT_ACCENT}80`,
}

const ruleStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 1,
  background: 'rgba(242, 237, 227, 0.09)',
  transformOrigin: 'center center',
  pointerEvents: 'none',
}

type RibbonWord = { word: string; key: string; ghost: boolean }

/**
 * Splits the shipped string into the ribbon's words, tagging each with the
 * plane it renders on (solid / outline) and a key that stays stable even if a
 * translation repeats a word.
 */
const parseWords = (raw: string): RibbonWord[] => {
  const seen = new Map<string, number>()
  return raw
    .split(ITEM_SEPARATOR)
    .map((word) => word.trim())
    .filter(Boolean)
    .map((word, index) => {
      const nth = (seen.get(word) ?? 0) + 1
      seen.set(word, nth)
      return { word, key: `${word}#${nth}`, ghost: index % 2 === 1 }
    })
}

/**
 * Reduced-motion override: with the transport parked, a max-content row would
 * clip most of the vocabulary behind overflow with no scroll affordance. Let
 * it wrap into a readable block and drop the seam-filler duplicate instead.
 * !important is required — the rest state lives in inline styles.
 */
const STYLES = `
@media (prefers-reduced-motion: reduce) {
  .lp-marquee-clip {
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }
  .lp-marquee-row {
    width: auto !important;
  }
  /* The words live inside the copy's own max-content flex row, so the wrap
     has to happen there — wrapping the outer row would only stack the two
     copies, each still wider than the viewport. */
  .lp-marquee-row > ul {
    flex: 1 1 auto !important;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 10px;
    padding-right: 0 !important;
  }
  .lp-marquee-dup {
    display: none !important;
  }
}
`

/** One pass of the vocabulary. The duplicate is the seam-filler for the loop. */
function RibbonCopy({
  words,
  duplicate,
}: {
  words: RibbonWord[]
  duplicate: boolean
}) {
  return (
    <ul
      aria-hidden={duplicate ? true : undefined}
      className={duplicate ? 'lp-marquee-dup' : undefined}
      style={{
        display: 'flex',
        flex: 'none',
        alignItems: 'center',
        gap: GAP,
        listStyle: 'none',
        margin: 0,
        padding: `0 ${GAP} 0 0`,
      }}
    >
      {words.map((item) => (
        <li
          key={item.key}
          style={{ display: 'flex', alignItems: 'center', gap: GAP }}
        >
          <span style={item.ghost ? ghostWordStyle : solidWordStyle}>
            {item.word}
          </span>
          <span aria-hidden style={markStyle} />
        </li>
      ))}
    </ul>
  )
}

export default function Marquee({ locale }: { locale: Locale }) {
  const t = makeT(locale)
  const words = parseWords(t('landing.marquee.items'))

  const scope = useRef<HTMLElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const ruleTopRef = useRef<HTMLDivElement>(null)
  const ruleBottomRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const row = rowRef.current
      const band = bandRef.current
      if (!(row && band)) return

      const mm = gsap.matchMedia()

      mm.add({ dt: MQ.dt, mobile: MQ.mobile, reduce: MQ.reduce }, (ctx) => {
        // Reduced motion: the ribbon stays a static, fully readable row. Every
        // rest state below (rules at scaleX 1, row untransformed) is the DOM's
        // default, so skipping the branch is the whole implementation.
        const conditions = ctx.conditions
        if (!conditions || conditions.reduce) return

        // The row holds exactly two copies, so -50% lands the second copy
        // precisely where the first started: seamless, no measurement, no
        // resize listener. Parked (and its compositor layer released) while
        // the band is off-screen — it is visible for ~5% of the page.
        const loop = gsap.to(row, {
          xPercent: -50,
          duration: conditions.dt ? LOOP_SECONDS_DT : LOOP_SECONDS_MOBILE,
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: band,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause resume pause',
            onToggle: (self) => {
              gsap.set(row, {
                willChange: self.isActive ? 'transform' : 'auto',
              })
            },
          },
        })

        // Entrance: the two hairlines draw out from the centre while the tape
        // itself rises into the transport. `from` tweens only — the rest state
        // is what the markup already renders.
        const ruleTop = ruleTopRef.current
        const ruleBottom = ruleBottomRef.current
        if (ruleTop && ruleBottom) {
          gsap.from([ruleTop, ruleBottom], {
            scaleX: 0,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.1,
            scrollTrigger: { trigger: band, start: 'top 90%', once: true },
          })
        }
        gsap.from(row, {
          yPercent: 112,
          duration: 1.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: band, start: 'top 88%', once: true },
        })

        // Depth: the backlight drifts against the page while the words travel
        // across it, so the band reads as lit from behind rather than printed.
        const glow = glowRef.current
        if (glow) {
          gsap.fromTo(
            glow,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: band,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        }

        // Scroll velocity nudges the tape forward, then it eases back to its
        // resting speed. Speed only — never a direction flip, which reads as a
        // glitch rather than as momentum.
        let boostAt = 0
        // One reusable timer restarted per tick — a setTimeout teardown +
        // allocation per scroll frame is churn the quantised boost already
        // avoids for the tween itself.
        const settle = gsap
          .delayedCall(SETTLE_MS / 1000, () => {
            boostAt = 0
            gsap.to(loop, {
              timeScale: 1,
              duration: 1.2,
              ease: 'power2.out',
              overwrite: true,
            })
          })
          .pause()
        const surge = ScrollTrigger.create({
          trigger: band,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const raw = Math.min(
              Math.abs(self.getVelocity()) / SURGE_FULL_AT,
              MAX_SURGE
            )
            // Quantised so a steady scroll retargets the speed a couple of
            // dozen times across the whole range instead of once per frame.
            const boost = Math.round(raw / SURGE_STEP) * SURGE_STEP
            if (boost !== boostAt) {
              boostAt = boost
              gsap.to(loop, {
                timeScale: 1 + boost,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true,
              })
            }
            settle.restart(true)
          },
        })

        return () => {
          settle.kill()
          surge.kill()
        }
      })

      return () => mm.revert()
    },
    { scope }
  )

  return (
    <section
      ref={scope}
      style={{
        position: 'relative',
        padding: 'clamp(56px, 10vh, 130px) 0',
      }}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static css */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* No overflow clip here: the backlight is meant to bleed past the
          hairlines into the void, and only the transport below clips. */}
      <div
        ref={bandRef}
        style={{
          position: 'relative',
          padding: 'clamp(20px, 3vh, 36px) 0',
        }}
      >
        <div
          ref={glowRef}
          aria-hidden
          style={{
            position: 'absolute',
            top: '-40%',
            bottom: '-40%',
            left: '8%',
            right: '8%',
            background: `radial-gradient(50% 50% at 50% 50%, ${COCKPIT_ACCENT}1f 0%, ${COCKPIT_ACCENT}00 72%)`,
            pointerEvents: 'none',
          }}
        />
        <div ref={ruleTopRef} aria-hidden style={{ ...ruleStyle, top: 0 }} />
        <div
          ref={ruleBottomRef}
          aria-hidden
          style={{ ...ruleStyle, bottom: 0 }}
        />

        <div
          className="lp-marquee-clip"
          style={{
            position: 'relative',
            overflow: 'hidden',
            maskImage: EDGE_FADE,
            WebkitMaskImage: EDGE_FADE,
          }}
        >
          <div
            ref={rowRef}
            className="lp-marquee-row"
            style={{ display: 'flex', width: 'max-content' }}
          >
            <RibbonCopy words={words} duplicate={false} />
            <RibbonCopy words={words} duplicate={true} />
          </div>
        </div>
      </div>
    </section>
  )
}
