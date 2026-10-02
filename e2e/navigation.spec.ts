import { expect, test } from "@playwright/test";

test("desktop nav items never wrap (70rem breakpoint up to 1920px)", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1120, height: 900 });
  await page.goto("/");
  const wrapped: number[] = [];
  for (let width = 1120; width <= 1920; width += 8) {
    await page.setViewportSize({ width, height: 900 });
    const multiLine = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Main"]');
      if (!nav) return true;
      const items = [...nav.querySelectorAll("ul li > *")];
      // One row: every item shares the same vertical centre (±2px), and
      // each item is a single line (36px tall nav links).
      const centres = items.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const oneRow = Math.max(...centres) - Math.min(...centres) <= 2;
      const singleLine = items.every(
        (el) => el.getBoundingClientRect().height <= 40,
      );
      return !(oneRow && singleLine);
    });
    if (multiLine) wrapped.push(width);
  }
  expect(wrapped).toEqual([]);
});

test("mobile menu opens, closes with Escape and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Sleep" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("nav stays visible while scrolling and gains a stronger shadow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav).toHaveAttribute("data-scrolled", "false");
  await page.mouse.wheel(0, 1200);
  await expect(nav).toHaveAttribute("data-scrolled", "true");
  const top = await nav.evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);
  expect(top).toBeLessThan(20);
});
