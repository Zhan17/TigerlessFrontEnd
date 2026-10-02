# Apsu Home Page

Front-end take-home assignment: a responsive home page and React component library based on the supplied Figma design.

**Current status:** foundations (tokens, icons, component library, data layer) are done; the page currently renders the navigation, hero, trust strip, How it works and the program sections (birth control / sleep details and BMI still to come). The remaining sections are in progress (see `doc/tasks-handoff.md`).

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
| — | Content source: copy `.env.example` to `.env.local`; `DATA_SOURCE=mock` (default) or `api` with `API_BASE_URL` |
| `npm run icons` | Regenerate icon components from `src/components/icons/svg` (SVGR) |

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

| `src/app/` | App Router route: `page.tsx` fetches the data once and passes mapped props to each section; `globals.css` design tokens; shared font |
| `src/components/ui/` | Component library: one folder per component with its stories and tests (Button, IconButton/IconLink, Pill, Eyebrow, CheckList, Price, Rating, SocialLinks) |
| `src/components/icons/` | `svg/` normalised sources (origins in `SOURCES.md`) and `generated/` typed components from `npm run icons` |
| `src/features/` | Page sections, one folder per feature (`navigation`, `hero`, …): section components, the mapper from API types to component props (`to-*-props.ts`), stories and tests. `shared/` holds content-to-UI helpers (CtaButton, RichText, link and icon mapping) |
| `src/content/` | Data layer: `schemas/` (Zod API contract, the future backend shape — start here), `mock/` (responses conforming to it), `api/` (data access with `DATA_SOURCE=mock\|api`) |
| `src/lib/` | Framework-agnostic helpers: `cn` (class merging aware of design tokens), `format/money`, `ui-copy` (fixed interface phrases) |
| `src/styles/` | Storybook foundations (tokens reference) |
| `scripts/` | Build helpers (SVGR index template) |
| `src/test/` | Vitest setup |
| `e2e/` | Playwright: responsive floor (320–1920 px, every width), nav never wraps, marquee / menu / sticky-nav behaviour |
| `.storybook/` | Storybook configuration (`@storybook/nextjs-vite`) |

The full structure (component library in `components/ui`, feature sections in `features/`, a central data contract, `lib/`) is described in `doc/architecture.md`. This table will be updated as those folders are created.

## Design deviations

Every change made to the supplied design, and why. Rows are added as each section is implemented (IDs refer to `doc/design.md` §4b). Copy fixes live in the mock content (`src/content/mock`), marked with the same ID.

| ID | Section | Original | Change | Why |
| --- | --- | --- | --- | --- |
| F06 | Hero, language pills | "Русскийالعربية" in one pill (two languages, two writing directions) | Two pills, "Русский" and "العربية"; Arabic gets `lang="ar"` and `dir="rtl"` | One language per pill; correct rendering and screen-reader pronunciation of RTL text |
| — | Hero, language pills | Labels carried trailing spaces ("Español ") | Clean labels from the languages resource | Spaces offset the text from the pill centre |
| — | Hero, category cards | First card used a different shadow from the other two | Same card shadow on all three | Inconsistent elevation for identical components |
| — | Mobile menu | Close icon drawn in a navy blue outside the palette | Brand dark green, same as the menu icon | Keeps the two toggle icons consistent |
| F01 | Trust strip | "Cash-pay, No Issuance Needed" | "Cash-pay, No Insurance Needed" | Typo; the page elsewhere says "no insurance needed" / "No Insurance Required" |
| F12 | How it works | Card 02's title sat ~17px lower than card 01's (content bottom-aligned, different list lengths) | Card content is top-aligned; both titles share a line | Visual alignment of two identical cards |
| F03 | Weight loss | "Loss Weight In Your Way." | "Lose Weight In Your Way." (design casing kept) | Grammar |
| F09 | Weight loss (mobile) | The weight-loss section, product cards and BMI were placed outside the mobile board | Rendered in the mobile page in the same order as desktop | Content missing from the mobile layout |

### Noted, not changed

| Section | Observation | Why it was left |
| --- | --- | --- |
| Hero, category cards | All three cards show the same Tirzepatide "Weight Loss Program" vial, including Birth Control and Sleep | Treated as a placeholder image (product decision Q4); swapping images is content, not UI |
| Hero, badges | `#21ac88` 14px text on white is about 2.9:1, below WCAG AA | Kept for fidelity in this version; to be addressed in a later colour pass (C10) |
| Hero, category cards | Eyebrow "Weight management" vs "Weight Loss" elsewhere | Naming / copy question, low UI impact (Q7) |
| How it works | List items end with full stops; other sections' lists do not | Copy style, low UI impact (Q7) |
| Weight loss (mobile) | The "WEIGHT LOSS" eyebrow is shown on desktop only, as in the boards | Followed the design |

## Self-designed interaction states

The design has no hover / focus / pressed states. All interaction states are CSS (so Storybook's pseudo-states addon can show each one); Motion is used only for the menu reveal. Shared rules: hover applies only on devices that can hover (touch gets press feedback), one green focus ring everywhere (`:focus-visible`, 2px, offset 2px), and `prefers-reduced-motion` disables movement.

| Component | States / transition | Why | Stories |
| --- | --- | --- | --- |
| Button (primary / secondary / outline) | Hover: scale 1.03, one tone darker (primary), soft shadow, arrow nudges 2px right. Pressed: scale 0.97. Disabled: 40% opacity, no hover (only "Calculate BMI") | A subtle "bubble" that is consistent across all pill buttons | `UI/Button/*` |
| IconButton / IconLink (carousel, social, menu) | Hover: scale 1.08 + fill (light green on outline, lighter tone on solid). Pressed: scale 0.94. Disabled: 40% (carousel ends only) | Same bubble language for every circular control | `UI/IconButton/*` |
| Pill (language) | Hover: scale 1.05 + tint. Pressed: 0.96. Selected: design's light-green fill (toggle, multi-select) | Pills are toggles (decision C1) | `UI/Pill/*` |
| Nav link | Hover: text lifts 2px and turns green. Pressed: settles with a small shrink. Current section: green + underline (scroll-spy) | "Floating" text feedback requested; current-section highlight helps orientation | `Sections/Navigation/Link*` |
| Sticky nav | Stays 12px from the top; shadow strengthens once the page scrolls | Keeps navigation reachable on a long page | e2e `navigation.spec.ts` |
| Mobile menu | Circular reveal from the menu button (top-right) with items sliding down; reverse on close; opacity only under reduced motion. Focus trap, Esc, scroll lock, focus return (Radix Dialog) | Requested reveal direction; accessible dialog behaviour | `Sections/Navigation/MobileMenuOpen` |
| Hero language marquee | Rows drift in opposite directions; hover middle pauses, hover a faded edge speeds towards it; touch drag scrubs with inertia; focus pauses; static scrollable rows under reduced motion | Requested behaviour (C1); makes it easy to find a language | `Sections/Hero/Languages`, e2e `hero.spec.ts` |
| Hero category card | Whole card clickable; hover lifts 4px with a softer shadow and the product image grows 4%; pressed shrinks to 0.98 | Requested bubble feedback on the whole card | `Sections/Hero/Card*` |
| Trust strip | Continuous leftward scroll (CSS); pauses while hovered; static, wrapping list under reduced motion | Requested auto-scroll (C2); pausing gives users control over moving content (WCAG 2.2.2) | `Sections/TrustStrip/*` |
| Full-width buttons (mobile) | A label too long for the width wraps to two lines (min-height keeps single-line buttons unchanged) | Graceful behaviour at 320px instead of overflowing | `UI/Button/ResponsiveMobile` |

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
