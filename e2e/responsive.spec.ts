import { expect, test } from "@playwright/test";

/**
 * Assignment 4B "responsive floor": at every width from 320 to 1920 the
 * page must not overflow horizontally. We resize one loaded page through
 * every width (step configurable via RESPONSIVE_STEP, default 1px) and
 * collect the widths where the document is wider than the viewport,
 * together with the elements sticking out, so failures are actionable.
 */
const MIN_WIDTH = 320;
const MAX_WIDTH = 1920;
const HEIGHT = 900;
const STEP = Number(process.env.RESPONSIVE_STEP ?? 1);

type Overflow = { width: number; scrollWidth: number; culprits: string[] };

test("no horizontal overflow from 320px to 1920px", async ({ page }) => {
  test.setTimeout(600_000);
  await page.setViewportSize({ width: MIN_WIDTH, height: HEIGHT });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const failures: Overflow[] = [];

  for (let width = MIN_WIDTH; width <= MAX_WIDTH; width += STEP) {
    await page.setViewportSize({ width, height: HEIGHT });
    const result = await page.evaluate((viewport) => {
      const root = document.documentElement;
      if (root.scrollWidth <= viewport) return null;
      // Elements sticking out of the viewport that are NOT clipped by an
      // ancestor (overflow hidden/clip), i.e. the ones that cause scrolling.
      const clipped = (el: Element) => {
        for (
          let p = el.parentElement;
          p && p !== document.body;
          p = p.parentElement
        ) {
          const { overflowX } = getComputedStyle(p);
          if (overflowX === "hidden" || overflowX === "clip") {
            const r = p.getBoundingClientRect();
            if (r.right <= viewport + 0.5 && r.left >= -0.5) return true;
          }
        }
        return false;
      };
      const culprits: string[] = [];
      for (const el of document.body.querySelectorAll<HTMLElement>("*")) {
        const rect = el.getBoundingClientRect();
        if ((rect.right > viewport + 0.5 || rect.left < -0.5) && !clipped(el)) {
          const id = el.id ? `#${el.id}` : "";
          const cls = el.classList.length
            ? `.${[...el.classList].slice(0, 4).join(".")}`
            : "";
          culprits.push(
            `${el.tagName.toLowerCase()}${id}${cls} right=${Math.round(rect.right)}`,
          );
          if (culprits.length >= 6) break;
        }
      }
      return { scrollWidth: root.scrollWidth, culprits };
    }, width);
    if (result) failures.push({ width, ...result });
  }

  expect(failures, JSON.stringify(failures.slice(0, 10), null, 2)).toEqual([]);
});
