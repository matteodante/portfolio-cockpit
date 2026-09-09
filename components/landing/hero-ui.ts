const TARGET = '[data-hero-glitch], .hero-actions > a'
const PROPERTIES = [
  '--hero-glitch-x',
  '--hero-glitch-y',
  '--hero-glitch-shift',
  '--hero-glitch-opacity',
  '--hero-glitch-scan',
]

/** Decorative DOM layers use the photograph's input strength and clock. */
export function createHeroUi(stage: HTMLElement) {
  let active: HTMLElement | null = null
  let enteredAt = 0
  let lastPulse = 0

  const clearTarget = () => {
    for (const property of PROPERTIES) active?.style.removeProperty(property)
    active = null
  }

  return {
    move(target: EventTarget | null, x: number, y: number, now: number) {
      const element = target instanceof Element ? target.closest(TARGET) : null
      const next =
        element instanceof HTMLElement && stage.contains(element)
          ? element
          : null
      if (next !== active) {
        clearTarget()
        active = next
        enteredAt = now
      }
      if (!active) return
      const bounds = active.getBoundingClientRect()
      active.style.setProperty('--hero-glitch-x', `${x - bounds.left}px`)
      active.style.setProperty('--hero-glitch-y', `${y - bounds.top}px`)
    },
    draw(strength: number, now: number, transition: number) {
      // A short echo at the peak of each identity change, not a second loop.
      const pulse = Math.round(transition ** 14 * 100) / 100
      if (pulse !== lastPulse) {
        stage.style.setProperty('--hero-identity-pulse', `${pulse}`)
        lastPulse = pulse
      }
      if (!active) return
      if (strength === 0) {
        clearTarget()
        return
      }
      const amount = Math.min(strength, 1.1)
      const tear = Math.sin(Math.floor(now * 0.018) * 2.4)
      active.style.setProperty('--hero-glitch-shift', `${tear * amount * 6}px`)
      active.style.setProperty(
        '--hero-glitch-opacity',
        `${Math.min(0.85, amount)}`
      )
      active.style.setProperty(
        '--hero-glitch-scan',
        `${Math.min(1, (now - enteredAt) / 220) * 100}%`
      )
    },
    reset() {
      clearTarget()
      stage.style.removeProperty('--hero-identity-pulse')
      lastPulse = 0
    },
  }
}
