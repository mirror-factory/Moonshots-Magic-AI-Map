/**
 * @module components/chat/suggestion-tiles
 * 2x2 grid of suggestion tiles displayed above the center chat bar
 * when no messages are present. Each tile sends a preset query.
 */

"use client";

import { motion } from "motion/react";

interface SuggestionTile {
  emoji: string;
  label: string;
  query: string;
}

const TILES: SuggestionTile[] = [
  { emoji: "\uD83C\uDFB6", label: "Live music tonight", query: "Find live music happening tonight in Orlando" },
  { emoji: "\uD83C\uDF55", label: "Food & drink", query: "What food and drink events are happening this week?" },
  { emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66", label: "Family fun", query: "Top family-friendly events this month" },
  { emoji: "\uD83C\uDF1F", label: "Surprise me", query: "Surprise me with something unique happening nearby" },
];

interface SuggestionTilesProps {
  /** Called when a tile is clicked with the query text. */
  onSelect: (query: string) => void;
}

/** 2x2 grid of suggestion tiles with glass styling. */
export function SuggestionTiles({ onSelect }: SuggestionTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TILES.map((tile) => (
        <motion.button
          key={tile.label}
          onClick={() => onSelect(tile.query)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(var(--glass-blur))",
            fontFamily: "var(--font-chakra-petch)",
          }}
        >
          <span className="text-base">{tile.emoji}</span>
          <span style={{ color: "var(--text)" }}>{tile.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
