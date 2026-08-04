/** Types for the vendored scroll-world scrub engine (scrub-engine.js). */

export type ScrollWorldCta = {
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}

export type ScrollWorldSection = {
  id: string
  label: string
  still?: string
  stillMobile?: string
  clip?: string
  clipMobile?: string
  accent?: string
  /** Per-section override of diveScroll (viewport-heights of scroll). */
  scroll?: number
  /** 0..1 — camera settles mid-scene while the copy peaks. Keep ≤ 0.6. */
  linger?: number
  eyebrow?: string
  title?: string
  body?: string
  tags?: string[]
  /** Last section only. */
  cta?: ScrollWorldCta
}

export type ScrollWorldConfig = {
  brand?: { name: string; href?: string }
  cta?: { label: string; href: string }
  diveScroll?: number
  connScroll?: number
  crossfade?: number
  /** Source frame rate of the clips. Seeks are quantised to this grid. Default 24. */
  fps?: number
  /**
   * Segments either side of the current one that keep a live <video>; the rest fall
   * back to their still. Default 2 (1 on touch) — browsers cap concurrent decoders.
   */
  keepClips?: number
  /**
   * Segments either side of the current one to DOWNLOAD ahead (wider than
   * keepClips — bytes are cheap, decoders are not). Default keepClips + 2.
   */
  prefetch?: number
  hint?: string
  nav?: boolean
  atmosphere?: boolean
  sections: ScrollWorldSection[]
  /** length = sections.length - 1; nulls allowed (direct crossfade). */
  connectors?: Array<string | null>
  connectorsMobile?: Array<string | null>
}

/** Builds the DOM + injects CSS into `container`. Returns a destroy(). */
export function mountScrollWorld(
  container: HTMLElement,
  config: ScrollWorldConfig
): () => void
