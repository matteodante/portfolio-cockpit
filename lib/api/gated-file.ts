import { NextResponse } from 'next/server'
import { hasAccess } from '@/lib/auth/cv-access'
import { loadDecrypted } from '@/lib/auth/load-encrypted'
import { isValidLocale } from '@/lib/i18n/config'

type GatedFileOptions = {
  locale: string
  encryptedRelPath: string
  contentType: string
  disposition: 'inline' | 'attachment'
  downloadFilename: string
}

export async function serveGatedFile({
  locale,
  encryptedRelPath,
  contentType,
  disposition,
  downloadFilename,
}: GatedFileOptions): Promise<Response> {
  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (!(await hasAccess())) {
    return NextResponse.json({ error: 'locked' }, { status: 401 })
  }

  const body = await loadDecrypted(encryptedRelPath)

  return new Response(new Uint8Array(body), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `${disposition}; filename="${downloadFilename}"`,
    },
  })
}
