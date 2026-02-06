import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

/**
 * Mock localStorage for SSR-guarded modules.
 * jsdom provides a basic localStorage, but we ensure it's clean between tests.
 */
beforeEach(() => {
  localStorage.clear();
});
