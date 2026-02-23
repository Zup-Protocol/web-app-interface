import { expect, test } from "@playwright/test";

test.describe("Asset Selector", () => {
  test("should show error state when tokens fetch fails and allow retry", async ({
    page,
  }) => {
    // Enable logging
    page.on("console", (msg) => console.log("BROWSER CONSOLE:", msg.text()));

    // 1. Mock the tokens API to fail
    await page.route("https://api.hydric.org/**/tokens**", async (route) => {
      console.log("Mocking failure for:", route.request().url());
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Go to page
    await page.goto("/positions/new");

    // 2. Open the asset selector
    const tokenSelector = page
      .getByRole("button", { name: /Select asset/i })
      .first();
    await tokenSelector.click();

    // 3. Verify error state is shown
    // We might need to wait for React Query to finish retries if it's not configured otherwise.
    // However, the error should eventually appear.
    const errorTitle = page.getByText("Something went wrong");
    await expect(errorTitle).toBeVisible({ timeout: 20000 });

    // 4. Unroute and allow tokens to succeed
    await page.unroute("https://api.hydric.org/**/tokens**");

    // 5. Click Try again
    const retryButton = page.getByRole("button", { name: /Try again/i });
    await retryButton.click();

    // 6. Verify error state is gone
    await expect(errorTitle).not.toBeVisible({ timeout: 15000 });
  });
});
