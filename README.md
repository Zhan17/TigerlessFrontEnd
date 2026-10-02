# Apsu Home Page

Front-end take-home assignment: a responsive home page and React component library based on the supplied Figma design.

**Status:** the whole page is implemented (navigation, hero, trust strip, How it works, the three program sections with products and the BMI calculator, services carousel, success stories, FAQ, closing CTA, footer) on top of a typed data contract, a component library and Storybook. Progress and evidence: [`doc/tasks-handoff.md`](doc/tasks-handoff.md).

**Reading guide:** start with the data contract in [`src/content/schemas`](src/content/schemas) (Zod schemas = the future API; types are inferred from them), then a feature folder such as [`src/features/online-care`](src/features/online-care) (mapper from API types to props → section component → stories → tests), then [`src/components/ui`](src/components/ui) for the shared building blocks.

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
| `npm run typecheck` | `next typegen` (route types such as `LayoutProps`) then `tsc --noEmit` (strict); works on a fresh clone without a prior build |
| `npm test` | Vitest unit and component tests (jsdom) |
| `npm run test:e2e` | Playwright against a production build: no horizontal overflow at every width from 320 to 1920 px, nav never wraps, marquee / menu / BMI / carousel / FAQ / footer behaviour, an axe accessibility scan and a keyboard walk. Run `npx playwright install chromium` once first; browsers are not downloaded by `npm install` |
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
| `src/components/ui/` | Component library: one folder per component with its stories and tests (Button / ButtonLink, IconButton / IconLink, Pill, Eyebrow, CheckList, Price, Rating, SocialLinks, SegmentedControl, NumberField, RadioPill) |
| `src/components/icons/` | `svg/` normalised sources (origins in `SOURCES.md`) and `generated/` typed components from `npm run icons` |
| `src/features/` | Page sections, one folder per feature (`navigation`, `hero`, `trust-strip`, `how-it-works`, `programs`, `bmi`, `online-care`, `stories`, `faq`, `footer`): section components, the mapper from API types to component props (`to-*-props.ts`), stories and tests. `shared/` holds content-to-UI helpers (CtaButton, TextAction, RichText, link / icon / nav-item mapping) |
| `src/content/` | Data layer: `schemas/` (Zod API contract, the future backend shape — start here), `mock/` (responses conforming to it), `api/` (data access with `DATA_SOURCE=mock\|api`) |
| `src/lib/` | Framework-agnostic helpers: `cn` (class merging aware of design tokens), `format/money`, `ui-copy` (fixed interface phrases) |
| `src/styles/` | Storybook foundations (tokens reference) |
| `scripts/` | Build helpers (SVGR index template) |
| `src/test/` | Vitest setup |
| `e2e/` | Playwright: responsive floor (320–1920 px, every width), nav never wraps, marquee / menu / sticky-nav behaviour, BMI calculator, services carousel, FAQ and footer |
| `.storybook/` | Storybook configuration (`@storybook/nextjs-vite`) |

