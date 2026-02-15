/**
 * @module components/chat/suggestion-tiles
 * Horizontal suggestion pill row displayed above the chat bar
 * when no messages are present. Shows 3 at a time with context-aware
 * ordering based on time, weather, and day of week.
 */

"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "motion/react";
import { Music, UtensilsCrossed, Users, MapPin, Clock, Sparkles } from "lucide-react";
import type { AmbientContext } from "@/lib/context/ambient-context";

interface SuggestionTile {
  icon: ReactNode;
  label: string;
  query: string;
  /** Categories this tile relates to, for context-aware ordering. */
  affinities: string[];
}

/** Brand blue for tile icons. */
const ICON_COLOR = "#3560FF";

const ALL_TILES: SuggestionTile[] = [
  {
    icon: <Music className="h-3.5 w-3.5" style={{ color: ICON_COLOR }} />,
    label: "Live music",
    query: "Find live music happening tonight in Orlando",
    affinities: ["evening", "night", "nightlife", "music"],
  },
  {
    icon: <UtensilsCrossed className="h-3.5 w-3.5" style={{ color: ICON_COLOR }} />,
    label: "Food & drink",
    query: "What food and drink events are happening this week?",
    affinities: ["evening", "afternoon", "food", "weekend"],
  },
  {
    icon: <Users className="h-3.5 w-3.5" style={{ color: ICON_COLOR }} />,
    label: "Family fun",
    query: "Top family-friendly events this month",
    affinities: ["morning", "afternoon", "family", "weekend"],
  },
  {
    icon: <MapPin className="h-3.5 w-3.5" style={{ color: ICON_COLOR }} />,
    label: "What's nearby",
    query: "What events are happening near me right now?",
    affinities: ["afternoon", "evening"],
  },
  {
    icon: <Clock className="h-3.5 w-3.5" style={{ color: ICON_COLOR }} />,
    label: "Starting soon",
    query: "What events are starting in the next 2 hours?",
    affinities: ["evening", "afternoon", "night"],
  },
  {
    icon: <Sparkles className="h-3.5 w-3.5" style={{ color: ICON_COLOR }} />,
    label: "Surprise me",
    query: "Surprise me with something unique happening nearby",
    affinities: ["evening", "night", "weekend"],
  },
];

/** Number of tiles to display at once. */
const VISIBLE_COUNT = 3;

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

/** Horizontal suggestion pills — top 3 context-ranked tiles above the chat bar. */
export function SuggestionTiles({ onSelect, context = null }: SuggestionTilesProps) {
  const visibleTiles = useMemo(() => {
    return [...ALL_TILES]
      .sort((a, b) => scoreTile(b, context) - scoreTile(a, context))
      .slice(0, VISIBLE_COUNT);
  }, [context]);

  return (
    <div className="flex gap-2">
      {visibleTiles.map((tile, i) => (
        <motion.button
          key={tile.label}
          onClick={() => onSelect(tile.query)}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center transition-all"
          style={{
            background: "rgba(10, 10, 15, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(12px)",
            fontFamily: "var(--font-chakra-petch)",
          }}
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-shadow group-hover:shadow-[0_0_10px_rgba(53,96,255,0.4)]"
            style={{ background: "rgba(53, 96, 255, 0.1)" }}
          >
            {tile.icon}
          </span>
          <span
            className="text-[11px] font-medium transition-all group-hover:text-white"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {tile.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
