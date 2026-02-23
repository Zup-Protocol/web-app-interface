import { expect, test } from "@playwright/test";

test.describe("Search Settings & Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/positions/new");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("should persist search settings and reflect changes in UI", async ({
    page,
  }) => {
    // 1. Open Search Settings
    const settingsTrigger = page.getByLabel("Search Settings", { exact: true });
    await expect(settingsTrigger).toBeVisible({ timeout: 10000 });
    await settingsTrigger.click({ force: true });

    // 2. Change Min Liquidity
    const usdInput = page.getByTestId("usd-input");
    // Note: UsdInput likely doesn't have data-testid in prod but let's assume I can find it by placeholder or value.
    // The previous test found it by placeholder "0".
    const input = page.getByPlaceholder("0");
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("5000");
    await input.press("Enter");

    // 3. Verify Popover Closed
    // Give it a moment to animate out
    await expect(input).not.toBeVisible({ timeout: 10000 });

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
    // Re-select input as it's a new element after reload
    await expect(page.getByPlaceholder("0")).toHaveValue("5 000");
  });

  test("should allow blocking exchanges and keep popover open when interacting with modal", async ({
    page,
  }) => {
    // 1. Open Search Settings
    const settingsTrigger = page.getByLabel("Search Settings", { exact: true });
    await expect(settingsTrigger).toBeVisible({ timeout: 10000 });
    await settingsTrigger.click({ force: true });

    // 2. Click Exchanges Button inside Popover
    // Button text: "Exchanges (22/22)" or similar.
    const exchangesBtn = page.getByRole("button", { name: /Exchanges/i });
    await exchangesBtn.click();

    // 3. Modal should open
    const modal = page.locator("[role='dialog']"); // Assuming modal uses dialog role
    await expect(
      page.getByRole("heading", { name: /Exchanges/ }),
    ).toBeVisible();
    // In mobile, the modal animates from bottom. Wait for it to settle.
    await page.waitForTimeout(500);

    // 4. Block an exchange (click a card)
    // Assuming exchange cards are clickable.
    // Let's find a card INSIDE the modal.
    const exchangeCard = page.getByTestId("dex-card").first();
    await exchangeCard.click({ force: true });

    // 5. Close Modal (Interact outside or close button)
    const closeBtn = page.getByLabel("Close", { exact: true });
    await closeBtn.click();

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
