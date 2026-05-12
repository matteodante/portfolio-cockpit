# Contributing

Thanks for opening the file. Here's what you need.

## Setup

```bash
nvm use                      # Node 22
bun install
cp .env.example .env.local   # set OPENAI_API_KEY (any non-empty
                             # value is fine for non-chat changes)
bun run dev
```

## Before you push

```bash
bun run check
```

Runs Biome, `tsgo` (fast TS check), and `bun test`. CI runs the same
command. If it passes locally it passes in CI.

If Biome flags style:

```bash
bun run lint:fix
```

## Code style

Enforced by Biome — read `biome.json` for the full list.

- Imports: `@/*` alias only. No `../`.
- `next/link` instead of `<a>`. `next/image` instead of `<img>`.
- No `forwardRef` — React 19 + React Compiler accept `ref` as a prop.
- TypeScript strict: `exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `verbatimModuleSyntax`,
  `noUnusedLocals/Parameters`. `noExplicitAny` is `error`.
- No nested ternaries. Extract to an IIFE or a helper.
- Format: single quotes, no semicolons, trailing commas `es5`,
  2-space indent, 80 cols, LF.
- Tailwind class sorting is automated. Don't hand-sort.
- Filenames: kebab-case or camelCase.

## Comments

Default: none. Names should carry the meaning.

Comment when the WHY is not obvious — a hidden constraint, a subtle
invariant, a workaround. Skip comments that restate the code, the
caller, or the PR. JSDoc is welcome on exported public APIs.

## Tests

`bun test` runs everything. No Jest, no Vitest. Translation parity is
enforced by tests in `lib/i18n/translations.test.ts` — if you add a
key, add it to both languages.

Heavy WebGL code is not unit-tested. Visual regression is manual.

## PRs

- Branch from `main`. One topic per PR.
- Keep diffs focused. Refactors and feature work in separate PRs.
- Describe the WHY, not the WHAT. The diff already shows the what.
- For UI / scene changes, include a short clip or screenshot.

## What to send

Welcome:

- Bug fixes
- Performance improvements
- Accessibility fixes (the cockpit has some — see `aria-*` in
  `dock-overlay.tsx`, focus trap, ESC handling)
- Translation fixes / improvements

Open an issue first for:

- New scene features
- Architectural changes (state management, rendering pipeline)
- Replacing core dependencies

Out of scope:

- Converting the scene to React Three Fiber. The imperative loop is
  intentional — see `ARCHITECTURE.md`.
- Changing the model identifier `gpt-5.4-nano`. It's real.

## Things that look weird, are intentional

See the "Things that look weird, is intentional" section in
`CLAUDE.md` before "fixing" something that seems off — chances are
it's load-bearing.

## License

By contributing, you agree your contribution is licensed under the
[MIT License](./LICENSE).
