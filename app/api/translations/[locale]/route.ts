import { NextResponse } from 'next/server'
import { hasAccess } from '@/lib/auth/cv-access'
import { PRIVATE_TRANSLATIONS_ENC } from '@/lib/auth/encrypted-paths'
import { loadDecryptedText } from '@/lib/auth/load-encrypted'
import { isValidLocale } from '@/lib/i18n/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _: Request,
  ctx: { params: Promise<{ locale: string }> }
): Promise<Response> {
  const { locale } = await ctx.params
  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (!(await hasAccess())) {
    return NextResponse.json({ error: 'locked' }, { status: 401 })
  }

  const body = await loadDecryptedText(PRIVATE_TRANSLATIONS_ENC[locale])

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  })
}
