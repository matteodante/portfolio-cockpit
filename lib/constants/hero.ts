/**
 * Landing hero asset manifest and cache-busting token.
 *
 * The files under /public/hero keep stable filenames across re-encodes and ship
 * with a 24h Cache-Control (see next.config.ts). Without a version in the URL a
 * re-encode is invisible to anyone holding a cached copy for a day. Bump
 * VERSION whenever any file under /public/hero changes.
 */
const VERSION = '1'

/** Adds the cache-busting token to a /hero asset path. */
export const heroAsset = (path: string) => `${path}?v=${VERSION}`

export const HERO_CLIP = heroAsset('/hero/ascent.mp4')
export const HERO_CLIP_MOBILE = heroAsset('/hero/ascent-m.mp4')
export const HERO_POSTER = heroAsset('/hero/ascent-poster.webp')
export const HERO_POSTER_MOBILE = heroAsset('/hero/ascent-poster-m.webp')

/**
 * Section ids of the landing page. `intro` and `contact` render inside the
 * hero / closing blocks; the middle three are the editorial service sections.
 * Shared by the page's sr-only SEO block and the visible sections so the
 * translation keys can never drift apart.
 */
export const LANDING_SECTION_IDS = [
  'intro',
  'webapp',
  'ai',
  'web',
  'contact',
] as const

export type LandingSectionId = (typeof LANDING_SECTION_IDS)[number]
