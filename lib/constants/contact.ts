export const NAME = 'Matteo Dante'

export const EMAIL = 'matteo.dante659@gmail.com'
export const EMAIL_HREF = `mailto:${EMAIL}` as const

export const GITHUB_USER = 'matteodante'
export const GITHUB_URL = `https://github.com/${GITHUB_USER}` as const
export const GITHUB_DISPLAY = `github.com/${GITHUB_USER}` as const

export const CLAUDE_LOCAL_DOCS_REPO_URL =
  `${GITHUB_URL}/claude-local-docs` as const
export const PORTFOLIO_REPO_URL = `${GITHUB_URL}/portfolio-cockpit` as const

const LINKEDIN_SLUG = 'matteo-dante-3705b5164'
export const LINKEDIN_URL = `https://linkedin.com/in/${LINKEDIN_SLUG}` as const
export const LINKEDIN_DISPLAY = 'linkedin.com/in/matteo-dante' as const

export const INSTAGRAM_USER = 'matteodante_'
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USER}` as const

export const SOCIAL_URLS = [GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL] as const

export const MAESTRO_APP_STORE_URL =
  'https://apps.apple.com/us/app/maestro-learn-anything/id6780267046?uo=4' as const
export const MAESTRO_APP_STORE_URL_IT =
  'https://apps.apple.com/it/app/maestro-impara-tutto/id6780267046?uo=4' as const
export const GYMTREE_APP_STORE_URL =
  'https://apps.apple.com/us/app/gymtree-workout-ai-coach/id6761392403?uo=4' as const
export const GYMTREE_APP_STORE_URL_IT =
  'https://apps.apple.com/it/app/gymtree-palestra-coach-ai/id6761392403?uo=4' as const
