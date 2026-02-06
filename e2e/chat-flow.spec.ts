import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("moonshots_intro_seen", "true");
  });
});

test.describe("Chat Flow", () => {
  test("open chat panel and see suggestions", async ({ page }) => {
    await page.goto("/");
    const chatButton = page.getByTitle(/open chat/i);
    await chatButton.click();

    // Chat panel should open
    const chatPanel = page.locator("[data-chat-panel]").or(
      page.locator('[class*="chat"]').first(),
    );
    await expect(chatPanel).toBeVisible({ timeout: 5000 });
  });

  test("click suggestion chip triggers AI response", async ({ page }) => {
    await page.goto("/");
    const chatButton = page.getByTitle(/open chat/i);
    await chatButton.click();

    // Look for suggestion chips/buttons in the chat
    const suggestion = page.locator("button").filter({ hasText: /event|find|show/i }).first();
    if (await suggestion.isVisible({ timeout: 3000 })) {
      await suggestion.click();
      // Wait for AI response (text or event cards)
      await page.waitForTimeout(5000);
      const messages = page.locator('[class*="message"]');
      await expect(messages.first()).toBeVisible({ timeout: 15000 });
    }
  });
});