The reasoning behind this structure (options considered and decisions) is in `doc/architecture.md` and `doc/decisions.md`.

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
| F08 | BMI | Inputs show 0 while the score shows 56; legend reads "Healthy Weight <18.5 - 24.9", "Overweight <25.0 - 29.9"; unit label "cm/kgs" | Real calculation with an empty initial state ("—"); legend generated from the thresholds (18.5–24.9, 25–29.9); "cm / kg" | Contradictory default state; wrong ranges; unit spelling |
| F09 | BMI (mobile) | Mobile board has no unit switch | Same ft/lbs ↔ cm/kg switch as desktop | Feature parity: metric users on mobile |
| — | BMI | Calculate looks enabled with empty inputs | Disabled (40% opacity) until the input is valid; out-of-range values show a message | Prevents calculating with no / impossible data (product decision) |
| — | BMI | No result sentence | "As a woman, your BMI is 24.2 — Healthy Weight." under the gauge (announced politely to screen readers) | Shows the category in words and reflects the sex selection (C6, see below) |
| — | Birth control (mobile) | The mobile board drops the intro paragraph ("Choose the method that fits your life…") | Shown on mobile too | Same content on every device; nothing about the method choice is lost on phones |
| — | Sleep, highlight cards | The "Your profile" bar is drawn full width while the label says 82% | The gradient fills 82% of the track; the rest is neutral | The bar should agree with its number (data-driven `percent`) |
| — | Program sections (1024–1440) | Boards exist only at 375 and 1440; at 1024 the photos would cover the price and copy | Each photo's width is capped at its 1440 share of the card, so it shrinks in place; the Sleep stat cards shrink and wrap at 320 | Graceful in-between widths (no overlap, no overflow) |
| F05 | Services carousel | "Easy Manager Treatment" | "Easy Treatment Management" | Grammar |
| — | Services carousel | White titles sit directly on bright photos (e.g. the sky behind "Free Expedited Shipping") | A light dark-to-transparent scrim behind the top of photo cards | Title contrast |
| — | Services carousel | Both arrows look identical at the start | "Previous" disabled at the start, "Next" at the end (40% opacity) | Shows where the row ends (agreed disabled states) |
| F07 | Success stories | "David L" | "David L." | Matches "Maria R." and "An N." |
| F10 | FAQ | Only the first question has an answer | Answers drafted for the other three from facts elsewhere on the page (lengths vary to exercise the accordion), each marked "(Test answer.)" | An FAQ needs answers; the marked ones are placeholders until the client supplies real copy |
| — | FAQ | No states designed for the rows | First question open by default, several may be open at once (see states below) | Every answer is treated as important here, so people can keep several open and move between them. The alternative, opening one question closes the others, is just as valid (shorter list, more focus); it was not rejected on quality but chosen per content and need, and is a one-line switch (Radix `type="single"`) |
| F11 | Closing CTA | "Start free consultations" | "Start a free consultation" (the shared CTA label, same as the hero) | One wording for the same action |
| — | Closing CTA (640–1023) | Only the 375 / 1440 layouts exist | Tablets use the centred layout without the tall mobile height | Avoids a large empty gap in the card |
| F02 | Footer | "Comapny" | "Company" | Typo |
| F13 | Footer | The divider ends at 1352px while the copyright and the last link column run to 1408px | Divider, columns and copyright share the same right edge | Consistent edge alignment |

### Noted, not changed

| Section | Observation | Why it was left |
| --- | --- | --- |
| Hero, category cards | All three cards show the same Tirzepatide "Weight Loss Program" vial, including Birth Control and Sleep | Treated as a placeholder image (product decision Q4); swapping images is content, not UI |
| Hero, badges | `#21ac88` 14px text on white is about 2.9:1, below WCAG AA | Kept for fidelity in this version; to be addressed in a later colour pass (C10) |
| Hero, category cards | Eyebrow "Weight management" vs "Weight Loss" elsewhere | Naming / copy question, low UI impact (Q7) |
| How it works | List items end with full stops; other sections' lists do not | Copy style, low UI impact (Q7) |
| Weight loss (mobile) | The "WEIGHT LOSS" eyebrow is shown on desktop only, as in the boards | Followed the design |
| BMI | The sex field does not change the number: adult BMI and its categories are the same for women and men. Kept because the UI design has it; the result sentence names the selection (C6). Alternative considered: a one-line note "Adult BMI ranges are the same for women and men", or removing the field | Follows the design; can be revisited with the product team |
| BMI (mobile) | Mobile shows no legend and no "See your GLP-1 Options" link, as on the mobile board | Followed the design |
| Services carousel, chat preview | The chat panel uses 7–9px text, as on the board | It illustrates the app at phone scale; drawn as real text (readable by screen readers, editable from data) and kept at the board's size for fidelity |
| Services carousel, phone | The phone mockup source is low resolution (the phone is ~265px wide in the exported image), so it is slightly soft at 305px | Same asset as the design; replace with a higher-resolution export when available |
| Success stories | The photo card is signed "David L." but shows a woman | Content question for the client; the card renders whatever the testimonials resource provides |
| FAQ (mobile) | The "FAQs" eyebrow is shown on desktop only, as in the boards | Followed the design |
| Hero, language marquee | **Open product question.** The pills really select (multi-select toggles, any pill on screen, keyboard on the originals), and the edge acceleration exists only to help reach a language to select; but the selection drives nothing yet (visual only, decision C1). Both features serve a real choice: if the marquee stays decorative, the selection and the edge acceleration could both be removed (simpler, less JS); if it should become functional, the selected-language state is ready to feed a site language switch, translation or the preferred consultation language. To ask: what is the marquee's actual value, and should it connect to language switching / translation? | Kept so the choice can be made later without rebuilding the component; the selection costs little and is accessible |
| How it works | The big "01" / "02" (`#c1e8de` on white) are low contrast | Decorative and hidden from screen readers (the ordered list announces the order), so exempt under WCAG 1.4.3; the axe test allows only this and the hero badges (C10) |
| Footer | Most footer links have no destination yet (About, Blogs, Contact, Terms…) | They render as buttons with press feedback only (decision C3); they become links once the content provides URLs |

