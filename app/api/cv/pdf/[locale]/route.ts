import { serveGatedFile } from '@/lib/api/gated-file'
import { cvPdfEnc } from '@/lib/auth/encrypted-paths'
import { isValidLocale } from '@/lib/i18n/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _: Request,
  ctx: { params: Promise<{ locale: string }> }
): Promise<Response> {
  const { locale } = await ctx.params
  if (!isValidLocale(locale)) {
    return new Response(null, { status: 404 })
  }
  return serveGatedFile({
    locale,
    encryptedRelPath: cvPdfEnc(locale),
    contentType: 'application/pdf',
    disposition: 'attachment',
    downloadFilename: `MatteoDante_CV_${locale}.pdf`,
  })
}
