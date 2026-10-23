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

Website development, app/software development and AI automation are quoted on request. Scope and price are agreed with Matteo for each project. The website quote defines pages, content, functionality, revisions and any domain, hosting or ongoing management costs. Remote collaboration is available in Italian and English; larger and international businesses are welcome.

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
- [Portico demo](${BASE_URL}/portico-demo/index.html): Microsoft's Direct3D 9 tutorials running unchanged in the browser on [Portico](https://github.com/matteodante/portico), an open-source library under MPL-2.0.

## Articles

- [Articles](${BASE_URL}/en/blog): long-form notes, in English, on software Matteo has built.
- [DroneClean: tap the shadow once](${BASE_URL}/en/blog/droneclean-shadow-removal): the shadow-removal web app at droneclean.app, its piece-wise uploads, tracking and inpainting models, and an export that re-encodes only what changed.
- [Miniform: save the message first, send the email second](${BASE_URL}/en/blog/miniform-self-hosted-form-inbox): a self-hosted form inbox in one Go binary with SQLite, where every notification has its own row, lease and retry.
- [GymTree: a workout app for the time between sets](${BASE_URL}/en/blog/gymtree-workout-and-coaching): the workout player, a rest timer that survives a locked phone, an ordered offline queue and the permissions behind a coach's programme.
- [Maestro: from "I want to take better photos" to a lesson](${BASE_URL}/en/blog/maestro-learning-goals-and-practice): URL-gated source search, a structural lesson inspection with repair attempts, and quiz answers kept after the quiz.
- [Portfolio Cockpit: a CV you fly through](${BASE_URL}/en/blog/portfolio-cockpit-playable-cv): how the Three.js world and the React interface share this site without updating at the same speed.
- [Filo: teaching an AI conversation to forget Bologna](${BASE_URL}/en/blog/filo-memory): encrypted local memory, corrections and a synthetic evaluation with its limitations. Filo, formerly Therapist, is experimental adult self-reflection software.
- [Portico: Microsoft's Direct3D 9 tutorials, unchanged, in a browser tab](${BASE_URL}/en/blog/portico-direct3d9-webgl2): the public MPL-2.0 library, generated shaders, JSPI and measured tutorial rendering comparisons.

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
