import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { headers } from 'next/headers'
import { getDb } from '@/lib/courses/db'
import { account, session, user, verification } from '@/lib/courses/schema'

/**
 * Course accounts (Better Auth). Sign in with Google only: no passwords and
 * no emails to send. Email and password exist only for local development
 * (COURSES_DEV_PASSWORD=1 outside production), so the area can be tested
 * without a Google client.
 */
function createAuth() {
  const db = getDb()
  const secret = process.env.BETTER_AUTH_SECRET
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const devPassword =
    process.env.NODE_ENV !== 'production' &&
    process.env.COURSES_DEV_PASSWORD === '1'
  if (!(db && secret && ((clientId && clientSecret) || devPassword)))
    return null
  return betterAuth({
    appName: 'Matteo Dante',
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    basePath: '/api/auth',
    secret,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: { user, session, account, verification },
    }),
    advanced: {
      database: { generateId: 'uuid' },
      // Railway's edge writes the visitor's address here and replaces any
      // value sent by the client.
      ipAddress: { ipAddressHeaders: ['x-real-ip'] },
    },
    telemetry: { enabled: false },
    emailAndPassword: devPassword
      ? { enabled: true, requireEmailVerification: false }
      : { enabled: false },
    socialProviders:
      clientId && clientSecret ? { google: { clientId, clientSecret } } : {},
    session: { expiresIn: 60 * 24 * 3600, updateAge: 24 * 3600 },
    rateLimit: {
      enabled: process.env.NODE_ENV === 'production',
      window: 60,
      max: 60,
    },
    plugins: [nextCookies()],
  })
}

type Auth = NonNullable<ReturnType<typeof createAuth>>
let auth: Auth | null | undefined

export function getAuth(): Auth | null {
  if (auth === undefined) auth = createAuth()
  return auth
}

export function googleSignInEnabled(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  )
}

export function devPasswordEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.COURSES_DEV_PASSWORD === '1'
  )
}

export type CourseUser = {
  id: string
  name: string
  email: string
  image: string | null
  admin: boolean
}

/** ADMIN_EMAILS: comma-separated Google addresses that manage the courses. */
export function isAdminEmail(email: string): boolean {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase())
}

export async function currentUser(): Promise<CourseUser | null> {
  const instance = getAuth()
  if (!instance) return null
  const result = await instance.api.getSession({ headers: await headers() })
  if (!result) return null
  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    image: result.user.image ?? null,
    admin: isAdminEmail(result.user.email),
  }
}
