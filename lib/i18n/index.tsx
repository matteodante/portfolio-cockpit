'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { type Locale, locales } from './config'
import en from './translations/en.json'
import it from './translations/it.json'

export type TranslationKey = keyof typeof en

type Translations = Record<TranslationKey, string>

const messages = {
  en: en satisfies Translations,
  it: it satisfies Translations,
} satisfies Record<Locale, Translations>

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
  unlocked: boolean
  applyUnlock: () => Promise<void>
}

const I18nContext = createContext<I18nContextValue | null>(null)

const LOCALE_PREFIX_RE = new RegExp(`^/(?:${locales.join('|')})(?=/|$)`)

export function I18nProvider({
  locale,
  children,
}: PropsWithChildren<{ locale: Locale }>) {
  const router = useRouter()
  const pathname = usePathname()
  const [overrides, setOverrides] = useState<Partial<Translations>>({})
  const [unlocked, setUnlocked] = useState(false)

  const fetchPrivate = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/translations/${locale}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      if (!res.ok) return false
      const data = (await res.json()) as Partial<Translations>
      setOverrides(data)
      setUnlocked(true)
      return true
    } catch {
      return false
    }
  }, [locale])

  useEffect(() => {
    void fetchPrivate()
  }, [fetchPrivate])

  const setLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(LOCALE_PREFIX_RE, `/${newLocale}`)
    router.replace(newPath as `/${string}`)
  }

  const t = (key: TranslationKey) => {
    const override = overrides[key]
    if (override !== undefined && override !== '') return override
    const v = messages[locale][key]
    if (process.env.NODE_ENV !== 'production' && v === undefined) {
      console.warn(`[i18n] missing key for locale=${locale}: ${key}`)
    }
    return v ?? key
  }

  const applyUnlock = useCallback(async () => {
    await fetchPrivate()
  }, [fetchPrivate])

  return (
    <I18nContext value={{ locale, setLocale, t, unlocked, applyUnlock }}>
      {children}
    </I18nContext>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}

export function useT() {
  return useI18n().t
}

export function useUnlock() {
  const { unlocked, applyUnlock } = useI18n()
  return { unlocked, applyUnlock }
}

export type { Locale }
