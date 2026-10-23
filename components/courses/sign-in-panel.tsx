'use client'

import { useState } from 'react'
import type { AccountCopy } from '@/components/courses/account-copy'
import { authClient } from '@/lib/courses/auth-client'

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}

export default function SignInPanel({
  copy,
  callbackURL,
  google,
  devPassword,
}: {
  copy: Pick<
    AccountCopy,
    'google' | 'devSignIn' | 'devEmail' | 'devPassword' | 'devSubmit' | 'error'
  >
  callbackURL: string
  google: boolean
  devPassword: boolean
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    setPending(true)
    setError('')
    const { error: failed } = await authClient.signIn.social({
      provider: 'google',
      callbackURL,
    })
    if (failed) {
      setPending(false)
      setError(copy.error)
    }
  }

  async function signInForDevelopment(form: FormData) {
    setPending(true)
    setError('')
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    const signedIn = await authClient.signIn.email({ email, password })
    const result = signedIn.error
      ? await authClient.signUp.email({
          email,
          password,
          name: email.split('@')[0] ?? email,
        })
      : signedIn
    if (result.error) {
      setPending(false)
      setError(copy.error)
      return
    }
    window.location.assign(callbackURL)
  }

  return (
    <div className="account-signin">
      {google && (
        <button
          className="account-google"
          type="button"
          disabled={pending}
          onClick={signInWithGoogle}
        >
          <GoogleMark />
          {copy.google}
        </button>
      )}
      {devPassword && (
        <form className="account-dev" action={signInForDevelopment}>
          <p>{copy.devSignIn}</p>
          <label>
            <span>{copy.devEmail}</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            <span>{copy.devPassword}</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
            />
          </label>
          <button className="hero-play" type="submit" disabled={pending}>
            {copy.devSubmit}
          </button>
        </form>
      )}
      <p className="account-error" role="alert">
        {error}
      </p>
    </div>
  )
}
