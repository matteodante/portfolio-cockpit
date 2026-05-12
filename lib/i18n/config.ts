export type Locale = 'en' | 'it'

export const locales: Locale[] = ['en', 'it']
export const defaultLocale: Locale = 'en'

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

/** BCP-47 tag (`en-US`) for `<html lang>`, JSON-LD `inLanguage`, etc. */
export const BCP47_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  it: 'it-IT',
}

/** OpenGraph variant (underscore separator) of the same map. */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  it: 'it_IT',
}
