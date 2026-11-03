'use client'

import { authClient } from '@/lib/courses/auth-client'

export default function SignOutButton({
  label,
  redirectTo,
}: {
  label: string
  redirectTo: string
}) {
  return (
    <button
      className="account-signout"
      type="button"
      onClick={async () => {
        await authClient.signOut()
        window.location.assign(redirectTo)
      }}
    >
      {label}
    </button>
  )
}
