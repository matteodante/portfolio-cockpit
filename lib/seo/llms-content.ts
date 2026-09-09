import {
  CAL_BOOKING_URL,
  CLAUDE_LOCAL_DOCS_REPO_URL,
  EMAIL,
  GITHUB_URL,
  GYMTREE_APP_STORE_URL,
  LINKEDIN_URL,
  MAESTRO_APP_STORE_URL,
  PORTFOLIO_REPO_URL,
} from '@/lib/constants/contact'
import { BASE_URL, CV_MARKDOWN_PATHS } from '@/lib/constants/site'
import { MARKETING_PAGES } from '@/lib/seo/marketing-pages'

const pageLinks = Object.values(MARKETING_PAGES)
  .flatMap((page) =>
    (['it', 'en'] as const).map(
      (locale) =>
        `- [${page.title[locale]} (${locale.toUpperCase()})](${BASE_URL}${page.paths[locale]}): ${page.description[locale]}`
    )
  )
  .join('\n')

// Public service and project summary only. Never read private CV sources here.
export const LLMS_PUBLIC = `# Matteo Dante

> Freelance software engineer based in Switzerland. Websites, apps, custom software and AI automation for professionals, startups and small businesses in Italy, Ticino and beyond. Work directly with Matteo in Italian or English.

Website development starts from EUR 300. The quote defines pages, content, functionality, revisions and any domain, hosting or ongoing management costs. App/software development and AI automation are quoted on request. Remote collaboration is available in Italian and English; larger and international businesses are welcome.

Matteo has over eight years of software engineering experience. Public role summaries include Senior Full-Stack Software Engineer at Pilatus Aircraft, Backend Engineer at DonTouch, and Full-Stack Developer at Hexa Credit Care and Galileo. These are roles within company teams, not claims that their entire products were freelance client projects.

The detailed CV requires an access code. This file contains public information only; it does not grant access to private CV documents, translations or chat context. Request access directly from Matteo by email or LinkedIn.

## Website and services

- [Homepage — Italiano](${BASE_URL}/it): servizi, progetti realizzati e contatti.
- [Homepage — English](${BASE_URL}/en): services, shipped projects and contact.
${pageLinks}


## Client work — three websites for PiùUDITO

- [PiùUDITO](https://www.piuudito.it/): hearing-care company website.
- [PiùUDITO Group](https://www.piuuditogroup.it/): group website, part of the same client work.
- [Fabio Tomassetti](https://www.fabiotomassetti.it/): website built as part of the same PiùUDITO engagement.

## Personal projects

- [matteodante.it source](${PORTFOLIO_REPO_URL}): this bilingual website with custom animation and a playable 3D cockpit CV.
- [Cockpit — Italiano](${BASE_URL}/it/cockpit): CV giocabile con profilo pubblico, progetti e assistente AI.
- [Cockpit — English](${BASE_URL}/en/cockpit): playable CV with a public profile, projects and an AI assistant.
- [Maestro: Learn Anything](${MAESTRO_APP_STORE_URL}): personal iOS learning app with AI-assisted lessons, quizzes and tutor chat.
- [GymTree: Workout & AI Coach](${GYMTREE_APP_STORE_URL}): personal fitness app with coaching and AI features.
- [claude-local-docs](${CLAUDE_LOCAL_DOCS_REPO_URL}): open-source documentation search tooling using local indexing and retrieval.

## Contact

- [Discuss a project on Cal.com](${CAL_BOOKING_URL}): Matteo's project booking page.
- [Email](mailto:${EMAIL}): project enquiries and requests for detailed CV access.
- [GitHub](${GITHUB_URL}): public projects and code.
- [LinkedIn](${LINKEDIN_URL}): professional profile.

## Optional

- [Public CV summary — English](${BASE_URL}${CV_MARKDOWN_PATHS.en}): Markdown.
- [Profilo CV pubblico — Italiano](${BASE_URL}${CV_MARKDOWN_PATHS.it}): Markdown.
- [Public CV PDF — English](${BASE_URL}/resume/cv-en.pdf): downloadable summary.
- [Profilo CV pubblico PDF — Italiano](${BASE_URL}/resume/cv-it.pdf): sintesi scaricabile.

`
