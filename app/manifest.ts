import type { MetadataRoute } from 'next'
import { ICON_PATH } from '@/lib/constants/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Matteo Dante — Freelance Software Engineer',
    short_name: 'Matteo Dante',
    description:
      'Websites, apps, AI consulting and custom software — plus a playable 3D cockpit CV.',
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
