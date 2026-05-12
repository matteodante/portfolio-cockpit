import { describe, expect, test } from 'bun:test'
import { nextLowerPreset, QUALITY_PRESETS } from './scene-quality'

describe('nextLowerPreset', () => {
  test('high → mid', () => {
    expect(nextLowerPreset('high')).toBe('mid')
  })

  test('mid → low', () => {
    expect(nextLowerPreset('mid')).toBe('low')
  })

  test('low → null (already lowest)', () => {
    expect(nextLowerPreset('low')).toBeNull()
  })

  test('throws on unknown preset', () => {
    // @ts-expect-error — testing the runtime guard against an invalid value
    expect(() => nextLowerPreset('ultra')).toThrow(/Unknown quality preset/)
  })
})

describe('QUALITY_PRESETS', () => {
  test('every preset matches its key', () => {
    for (const [key, preset] of Object.entries(QUALITY_PRESETS)) {
      expect(preset.preset).toBe(key as typeof preset.preset)
    }
  })

  test('higher tiers have higher dprMax', () => {
    expect(QUALITY_PRESETS.high.dprMax).toBeGreaterThan(
      QUALITY_PRESETS.mid.dprMax
    )
    expect(QUALITY_PRESETS.mid.dprMax).toBeGreaterThan(
      QUALITY_PRESETS.low.dprMax
    )
  })

  test('low disables expensive features', () => {
    expect(QUALITY_PRESETS.low.bloomEnabled).toBe(false)
    expect(QUALITY_PRESETS.low.godRaysEnabled).toBe(false)
    expect(QUALITY_PRESETS.low.cubemapEnabled).toBe(false)
  })
})
