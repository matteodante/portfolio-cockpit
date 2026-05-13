import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n/config'

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })

  const languages = new Negotiator({ headers })
    .languages()
    .filter((l) => l && l !== '*')
  if (languages.length === 0) return defaultLocale
  try {
    return match(languages, locales, defaultLocale)
  } catch {
    return defaultLocale
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip Next internals, API routes, anything with a file extension, and
  // the well-known + Next-metadata routes (sitemap, robots, manifest, OG
  // images, icons). The `.well-known` exclusion catches extensionless
  // paths like `/.well-known/change-password` that the dotfile rule
  // alone wouldn't match.
  matcher: [
    '/((?!_next|api|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|opengraph-image|twitter-image|icon|apple-icon|favicon\\.ico|\\.well-known|.*\\..*).*)',
  ],
}
