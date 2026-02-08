/**
 * @module components/onboarding/vibe-tile-large
 * Large selectable category tile for the onboarding flow.
 * 120x100px min, emoji + label + description, glowing category color on select.
 */

"use client";

import { motion } from "motion/react";
import type { EventCategory } from "@/lib/registries/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/map/config";

/** Emoji icon for each category. */
const CATEGORY_EMOJIS: Partial<Record<EventCategory, string>> = {
  music: "\uD83C\uDFB6",
  arts: "\uD83C\uDFA8",
  sports: "\u26BD",
  food: "\uD83C\uDF55",
  tech: "\uD83D\uDCBB",
  community: "\uD83E\uDD1D",
  family: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67",
  nightlife: "\uD83C\uDF19",
  outdoor: "\uD83C\uDFD5\uFE0F",
  education: "\uD83D\uDCDA",
  festival: "\uD83C\uDF89",
  market: "\uD83D\uDED2",
};

/** Short descriptors for each category. */
const CATEGORY_DESCRIPTIONS: Partial<Record<EventCategory, string>> = {
  music: "Live shows & concerts",
  arts: "Galleries & exhibits",
  sports: "Games & fitness",
  food: "Tastings & pop-ups",
  tech: "Meetups & demos",
  community: "Gatherings & causes",
  family: "Kid-friendly fun",
  nightlife: "Bars & late nights",
  outdoor: "Parks & adventures",
  education: "Workshops & talks",
  festival: "Big celebrations",
  market: "Local finds & shops",
};

interface VibeTileLargeProps {
  /** The event category this tile represents. */
  category: EventCategory;
  /** Whether this tile is currently selected. */
  selected: boolean;
  /** Called when the tile is toggled. */
  onToggle: (category: EventCategory) => void;
}

/** Large selectable category tile with emoji, label, and description. */
export function VibeTileLarge({ category, selected, onToggle }: VibeTileLargeProps) {
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];
  const emoji = CATEGORY_EMOJIS[category] ?? "\u2728";
  const desc = CATEGORY_DESCRIPTIONS[category] ?? "";

  return (
    <motion.button
      onClick={() => onToggle(category)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex min-h-[80px] flex-col items-center justify-center gap-1.5 rounded-2xl p-3 transition-colors sm:min-h-[100px] sm:p-4"
      style={{
        background: selected ? `${color}22` : "rgba(255, 255, 255, 0.05)",
        border: `2px solid ${selected ? color : "rgba(255, 255, 255, 0.08)"}`,
        boxShadow: selected ? `0 0 24px ${color}40` : "none",
      }}
    >
      <span className="text-xl sm:text-2xl">{emoji}</span>
      <span
        className="text-sm font-medium"
        style={{
          color: selected ? color : "rgba(255, 255, 255, 0.9)",
          fontFamily: "var(--font-chakra-petch)",
        }}
      >
        {label}
      </span>
      <span
        className="text-[10px]"
        style={{ color: selected ? color : "rgba(255, 255, 255, 0.5)" }}
      >
        {desc}
      </span>
    </motion.button>
  );
}
