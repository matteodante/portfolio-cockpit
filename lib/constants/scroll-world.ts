/**
 * Scroll-world asset manifest and cache-busting token.
 *
 * The scene files under /public/scroll-world keep stable filenames across
 * re-encodes, and they ship with a 24h Cache-Control (see next.config.ts). Without
 * a version in the URL a re-encode is simply invisible to anyone holding a cached
 * copy — they keep scrubbing yesterday's clips for a day. Bump VERSION whenever any
 * file under /public/scroll-world changes.
 */
const VERSION = '3'

/** Adds the cache-busting token to a /scroll-world asset path. */
export const swAsset = (path: string) => `${path}?v=${VERSION}`

export const SCROLL_WORLD_SECTION_IDS = [
  'intro',
  'webapp',
  'ai',
  'web',
  'contact',
] as const

export type ScrollWorldSectionId = (typeof SCROLL_WORLD_SECTION_IDS)[number]

/** Fly-over clips between consecutive scenes. Length must be sections - 1. */
export const SCROLL_WORLD_CONNECTORS = [1, 2, 3, 4].map((i) =>
  swAsset(`/scroll-world/vid/conn${i}.mp4`)
)

export const SCROLL_WORLD_CONNECTORS_MOBILE = [1, 2, 3, 4].map((i) =>
  swAsset(`/scroll-world/vid/conn${i}-m.mp4`)
)

export const swStill = (id: ScrollWorldSectionId) =>
  swAsset(`/scroll-world/${id}.webp`)

export const swStillMobile = (id: ScrollWorldSectionId) =>
  swAsset(`/scroll-world/${id}-m.webp`)

export const swClip = (id: ScrollWorldSectionId) =>
  swAsset(`/scroll-world/vid/dive-${id}.mp4`)

export const swClipMobile = (id: ScrollWorldSectionId) =>
  swAsset(`/scroll-world/vid/dive-${id}-m.mp4`)
