'use client'

import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useRef } from 'react'
import { makeT } from '@/components/landing/i18n'
import {
  fontsSettled,
  gsap,
  idleGate,
  MQ,
  SplitText,
  useGSAP,
} from '@/components/landing/motion'
import { EMAIL, EMAIL_HREF, NAME } from '@/lib/constants/contact'
import { ART_SIZE, CONTACT_ART } from '@/lib/constants/landing-assets'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { Locale } from '@/lib/i18n/config'

type Split = InstanceType<typeof SplitText>

const INK = '#f2ede3'

/**
 * Rest halo of the finale headline. Declared once and used BOTH in the JSX
 * style and as the value the reveal restores — the title's glow lives in a
 * React inline style, so writing '' after the split would delete it for good
 * instead of falling back to a class (there is none for this element).
 */
const TITLE_GLOW = `0 0 64px ${COCKPIT_ACCENT}2e`
const INK_SOFT = '#8f8a97'

/** Magnetic pull ceiling, in px. Past ~8 the pill stops feeling attached. */
const MAGNET_PX = 8

/**
 * Pull per px of cursor offset from the pill's true centre. Tuned so the pull
 * reaches its ceiling right about at the pill's own edge — inside the pill it
 * is a proportional lean, outside it is a steady reach.
 */
const MAGNET_X = 0.08
const MAGNET_Y = 0.28

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * Interactive state lives in CSS so hover/focus survive without JS and never
 * fight the GSAP transforms (which own the *wrapper*, not the controls).
 * Prefixed `lp-contact-` — one <style> block per section, repo convention.
 */
const STYLES = `
.lp-contact-play {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-orbitron), Orbitron, sans-serif;
  font-size: clamp(14px, 1.4vw, 17px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: #0b0812;
  background: var(--lp-accent);
  border: 1px solid var(--lp-accent);
  border-radius: 999px;
  padding: 18px 34px;
  text-decoration: none;
  box-shadow:
    0 0 26px color-mix(in oklab, var(--lp-accent) 34%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.lp-contact-play:focus-visible {
  /* Ivory, not accent: an orange ring inside an orange halo on an orange pill
     is not a ring. */
  outline: 2px solid #f2ede3;
  outline-offset: 3px;
}

.lp-contact-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-jetbrains-mono), monospace;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #f2ede3;
  border: 1px solid rgba(242, 237, 227, 0.28);
  border-radius: 999px;
  padding: 17px 30px;
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}
.lp-contact-ghost:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 3px;
}

.lp-contact-mail {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}
.lp-contact-mail:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 3px;
}

@media (hover: hover) {
  .lp-contact-play:hover {
    transform: translateY(-1px);
    box-shadow:
      0 0 44px color-mix(in oklab, var(--lp-accent) 58%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.42);
  }
  /* The ghost brightens its edge and picks up an inset light line — it never
     glows orange, so the flame stays on the primary action. */
  .lp-contact-ghost:hover {
    transform: translateY(-1px);
    border-color: rgba(242, 237, 227, 0.62);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }
  .lp-contact-mail:hover {
    color: var(--lp-accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-contact-play:hover,
  .lp-contact-ghost:hover {
    transform: none;
  }
}
`

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
  fontSize: 'clamp(42px, 8.8vw, 136px)',
  fontWeight: 700,
  lineHeight: 1.02,
  letterSpacing: '0.01em',
  textTransform: 'uppercase',
  color: INK,
  margin: 0,
  maxWidth: '10em',
  textShadow: TITLE_GLOW,
}

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-rajdhani), system-ui, sans-serif',
  fontSize: 'clamp(17px, 1.6vw, 21px)',
  lineHeight: 1.55,
  color: INK_SOFT,
  margin: 'clamp(20px, 2.6vh, 30px) 0 0',
  maxWidth: 500,
}

