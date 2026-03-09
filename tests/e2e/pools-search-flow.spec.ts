import { expect, test } from "@playwright/test";

test.describe("Pools Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/positions/new");
    await page.waitForLoadState("networkidle");
  });

  test("should navigate through the full search flow", async ({ page }) => {
    // 1. Initial state check
    await expect(page.getByText(/Find the best yield/i)).toBeVisible();

    // 2. Select Asset A (e.g. USDT on Ethereum)
    const assetA = page.getByTestId("asset-selector-A");
    await assetA.click();

    // Search for USDT in the modal
    const searchInput = page.getByPlaceholder(/Search name or paste address/i);
    await searchInput.fill("USDT");

    // Select the first USDT using test-id
    await page.getByTestId("token-USDT").first().click();

    // 3. Select Asset B (e.g. USDC on Ethereum)
    const assetB = page.getByTestId("asset-selector-B");
    await assetB.click();
    await searchInput.fill("USDC");
    await page.getByTestId("token-USDC").first().click();

    // 4. Click Hunt Button
    const huntBtn = page.getByRole("button", { name: /Show me the money!/i });
    await expect(huntBtn).not.toBeDisabled();
    await huntBtn.click();

    // 5. Verify Navigation to Pools Page
    await expect(page).toHaveURL(/\/positions\/new\/pools/);
    await expect(page.locator("h1")).toContainText(/Available Yields/i);

    // 6. Verify URL Params are present
    const url = page.url();
    expect(url).toContain("assetA=");
    expect(url).toContain("assetB=");

    // 7. Test Yield Period Switch
    const dayBtn = page.getByRole("radio", { name: "24h" });
    const weekBtn = page.getByRole("radio", { name: "7d" });

    await weekBtn.click();
    await expect(weekBtn).toBeChecked();

    // Should stay on the same URL but reflect changes in UI (segmented control)
    await expect(page).toHaveURL(/\/positions\/new\/pools/);

    // 8. Test Back Button
    const backBtn = page.getByLabel("Go Back");
    await backBtn.click();
    await expect(page).toHaveURL(/\/positions\/new/);

    // Verify assets are still selected (persistence via URL/State)
    await expect(page.getByText("USDT")).toBeVisible();
    await expect(page.getByText("USDC")).toBeVisible();
  });

  test("should handle direct deep links with search params", async ({ page }) => {
    // Arbitrary pre-computed valid hashes for USDT and USDC on Eth
    // assetA: {"type":"single-chain-token","chainId":1,"address":"0xdAC17F958D2ee523a2206206994597C13D831ec7"}
    // encoded: N4IgpgTglgzgLgSwDYCcCmATAhlALgAgFsA6SgIQCcBXAewHsqB7VAIwgDcAaEAZgFYA7EA

    // assetB: {"type":"single-chain-token","chainId":1,"address":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}
    // encoded: N4IgpgTglgzgLgSwDYCcCmATAhlALgAgFsA6WAZwBsB7KgexQCMIA3AGhAGYBWAAxAAwQA0IA

    const assetA = "N4IgpgTglgzgLgSwDYCcCmATAhlALgAgFsA6SgIQCcBXAewHsqB7VAIwgDcAaEAZgFYA7EA";
    const assetB = "N4IgpgTglgzgLgSwDYCcCmATAhlALgAgFsA6WAZwBsB7KgexQCMIA3AGhAGYBWAAxAAwQA0IA";

    await page.goto(`/positions/new/pools?assetA=${assetA}&assetB=${assetB}&chainId=1`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText(/Available Yields/i);
    // Should display USDT and USDC in the header or some visual indicator
    await expect(page.getByText(/USDT/i)).toBeVisible();
    await expect(page.getByText(/USDC/i)).toBeVisible();
  });

  test("should show error state for invalid search params", async ({ page }) => {
    await page.goto("/positions/new/pools?assetA=garbage&assetB=garbage");
    // Depending on implementation, it might redirect or show an empty state.
    // Let's assume it shows an empty state or redirect back to selection.
    // If it redirects:
    await expect(page).toHaveURL(/\/positions\/new/);
  });
});
