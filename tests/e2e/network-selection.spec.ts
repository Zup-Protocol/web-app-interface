import { expect, test } from "@playwright/test";

test.describe("Network Selection Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens network selector modal", async ({ page }) => {
    // Click network selector button.
    await page
      .locator("header")
      .getByRole("button")
      .filter({ hasText: /Ethereum|Base|Monad|All Networks/ })
      .first()
      .click();

    await expect(page.getByText("Select Network")).toBeVisible();
    await expect(page.getByPlaceholder("Find a network")).toBeVisible();
  });

  test("filters networks", async ({ page }) => {
    // Open modal
    await page
      .locator("header")
      .getByRole("button")
      .filter({ hasText: /Ethereum|Base|Monad|All Networks/ })
      .first()
      .click();

    const input = page.getByPlaceholder("Find a network");
    await input.fill("Base");

    // "Base" should be visible
    await expect(page.getByText("Base", { exact: true })).toBeVisible();

    // "Ethereum" should not be visible (if filtered correctly and list renders names)
    // Note: getByText is fuzzy unless exact:true.
    // And if "Base" is selected or similar.
    // Assuming Ethereum is hidden.
    await expect(page.getByText("Ethereum")).not.toBeVisible();
  });
});
