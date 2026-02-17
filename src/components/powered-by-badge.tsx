/**
 * @module components/powered-by-badge
 * Sticky badge displaying "Powered by Mirror Factory" attribution.
 * Appears in the bottom-right corner with translucent dark background.
 */

"use client";

/**
 * Renders a fixed-position badge in the bottom-right corner.
 * Uses the same dark translucent styling as the navigation bar.
 */
export function PoweredByBadge() {
  return (
    <div
      className="fixed bottom-4 right-4 z-40 rounded-full px-4 py-2 text-sm font-medium"
      style={{
        background: "rgba(5, 5, 5, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "var(--text-dim)",
        fontFamily: "var(--font-chakra-petch, sans-serif)",
      }}
    >
      Powered by{" "}
      <a
        href="https://github.com/mirror-factory"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-brand-primary"
        style={{ color: "var(--text)" }}
      >
        Mirror Factory
      </a>
    </div>
  );
}
