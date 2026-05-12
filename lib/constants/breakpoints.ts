export const MOBILE_BREAKPOINT = 800

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
