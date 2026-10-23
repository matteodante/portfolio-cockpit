# AGENTS.md (blog articles)

Rules for the articles of matteodante.it. They lived in the public profile repository `matteodante/matteodante`
until 2026-10-23; their history up to then is there. That repository's README keeps the `Writing` list of links.

## Where things are

- `content/blog/<slug>.md`: one article each. The slug is the file name and never changes: shared links point to
  it, even when the title changes. This file is not an article (its name is not a slug).
- `public/blog/images/`: covers and screenshots. Articles refer to them as `images/<file>`. No provenance
  manifests (Matteo, 23 Oct 2026).
- The build reads this folder (`lib/blog/source.ts`): publishing or fixing an article is a commit here and a
  deploy. Merging to `main` deploys production, so article changes go through a draft PR for Matteo.

## Articles

- Frontmatter: `title`, `subtitle` (it is the page description and the link preview, so it must stand alone),
  `date`, `cover`, `coverAlt`, `draft` and, only after a substantial revision, `updated` (it becomes
  `dateModified` and the sitemap lastmod). Quote any value that contains a colon.
- Markdown as the renderer expects: GFM tables, fenced code with a language, ```` ```mermaid ```` for diagrams
  (drawn in the browser), images on consecutive lines to make a gallery, relative links `other-slug.md` for other
  articles. No raw HTML. A leading H1 is dropped; start the body with prose.
- Audience: a recruiter must be able to read every article, and a programmer should come away curious enough to
  write. Tell why the thing exists, what it does for the person using it, what was hard, what was learned, and
  where it stands, in the first person. No sales tone, no feature lists, no call to buy; the closing is an open
  invitation to talk.
- Depth: for a closed-source product (DroneClean, GymTree, Maestro) nothing that would help someone clone it:
  no model names, parameters, pipeline stages, internal limits or infrastructure. Describe what a user sees and
  the decisions behind it. Open-source projects link their repository for the depth; the article still tells
  the story, not the spec. Code blocks only when a line carries the story, and almost never.
- Every number, name and claim comes from the project's repository, its documents or the live product. Feelings
  and motivations only as documented decisions and the author's own words in the notes; no invented biography.
  No invented clients, results or benchmarks. Private footage, creators' clips, tokens, outreach and internal
  business state stay out.
- Voice: first person, plain, candid, with opinions and asides, as in Anthropic's engineering posts. Follow the
  humanizer rules: no em or en dashes, no "not X but Y", no one-line closers that restate the paragraph, no forced
  triads, no bold labels, headings in sentence case that state the point ("The shadow is never where you want
  it"), no "delve/crucial/robust/showcase" filler.
- Every article ends with a `## Links` section: the product site or demo, the repository when public, the App
  Store page, the documents the article rests on, and related articles as relative `slug.md` links. Keep it to
  what a reader would open, with a few words on each.
- Readability: paragraphs of at most about 70 words and sentences of at most about 40, measured with a script, not
  guessed. Screenshots and an occasional blockquote or small table give the eye something to hold; a "What I
  learned" section with two or three plain heuristics closes the story.
- Images: covers are 16:9 (the site also crops them to 3:2 on phones), with no typography. Without an image
  generator, compose the cover from the product's own rights-cleared media. Only a real output may be shown as a
  result. Screenshots of a live product are captured at 1440×1000 with the cookie notice dismissed. Check the
  rights register of the product (for DroneClean, `social/RIGHTS.md`) and record the use there.
- The MMORPG article has its own third-party-rights wording (unnamed game, nothing distributed, private test
  server) and is kept as written unless Matteo asks.

## History

- One commit per new article, titled `Publish the <project> article`, containing the article and its images.
  Later fixes are ordinary commits (`Fix the <project> article: …`): this repository's history is shared, so it
  is never rewritten.

## Before merging

- Preview with `bun run dev` and look at each page at 390px and 1440px: tables scroll, galleries show whole
  screenshots, diagrams render.
- Run a link check on every external URL in the article.
- After publishing or renaming, in the same change: `lib/seo/llms-content.ts` (the discovery test expects every
  published article there), `lib/ai/landing-context.ts` and the public profile in `app/api/chat/route.ts`. Then add
  or update the article's line in the `Writing` list of the `matteodante/matteodante` README and the link text in
  the project's README, and re-scrape the URL in LinkedIn's Post Inspector when the title, description or cover
  changed.
- Check the live page with an HTTP client after the deploy, not with a browser tab.
