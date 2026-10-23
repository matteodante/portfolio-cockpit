import { getAuth } from '@/lib/courses/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Better Auth's routes (Google sign-in, session, sign-out) for the course area. */
async function handle(request: Request) {
  const auth = getAuth()
  if (!auth) return Response.json({ error: 'unavailable' }, { status: 503 })
  return auth.handler(request)
}

export { handle as GET, handle as POST }
