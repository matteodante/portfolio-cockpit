# Personal website and company-team evidence

The owner approved using matteodante.it and its playable cockpit as proof
alongside the PiùUDITO client project, and using Pilatus/DonTouch experience
where appropriate. The additions appear on the homepage and website
service page in both languages.

## Content and placement

- Homepage: PiùUDITO, then the personal website/cockpit proof row, the
  existing Maestro/GymTree pair, and a compact company-team summary.
- Website development: the original PiùUDITO showcase and explanation,
  followed by the personal project and company-team summary.
- App/software, AI and the PiùUDITO case retain their existing evidence.

`PortfolioEvidence` describes the site as Matteo’s personal project:
bilingual landing, custom animation and a playable 3D CV. The dark action
opens the localized cockpit. The service page also links to the homepage.
Both links disable prefetch; the commercial page does not import a live
WebGL scene or load the cockpit model to illustrate the work.

`TeamExperience` uses public role summaries: Senior Full-Stack Software
Engineer in aviation at Pilatus Aircraft, Backend Engineer on a high-traffic
consumer platform at DonTouch. It is company-team experience, not a claim
that either employer commissioned their corporate website from Matteo or
that he alone built their products.

Sources: `public/resume/cv.it.md`, `public/resume/cv.md` and the public
`experience.03`/`experience.04` translations. No gated CV content, private
architecture, employer metrics, testimonials or results were added.

## Actual project captures

`public/landing-v2/portfolio/landing.jpg` comes from the prior settled
Matteo hero capture; `cockpit-mobile.jpg` comes from the prior public mobile
gameplay capture. The original screenshot pixels were JPEG-encoded without
retouching or cropping. These are real UI captures, not generated mockups.
The homepage capture predates its added service navigation shortcut; it
records the existing hero composition, portrait and CTAs. The cockpit
capture shows no access code or private CV content.

Both carry embedded origins; `origin.json` records capture paths and hashes.
Together the source JPEGs are about 132 KiB. Next Image loads them lazily,
with intrinsic dimensions and responsive sizes. The side-by-side screenshot
pair occupies the existing editorial proof-row layout and stacks with its
copy on mobile. All links remain normal server-rendered links.

## SEO and measurement

Website-service descriptions now mention PiùUDITO, this site and the
cockpit. The public llms.txt explanation identifies the portfolio as a
personal project. Existing `project_opened` tracking accepts two explicit
labels: `portfolio_website` and `portfolio_cockpit`. These clicks represent
interest in an example, not a lead, appointment or completed game.

## Validation

- `bun run check`: passed, 31 tests and 191 assertions.
- `bun run build`: passed.
- HTTP checks of EN/IT homepage and website-development pages confirm one
  personal-project row, localized links, company roles, lazy screenshots,
  unique team heading and unchanged canonical URLs.
- App/software, AI and case routes were checked for scope preservation;
  both new source images return JPEG 200.
- Impeccable detector: zero primary findings; existing typography/color
  advisories remain. Both added rasters have embedded provenance.
- React Doctor: one maintainability warning for control-flow complexity in
  the existing multi-page `MarketingPageContent`; no runtime bug reported
  for these changed files. No diagnostic suppression was added.

The pre-existing project captures were inspected before reuse. They are
not fresh captures of the new proof-row layout. Desktop/mobile browser
inspection and the independent visual finish review remain pending while
the owner's Mac is locked. The owner said they will unlock it at 18:00.
Previous social-card and cinematic-hero reviews do not approve this layout.
No live analytics receipt or conversion/SEO result is claimed.
