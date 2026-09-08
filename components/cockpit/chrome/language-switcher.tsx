import LanguageControl from '@/components/shared/language-switcher'
import type { Locale } from '@/lib/i18n/config'

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: Locale
}) {
  return <LanguageControl locale={currentLocale} cockpit />
}
