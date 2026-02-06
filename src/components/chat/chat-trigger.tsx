/**
 * @module components/chat/chat-trigger
 * Always-visible floating action button that toggles the chat panel.
 * Icon transforms between chat bubble and X based on open state.
 */

"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface ChatTriggerProps {
  open: boolean;
  onClick: () => void;
}

/** Always-visible floating chat toggle with animated icon transformation. */
export function ChatTrigger({ open, onClick }: ChatTriggerProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-4 z-30 h-12 w-12 rounded-full shadow-lg"
      style={{
        background: "var(--brand-primary)",
        color: "var(--brand-primary-foreground)",
      }}
      title={open ? "Close chat" : "Open chat"}
    >
      <div className="relative h-5 w-5">
        {/* Chat bubble icon */}
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: open ? 0 : 1,
            scale: open ? 0.5 : 1,
            rotate: open ? 90 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        {/* X icon */}
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: open ? 1 : 0,
            scale: open ? 1 : 0.5,
            rotate: open ? 0 : -90,
          }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
    </Button>
  );
}
