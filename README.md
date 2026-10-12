# Apsu Home Page

A responsive marketing home page for Apsu, an online care service, built as a
typed React component library with Next.js.

## Features

- **Full page**: sticky navigation with scroll-spy and a mobile menu, hero with
  category cards and a language marquee, auto-scrolling trust strip, How it
  works, three program sections with product cards, a BMI calculator, a
  services carousel, success stories, FAQ accordion, closing CTA and footer.
- **Responsive** from 320px to 1920px, matched to the 375px and 1440px designs.
- **BMI calculator**: imperial / metric switch that keeps the exact
  measurement, input validation, animated gauge and scale.
- **Interaction states** on every control: hover, focus-visible, pressed and
  disabled, with smooth transitions. Movement is turned off under
  `prefers-reduced-motion`.
- **Accessible**: keyboard support throughout, focus management in the mobile
  menu, and an automated axe scan in the end-to-end tests.
- **Typed content layer**: Zod schemas describe the content API; the page runs
  on bundled mock data or a real API (`DATA_SOURCE=mock|api`).
- **Storybook** with a story for each component state.

## Tech stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS · Motion ·
Radix UI · Zod · Storybook · Vitest · Testing Library · Playwright · Biome

## Getting started

Requires Node.js 24 (see `.nvmrc`; `>=22.12` works).

```sh
npm install
npm run dev            # http://localhost:3000
npm run storybook      # http://localhost:6006
```

| Script | Purpose |
| --- | --- |
| `npm run build` / `npm run start` | Production build / serve it |
| `npm run lint` / `npm run format` | Biome check / format |
| `npm run typecheck` | Strict TypeScript check |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | Playwright: responsive, behaviour and accessibility tests (run `npx playwright install chromium` once first) |
| `npm run build-storybook` | Static Storybook build |
| `npm run icons` | Regenerate icon components from `src/components/icons/svg` |

To use a real content API, copy `.env.example` to `.env.local` and set
`DATA_SOURCE=api` and `API_BASE_URL`.

## Project structure

| Path | Contents |
| --- | --- |
| `src/app/` | Route, global styles and design tokens |
| `src/components/ui/` | Reusable components (Button, IconButton, Pill, NumberField, SegmentedControl, …) with stories and tests |
| `src/components/icons/` | SVG sources and generated icon components |
| `src/features/` | Page sections, one folder each |
| `src/content/` | Zod schemas, mock data and the data-access layer |
| `src/lib/` | Small shared helpers |
| `e2e/` | Playwright tests |
