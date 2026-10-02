# Apsu Home Page

Front-end take-home assignment: a responsive home page and React component library based on the supplied Figma design.

**Current status:** the project scaffold is in place (Next.js, Tailwind, Storybook, Biome, Vitest, Playwright) and all four evaluator commands run. The home page sections, components and data layer are not implemented yet; the page is a placeholder.

## Assignment and design

- Required stack: Next.js App Router, React, strict TypeScript, and Tailwind CSS.
- Fidelity targets: 375px and 1440px. Layout integrity is required at every width from 320px to 1920px.
- Dynamic content must have typed future API contracts and conforming mock data.
- Interactive elements need hover, focus, pressed states, and transitions. Stateful components need one Storybook story per state.
- Preserve the full commit history and complete, unedited AI session records under `ai-logs/`.
- [Figma reference](https://www.figma.com/design/DmTQCqCODfpqMmdsZUFCnj/Front-end-Assignment?node-id=0-1)

The source assignment is `Front-End Take-Home Assignment (1).pdf`, page 1, supplied separately in the local workspace. Its requirements are summarized in [requirements](doc/requirements.md).

## Running the project

Requirements: **Node.js 24 LTS** (see `.nvmrc`; `engines` allows `>=22.12`, the Vitest 5 minimum) and npm 11. `package-lock.json` is committed.

```sh
npm install
npm run build          # production build
npm run dev            # http://localhost:3000
npm run storybook      # http://localhost:6006
```

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run start` | Serve the production build |
| `npm run lint` / `npm run format` | Biome check / format |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm test` | Vitest unit and component tests (jsdom) |
| `npm run test:e2e` | Playwright: builds the app and checks for horizontal overflow at every width from 320 to 1920 px. Run `npx playwright install chromium` once first; browsers are not downloaded by `npm install` |
| `npm run build-storybook` | Static Storybook build |

`npm install` prints an npm 11 `allow-scripts` warning for `esbuild`'s postinstall. It is harmless: the esbuild binary is delivered through optional dependencies, and builds pass without the script.

## Repository structure

| Path | Purpose |
| --- | --- |
| `doc/requirements.md` | Assignment requirements, acceptance criteria, and scope boundaries |
| `doc/checklist.md` | Working checklist: hard requirements, scored items, bonus, implicit requirements, and easily missed items |
| `doc/assets-checklist.md` | Design asset inventory: what has been exported, what is missing, and where raw files are staged |
| `doc/design.md` | Design inventory, evidence, unresolved questions, and Hero audit |
| `doc/architecture.md` | Proposed code structure, content contracts, and component boundaries |
| `doc/decisions.md` | Significant choices, reasons, alternatives, and optional model handoff workflow |
| `doc/tasks-handoff.md` | Current progress, next task, validation evidence, and handoff |
| `ai-logs/` | Original AI session records and an index explaining their scope |

| `src/app/` | Next.js App Router routes (currently a placeholder home page) |
| `src/lib/` | Framework-agnostic helpers (`cn` class merging so far) |
| `src/test/` | Vitest setup |
| `e2e/` | Playwright checks (responsive floor 320–1920 px) |
| `.storybook/` | Storybook configuration (`@storybook/nextjs-vite`) |

The full structure (component library in `components/ui`, feature sections in `features/`, a central data contract, `lib/`) is described in `doc/architecture.md`. This table will be updated as those folders are created.

## Design deviations

No design fix has been implemented yet. Design details have not been verified directly through Figma; connector access failed during initialization. Candidate issues in working notes are not accepted deviations.

Record **every implemented design fix** here, rather than keeping the submission log only in internal documentation.

| ID | Section / source node | Original issue | Implemented change | Why | Verification |
| --- | --- | --- | --- | --- | --- |

## Self-designed interaction states

No interaction states have been implemented yet. Record every self-designed state and its rationale here; link the corresponding Storybook stories once available.

| Component | States / transition | Why | Story / verification |
| --- | --- | --- | --- |

## AI use and session records

| Tool | Contribution | Original session record |
| --- | --- | --- |
| Codex | Initial requirement analysis, documentation and local Git setup; later collected 9 raw image assets from Figma | Pending export; see [AI log index](ai-logs/README.md) |
| Claude Code | Requirement review, Figma audit (`doc/design.md`), asset and icon sourcing (`doc/assets-checklist.md`), architecture options (`doc/architecture.md`), project scaffold and tooling configuration | Pending export of session `49a5b82d…`; see [AI log index](ai-logs/README.md) |

Update this table as work continues. Working documents and handoff summaries do not replace original transcripts.

## Validation and known limitations

- PDF requirement extraction and Figma design audit: done (see `doc/design.md`).
- Scaffold: `npm install`, `build`, `dev`, `storybook`, `lint`, `typecheck`, `test` and `test:e2e` verified from a clean install on Node 24.19.0 / npm 11.17.0. The page is still a placeholder, so these checks don't cover the real page yet.
- AI transcript export: pending.

See [current handoff](doc/tasks-handoff.md) for the next concrete task.
