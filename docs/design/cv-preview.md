# CV navigation and readability

Prepared and reviewed locally on 2026-10-05. The owner approved publication
after reviewing the preview. Verification below describes the local build;
production deployment checks are recorded in the release task.
The preceding production release is `0de1d1b`.

## Changes

- The homepage has a secondary public PDF download beneath the hero actions,
  in EN/IT. The server renders the link; hydration adds the dated filename
  at click time. The private CV still requires the existing access code.
- The cockpit menu opens every CV section directly. The native menu closes
  before the dock overlay opens; Escape returns focus to the menu button.
- Experience lists four employers. GymTree is a personal project, with its
  private detail retained in the project translation. Miniform and Therapist
  join the project list; Therapist remains explicitly experimental. The
  public/private assistant profiles also distinguish employers and projects.
- The four PDFs retain the original photo, all six projects and Java. Shorter
  summaries/project descriptions allow 10pt body text with 12pt leading,
  instead of 9.5/11.5pt. Each PDF remains one A4 page.
- Language controls are at least 44×44px; motion, section navigation, project
  links and dock close actions are at least 44px high. Below 360px the homepage
  header uses the labeled avatar without the adjacent name to preserve space.
- Encrypted reads are rooted in three literal asset directories. Required
  `outputFileTracingIncludes` remain in place; the broad tracing warning is
  gone. The seven encrypted files still decrypt to their local sources.

## Verification

- `bun run check`: 51 tests, 569 assertions, no failures; lint/types passed.
- Production build passed. The existing outdated Browserslist notice remains.
- React Doctor: no reported diagnostics. The scan including the existing
  dock-overlay file scores 95/100; the smaller eight-file scan scored 100.
  These scans have different file coverage and are not a comparable baseline.
- Required static design check: zero primary findings; existing advisory
  typography/color deviations remain outside this refinement.
- Inspected all four PDF page renders; no clipping or spill onto another page.
- Chromium preview: desktop 1440×900, mobile 390×844 and narrow 320×740.
  Checked Italian/English, motion-pause rendering, direct public download,
  authenticated navigation, four-employer content, six projects, Escape and
  focus return. No horizontal overflow in the inspected homepage layouts.
- Both private PDFs, Markdown documents and translation responses matched
  the local sources; unauthenticated PDF access returned 401. The new public
  download is present in the server HTML. All seven encrypted blobs were
  checked against plaintext; an unlisted directory was rejected.
- No physical-device, Safari, complete gameplay, full screen-reader or field
  performance certification is implied. The scene behavior was not changed.

## Review entry points

Run the production build locally on port 3001. Inspect `/it`, `/en`, and the
corresponding `/cockpit` routes. From the cockpit, start and open Menu to
reach the sections without piloting. Full PDFs remain under ignored
`private-src/`; public PDFs and sources are in `public/resume/`.

The preview was presented before any commit, push or Vercel deployment.
