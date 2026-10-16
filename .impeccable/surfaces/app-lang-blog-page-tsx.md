# Articles (blog)

Mode: Read. Code-led extension of the existing portfolio world, requested by
the owner on 2026-10-16: an articles index reachable from the homepage, each
article with title, subtitle and cover image, and a reading page that renders
Markdown written in the public `matteodante/matteodante` repository
(`articles/*.md`, YAML frontmatter). The blog and its articles are in English
only (owner's decision): `/en/blog` and `/en/blog/<slug>`; the `/it` paths
redirect there, and both homepages link to it as "Blog".

Audience: the same visitors as the homepage, plus engineers arriving from the
article links on GitHub. Primary job: read the article comfortably; secondary:
reach Matteo (the booking CTA closes each article).

## Direction contract

THESIS: A long technical article should be a pleasure to read in the site's own space.
OWN-WORLD: Deep space ground, warm ivory, Unbounded titles, Space Grotesk prose,
thin frames, two-pixel corners, orange only for actions, link underlines and list markers.
STORY: See what has been written, open one, read it, contact Matteo.
FIRST VIEWPORT: Index: a large "Articles" title with a short lead, then each
article as a framed 3:2 cover with date, reading time, title and subtitle
bottom-aligned beside it (stacked on phones). Article: back link, a large
Unbounded title, subtitle and meta on the reading column, then a wide 16:9 cover.
FORM: A ~68-character reading column (19px/1.75) on a subgrid; diagrams and the
cover take a wider column. Mermaid diagrams are drawn in the browser in the site
palette; tables and diagrams scroll inside their frames on phones.
ONE MOMENT: the cover drifts a few percent inside its frame as the page scrolls
(CSS scroll-driven animation, off with reduced motion). Nothing else moves on its own.