## Self-designed interaction states

The design has no hover / focus / pressed states. All interaction states are CSS (so Storybook's pseudo-states addon can show each one); Motion is used only where physics or values must be animated (menu reveal, segmented-control squash, BMI gauge, carousel glide). Shared rules: hover applies only on devices that can hover (touch gets press feedback), one green focus ring everywhere (`:focus-visible`, 2px, offset 2px), and `prefers-reduced-motion` disables movement.

| Component | States / transition | Why | Stories |
| --- | --- | --- | --- |
| Button (primary / secondary / outline) | Hover: scale 1.03, one tone darker (primary), soft shadow, arrow nudges 2px right. Pressed: scale 0.97. Disabled: 40% opacity, no hover (only "Calculate BMI") | A subtle "bubble" that is consistent across all pill buttons | `UI/Button/*` |
| IconButton / IconLink (carousel, social, menu) | Hover: scale 1.08 + fill (light green on outline, lighter tone on solid). Pressed: scale 0.94. Disabled: 40% (carousel ends only) | Same bubble language for every circular control | `UI/IconButton/*` |
| Pill (language) | Hover: scale 1.05 + tint. Pressed: 0.96. Selected: design's light-green fill (toggle, multi-select) | Pills are toggles (decision C1) | `UI/Pill/*` |
| Nav link | Hover: text lifts 2px and turns green. Pressed: settles with a small shrink. Current section: green + underline (scroll-spy) | "Floating" text feedback requested; current-section highlight helps orientation | `Sections/Navigation/Link*` |
| Sticky nav | Stays 12px from the top; shadow strengthens once the page scrolls | Keeps navigation reachable on a long page | e2e `navigation.spec.ts` |
| Logo (header / footer) | On the home page it glides back to the top (and clears any `#section` from the URL) instead of reloading; elsewhere or with a modifier key it is a normal link; reduced motion jumps | A reload to reach the top of the same page felt abrupt | e2e `navigation.spec.ts` |
| Mobile menu | Circular reveal from the menu button (top-right) with items sliding down; reverse on close; opacity only under reduced motion. Focus trap, Esc, scroll lock, focus return (Radix Dialog) | Requested reveal direction; accessible dialog behaviour | `Sections/Navigation/MobileMenuOpen` |
| Hero language marquee | Rows drift in opposite directions; hover middle pauses, hover a faded edge speeds towards it; touch drag scrubs with inertia; focus pauses; static scrollable rows under reduced motion | Requested behaviour (C1); makes it easy to find a language | `Sections/Hero/Languages`, e2e `hero.spec.ts` |
| Hero category card | Whole card clickable; hover lifts 4px with a softer shadow and the product image grows 4%; pressed shrinks to 0.98 | Requested bubble feedback on the whole card | `Sections/Hero/Card*` |
| Trust strip | Continuous leftward scroll (CSS); pauses while hovered; static, wrapping list under reduced motion | Requested auto-scroll (C2); pausing gives users control over moving content (WCAG 2.2.2) | `Sections/TrustStrip/*` |
| SegmentedControl (BMI units) | Liquid switch like two drops meeting: a small droplet swells inside the new option on the side facing the pill; an SVG goo filter (blur + alpha threshold) draws a surface-tension bridge that starts as a thin neck and thickens until they merge; the pill then flows over (leading edge first, trailing edge a beat later) with a small vertical squash. Text is outside the filter and stays crisp; nothing leaves the track; reduced motion jumps; hover tints the inactive option; pressed shrinks; focus ring on the option. Native radios (arrow keys) | Requested liquid tab switch | `UI/Form controls/Segmented*` |
| NumberField (BMI inputs) | Hover darkens the border; focus ring; invalid = red border + message; up/down stepper halves highlight on hover/press | Clear feedback for typing and errors | `UI/Form controls/Number*` |
| RadioPill (BMI sex) | Hover tint + darker border; pressed shrink; focus ring; checked = filled icon + dark border | Consistent with the other pill controls | `UI/Form controls/Radio*` |
| BMI result | Arc fills and the score counts up (0.9s, fast-then-slow); the scale marker slides to the result; the active legend label turns dark | Makes the result feel computed; instant under reduced motion | `Sections/BMI calculator/Result*` |
| Full-width buttons (mobile) | A label too long for the width wraps to two lines (min-height keeps single-line buttons unchanged) | Graceful behaviour at 320px instead of overflowing | `UI/Button/ResponsiveMobile` |
| Services carousel | Arrows glide one card (0.7s, ease-out-expo); swipe / trackpad scroll natively with snap; the track itself takes keyboard focus (arrow keys scroll it); a swipe or wheel during a glide takes over; arrows disabled at the ends; reduced motion jumps instead of gliding | Requested smooth stepping without fighting native scrolling | `Sections/Services carousel/*`, e2e `services.spec.ts` |
| Success stories, social links | The IconLink bubble states on dark circles (quote cards) and white circles (photo card) | Same circular-control language as everywhere | `Sections/Success stories/*Social*` |
| FAQ rows | Closed hover tints the row and pops the chevron circle (1.08); pressed shrinks to 0.99; open = sage header with white text, dashed edge and raised shadow, hover a lighter sage; the answer slides open (300ms, ease-out-expo) and closed (200ms) and the chevron turns; keyboard: Tab / Enter / Space and arrow keys between questions | Clear open state and smooth reveal; no animation on page load | `Sections/FAQ/*`, e2e `faq-footer.spec.ts` |
| Footer links | Hover turns the text mint, pressed a deeper green; social circles use the IconLink states | Readable feedback on the dark background | `Sections/Footer/*` |

## AI use and session records

| Tool | Contribution | Original session record |
| --- | --- | --- |
| Codex | Initial requirement analysis, documentation and local Git setup; later collected 9 raw image assets from Figma | To be added to `ai-logs/` by the user; see [AI log index](ai-logs/README.md) |
| Claude Code (desktop app, Claude Opus) | Requirement review, Figma audit (`doc/design.md`), asset and icon sourcing (`doc/assets-checklist.md`), architecture options (`doc/architecture.md`); then, following the decisions recorded in `doc/`, the implementation: project scaffold and tooling, design tokens, icons, component library, data contract and mocks, every page section, Storybook stories, unit / e2e / accessibility tests, visual comparison against the boards, and the README logs. The user made the product and design decisions (`doc/design.md` §4b, `doc/decisions.md`) and reviewed each group before it was pushed | [`ai-logs/claude-code/`](ai-logs/claude-code/) (session `49a5b82d…`, unedited); see [AI log index](ai-logs/README.md) |

Working documents and handoff summaries do not replace original transcripts.

## Validation and known limitations

- PDF requirement extraction and Figma design audit: done (see `doc/design.md`).
- Fresh clone (2026-10-02, Node 24.19.0 / npm 11.17.0): `npm install`, `lint`, `typecheck`, `test` (120 unit / component tests), `build`, `build-storybook` and `test:e2e` (24 tests) pass; `dev` and `storybook` serve the page and the 156 stories.
- Page: navigation, hero, trust strip, how it works, the three program sections with products and the BMI calculator, the services carousel, the success stories, the FAQ, the closing CTA and the footer are implemented and compared with both boards (375 / 1440) plus 320, 768, 1024, 1280 and 1920. The page height at 1440 matches the desktop board (10155px).
- AI transcripts: the Claude Code session is in `ai-logs/claude-code/` (unedited copy); the Codex session is added by the user.
- Known limitations: no real backend (the `api` data source is tested only against a mocked fetch); hero badge contrast kept for fidelity (C10); the copyright year is computed at build time.

See [current handoff](doc/tasks-handoff.md) for the next concrete task.
