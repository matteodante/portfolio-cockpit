'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Single registration point — every landing section imports gsap from here
// so plugins register exactly once and tree-shaking stays predictable.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText, useGSAP }

/**
 * Shared media conditions for gsap.matchMedia(). `DT` mirrors the site's
 * `--breakpoint-dt` (800px); `REDUCE` must always be handled — its branch
 * shows everything at rest with no motion. `FINE` gates pointer-chasing
 * affordances (magnetic pulls) to actual pointing devices.
 */
export const MQ = {
  dt: '(min-width: 800px)',
  mobile: '(max-width: 799px)',
  reduce: '(prefers-reduced-motion: reduce)',
  motionOk: '(prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
} as const

/**
 * The park-offscreen recipe every landing idle loop must carry: an infinite
 * tween with no gate keeps GSAP's ticker and a style write alive for the
 * whole page while its section is 10+ viewports away. Spread the result
 * into the tween's `scrollTrigger` (add callbacks as needed).
 */
export const idleGate = (trigger: Element | null) =>
  ({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    toggleActions: 'play pause resume pause',
  }) as const

/**
 * Fonts have to be settled before SplitText measures line boxes, or the
 * reveal splits on fallback metrics and breaks in the wrong places.
 * `fonts.ready` always resolves in practice; the race is insurance, because
 * the failure mode of waiting forever is a permanently invisible headline.
 */
export const fontsSettled = (): Promise<unknown> =>
  Promise.race([
    document.fonts.ready,
    new Promise((res) => {
      window.setTimeout(res, 1500)
    }),
  ])
