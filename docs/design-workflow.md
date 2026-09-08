# Design workflow

Impeccable is installed globally through `npx skills`, at
`~/.agents/skills/impeccable`. Keep tooling global and project knowledge
in this repo. Verified on 2026-09-08: skill 4.2.2, engine 0.1.3.

## Tooling

If Impeccable is already installed, update only that skill:

```bash
bun run design:update
# equivalent: npx skills update impeccable --global --yes
```

First-time installation on another machine:

```bash
npx skills add pbakaus/impeccable --skill impeccable --global --agent codex --yes
```

The skill ships a launcher that resolves its engine and downloads it
on first use if needed. The `design:*` commands expect the standard
global Skills path on macOS/Linux. They do not install dependencies
in the application or modify agent hooks. New agent sessions discover
the updated global skill.

```bash
bun run design:context   # once at the start of a landing design session
bun run design:doctor    # context/config schema health
bun run design:check     # static landing design findings
```

For another target, call the same global launcher explicitly:

```bash
"$HOME/.agents/skills/impeccable/scripts/impeccable" context \
  --target 'app/[lang]/cockpit/page.tsx'
"$HOME/.agents/skills/impeccable/scripts/impeccable" detect \
  components/cockpit/chrome components/cockpit/dock
```

`design:doctor` checks artifact compatibility, not whether prose still
matches the UI. `design:check` reports code patterns; a finding requires
inspection. Exit 0 means no primary findings, 1 means a scan failure,
and 2 means primary findings were found. Do not silence existing
findings or add a failing design gate to CI just to complete setup.

## Where decisions live

| File | Owns |
| --- | --- |
| `AGENTS.md` | Shared development instructions; `CLAUDE.md` imports it |
| `PRODUCT.md` | Confirmed audience, positioning, identity and evidence |
| `DESIGN.md` + `.impeccable/design.json` | Implemented visual system |
| `.impeccable/surfaces/*.md` | Route-specific goal, mode and constraints |
| `.impeccable/config.json` | Shared Impeccable settings |
| `docs/redesign-roadmap.md` | Starting findings, priorities and proposed measurement |

Keep personal settings in ignored `.impeccable/config.local.json`.
Review captures and temporary Live state are also ignored. There is
no saved `buildPath` preference yet; only record `comp` or `code` after
the user chooses it. Setup itself does not select a new visual world.

## Working sequence

1. Read the target context and inspect the running page and source.
   Verify the app behind a local port before testing it; port 3000 may
   belong to another repo. Start this app on a free port if needed:
   `bun run dev --port 3001`.
2. Use `/impeccable shape app/[lang]/page.tsx` for a design brief, or
   `/impeccable critique app/[lang]/page.tsx` for a UX critique. A full
   redesign follows Impeccable's new-work flow. Preserve confirmed
   product facts; choose composition before implementing effects.
3. For conversion work, use the CRO skill alongside Impeccable:
   offer clarity, real proof, contact hierarchy, friction. Define the
   visitor's action before styling its button.
4. Implement the chosen scope in EN/IT. Keep composition styles in `components/landing/landing.css` and
   `components/cockpit/cockpit.css`. Shared fonts, colors, language navigation
   and control styling form one identity; `lib/styles/css/brand.css` and
   `components/shared/` own the shared primitives. Edit `lib/styles/config.ts` and
   its sources, never generated `root.css` or `tailwind.css`.
5. Verify desktop/mobile together, batch fixes, confirm once. Use
   `/impeccable audit` for technical checks or `/impeccable polish` for
   the final craft pass. Update the brief and document the implemented
   design, including its sidecar, if the visual system changes.

Live editing is optional: invoke `/impeccable live` when using the
browser picker. Its setup resolves the actual layout and any CSP
requirements then; no picker is injected by these repo commands.

## Done for a visual change

- Offer and next action are understandable in the first viewport;
  contact does not depend on playing or finishing a scroll sequence.
- Proof links work; claims have a source; no invented metrics or logos.
- Inspect 390px mobile and 1440px desktop, EN and IT, keyboard focus,
  reduced motion, media failure, and a usable no-JS landing fallback.
  Check 320px width and 200% zoom for overflow and lost controls.
- Content and focus order stay logical; text is readable over the
  actual media frames; touch targets are comfortably usable.
- Media gets a useful poster, appropriate loading and an explicit
  transfer budget based on the baseline. Measure the production build;
  do not present a dev-server score as field performance.
- Run `bun run design:check`, `bun run check`, and `bun run build`.
  Capture any outstanding findings with scope and evidence.
- State what shipped, what was checked, and what still needs evidence.
  A redesigned page is not evidence of increased conversion.

Sources: [Impeccable](https://github.com/pbakaus/impeccable),
[Skills CLI](https://github.com/vercel-labs/skills).
