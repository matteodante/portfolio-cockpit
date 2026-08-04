import { notFound } from 'next/navigation'

// Without this route an unknown path under a valid locale falls through to
// Next's own /_not-found, which renders outside app/[lang]/layout.tsx — no
// fonts, no theme. Routing here lets the [lang] not-found boundary catch it.
export default function CatchAll(): never {
  notFound()
}
