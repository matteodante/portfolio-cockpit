# Search metadata and public discovery

Updated 2026-09-09. The commercial pages, public portfolio evidence and
approved portrait are the source of truth for this revision.

## Implemented

- `lib/seo/page-metadata.ts` gives each page its own title, description,
  canonical, reciprocal EN/IT and x-default links, OG locale/alternate locale
  and matching OG/Twitter image. Homepage metadata is explicit, including
  images, so Next's file defaults cannot replace the approved portrait.
- The locale layout owns only shared defaults, public Person/WebSite data
  and discovery links. It no longer declares the CV as an alternative
  representation of every service page. Only the cockpit links its localized
  public Markdown CV; all pages link `/llms.txt` with `rel="describedby"`.
- Person data describes public identity and services. Removed detailed
  employer scope, education and occupation claims from the shared graph.
  The homepage is a commercial `WebPage`; the cockpit is a separate page
  about the same Person. WebSite declares both supported languages.
- Service and case graphs use Schema.org types, stable connected IDs and
  BCP-47 language tags. Website pricing uses `minPrice: 300` with EUR,
  representing the visible starting price. Apps and AI retain quotes on
  request without invented prices. The PiùUDITO creative-work node identifies
  one company and its three website examples. No ratings or outcome claims
  are introduced.
- `/llms.txt` is a concise public Markdown guide to services, pricing,
  client work, personal products, public roles and real contact destinations.
  Commercial links come from the same route definitions as the pages. It
  reads no private content, cookies or decrypted CV documents.
- Robots keeps the shared public allow rule, including API paths so crawlers
  can read their exclusion headers. Rendering assets and llms.txt remain
  crawlable. Authentication still protects private content. API responses carry
  `X-Robots-Tag: noindex, nofollow`; standalone JSON/provenance records carry
  `noindex`, without blocking portrait or social image indexing.
- Sitemap lists twelve canonical EN/IT HTML pages, their corresponding
  social images, reciprocal language alternatives and two public CV
  Markdown files. Stable content-revision dates are maintained in the sitemap;
  no build-time freshness dates or guessed schedules. See
  [the Search Console verification](search-console.md) for current evidence.

## Sources and limits

Structured data must reflect the page's real content; adding markup alone
does not establish eligibility or appearance in search.
[Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
The website offer uses Schema.org's minimum-price property, rather than
presenting EUR 300 as a fixed all-inclusive fee.
[Schema.org minPrice](https://schema.org/minPrice).

The public allow rule includes OAI-SearchBot. Search crawling and model
training are different uses; no training-policy change is made here.
[OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).
llms.txt and its discovery link follow the public proposal; it is not a
Google ranking mechanism.
[llms.txt proposal](https://llmstxt.org/),
[Google AI-search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

Google ignores sitemap priority/changefreq and expects lastmod, when
provided, to reflect a verifiable content change.
[Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
Page-level fields avoid Next metadata inheritance replacing an entire
nested Open Graph object with incomplete data.
[Next metadata documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

## Verification

`lib/seo/discovery.test.ts` checks canonical/social/language agreement,
connected entity references, public-profile boundaries, truthful service
pricing, sitemap coverage and llms.txt structure. Existing tests cover
localized routes and private-access logic. Production HTTP verification
checks the actual served HTML, JSON-LD, images, sitemap, robots, public
llms.txt, gated API status/headers and invalid routes.

Completed locally: `bun run check` passes 36 tests and 502 assertions;
`bun run build` passes. HTTP checks pass on all twelve pages, fourteen
sitemap targets, twelve sitemap images, current metadata and public llms.txt.
Three gated endpoints return 401 plus noindex; an invalid service returns
404 plus noindex. The portrait stays indexable while its JSON provenance
does not. All twelve social PNGs match the previously reviewed renders;
four legacy image endpoints and both manifest icons also pass. Evidence is
in `.impeccable/tmp/seo-metadata/`. React Doctor retains the existing single
marketing-page complexity warning (63/100); no new issue was reported.

No ranking, indexing, lead or conversion improvement is measured here.
Search Console/GA activation remains separate in `measurement-plan.md`.
Current browser layout and hero-interaction checks remain pending while
the owner's Mac is locked; static assets/social cards have their own
completed scoped review in `../design/portrait-provenance.md`.
