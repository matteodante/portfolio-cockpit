import { describe, expect, test } from 'bun:test'
import en from './translations/en.json'
import it from './translations/it.json'

describe('translation parity', () => {
  const enKeys = new Set(Object.keys(en))
  const itKeys = new Set(Object.keys(it))

  test('every EN key has an IT translation', () => {
    const missing = [...enKeys].filter((k) => !itKeys.has(k))
    expect(missing).toEqual([])
  })

  test('every IT key has an EN source', () => {
    const orphans = [...itKeys].filter((k) => !enKeys.has(k))
    expect(orphans).toEqual([])
  })

  test('no empty values in either locale', () => {
    // Gated ownership bullets (.ownership.2/3/4) are intentionally empty
    // in the public bundle — the values come from the gated private
    // translations file after unlock.
    const gatedEmptyKeyRe = /^experience\.\d+\.ownership\.[234]$/
    const empties: string[] = []
    for (const [k, v] of Object.entries(en)) {
      if (gatedEmptyKeyRe.test(k)) continue
      if (typeof v !== 'string' || v.length === 0) empties.push(`en:${k}`)
    }
    for (const [k, v] of Object.entries(it)) {
      if (gatedEmptyKeyRe.test(k)) continue
      if (typeof v !== 'string' || v.length === 0) empties.push(`it:${k}`)
    }
    expect(empties).toEqual([])
  })
})
