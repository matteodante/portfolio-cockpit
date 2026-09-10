import { describe, expect, test } from 'bun:test'
import {
  campaignParameters,
  consentFromStorage,
  safePageLocation,
  validMeasurementId,
} from '@/lib/analytics/client'

describe('analytics privacy boundary', () => {
  test('only a real-shaped GA4 ID enables configuration', () => {
    expect(validMeasurementId(undefined)).toBe('')
    expect(validMeasurementId('G-ABCD123456')).toBe('G-ABCD123456')
    expect(validMeasurementId('G-<script>')).toBe('')
    expect(validMeasurementId('UA-123456-1')).toBe('')
  })
  test('missing, malformed, future and expired consent do not enable analytics', () => {
    const now = 180 * 86400000
    expect(consentFromStorage(null, now)).toBeNull()
    expect(consentFromStorage('{broken', now)).toBeNull()
    expect(
      consentFromStorage(JSON.stringify({ choice: 'granted', at: 0 }), now)
    ).toBeNull()
    expect(
      consentFromStorage(
        JSON.stringify({ choice: 'granted', at: now + 1 }),
        now
      )
    ).toBeNull()
    expect(
      consentFromStorage(
        JSON.stringify({ choice: 'granted', at: now - 1 }),
        now
      )
    ).toBe('granted')
    expect(
      consentFromStorage(JSON.stringify({ choice: 'denied', at: now - 1 }), now)
    ).toBe('denied')
  })
  test('page locations omit query, fragment and unknown/private path data', () => {
    expect(
      safePageLocation(
        'https://matteodante.it/it?email=private@example.com#secret'
      )
    ).toBe('https://matteodante.it/it')
    expect(
      safePageLocation(
        'https://matteodante.it/it/servizi/sviluppo-siti-web?code=secret'
      )
    ).toBe('https://matteodante.it/it/servizi/sviluppo-siti-web')
    expect(
      safePageLocation('https://matteodante.it/it/private@example.com')
    ).toBe('https://matteodante.it/not-found')
    expect(safePageLocation('https://matteodante.it/api/cv/pdf/it')).toBe(
      'https://matteodante.it/not-found'
    )
  })
})

describe('campaign attribution', () => {
  test('maps campaign slugs while leaving the tracked URL clean', () => {
    const url =
      'https://matteodante.it/it?utm_source=google&utm_medium=cpc&utm_campaign=websites_it&utm_content=hero_a&utm_id=launch_01'
    expect(campaignParameters(url)).toEqual({
      campaign_source: 'google',
      campaign_medium: 'cpc',
      campaign_name: 'websites_it',
      campaign_content: 'hero_a',
      campaign_id: 'launch_01',
    })
    expect(safePageLocation(url)).toBe('https://matteodante.it/it')
  })
  test('excludes contact details, click IDs, free-text terms and oversized values', () => {
    expect(
      campaignParameters(
        'https://matteodante.it/it?utm_source=private@example.com&utm_medium=https://example.com&utm_campaign=' +
          'a'.repeat(81) +
          '&gclid=secret&fbclid=secret&utm_term=someone'
      )
    ).toEqual({})
  })
})
