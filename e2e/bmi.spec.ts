import { expect, test } from "@playwright/test";

test.describe("BMI calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  const form = (page: import("@playwright/test").Page) =>
    page.getByRole("form", { name: "Could a GLP-1 program be right for you?" });

  test("starts empty with the button disabled", async ({ page }) => {
    await expect(
      form(page).getByRole("button", { name: "Calculate BMI" }),
    ).toBeDisabled();
    await expect(
      page.getByText("Enter your details to see your score").last(),
    ).toBeVisible();
  });

  test("calculates, names the sex, and recalculates after a unit switch", async ({
    page,
  }) => {
    const f = form(page);
    await f.getByRole("spinbutton", { name: "Height, feet" }).fill("5");
    await f.getByRole("spinbutton", { name: "Height, inches" }).fill("7");
    await f.getByRole("spinbutton", { name: "Weight, pounds" }).fill("150");
    const submit = f.getByRole("button", { name: "Calculate BMI" });
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(
      page.getByText("As a woman, your BMI is 23.5 — Healthy Weight.").last(),
    ).toBeVisible();

    // Sex only changes the wording (C6), not the number.
    await f.getByText("Male", { exact: true }).click();
    await submit.click();
    await expect(
      page.getByText("As a man, your BMI is 23.5 — Healthy Weight.").last(),
    ).toBeVisible();

    // Units: values convert and the existing result is recalculated.
    await f.getByText("cm / kg").click();
    await expect(
      f.getByRole("spinbutton", { name: "Height, centimetres" }),
    ).toHaveValue("170");
    await expect(
      f.getByRole("spinbutton", { name: "Weight, kilograms" }),
    ).toHaveValue("68");
    await expect(page.getByText(/your BMI is 23\.5/).last()).toBeVisible();
  });

  test("shows a range message and keeps the button disabled", async ({
    page,
  }) => {
    const f = form(page);
    await f.getByRole("spinbutton", { name: "Height, feet" }).fill("12");
    await f.getByRole("spinbutton", { name: "Weight, pounds" }).fill("150");
    const feet = f.getByRole("spinbutton", { name: "Height, feet" });
    await expect(feet).toHaveAttribute("aria-invalid", "true");
    await expect(feet).toHaveAccessibleDescription("Enter 3–8 ft");
    await expect(
      f.getByRole("button", { name: "Calculate BMI" }),
    ).toBeDisabled();
  });

  test("works with the keyboard only", async ({ page }) => {
    const f = form(page);
    await f.getByRole("radio", { name: "ft / lbs" }).focus();
    await page.keyboard.press("ArrowRight"); // -> cm / kg
    await expect(f.getByRole("radio", { name: "cm / kg" })).toBeChecked();
    await f.getByRole("spinbutton", { name: "Height, centimetres" }).focus();
    await page.keyboard.type("180");
    await page.keyboard.press("Tab"); // skip stepper buttons (tabIndex -1) -> weight
    await page.keyboard.type("90");
    await f.getByRole("button", { name: "Calculate BMI" }).focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByText(/your BMI is 27\.8 — Overweight/).last(),
    ).toBeVisible();
  });
});
