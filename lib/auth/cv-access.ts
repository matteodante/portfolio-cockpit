import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { requireEnv } from './env'

const COOKIE_NAME = 'cv_access'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function checkPassword(input: string): boolean {
  if (typeof input !== 'string' || input.length === 0) return false
  const expected = requireEnv('CV_ACCESS_PASSWORD')
  const a = Buffer.from(input, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function sign(message: string): string {
  return createHmac('sha256', requireEnv('CV_ACCESS_SECRET'))
    .update(message)
    .digest('hex')
}

function makeAccessToken(now: number = Date.now()): string {
  const exp = String(Math.floor(now / 1000) + MAX_AGE_SECONDS)
  return `${exp}.${sign(exp)}`
}

function verifyAccessToken(
  token: string | undefined | null,
  now: number = Date.now()
): boolean {
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const exp = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expNum = Number(exp)
  if (!Number.isFinite(expNum) || expNum < Math.floor(now / 1000)) return false
  const expected = sign(exp)
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(sig, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function hasAccess(): Promise<boolean> {
  const store = await cookies()
  return verifyAccessToken(store.get(COOKIE_NAME)?.value)
}

export function writeAccessCookie(res: NextResponse): void {
  res.cookies.set({
    name: COOKIE_NAME,
    value: makeAccessToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export function clearAccessCookie(res: NextResponse): void {
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
