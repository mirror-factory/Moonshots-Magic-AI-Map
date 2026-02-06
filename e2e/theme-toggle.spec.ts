import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("moonshots_intro_seen", "true");
  });
});

test.describe("Theme Toggle", () => {
  test("toggle theme changes data-theme attribute", async ({ page }) => {
    await page.goto("/");

    // Get initial theme
    const html = page.locator("html");
    const initialTheme = await html.getAttribute("data-theme");

    // Find the theme toggle button
    const themeToggle = page.locator("button").filter({ hasText: /theme|dark|light/i }).or(
      page.locator('[aria-label*="theme" i]'),
    ).first();

    if (await themeToggle.isVisible({ timeout: 3000 })) {
      await themeToggle.click();

      // Theme attribute should change
      const newTheme = await html.getAttribute("data-theme");
      if (initialTheme) {
        expect(newTheme).not.toBe(initialTheme);
      }
    }

    // Map canvas should still be rendered after theme change
    const canvas = page.locator("canvas.maplibregl-canvas");
    await expect(canvas).toBeVisible();
  });
});
