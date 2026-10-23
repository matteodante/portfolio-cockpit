import { notFound } from 'next/navigation'
import { currentUser } from '@/lib/courses/auth'
import { getDb } from '@/lib/courses/db'
import { isValidLocale } from '@/lib/i18n/config'

/** Locale, database and viewer of a course-area page. */
export async function accountContext(params: Promise<{ lang: string }>) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  return { locale: lang, db: getDb(), viewer: await currentUser() }
}
