import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("moonshots_intro_seen", "true");
  });
});

test.describe("Event Search", () => {
  test("search for free music events via chat", async ({ page }) => {
    await page.goto("/");

    // Open chat
    const chatButton = page.getByTitle(/open chat/i);
    await chatButton.click();

    // Find the chat input
    const input = page.locator("textarea, input[type='text']").last();
    await expect(input).toBeVisible({ timeout: 5000 });

    // Type a search query
    await input.fill("Find free music events");
    await input.press("Enter");

    // Wait for AI to respond with event cards or text
    await page.waitForTimeout(10000);

    // Verify some response appeared (either text or event cards)
    const response = page.locator('[class*="message"], [class*="event"], [class*="card"]');
    await expect(response.first()).toBeVisible({ timeout: 15000 });
  });
});
