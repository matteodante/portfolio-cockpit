export const NAME = 'Matteo Dante'

export const EMAIL = 'matteo.dante659@gmail.com'
export const EMAIL_HREF = `mailto:${EMAIL}` as const

export const GITHUB_USER = 'matteodante'
export const GITHUB_URL = `https://github.com/${GITHUB_USER}` as const
export const GITHUB_DISPLAY = `github.com/${GITHUB_USER}` as const

const LINKEDIN_SLUG = 'matteo-dante-3705b5164'
export const LINKEDIN_URL = `https://linkedin.com/in/${LINKEDIN_SLUG}` as const
export const LINKEDIN_DISPLAY = 'linkedin.com/in/matteo-dante' as const

export const INSTAGRAM_USER = 'matteodante_'
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USER}` as const

export const SOCIAL_URLS = [GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL] as const
