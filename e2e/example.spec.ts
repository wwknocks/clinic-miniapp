import { test, expect } from "@playwright/test";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Liquid Glass Design System/);
});

test("homepage displays welcome card", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Welcome")).toBeVisible();
});
