import { expect, test } from "@playwright/test";

test.describe("Search Settings & Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/positions/new");
  });

  test("should persist search settings and reflect changes in UI", async ({
    page,
  }) => {
    // 1. Open Search Settings
    const settingsTrigger = page.getByLabel("Search Settings", { exact: true });
    await expect(settingsTrigger).toBeVisible();
    await settingsTrigger.click();

    // 2. Change Min Liquidity
    const usdInput = page.getByTestId("usd-input");
    // Note: UsdInput likely doesn't have data-testid in prod but let's assume I can find it by placeholder or value.
    // The previous test found it by placeholder "0".
    const input = page.getByPlaceholder("0");
    await expect(input).toBeVisible();
    await input.fill("5000");
    await input.press("Enter"); // Should close popover via onDone? SearchSettingsContent calls onDone on Enter.

    // 3. Verify Popover Closed
    await expect(input).not.toBeVisible();

    // 4. Verify Icon Color Change (Visual Feedback)
    // The class is applied to the CogIcon wrapper div.
    await expect(settingsTrigger.locator(".text-orange-400")).toBeVisible();

    // 5. Reload Page (Persistence Check)
    await page.reload();

    // 6. Verify Persistence
    await expect(settingsTrigger).toBeVisible();
    // Icon should still be orange
    await expect(settingsTrigger.locator(".text-orange-400")).toBeVisible();

    // Open again to check value
    await settingsTrigger.click();
    await expect(page.getByDisplayValue("5,000")).toBeVisible(); // UsdInput formats value? Or just "5000". Likely "5,000" if formatter used.
    // If UsdInput uses numeric formatting, it might have commas.
    // Let's assume raw value for now or check input value.
  });

  test("should allow blocking exchanges and keep popover open when interacting with modal", async ({
    page,
  }) => {
    // 1. Open Search Settings
    const settingsTrigger = page.getByLabel("Search Settings", { exact: true });
    await settingsTrigger.click();

    // 2. Click Exchanges Button inside Popover
    // Button text: "Exchanges (22/22)" or similar.
    const exchangesBtn = page.getByRole("button", { name: /Exchanges/i });
    await exchangesBtn.click();

    // 3. Modal should open
    const modal = page.locator("[role='dialog']"); // Assuming modal uses dialog role
    // Or checking for title "Exchanges"
    await expect(
      page.getByRole("heading", { name: /Exchanges/ }),
    ).toBeVisible();

    // 4. Block an exchange (click a card)
    // Assuming exchange cards are clickable.
    // Let's find a card INSIDE the modal.
    const exchangeCard = page
      .getByRole("dialog")
      .locator(".cursor-pointer")
      .first();
    // This selector is fragile but common in this codebase based on previous test.
    await exchangeCard.click();

    // 5. Close Modal (Interact outside or close button)
    // Click outside modal to close it.
    await page.mouse.click(10, 10);

    // 6. Verify Modal Closed
    await expect(
      page.getByRole("heading", { name: /Exchanges/ }),
    ).not.toBeVisible();

    // 7. Verify Popover is STILL OPEN (Critical Fix Check)
    await expect(page.getByText("Minimum Pool Liquidity")).toBeVisible(); // Label inside popover

    // 8. Verify Count Updated in Popover
    // Should show (21/22) or something different than initial.
    await expect(exchangesBtn).not.toHaveText(/\(22\/22\)/); // Assuming 22 is total.
  });
});
