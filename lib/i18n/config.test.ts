import { describe, expect, test } from 'bun:test'
import { defaultLocale, isValidLocale, locales } from './config'

describe('isValidLocale', () => {
  test('accepts every configured locale', () => {
    for (const locale of locales) {
      expect(isValidLocale(locale)).toBe(true)
    }
  })

  test('rejects an unknown locale', () => {
    expect(isValidLocale('fr')).toBe(false)
    expect(isValidLocale('')).toBe(false)
    expect(isValidLocale('EN')).toBe(false)
  })
})

describe('defaultLocale', () => {
  test('is in the locales list', () => {
    expect(locales).toContain(defaultLocale)
  })
})
