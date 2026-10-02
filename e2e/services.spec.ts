import { expect, type Page, test } from "@playwright/test";

const carousel = (page: Page) =>
  page.getByRole("region", { name: "Completely online on your schedule" });

const scrollLeft = (page: Page) =>
  carousel(page)
    .getByRole("list")
    .first()
    .evaluate((track) => Math.round(track.scrollLeft));

test.describe("services carousel", () => {
  test("arrows step one card and disable at the ends", async ({ page }) => {
    // 375: card 333 + gap 12 per step; the last step stops at the max
    // scroll (4 cards + gaps + 20px insets - viewport = 1033).
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const prev = carousel(page).getByRole("button", { name: "Previous" });
    const next = carousel(page).getByRole("button", { name: "Next" });
    await next.scrollIntoViewIfNeeded();
    await expect(prev).toBeDisabled();

    for (const expected of [345, 690, 1033]) {
      await next.click();
      await expect.poll(() => scrollLeft(page)).toBe(expected);
    }
    await expect(next).toBeDisabled();
    await expect(prev).toBeEnabled();

    await prev.click();
    await expect.poll(() => scrollLeft(page)).toBe(690);
    await expect(next).toBeEnabled();
  });

  test("at 1440 one step reveals the last card", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const next = carousel(page).getByRole("button", { name: "Next" });
    await next.scrollIntoViewIfNeeded();
    await next.click();
    // 4 x 382 + 3 x 24 + 2 x 60 - 1440
    await expect.poll(() => scrollLeft(page)).toBe(280);
    await expect(next).toBeDisabled();
  });

  test("cards bleed to the right edge and never widen the page", async ({
    page,
  }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBe(0);
      const track = await carousel(page)
        .getByRole("list")
        .first()
        .evaluate((el) => el.getBoundingClientRect().right);
      expect(Math.round(track)).toBe(width);
    }
  });

  test("reduced motion jumps instead of gliding", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await carousel(page).getByRole("button", { name: "Next" }).click();
    expect(await scrollLeft(page)).toBe(280);
  });
});
