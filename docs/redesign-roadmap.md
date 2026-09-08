# Portfolio redesign: working brief and priorities

Prepared 2026-09-08. The starting evidence below describes the retired
landing, whose source remains in Git history. The owner then selected
Dungyov.com as the reference and made client enquiries the homepage's
priority. The implemented replacement has four sections, a portrait,
real localized App Store captures, brief EN/IT copy and booking CTAs.
The exact Cal.com URL is still required before booking can work.
This redesign is not evidence of conversion lift.

## Starting evidence

| Observation | Evidence | Consequence to investigate |
| --- | --- | --- |
| Fixed navigation offers PLAY, with no contact action | `components/landing/landing-sections.tsx`; local first viewport | Ready-to-contact visitors need another route to email |
| Hero asks visitors to scroll and has a 500svh track | `components/landing/landing-hero.tsx` | The cinematic journey may delay access to proof and contact |
| Projects outro and contact finale emphasize entering the cockpit | `sections/section-projects.tsx`, `sections/section-contact.tsx` | The strongest visual action sends visitors into another experience |
| The specific introductory pitch is rendered only in the hidden SEO block | `app/[lang]/page.tsx` | Bring useful offer detail into visible copy |
| Four real projects already exist on the landing | `section-projects.tsx`, translations and contact constants | Use their actual products and technical work as proof |
| Vercel Analytics and Speed Insights are mounted; no custom conversion tracking found in the landing | `app/[lang]/layout.tsx`, `components/landing/` | Pageviews alone cannot distinguish contact intent from play |

These are interface observations and hypotheses. Traffic sources,
conversion rates and lead quality have not been measured here.

Setup checks: `bun run check` passes (17 tests). The static Impeccable
landing scan reports no primary findings and one advisory: the existing
white highlight `rgba(255, 255, 255, 0.16)` in `section-contact.tsx:130`
is outside the documented palette. Review its intended token during
the redesign; no rule was disabled. `design:doctor` reports only the
unset `buildPath` preference, which remains deliberately unanswered.

The production build completes. It also reports a broad file-tracing
warning through `next.config.ts` → `load-encrypted.ts` and OG/social
image warnings for unsupported `z-index` and the `◉` font glyph. These
source files were not changed by setup. Keep these as separate technical
follow-ups; inspect the generated social images and server bundle before
altering encrypted-asset tracing.

## P0 — Make the commercial journey explicit

Preserve the audiences confirmed in `PRODUCT.md`. Client projects now have priority on the homepage.
Recommended hypothesis for the showcase: direct project enquiries
lead the landing; the cockpit remains a prominent optional proof of
craft and a route to the CV.

Acceptance for this step:

- A visitor can identify Matteo, the web/mobile/AI offer and the next
  action without scrolling or watching a clip.
- Contact is reachable from the first viewport, after proof, and at
  the close. The existing email destination is sufficient initially.
- CTA labels say what happens. Draft pairs to explore: “Parliamo del
  tuo progetto” / “Let's talk about your project”; “Esplora il CV 3D” /
  “Explore the 3D CV”. These are proposals, not approved copy.
- Navigation offers a direct route to projects and contact. Animation
  accompanies that path without controlling whether links are usable.

## P1 — Make the craft and the proof specific

Keep the astronaut and space identity. Explore a composition with a
recognizable focal moment, deliberate type scale, coherent materials
and a readable mobile version. Palette, fonts, hero length and the
current orange-button hierarchy can evolve. Select the visual direction
through Impeccable before changing the design system.

Use the real work already represented:

| Project | Evidence to develop using existing public material |
| --- | --- |
| Maestro | Native iOS tutor, learning journey, source-grounded AI, localized App Store link |
| GymTree | Coach web, trainee app, subscriptions, backend and production AI flows |
| claude-local-docs | Public repository, retrieval approach, actual usage example |
| Cockpit Portfolio | Playable implementation and public code; an example of craft |

For each selected project, show its audience/problem, Matteo's role,
one meaningful interface or interaction, and a working proof link.
Verify the live listings and current product assets when implementing.
Toy illustrations carry identity; actual product captures carry proof.
Do not invent screenshots, testimonials, customer counts or outcomes.
Request missing evidence only when the chosen composition needs it.

## P2 — Validate usability and performance with the redesign

Use the completion checks in `design-workflow.md`. In particular:

- Keep both languages equally complete, including visible headings,
  metadata, link labels and contact copy.
- Ensure reduced motion delivers the entire story in a usable static
  layout; test video/image failure and the no-JS path.
- Capture transfer size, LCP and interaction responsiveness from a
  production build before replacing media. Set a budget from that
  baseline; lazy-load below-fold art and isolate cockpit code.
- Review public CV access, contact, keyboard navigation and return
  from the cockpit as complete visitor journeys.

## Measurement proposal — not yet instrumented

Use the existing analytics provider if its configured plan supports
the needed custom events. Confirm that before implementation; do not
add a second provider as part of visual work.

| Event | Trigger | Suggested properties |
| --- | --- | --- |
| `contact_click` | Activation of an email/project contact CTA | `locale`, `placement` |
| `project_open` | Activation of a project's proof link | `locale`, `project_id`, `placement` |
| `cockpit_enter` | Activation of a link into the cockpit | `locale`, `placement` |
| `cv_download` | Activation of a public or authorized CV link | `locale`, `placement`, `format` |

Allow only fixed, documented property values. Never include chat text,
email contents, passwords, unlock codes, cookie values or private CV
content. Track on activation, not render; do not delay navigation.

`contact_click` and `cv_download` measure intent, not email delivery or
successful downloads. Count qualified enquiries separately from actual
incoming contacts. Define qualification consistently (relevant need,
real project or hiring opportunity, a possible next step).

Before comparing versions, capture the baseline and launch date. Keep
time windows, locale, device and traffic source comparable where data
allows. Use unique sessions with contact intent / landing sessions only
if the provider exposes both consistently; otherwise report raw events
and pageviews separately. Never label events/pageviews a visitor
conversion rate. Low traffic calls for cautious observation and real
conversations, without claiming statistical significance.

## Open decisions

- Exact Cal.com event URL.
- No lasting preference for code or generated composition workflows is recorded.
- Traffic/analytics baseline and access to the measurement dashboard.
