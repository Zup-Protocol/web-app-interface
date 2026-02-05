import { expect, test } from "@playwright/test";

test.describe("Settings Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens settings menu and sees options", async ({ page }) => {
    // Click settings button (cog icon) - 'Settings' from translation
    // Scope to header to avoid Astro toolbar
    await page
      .locator("header")
      .getByRole("button", { name: /Settings/i })
      .click();

    await expect(page.getByText("Theme Mode")).toBeVisible();
    await expect(page.getByText("Language")).toBeVisible();
  });

  test("can toggle theme options", async ({ page }) => {
    await page
      .locator("header")
      .getByRole("button", { name: /Settings/i })
      .click();

    // Find theme dropdown/select
    const themeTrigger = page.getByRole("combobox").first();
    await themeTrigger.click();

    // Check options appear
    await expect(page.getByText("Light", { exact: true })).toBeVisible();
    await expect(page.getByText("Dark", { exact: true })).toBeVisible();
  });
});
