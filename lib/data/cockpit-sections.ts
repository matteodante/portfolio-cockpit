export type CockpitSectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact'
  | 'comm'

type SectionBase = {
  id: CockpitSectionId
  i18nKey: string
}

export type PlanetSection = SectionBase & {
  kind: 'planet'
  pos: readonly [number, number, number]
  radius: number
  color: number
  emissive: number
  ring?: boolean
  isEarth?: boolean
}

export type DockOnlySection = SectionBase & {
  kind: 'dock-only'
}

export type CockpitSection = PlanetSection | DockOnlySection

export const SECTIONS: readonly PlanetSection[] = [
  {
    kind: 'planet',
    id: 'about',
    i18nKey: 'cockpit.sections.about',
    pos: [-54, 0, -36],
    radius: 10,
    color: 0xbfa37a,
    emissive: 0x2a1f10,
  },
  {
    kind: 'planet',
    id: 'experience',
    i18nKey: 'cockpit.sections.experience',
    pos: [60, 0, -45],
    radius: 12,
    color: 0x7a9fc9,
    emissive: 0x0a1a2a,
    ring: true,
  },
  {
    kind: 'planet',
    id: 'projects',
    i18nKey: 'cockpit.sections.projects',
    pos: [-66, 0, 54],
    radius: 11,
    color: 0xc96442,
    emissive: 0x2a1205,
  },
  {
    kind: 'planet',
    id: 'skills',
    i18nKey: 'cockpit.sections.skills',
    pos: [72, 0, 42],
    radius: 9,
    color: 0x8fa87a,
    emissive: 0x0f1a0a,
  },
  {
    kind: 'planet',
    id: 'contact',
    i18nKey: 'cockpit.sections.contact',
    pos: [30, 0, 90],
    radius: 18,
    color: 0x2b6cb0,
    emissive: 0x0a1a2a,
    isEarth: true,
  },
] as const

// Dock-only module: not rendered as a planet in the 3D scene.
export const COMM_SECTION: DockOnlySection = {
  kind: 'dock-only',
  id: 'comm',
  i18nKey: 'cockpit.sections.comm',
}