export default function SectionContact({ locale }: { locale: Locale }) {
  const t = makeT(locale)

  const scope = useRef<HTMLDivElement>(null)
  const artLayerRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const ctaRowRef = useRef<HTMLDivElement>(null)
  const magnetRef = useRef<HTMLSpanElement>(null)
  const haloRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // ── Scene motion ───────────────────────────────────────────────────
      // Reduced motion: every rest state below is the markup's own default —
      // astronaut visible, headline unsplit, halo lit, nothing to restore.
      mm.add(MQ.motionOk, (ctx) => {
        const artLayer = artLayerRef.current
        const art = artRef.current
        const bloom = bloomRef.current
        const halo = haloRef.current
        const title = titleRef.current

        if (art) {
          // Two idle oscillators on deliberately coprime periods so the
          // astronaut never repeats the same pose-and-place pairing.
          gsap.fromTo(
            art,
            { y: 10 },
            {
              y: -14,
              duration: 5.4,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              scrollTrigger: idleGate(scope.current),
            }
          )
          gsap.fromTo(
            art,
            { rotation: -1.7 },
            {
              rotation: 1.7,
              duration: 8.6,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              scrollTrigger: idleGate(scope.current),
            }
          )
        }

        if (artLayer) {
          // Layer 1 — the astronaut rides against the page scroll.
          gsap.fromTo(
            artLayer,
            { yPercent: 9 },
            {
              yPercent: -9,
              ease: 'none',
              scrollTrigger: {
                trigger: artLayer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
          gsap.from(artLayer, {
            opacity: 0,
            scale: 0.94,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: artLayer, start: 'top 88%', once: true },
          })
        }

        if (bloom) {
          // Layer 2 — the backlight lags the astronaut, so the two separate as
          // the finale scrolls through.
          gsap.fromTo(
            bloom,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: artLayer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
          gsap.fromTo(
            bloom,
            { scale: 0.93 },
            {
              scale: 1.08,
              duration: 6.2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              scrollTrigger: idleGate(scope.current),
            }
          )
        }

        if (halo) {
          gsap.to(halo, {
            scale: 1.12,
            opacity: 1,
            duration: 2.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            scrollTrigger: idleGate(scope.current),
          })
        }

        const body = bodyRef.current
        const ctaRow = ctaRowRef.current
        if (body && ctaRow) {
          gsap.from([body, ctaRow], {
            opacity: 0,
            y: 22,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: body, start: 'top 90%', once: true },
          })
        }

        let split: Split | null = null
        let disposed = false

        if (title) {
          // Split only once the real Orbitron is in: line boxes measured
          // against the fallback face break in the wrong places.
          fontsSettled().then(() => {
            if (disposed || !title.isConnected) return
            ctx.add(() => {
              // Keep the halo off while the line masks exist — clipped, it
              // reads as grey boxes behind the glyphs on the dark canvas.
              title.style.textShadow = 'none'
              split = SplitText.create(title, {
                type: 'lines',
                mask: 'lines',
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 112,
                    duration: 1.1,
                    ease: 'expo.out',
                    stagger: 0.09,
                    scrollTrigger: {
                      trigger: title,
                      start: 'top 85%',
                      once: true,
                    },
                    // Hand the headline back as one plain element the moment
                    // the reveal lands: the per-line masks clip its ambient
                    // halo, and it has to reflow freely on resize afterwards.
                    onComplete: () => {
                      self.revert()
                      title.style.textShadow = TITLE_GLOW
                    },
                  }),
              })
            })
          })
        }

        return () => {
          disposed = true
          split?.revert()
        }
      })

      // ── Magnetic primary CTA ───────────────────────────────────────────
      mm.add(`${MQ.fine} and ${MQ.motionOk}`, () => {
        const row = ctaRowRef.current
        const magnet = magnetRef.current
        if (!(row && magnet)) return

        const xTo = gsap.quickTo(magnet, 'x', {
          duration: 0.45,
          ease: 'power3',
        })
        const yTo = gsap.quickTo(magnet, 'y', {
          duration: 0.45,
          ease: 'power3',
        })

        // The pill's untransformed centre, read once per approach instead of
        // a forced-layout rect (plus two transform parses) per pointermove.
        // The last applied pull is tracked locally and subtracted, or the
        // pill would chase its own displacement. A ±8px pull makes any
        // hover-while-scrolling staleness invisible.
        let cx = 0
        let cy = 0
        let pulledX = 0
        let pulledY = 0

        const onEnter = () => {
          const rect = magnet.getBoundingClientRect()
          cx = rect.left + rect.width / 2 - pulledX
          cy = rect.top + rect.height / 2 - pulledY
        }
        const onMove = (event: PointerEvent) => {
          pulledX = clamp(
            (event.clientX - cx) * MAGNET_X,
            -MAGNET_PX,
            MAGNET_PX
          )
          pulledY = clamp(
            (event.clientY - cy) * MAGNET_Y,
            -MAGNET_PX,
            MAGNET_PX
          )
          xTo(pulledX)
          yTo(pulledY)
        }
        const onLeave = () => {
          pulledX = 0
          pulledY = 0
          xTo(0)
          yTo(0)
        }

        // Bound to the button row, not the window: the pull engages as the
        // pointer approaches through the row and releases the moment it leaves.
        row.addEventListener('pointerenter', onEnter)
        row.addEventListener('pointermove', onMove)
        row.addEventListener('pointerleave', onLeave)
        return () => {
          row.removeEventListener('pointerenter', onEnter)
          row.removeEventListener('pointermove', onMove)
          row.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => mm.revert()
    },
    { scope }
  )

  return (
    <div
      ref={scope}
      style={{
        position: 'relative',
        ['--lp-accent' as string]: COCKPIT_ACCENT,
      }}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static css */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding:
            'clamp(110px, 18vh, 220px) calc(env(safe-area-inset-right, 0px) + 6vw) clamp(96px, 15vh, 190px) calc(env(safe-area-inset-left, 0px) + 6vw)',
        }}
      >
        <div
          ref={artLayerRef}
          style={{
            position: 'relative',
            width: 'clamp(210px, 30vw, 440px)',
            marginBottom: 'clamp(30px, 5vh, 62px)',
          }}
        >
          <div
            ref={bloomRef}
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-24%',
              borderRadius: '50%',
              background: `radial-gradient(50% 50% at 50% 50%, ${COCKPIT_ACCENT}2b 0%, ${COCKPIT_ACCENT}00 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div ref={artRef} style={{ position: 'relative' }}>
            <Image
              src={CONTACT_ART}
              alt=""
              aria-hidden
              width={ART_SIZE}
              height={ART_SIZE}
              quality={90}
              sizes="(max-width: 800px) 220px, (max-width: 1500px) 30vw, 440px"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                // The render's own near-black sky is a shade off the page
                // canvas, so the square edge reads; feather it away.
                WebkitMaskImage:
                  'radial-gradient(closest-side, #000 58%, transparent 99%)',
                maskImage:
                  'radial-gradient(closest-side, #000 58%, transparent 99%)',
              }}
            />
          </div>
        </div>

        <h2 ref={titleRef} style={titleStyle}>
          {t('landing.contact.title')}
        </h2>

        <p ref={bodyRef} style={bodyStyle}>
          {t('landing.contact.body')}
        </p>

        <div
          ref={ctaRowRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginTop: 'clamp(32px, 4.4vh, 52px)',
          }}
        >
          <span
            ref={magnetRef}
            style={{ position: 'relative', display: 'inline-flex' }}
          >
            <span
              ref={haloRef}
              aria-hidden
              style={{
                position: 'absolute',
                inset: -24,
                borderRadius: 999,
                background: `radial-gradient(closest-side at 50% 50%, ${COCKPIT_ACCENT}66 0%, ${COCKPIT_ACCENT}00 100%)`,
                opacity: 0.68,
                pointerEvents: 'none',
              }}
            />
            <Link
              href={`/${locale}/cockpit` as Route}
              className="lp-contact-play"
            >
              {t('landing.cta.primary')}
            </Link>
          </span>

          <a href={EMAIL_HREF} className="lp-contact-ghost">
            {t('landing.cta.secondary')}
          </a>
        </div>
      </section>

      <footer
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          borderTop: '1px solid rgba(242, 237, 227, 0.09)',
          padding:
            '22px calc(env(safe-area-inset-right, 0px) + 5vw) calc(env(safe-area-inset-bottom, 0px) + 26px) calc(env(safe-area-inset-left, 0px) + 5vw)',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: INK_SOFT,
        }}
      >
        <span>{NAME}</span>
        <a href={EMAIL_HREF} className="lp-contact-mail">
          {EMAIL}
        </a>
      </footer>
    </div>
  )
}
