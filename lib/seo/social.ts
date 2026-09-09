import type { Metadata } from 'next'
import { BASE_URL } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'

export const HOME_METADATA: Record<
  Locale,
  { title: string; description: string }
> = {
  en: {
    title: 'Matteo Dante · Websites, apps & AI automation',
    description:
      'Websites, apps and AI automation for professionals, startups and businesses in Italy, Ticino and beyond. Explore my work and discuss your project with me.',
  },
  it: {
    title: 'Matteo Dante · Siti web, app e automazioni AI',
    description:
      'Siti web, app e automazioni AI per professionisti, startup e imprese in Italia e Ticino. Guarda i progetti realizzati e parliamo del tuo progetto.',
  },
}

export const SOCIAL_PAGES = [
  'home',
  'websites',
  'apps',
  'ai',
  'piuudito',
  'cockpit',
] as const
export type SocialPage = (typeof SOCIAL_PAGES)[number]
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 }

export const SOCIAL_COPY = {
  it: {
    home: ['Siti web, app e AI.', 'Dall’idea al lancio.'],
    websites: ['Siti web', 'Per professionisti e imprese.'],
    apps: ['App e software', 'Dall’idea al rilascio.'],
    ai: ['Automazioni AI', 'Partiamo dal tuo lavoro.'],
    piuudito: ['PiùUDITO · Caso studio', 'Tre siti per la stessa azienda.'],
    cockpit: ['Il mio CV, da giocare.', 'Esplora il cockpit.'],
  },
  en: {
    home: ['Websites, apps & AI.', 'From idea to launch.'],
    websites: ['Website development', 'For professionals and businesses.'],
    apps: ['Apps & software', 'From idea to release.'],
    ai: ['AI automation', 'Start with your workflow.'],
    piuudito: ['PiùUDITO · Case study', 'Three websites for one business.'],
    cockpit: ['My CV. Your mission.', 'Explore the cockpit.'],
  },
} as const

export function socialImageUrl(page: SocialPage, locale: Locale) {
  return `${BASE_URL}/social/${locale}/${page}.png`
}

export function socialImages(page: SocialPage, locale: Locale) {
  const [title] = SOCIAL_COPY[locale][page]
  return [
    {
      url: socialImageUrl(page, locale),
      ...SOCIAL_IMAGE_SIZE,
      type: 'image/png',
      alt:
        locale === 'it'
          ? `Matteo Dante — ${title} Ritratto di Matteo con le braccia conserte su un paesaggio lunare.`
          : `Matteo Dante — ${title} Matteo’s portrait with folded arms in a lunar landscape.`,
    },
  ] satisfies NonNullable<Metadata['openGraph']>['images']
}

export function socialSchemaImage(page: SocialPage, locale: Locale) {
  return {
    '@type': 'ImageObject' as const,
    url: socialImageUrl(page, locale),
    width: `${SOCIAL_IMAGE_SIZE.width}px`,
    height: `${SOCIAL_IMAGE_SIZE.height}px`,
  }
}
