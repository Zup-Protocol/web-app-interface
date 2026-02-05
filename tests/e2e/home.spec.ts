import { expect, test } from "@playwright/test";

test("homepage has title and button", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home/);

  // Expect the main hero button to be visible
  const button = page.getByRole("button", { name: /Join the Future/i }).first();
  await expect(button).toBeVisible();
});
