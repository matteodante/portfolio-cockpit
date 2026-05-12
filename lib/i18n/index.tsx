'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, type PropsWithChildren, useContext } from 'react'
import { type Locale, locales } from './config'
import en from './translations/en.json'
import it from './translations/it.json'

export type TranslationKey = keyof typeof en

type Translations = Record<TranslationKey, string>

// `satisfies` keeps both maps narrow so TS catches IT/EN key drift.
const messages = {
  en: en satisfies Translations,
  it: it satisfies Translations,
} satisfies Record<Locale, Translations>

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const LOCALE_PREFIX_RE = new RegExp(`^/(?:${locales.join('|')})(?=/|$)`)

export function I18nProvider({
  locale,
  children,
}: PropsWithChildren<{ locale: Locale }>) {
  const router = useRouter()
  const pathname = usePathname()

  const setLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(LOCALE_PREFIX_RE, `/${newLocale}`)
    router.replace(newPath as `/${string}`)
  }

  const t = (key: TranslationKey) => {
    const v = messages[locale][key]
    if (process.env.NODE_ENV !== 'production' && v === undefined) {
      console.warn(`[i18n] missing key for locale=${locale}: ${key}`)
    }
    return v ?? key
  }
  return <I18nContext value={{ locale, setLocale, t }}>{children}</I18nContext>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}

export function useT() {
  return useI18n().t
}

export type { Locale }
