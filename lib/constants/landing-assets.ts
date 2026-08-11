/**
 * Section artwork manifest for the landing (generated toy-world renders).
 * Same contract as /hero (see lib/constants/hero.ts): stable filenames,
 * 24h Cache-Control from next.config.ts, bump VERSION on any re-render.
 */
const VERSION = '1'

export const landingAsset = (path: string) => `${path}?v=${VERSION}`

/** One glossy toy object per service scene. Square 1:1 renders. */
export const SERVICE_ART = {
  webapp: landingAsset('/landing/phone.webp'),
  ai: landingAsset('/landing/bot.webp'),
  web: landingAsset('/landing/shop.webp'),
} as const

/** One toy artifact per real project card (copy lives in projects.* keys). */
export const PROJECT_ART = {
  maestro: landingAsset('/landing/maestro.webp'),
  gymtree: landingAsset('/landing/gymtree.webp'),
  claudeLocalDocs: landingAsset('/landing/docs.webp'),
  portfolio: landingAsset('/landing/rocket.webp'),
} as const

/** The astronaut waving goodbye/hello in the contact finale. */
export const CONTACT_ART = landingAsset('/landing/astro-wave.webp')

/** Rendered square size of every art file after compression. */
export const ART_SIZE = 1024
