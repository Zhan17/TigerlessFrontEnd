import { expect, type Page, test } from "@playwright/test";

/** The language marquee, found by its accessible name (other fieldsets exist). */
const marquee = (page: Page) =>
  page.getByRole("group", {
    name: "Languages available for your consultation",
  });

const trackX = (page: Page, row: number) =>
  marquee(page)
    .locator(".will-change-transform")
    .nth(row)
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

test.describe("language marquee", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test("rows drift in opposite directions", async ({ page }) => {
    const a = [await trackX(page, 0), await trackX(page, 1)];
    await page.waitForTimeout(800);
    const b = [await trackX(page, 0), await trackX(page, 1)];
    expect(b[0]).not.toBe(a[0]);
    expect(b[1]).not.toBe(a[1]);
  });

  test("hovering the middle pauses, hovering an edge speeds up", async ({
    page,
  }) => {
    const box = await marquee(page).boundingBox();
    if (!box) throw new Error("marquee not rendered");
    const y = box.y + box.height / 4;

    await page.mouse.move(box.x + box.width / 2, y);
    await page.waitForTimeout(150);
    const pausedA = await trackX(page, 0);
    await page.waitForTimeout(500);
    expect(Math.abs((await trackX(page, 0)) - pausedA)).toBeLessThan(1);

    // Right edge: content races left (far faster than the ~28px/s drift).
    await page.mouse.move(box.x + box.width - 10, y);
    await page.waitForTimeout(100);
    const edgeA = await trackX(page, 0);
    await page.waitForTimeout(500);
    const moved = edgeA - (await trackX(page, 0));
    // The offset wraps around, so accept any large jump.
    expect(Math.abs(moved)).toBeGreaterThan(60);
  });

  test("pills toggle a multi-select highlight on every copy (keyboard)", async ({
    page,
  }) => {
    const english = marquee(page).locator("button:not([inert] *)", {
      hasText: "English",
    });
    await expect(english).toHaveAttribute("aria-pressed", "false");
    // Focus pauses the row, then Enter toggles: also proves keyboard access.
    await english.focus();
    await page.keyboard.press("Enter");
    await expect(english).toHaveAttribute("aria-pressed", "true");
    // Defaults stay selected (multi-select, K16).
    await expect(
      marquee(page).locator("button:not([inert] *)", { hasText: "中文" }),
    ).toHaveAttribute("aria-pressed", "true");
    // Clones mirror the state.
    await expect(
      marquee(page).locator("[inert] button", { hasText: "English" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(english).toHaveAttribute("aria-pressed", "false");
  });

  test("touch drag scrubs the row and a drag does not toggle a pill", async ({
    page,
  }) => {
    const before = await trackX(page, 0);
    const moved = await page.evaluate(() => {
      const viewport = [...document.querySelectorAll("fieldset")]
        .find((f) =>
          f.querySelector("legend")?.textContent?.startsWith("Languages"),
        )
        ?.querySelector(".touch-pan-y");
      if (!viewport) return null;
      const r = viewport.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const fire = (type: string, x: number) =>
        viewport.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            pointerType: "touch",
            pointerId: 7,
            clientX: x,
            clientY: y,
          }),
        );
      const start = r.left + r.width / 2;
      fire("pointerdown", start);
      for (let step = 1; step <= 10; step++)
        fire("pointermove", start - step * 20);
      fire("pointerup", start - 200);
      return true;
    });
    expect(moved).toBe(true);
    const after = await trackX(page, 0);
    // Dragged ~200px left (offset wraps, so compare the distance both ways).
    const period = await marquee(page)
      .locator(".will-change-transform > div")
      .first()
      .evaluate((el) => el.getBoundingClientRect().width);
    const delta = Math.abs(after - before);
    expect(Math.min(delta, Math.abs(period - delta))).toBeGreaterThan(120);
    // No pill got toggled by the drag.
    await expect(
      marquee(page).locator("button[aria-pressed=true]:not([inert] *)"),
    ).toHaveCount(2);
  });

  test("clones are hidden from assistive tech and keyboard", async ({
    page,
  }) => {
    const visible = await marquee(page)
      .locator("button:not([inert] *)")
      .count();
    expect(visible).toBe(11);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("rows are static and scroll horizontally instead", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(marquee(page).locator(".will-change-transform")).toHaveCount(
      0,
    );
    await expect(marquee(page).locator("[inert]")).toHaveCount(0);
  });
});
