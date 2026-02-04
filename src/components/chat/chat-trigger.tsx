/**
 * @module components/chat/chat-trigger
 * Floating action button that opens the chat panel. Displayed when the
 * chat is closed.
 */

"use client";

import { Button } from "@/components/ui/button";

interface ChatTriggerProps {
  onClick: () => void;
}

/** Floating action button that opens the chat panel. */
export function ChatTrigger({ onClick }: ChatTriggerProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-16 right-4 z-30 h-12 w-12 rounded-full shadow-lg"
      style={{
        background: "var(--brand-primary)",
        color: "var(--brand-primary-foreground)",
      }}
      title="Open chat"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}
