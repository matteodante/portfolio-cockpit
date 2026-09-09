import { describe, expect, test } from 'bun:test'
import { createIdentityPointer } from '@/components/landing/identity-pointer'

describe('interactive identity wake', () => {
  test('a tap gives immediate feedback and settles without more input', () => {
    const pointer = createIdentityPointer()
    expect(pointer.sample(0).strength).toBe(0)
    pointer.move(0.3, 0.8, 100, 'touch')
    const tap = pointer.sample(100)
    expect(tap.x).toBe(0.3)
    expect(tap.y).toBe(0.8)
    expect(tap.strength).toBeGreaterThan(0.4)
    expect(pointer.sample(350).strength).toBeLessThan(tap.strength)
    expect(pointer.sample(1500).strength).toBe(0)
  })

  test('fast dragging is stronger but bounded and follows the new position', () => {
    const slow = createIdentityPointer()
    const fast = createIdentityPointer()
    for (const pointer of [slow, fast]) pointer.move(0.2, 0.4, 100, 'drag')
    slow.move(0.21, 0.4, 120, 'drag')
    fast.move(0.8, 0.7, 120, 'drag')
    const slowFrame = slow.sample(120)
    const fastFrame = fast.sample(120)
    expect(fastFrame.strength).toBeGreaterThan(slowFrame.strength)
    expect(fastFrame.strength).toBeLessThanOrEqual(1)
    expect(fastFrame.x).toBeGreaterThan(0.2)
    expect(fastFrame.x).toBeLessThan(0.8)
    expect(fast.sample(220).x).toBeGreaterThan(fastFrame.x)
    expect(fast.sample(1200).strength).toBe(0)
  })

  test('pause or loss of visibility clears the wake; resuming has no old trail', () => {
    const pointer = createIdentityPointer()
    pointer.move(0.2, 0.8, 100, 'hover')
    pointer.reset()
    expect(pointer.sample(101).strength).toBe(0)
    pointer.move(0.9, 0.1, 2000, 'hover')
    const resumed = pointer.sample(2000)
    expect(resumed.x).toBe(0.9)
    expect(resumed.y).toBe(0.1)
    expect(resumed.strength).toBe(0.32)
  })

  test('hover works without a button and dragging is stronger at the same speed', () => {
    for (const distance of [0.002, 0.04, 0.4]) {
      const hover = createIdentityPointer()
      const drag = createIdentityPointer()
      hover.move(0.2, 0.4, 100, 'hover')
      drag.move(0.2, 0.4, 100, 'drag')
      hover.move(0.2 + distance, 0.4, 120, 'hover')
      drag.move(0.2 + distance, 0.4, 120, 'drag')
      const light = hover.sample(120).strength
      const strong = drag.sample(120).strength
      expect(light).toBeGreaterThan(0)
      expect(light).toBeLessThanOrEqual(0.55)
      expect(strong).toBeGreaterThan(light)
      expect(strong).toBeLessThanOrEqual(1)
      drag.move(0.3, 0.4, 140, 'hover')
      expect(drag.sample(140).strength).toBeLessThanOrEqual(0.55)
    }
  })

  test('touch is at least three times stronger than mouse drag and still settles', () => {
    for (const distance of [0, 0.002, 0.04, 0.4]) {
      const mouse = createIdentityPointer()
      const touch = createIdentityPointer()
      mouse.move(0.2, 0.4, 100, 'drag')
      touch.move(0.2, 0.4, 100, 'touch')
      mouse.move(0.2 + distance, 0.4, 120, 'drag')
      touch.move(0.2 + distance, 0.4, 120, 'touch')
      const finger = touch.sample(120).strength
      expect(finger).toBeGreaterThan(mouse.sample(120).strength * 3)
      expect(finger).toBeLessThanOrEqual(3.8)
      expect(touch.sample(1500).strength).toBe(0)
      touch.move(0.5, 0.5, 1600, 'hover')
      expect(touch.sample(1600).strength).toBeLessThanOrEqual(0.55)
    }
  })
})
