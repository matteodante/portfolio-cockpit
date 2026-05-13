import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitResult = {
  ok: boolean
  retryAfter: number
  limit: number
  remaining: number
  resetMs: number
}

export type RateLimiter = {
  consume: (ip: string) => Promise<RateLimitResult>
  headers: (rl: RateLimitResult) => Record<string, string>
}

const GC_THRESHOLD = 256

type Options = {
  points: number
  windowSeconds: number
  prefix: string
}

export function createRateLimiter({
  points,
  windowSeconds,
  prefix,
}: Options): RateLimiter {
  const windowMs = windowSeconds * 1000
  const buckets = new Map<string, { count: number; resetAt: number }>()

  let upstash: Ratelimit | null | undefined
  function getUpstash(): Ratelimit | null {
    if (upstash !== undefined) return upstash
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!(url && token)) {
      upstash = null
      return null
    }
    upstash = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(points, `${windowSeconds} s`),
      analytics: true,
      prefix,
    })
    return upstash
  }

  function consumeInMemory(ip: string): RateLimitResult {
    const now = Date.now()
    if (buckets.size >= GC_THRESHOLD) {
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key)
      }
    }

    const bucket = buckets.get(ip)
    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + windowMs
      buckets.set(ip, { count: 1, resetAt })
      return {
        ok: true,
        retryAfter: 0,
        limit: points,
        remaining: points - 1,
        resetMs: resetAt,
      }
    }
    if (bucket.count >= points) {
      return {
        ok: false,
        retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        limit: points,
        remaining: 0,
        resetMs: bucket.resetAt,
      }
    }
    bucket.count += 1
    return {
      ok: true,
      retryAfter: 0,
      limit: points,
      remaining: points - bucket.count,
      resetMs: bucket.resetAt,
    }
  }

  let upstashWarned = false
  async function consume(ip: string): Promise<RateLimitResult> {
    const rl = getUpstash()
    if (!rl) return consumeInMemory(ip)
    try {
      const { success, limit, remaining, reset } = await rl.limit(ip)
      return {
        ok: success,
        retryAfter: success
          ? 0
          : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
        limit,
        remaining,
        resetMs: reset,
      }
    } catch (err) {
      if (!upstashWarned) {
        upstashWarned = true
        console.warn(`rate-limit[${prefix}]: upstash failed, falling back`, err)
      }
      return consumeInMemory(ip)
    }
  }

  function headers(rl: RateLimitResult): Record<string, string> {
    const out: Record<string, string> = {
      'X-RateLimit-Limit': String(rl.limit),
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Reset': String(Math.ceil(rl.resetMs / 1000)),
    }
    if (!rl.ok) out['Retry-After'] = String(rl.retryAfter)
    return out
  }

  return { consume, headers }
}

/** Vercel-signed client IP. Falls back to x-real-ip, then loopback. */
export function getClientIp(req: Request): string {
  const vercelXff = req.headers.get('x-vercel-forwarded-for')
  if (vercelXff) {
    const first = vercelXff.split(',')[0]
    if (first) return first.trim()
  }
  return req.headers.get('x-real-ip') ?? '127.0.0.1'
}
