import { describe, expect, test } from 'bun:test'
import { COMM_SECTION, SECTIONS } from './cockpit-sections'

describe('cockpit-sections', () => {
  test('SECTIONS only contains planet sections', () => {
    for (const section of SECTIONS) {
      expect(section.kind).toBe('planet')
    }
  })

  test('SECTIONS ids are unique', () => {
    const ids = SECTIONS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every planet has a positive radius', () => {
    for (const s of SECTIONS) {
      expect(s.radius).toBeGreaterThan(0)
    }
  })

  test('COMM_SECTION is dock-only and not in SECTIONS', () => {
    expect(COMM_SECTION.kind).toBe('dock-only')
    const ids = SECTIONS.map((s) => s.id)
    expect(ids).not.toContain(COMM_SECTION.id)
  })
})
