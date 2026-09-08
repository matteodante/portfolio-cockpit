import { describe, expect, test } from 'bun:test'
import { identityFrame } from '@/components/landing/identity-timing'

describe('hero identity sequence', () => {
  test('starts on the clean astronaut and reveals Matteo during first load', () => {
    expect(identityFrame(0).progress).toBe(0)
    expect(identityFrame(0).strength).toBe(0)
    expect(identityFrame(0).wait).toBeLessThan(1000)
    expect(identityFrame(1800).progress).toBe(1)
  })

  test('alternates direction every five seconds with clean resting frames', () => {
    for (const time of [1800, 3000, 5600, 11800]) {
      expect(identityFrame(time).progress).toBe(1)
      expect(identityFrame(time).strength).toBe(0)
      expect(identityFrame(time).wait).toBeGreaterThan(0)
      expect(identityFrame(time + 5000).progress).toBe(0)
    }
  })

  test('both transitions have a bounded active midpoint', () => {
    for (const time of [1210, 6210]) {
      const frame = identityFrame(time)
      expect(frame.progress).toBeCloseTo(0.5)
      expect(frame.strength).toBeGreaterThan(0.95)
      expect(frame.strength).toBeLessThanOrEqual(1)
      expect(frame.wait).toBe(0)
    }
  })
})
