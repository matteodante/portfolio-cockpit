export type IdentityPointerFrame = {
  x: number
  y: number
  strength: number
}

export type IdentityInput = 'hover' | 'drag' | 'touch'

/** A short optical wake; stopping the pointer lets the renderer sleep again. */
export function createIdentityPointer() {
  let x = 0.5
  let y = 0.5
  let targetX = x
  let targetY = y
  let amplitude = 0
  let movedAt = 0
  let sampledAt = 0

  return {
    move(nextX: number, nextY: number, now: number, input: IdentityInput) {
      const fresh = amplitude === 0 || now - movedAt > 400
      const distance = Math.hypot(nextX - targetX, nextY - targetY)
      const speed = fresh ? 0 : distance / Math.max(8, now - movedAt)
      if (input === 'touch') amplitude = Math.min(3.8, 2.6 + speed * 280)
      else if (input === 'drag') amplitude = Math.min(1, 0.72 + speed * 95)
      else amplitude = Math.min(0.55, 0.32 + speed * 55)
      targetX = nextX
      targetY = nextY
      if (fresh) {
        x = nextX
        y = nextY
        sampledAt = now
      }
      movedAt = now
    },
    sample(now: number): IdentityPointerFrame {
      const follow = 1 - Math.exp(-Math.max(0, now - sampledAt) / 55)
      x += (targetX - x) * follow
      y += (targetY - y) * follow
      sampledAt = now
      const strength = amplitude * Math.exp(-(now - movedAt) / 190)
      if (strength < 0.008) amplitude = 0
      return { x, y, strength: amplitude === 0 ? 0 : strength }
    },
    reset() {
      amplitude = 0
    },
  }
}
