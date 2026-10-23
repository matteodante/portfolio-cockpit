import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/components/landing/landing.css'
import '@/components/courses/account.css'

/** The signed-in course area: personal pages, never indexed or cached. */
export const metadata: Metadata = {
  title: { absolute: 'Area corsi · Matteo Dante' },
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children
}
