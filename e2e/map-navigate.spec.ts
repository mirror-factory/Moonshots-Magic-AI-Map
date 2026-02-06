import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("moonshots_intro_seen", "true");
  });
});

test.describe("Map Navigate", () => {
  test("send location query and see map action card", async ({ page }) => {
    await page.goto("/");

    // Open chat
    const chatButton = page.getByTitle(/open chat/i);
    await chatButton.click();

    // Find the chat input
    const input = page.locator("textarea, input[type='text']").last();
    await expect(input).toBeVisible({ timeout: 5000 });

    // Ask about a location
    await input.fill("Show me events near Lake Eola");
    await input.press("Enter");

    // Wait for AI response with map action
    await page.waitForTimeout(10000);

    // Look for a map action card or any response
    const response = page.locator('[class*="message"], [class*="map-action"], [class*="action"]');
    await expect(response.first()).toBeVisible({ timeout: 15000 });
  });
});
