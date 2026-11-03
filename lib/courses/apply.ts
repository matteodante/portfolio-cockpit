'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { createRateLimiter, getClientIp } from '@/lib/api/rate-limit'
import { getDb } from '@/lib/courses/db'
import {
  APPLICATION_FORMATS,
  APPLICATION_LEVELS,
  APPLICATION_TOPICS,
  applications,
} from '@/lib/courses/schema'

export type ApplyState = {
  status: 'idle' | 'sent' | 'invalid' | 'limited' | 'failed' | 'unavailable'
  fields?: string[]
  /** What was typed, so a refused pass comes back filled in. */
  values?: Record<string, string>
}

const TEXT_FIELDS = ['name', 'email', 'topic', 'format', 'level', 'goal']

const Application = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  topic: z.enum(APPLICATION_TOPICS),
  format: z.enum(APPLICATION_FORMATS),
  level: z.enum(APPLICATION_LEVELS),
  goal: z.string().trim().min(1).max(2000),
  locale: z.enum(['it', 'en']),
  consent: z.literal('on'),
})

const limiter = createRateLimiter({
  points: 5,
  windowSeconds: 600,
  prefix: 'course-apply',
})

export async function submitApplication(
  _previous: ApplyState,
  form: FormData
): Promise<ApplyState> {
  // Honeypot: people never see this field; bots fill it in.
  if (form.get('website')) return { status: 'sent' }
  const values = Object.fromEntries(
    TEXT_FIELDS.map((key) => [key, String(form.get(key) ?? '').slice(0, 2000)])
  )
  const parsed = Application.safeParse(Object.fromEntries(form))
  if (!parsed.success) {
    return {
      status: 'invalid',
      fields: parsed.error.issues.map((issue) => String(issue.path[0])),
      values,
    }
  }
  const db = getDb()
  if (!db) return { status: 'unavailable', values }
  const rl = await limiter.consume(getClientIp(await headers()))
  if (!rl.ok) return { status: 'limited', values }
  const { consent: _consent, ...row } = parsed.data
  try {
    await db.insert(applications).values(row)
    return { status: 'sent' }
  } catch (error) {
    console.error('course application failed', error)
    return { status: 'failed', values }
  }
}
