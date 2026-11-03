'use client'

import { createAuthClient } from 'better-auth/react'

/** Same origin: /api/auth on this site. */
export const authClient = createAuthClient()
