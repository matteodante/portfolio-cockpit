import type { Locale } from '@/lib/i18n/config'
import en from '@/lib/i18n/translations/en.json'
import it from '@/lib/i18n/translations/it.json'

const MESSAGES: Record<Locale, Record<string, string>> = { en, it }

/**
 * Static translation lookup for the landing. The landing never loads the
 * private overrides (they are cockpit-only), so a plain JSON lookup keeps
 * server components synchronous and client bundles context-free. Falls back
 * to the key itself, same contract as the cockpit's useT().
 */
export const makeT = (locale: Locale) => {
  const m = MESSAGES[locale]
  return (key: string) => m[key] ?? key
}
