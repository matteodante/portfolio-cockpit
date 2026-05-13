import type { Locale } from '@/lib/i18n/config'

export const CHAT_PROFILE_ENC = 'lib/ai/chat-profile.enc'

export const PRIVATE_TRANSLATIONS_ENC: Record<Locale, string> = {
  en: 'lib/i18n/translations/en.private.json.enc',
  it: 'lib/i18n/translations/it.private.json.enc',
}

export const cvMdEnc = (locale: Locale): string =>
  `private/resume/cv-${locale}.md.enc`

export const cvPdfEnc = (locale: Locale): string =>
  `private/resume/cv-${locale}.pdf.enc`
