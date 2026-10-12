import { expect, test } from "@playwright/test";

test.describe("FAQ and footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test("the open answer is visible on load and questions toggle by keyboard", async ({
    page,
  }) => {
    const faq = page.locator("#faq");
    const first = faq.getByRole("button", {
      name: "What states do you serve in GLP-1 programs?",
    });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(
      faq.getByText("We are currently able to serve GLP-1 programs"),
    ).toBeVisible();

    const insurance = faq.getByRole("button", { name: "Do I need insurance?" });
    await insurance.focus();
    await page.keyboard.press("Enter");
    await expect(insurance).toHaveAttribute("aria-expanded", "true");
    await expect(faq.getByText("Apsu is cash-pay")).toBeVisible();
    // Several answers stay open.
    await expect(first).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Space");
    await expect(insurance).toHaveAttribute("aria-expanded", "false");
    await expect(faq.getByText("Apsu is cash-pay")).toBeHidden();
  });

  test("the footer FAQs link scrolls to the FAQ section", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "Footer" })
      .getByRole("link", { name: "FAQs" })
      .click();
    await expect(page).toHaveURL(/#faq$/);
    await expect
      .poll(() =>
        page
          .locator("#faq")
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBeLessThan(200);
  });

  test("the giant wordmark is cut off by the end of the page", async ({
    page,
  }) => {
    const footer = page.locator("footer").last();
    const box = await footer.evaluate((el) => {
      const wordmark = el.lastElementChild?.firstElementChild;
      const svg = wordmark?.querySelector("svg");
      if (!wordmark || !svg) return null;
      return {
        visible: wordmark.getBoundingClientRect().height,
        full: svg.getBoundingClientRect().height,
        pageEnd: document.documentElement.scrollHeight,
        footerEnd: el.getBoundingClientRect().bottom + window.scrollY,
      };
    });
    expect(box).not.toBeNull();
    if (!box) return;
    expect(box.visible / box.full).toBeGreaterThan(0.6);
    expect(box.visible / box.full).toBeLessThan(0.7);
    expect(Math.round(box.footerEnd)).toBe(box.pageEnd);
  });
});
