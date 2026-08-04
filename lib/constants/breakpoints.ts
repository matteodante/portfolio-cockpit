import { breakpoints } from '@/lib/styles/layout.mjs'

export const MOBILE_BREAKPOINT = breakpoints.dt

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
