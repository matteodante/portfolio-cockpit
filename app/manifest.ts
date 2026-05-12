import type { MetadataRoute } from 'next'
import { ICON_PATH } from '@/lib/constants/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Matteo Dante — Cockpit Portfolio',
    short_name: 'Matteo Dante',
    description:
      'Interactive 3D cockpit portfolio with streaming AI assistant.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05060a',
    theme_color: '#05060a',
    icons: [
      {
        src: ICON_PATH,
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
