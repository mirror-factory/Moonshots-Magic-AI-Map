/**
 * @module components/chat/suggestion-tiles
 * Horizontally-scrollable suggestion tiles displayed above the chat bar
 * when no messages are present. Shows 2 tiles at a time with swipe/scroll
 * for the rest. Context-aware ordering based on time, weather, and day of week.
 */

"use client";

import { useMemo, useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Music, UtensilsCrossed, Users, MapPin, Clock, Sparkles } from "lucide-react";
import type { AmbientContext } from "@/lib/context/ambient-context";

interface SuggestionTile {
  icon: ReactNode;
  label: string;
  subtitle: string;
  query: string;
  /** Categories this tile relates to, for context-aware ordering. */
  affinities: string[];
}

/** Brand blue for tile icons. */
const ICON_COLOR = "#3560FF";

const ALL_TILES: SuggestionTile[] = [
  {
    icon: <Music className="h-4 w-4" style={{ color: ICON_COLOR }} />,
    label: "Live music",
    subtitle: "Bands, venues & stages nearby",
    query: "Find live music happening tonight in Orlando",
    affinities: ["evening", "night", "nightlife", "music"],
  },
  {
    icon: <UtensilsCrossed className="h-4 w-4" style={{ color: ICON_COLOR }} />,
    label: "Food & drink",
    subtitle: "Tastings, pop-ups & foodie events",
    query: "What food and drink events are happening this week?",
    affinities: ["evening", "afternoon", "food", "weekend"],
  },
  {
    icon: <Users className="h-4 w-4" style={{ color: ICON_COLOR }} />,
    label: "Family fun",
    subtitle: "Kid-friendly adventures",
    query: "Top family-friendly events this month",
    affinities: ["morning", "afternoon", "family", "weekend"],
  },
  {
    icon: <MapPin className="h-4 w-4" style={{ color: ICON_COLOR }} />,
    label: "What's nearby",
    subtitle: "Events close to you",
    query: "What events are happening near me right now?",
    affinities: ["afternoon", "evening"],
  },
  {
    icon: <Clock className="h-4 w-4" style={{ color: ICON_COLOR }} />,
    label: "Starting soon",
    subtitle: "Happening in the next few hours",
    query: "What events are starting in the next 2 hours?",
    affinities: ["evening", "afternoon", "night"],
  },
  {
    icon: <Sparkles className="h-4 w-4" style={{ color: ICON_COLOR }} />,
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

/** Horizontally-scrollable suggestion tiles — 2 visible at a time. */
export function SuggestionTiles({ onSelect, context = null }: SuggestionTilesProps) {
  const sortedTiles = useMemo(() => {
    return [...ALL_TILES].sort(
      (a, b) => scoreTile(b, context) - scoreTile(a, context),
    );
  }, [context]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState, sortedTiles]);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      {/* Fade edge — left */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 rounded-l-xl bg-gradient-to-r from-black/20 to-transparent" />
      )}
      {/* Fade edge — right */}
      {canScrollRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 rounded-r-xl bg-gradient-to-l from-black/20 to-transparent" />
      )}

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-1 backdrop-blur-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
        </button>
      )}
      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-1 backdrop-blur-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
        </button>
      )}

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
        {sortedTiles.map((tile, i) => (
          <motion.button
            key={tile.label}
            onClick={() => onSelect(tile.query)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-colors"
            style={{
              width: "calc(50% - 4px)",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(var(--glass-blur))",
              fontFamily: "var(--font-chakra-petch)",
            }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(53, 96, 255, 0.1)" }}>
              {tile.icon}
            </span>
            <div className="min-w-0">
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {tile.label}
              </span>
              <p className="mt-0.5 text-[10px] leading-snug" style={{ color: "var(--text-dim)" }}>
                {tile.subtitle}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
