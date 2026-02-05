import { expect, test } from "@playwright/test";

test("new position page has title and button", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/New Position/);

  // Expect the main hunt button to be visible
  const button = page
    .getByRole("button", { name: /Show me the money!/i })
    .first();
  await expect(button).toBeVisible();
});
