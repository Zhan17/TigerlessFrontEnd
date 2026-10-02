import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Whole-page accessibility checks: an axe scan (WCAG 2.x A / AA) on both
 * boards and a keyboard walk that tabs through the page.
 *
 * Known, logged contrast exceptions (README "Noted, not changed"):
 * - hero badges (`text-accent-soft`, #21ac88 on white, ~2.9:1), kept for
 *   fidelity until the colour pass (C10);
 * - the big "01" / "02" in How it works (`text-step-number`): decorative and
 *   aria-hidden (the ordered list announces the order), exempt under 1.4.3.
 */
const KNOWN_CONTRAST = /text-accent-soft|text-step-number/;

for (const width of [375, 1440]) {
  test(`axe finds no WCAG A/AA violations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const unexpected = violations.flatMap((violation) =>
      violation.nodes
        .filter(
          (node) =>
            !(
              violation.id === "color-contrast" &&
              node.target.join(" ").match(KNOWN_CONTRAST)
            ),
        )
        .map((node) => `${violation.id}: ${node.target.join(" ")}`),
    );
    expect(unexpected).toEqual([]);
  });
}

test("tabbing reaches every control in order with a visible focus ring", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const seen: string[] = [];
  for (let step = 0; step < 200; step += 1) {
    await page.keyboard.press("Tab");
    // Smooth scrolling brings the focused element in over a few frames.
    await page
      .waitForFunction(
        () => {
          const el = document.activeElement;
          if (!el || el === document.body) return true;
          const box = el.getBoundingClientRect();
          return box.bottom > 0 && box.top < window.innerHeight;
        },
        undefined,
        { timeout: 1500 },
      )
      .catch(() => undefined);
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      // The ring is drawn on the element or, for inputs inside a styled
      // field, on its wrapper (`has-[input:focus-visible]`).
      const ringOn = (node: Element | null) =>
        node instanceof HTMLElement &&
        getComputedStyle(node).outlineStyle !== "none" &&
        getComputedStyle(node).outlineWidth !== "0px";
      const box = el.getBoundingClientRect();
      // Also not clipped away by a scrolling / overflow-hidden ancestor
      // (e.g. a pill moved outside the marquee row): its centre must lie
      // inside every clipping ancestor.
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      let clipped = false;
      for (let node = el.parentElement; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.overflowX === "visible" && style.overflowY === "visible")
          continue;
        const clip = node.getBoundingClientRect();
        if (
          cx < clip.left ||
          cx > clip.right ||
          cy < clip.top ||
          cy > clip.bottom
        ) {
          clipped = true;
          break;
        }
      }
      return {
        where: `top ${Math.round(box.top)} bottom ${Math.round(box.bottom)} viewport ${window.innerHeight} scrollY ${Math.round(window.scrollY)}`,
        name: `${el.tagName.toLowerCase()} ${el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 40) ?? ""}`,
        ring:
          ringOn(el) ||
          ringOn(el.parentElement) ||
          ringOn(el.parentElement?.parentElement ?? null),
        visible:
          box.width > 0 &&
          box.height > 0 &&
          box.bottom > 0 &&
          box.top < window.innerHeight &&
          !clipped,
        // The page footer, not the <footer> inside testimonial cards.
        inFooter: Boolean(el.closest("footer") && !el.closest("article")),
      };
    });
    if (!info) break;
    expect.soft(info.ring, `focus ring on ${info.name}`).toBe(true);
    expect
      .soft(info.visible, `${info.name} scrolled into view (${info.where})`)
      .toBe(true);
    seen.push(info.name);
    if (info.inFooter && info.name.includes("on LinkedIn")) break;
  }

  // The walk starts in the nav and ends at the footer socials, passing the
  // main interactive sections on the way.
  const joined = seen.join("\n");
  for (const expected of [
    "Apsu home",
    // "Calculate BMI" is skipped: it stays disabled until the input is valid.
    "Height, feet",
    "Next",
    "on Instagram",
    "What states do you serve",
    "Start a free consultation",
    "FAQs",
    "APSU on LinkedIn",
  ]) {
    expect(joined).toContain(expected);
  }
});
