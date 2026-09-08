const colors = {
  black: '#1a1a1a',
  white: '#f0f0f0',
  red: '#e30613',
  blue: '#0070f3',
  green: '#00ff88',
  purple: '#7928ca',
  pink: '#ff0080',
  'cockpit-bg': '#05060a',
  'cockpit-panel': '#0c0d11',
  'cockpit-panel-light': '#14161c',
  'cockpit-text': '#f2ede3',
  'cockpit-text-dim': '#a7a5a1',
  'cockpit-border': '#f2ede333',
  'cockpit-accent': '#ff6b35',
  'cockpit-hud-green': '#6aff9e',
  'cockpit-hud-amber': '#ffb347',
  'cockpit-hud-red': '#ff5252',
  'cockpit-hud-blue': '#00d9ff',
} as const

const themeNames = ['light', 'dark', 'red', 'evil', 'cockpit'] as const
const colorNames = ['primary', 'secondary', 'contrast'] as const

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.blue,
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.blue,
  },
  evil: {
    primary: colors.black,
    secondary: colors.red,
    contrast: colors.white,
  },
  red: {
    primary: colors.red,
    secondary: colors.black,
    contrast: colors.white,
  },
  cockpit: {
    primary: colors['cockpit-bg'],
    secondary: colors['cockpit-text'],
    contrast: colors['cockpit-accent'],
  },
} as const satisfies Themes

export { colors, themeNames, themes }

export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
