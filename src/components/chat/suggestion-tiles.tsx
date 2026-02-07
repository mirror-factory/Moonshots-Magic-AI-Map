/**
 * @module components/chat/suggestion-tiles
 * 2x3 grid of suggestion tiles displayed above the center chat bar
 * when no messages are present. Context-aware ordering based on time,
 * weather, and day of week.
 */

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { AmbientContext } from "@/lib/context/ambient-context";

interface SuggestionTile {
  emoji: string;
  label: string;
  subtitle: string;
  query: string;
  /** Categories this tile relates to, for context-aware ordering. */
  affinities: string[];
}

const ALL_TILES: SuggestionTile[] = [
  {
    emoji: "\uD83C\uDFB6",
    label: "Live music",
    subtitle: "Bands, venues & stages nearby",
    query: "Find live music happening tonight in Orlando",
    affinities: ["evening", "night", "nightlife", "music"],
  },
  {
    emoji: "\uD83C\uDF55",
    label: "Food & drink",
    subtitle: "Tastings, pop-ups & foodie events",
    query: "What food and drink events are happening this week?",
    affinities: ["evening", "afternoon", "food", "weekend"],
  },
  {
    emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66",
    label: "Family fun",
    subtitle: "Kid-friendly adventures",
    query: "Top family-friendly events this month",
    affinities: ["morning", "afternoon", "family", "weekend"],
  },
  {
    emoji: "\uD83D\uDCA1",
    label: "What's nearby",
    subtitle: "Events close to you",
    query: "What events are happening near me right now?",
    affinities: ["afternoon", "evening"],
  },
  {
    emoji: "\u23F0",
    label: "Starting soon",
    subtitle: "Happening in the next few hours",
    query: "What events are starting in the next 2 hours?",
    affinities: ["evening", "afternoon", "night"],
  },
  {
    emoji: "\uD83C\uDF1F",
    label: "Surprise me",
    subtitle: "Something unexpected & fun",
    query: "Surprise me with something unique happening nearby",
    affinities: ["evening", "night", "weekend"],
  },
];

/** Score a tile based on how well it matches the current context. */
function scoreTile(tile: SuggestionTile, context: AmbientContext | null): number {
  if (!context) return 0;

  let score = 0;
  const { timeOfDay, weather, isWeekend } = context;

  // Time affinity
  if (tile.affinities.includes(timeOfDay)) score += 3;

  // Weekend affinity
  if (isWeekend && tile.affinities.includes("weekend")) score += 2;

  // Weather affinity — rainy pushes indoor categories
  if (weather) {
    const isRainy = ["Rainy", "Drizzle", "Showers", "Thunderstorm"].includes(weather.condition);
    if (isRainy && !tile.affinities.includes("outdoor")) score += 1;
    if (!isRainy && tile.affinities.includes("outdoor")) score += 1;
  }

  return score;
}

interface SuggestionTilesProps {
  /** Called when a tile is clicked with the query text. */
  onSelect: (query: string) => void;
  /** Ambient context for smart tile ordering. */
  context?: AmbientContext | null;
}

/** 2x3 grid of context-aware suggestion tiles with glass styling. */
export function SuggestionTiles({ onSelect, context = null }: SuggestionTilesProps) {
  const sortedTiles = useMemo(() => {
    return [...ALL_TILES].sort(
      (a, b) => scoreTile(b, context) - scoreTile(a, context),
    );
  }, [context]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {sortedTiles.map((tile, i) => (
        <motion.button
          key={tile.label}
          onClick={() => onSelect(tile.query)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 rounded-xl px-5 py-4 text-left transition-colors"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(var(--glass-blur))",
            fontFamily: "var(--font-chakra-petch)",
          }}
        >
          <span className="text-2xl leading-none">{tile.emoji}</span>
          <div className="min-w-0">
            <span className="text-base font-medium" style={{ color: "var(--text)" }}>
              {tile.label}
            </span>
            <p className="mt-0.5 text-xs leading-snug" style={{ color: "var(--text-dim)" }}>
              {tile.subtitle}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
