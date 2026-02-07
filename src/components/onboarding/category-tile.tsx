/**
 * @module components/onboarding/category-tile
 * Selectable category tile for the onboarding quiz vibe step.
 * Renders an icon, label, and glowing border when selected.
 */

"use client";

import { motion } from "motion/react";
import type { EventCategory } from "@/lib/registries/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/map/config";
import {
  Music,
  Palette,
  Trophy,
  UtensilsCrossed,
  Cpu,
  Users,
  Baby,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Partial<Record<EventCategory, LucideIcon>> = {
  music: Music,
  arts: Palette,
  sports: Trophy,
  food: UtensilsCrossed,
  tech: Cpu,
  community: Users,
  family: Baby,
  nightlife: PartyPopper,
};

interface CategoryTileProps {
  /** The event category this tile represents. */
  category: EventCategory;
  /** Whether this tile is currently selected. */
  selected: boolean;
  /** Number of events in this category. */
  eventCount?: number;
  /** Called when the tile is toggled. */
  onToggle: (category: EventCategory) => void;
}

/** Selectable category tile with icon, label, and glow effect. */
export function CategoryTile({ category, selected, eventCount, onToggle }: CategoryTileProps) {
  const Icon = CATEGORY_ICONS[category] ?? Users;
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  return (
    <motion.button
      onClick={() => onToggle(category)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-colors"
      style={{
        background: selected ? `${color}22` : "var(--glass-bg)",
        border: `2px solid ${selected ? color : "var(--glass-border)"}`,
        backdropFilter: "blur(var(--glass-blur))",
        boxShadow: selected ? `0 0 20px ${color}40` : "none",
      }}
    >
      <Icon className="h-6 w-6" style={{ color: selected ? color : "var(--text-dim)" }} />
      <span
        className="text-sm font-medium"
        style={{
          color: selected ? color : "var(--text)",
          fontFamily: "var(--font-chakra-petch)",
        }}
      >
        {label}
      </span>
      {eventCount !== undefined && (
        <span
          className="text-[10px]"
          style={{ color: selected ? color : "var(--text-muted)" }}
        >
          {eventCount} event{eventCount !== 1 ? "s" : ""}
        </span>
      )}
    </motion.button>
  );
}
