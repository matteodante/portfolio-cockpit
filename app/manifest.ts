import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/constants/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: BASE_URL,
    name: 'Matteo Dante — Websites, apps & AI',
    short_name: 'Matteo Dante',
    description:
      'Websites, apps, AI consulting and custom software — plus a playable 3D cockpit CV.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#05060a',
    theme_color: '#05060a',
    icons: [
      {
        src: '/social/avatar-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/social/avatar-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
