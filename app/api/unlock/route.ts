import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createRateLimiter, getClientIp } from '@/lib/api/rate-limit'
import {
  checkPassword,
  clearAccessCookie,
  writeAccessCookie,
} from '@/lib/auth/cv-access'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BodySchema = z.object({
  password: z.string().min(1).max(256),
})

// Defense-in-depth against brute force. Primary guard should be a Vercel
// Firewall rule at the edge; this limiter activates additionally when
// Upstash Redis is configured, otherwise an in-memory bucket per instance.
const unlockLimiter = createRateLimiter({
  points: 5,
  windowSeconds: 60,
  prefix: 'portfolio:unlock',
})

export async function POST(request: Request): Promise<Response> {
  const rl = await unlockLimiter.consume(getClientIp(request))
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: unlockLimiter.headers(rl) }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 })
  }
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'bad_request' },
      { status: 400 }
    )
  }

  if (!checkPassword(parsed.data.password)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_password' },
      { status: 401, headers: unlockLimiter.headers(rl) }
    )
  }

  const res = NextResponse.json(
    { ok: true },
    { headers: unlockLimiter.headers(rl) }
  )
  writeAccessCookie(res)
  return res
}

export async function DELETE(): Promise<Response> {
  const res = NextResponse.json({ ok: true })
  clearAccessCookie(res)
  return res
}
