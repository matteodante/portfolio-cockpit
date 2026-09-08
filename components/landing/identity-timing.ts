const FIRST_CHANGE = 650
const CHANGE_EVERY = 5000
const TRANSITION_LENGTH = 1120

/** Time advances only while the hero is visible and motion is enabled. */
export function identityFrame(elapsed: number) {
  if (elapsed < FIRST_CHANGE) {
    return { progress: 0, strength: 0, wait: FIRST_CHANGE - elapsed }
  }
  const time = elapsed - FIRST_CHANGE
  const cycle = Math.floor(time / CHANGE_EVERY)
  const local = time % CHANGE_EVERY
  const reverse = cycle % 2 === 1
  if (local >= TRANSITION_LENGTH) {
    return {
      progress: reverse ? 0 : 1,
      strength: 0,
      wait: CHANGE_EVERY - local,
    }
  }
  const phase = local / TRANSITION_LENGTH
  const eased = phase * phase * (3 - 2 * phase)
  return {
    progress: reverse ? 1 - eased : eased,
    strength: Math.sin(phase * Math.PI) ** 0.8,
    wait: 0,
  }
}
