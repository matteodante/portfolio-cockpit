/**
 * Landing hero asset manifest and cache-busting token.
 *
 * The files under /public/hero keep stable filenames across re-encodes and ship
 * with a 24h Cache-Control (see next.config.ts). Without a version in the URL a
 * re-encode is invisible to anyone holding a cached copy for a day. Bump
 * VERSION whenever any file under /public/hero changes.
 */
const VERSION = '2'

/** Adds the cache-busting token to a /hero asset path. */
export const heroAsset = (path: string) => `${path}?v=${VERSION}`

/**
 * The clip is ONE timeline in two acts: a seamless resting loop (the
 * astronaut bobbing over the clouds, first frame == last frame == the
 * ascent's first frame), then the ascent itself. At rest the hero PLAYS
 * [0, HERO_LOOP_SECONDS) natively and wraps at the seam; the scroll scrub
 * owns [HERO_LOOP_SECONDS, duration]. The seam frame is shared by both
 * acts, so every mode switch lands on identical pixels — no cut, no fade.
 */
export const HERO_LOOP_SECONDS = 5

export const HERO_CLIP = heroAsset('/hero/ascent.mp4')
export const HERO_CLIP_MOBILE = heroAsset('/hero/ascent-m.mp4')
export const HERO_POSTER = heroAsset('/hero/ascent-poster.webp')
export const HERO_POSTER_MOBILE = heroAsset('/hero/ascent-poster-m.webp')
