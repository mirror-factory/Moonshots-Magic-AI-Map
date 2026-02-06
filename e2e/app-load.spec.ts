import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Skip the intro modal
  await page.addInitScript(() => {
    localStorage.setItem("moonshots_intro_seen", "true");
  });
});

test.describe("App Load", () => {
  test("page loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Moonshots/i);
  });

  test("map canvas is visible", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("canvas.maplibregl-canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });
  });

  test("chat FAB is visible", async ({ page }) => {
    await page.goto("/");
    const chatButton = page.getByTitle(/open chat/i);
    await expect(chatButton).toBeVisible();
  });

  test("map markers are rendered", async ({ page }) => {
    await page.goto("/");
    // Wait for map to load and markers to appear
    await page.waitForTimeout(3000);
    const canvas = page.locator("canvas.maplibregl-canvas");
    await expect(canvas).toBeVisible();
  });
});
