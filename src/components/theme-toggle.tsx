/**
 * @module components/theme-toggle
 * Client component that provides a toggle button to switch between light and dark themes.
 * Uses next-themes for theme management.
 */

"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Subscribe to nothing - we just need to know if we're mounted.
 * Uses useSyncExternalStore to avoid the lint warning about setState in useEffect.
 */
function subscribe() {
  return () => {};
}

/** Returns true only on the client, false during SSR. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client value
    () => false // server value
  );
}

/** Theme toggle button with sun/moon icons. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    // Return placeholder with same dimensions to avoid layout shift
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface border border-border-color transition-colors"
        aria-label="Toggle theme"
      >
        <div className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface border border-border-color transition-colors hover:bg-surface-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-text" />
      ) : (
        <Moon className="h-4 w-4 text-text" />
      )}
    </button>
  );
}
