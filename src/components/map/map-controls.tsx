/**
 * @module components/map/map-controls
 * Slide-out panel with category filter toggles, quick-navigate buttons
 * for preset locations, and a color legend for visible categories.
 */

"use client";

import { EVENT_CATEGORIES, type EventCategory } from "@/lib/registries/types";
import { CATEGORY_COLORS, CATEGORY_LABELS, PRESET_LOCATIONS } from "@/lib/map/config";
import { useMap } from "./use-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MapControlsProps {
  open: boolean;
  onToggle: () => void;
  visibleCategories: Set<EventCategory>;
  onToggleCategory: (category: EventCategory) => void;
  eventCount: number;
}

/** Slide-out panel with category filters, quick-navigate buttons, and legend. */
export function MapControls({
  open,
  onToggle,
  visibleCategories,
  onToggleCategory,
  eventCount,
}: MapControlsProps) {
  const map = useMap();

  const handleFlyTo = (name: string) => {
    const loc = PRESET_LOCATIONS[name];
    if (loc && map) {
      map.flyTo({ center: loc.center, zoom: loc.zoom, duration: 1500 });
    }
  };

  if (!open) {
    return (
      <button
        onClick={onToggle}
        className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-color)",
          color: "var(--text)",
        }}
        title="Open controls"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="absolute left-0 top-0 z-20 flex h-full flex-col overflow-y-auto"
      style={{
        width: "var(--panel-width)",
        background: "var(--surface)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
            Moonshots & Magic
          </h2>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            {eventCount} events
          </p>
        </div>
        <button
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded"
          style={{ color: "var(--text-dim)" }}
          title="Close controls"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <Separator />

      {/* Category Filters */}
      <div className="p-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {EVENT_CATEGORIES.map((cat) => {
            const isActive = visibleCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className="transition-opacity"
                style={{ opacity: isActive ? 1 : 0.35 }}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer text-xs"
                  style={{
                    background: isActive ? CATEGORY_COLORS[cat] : "var(--surface-3)",
                    color: isActive ? "#000" : "var(--text-dim)",
                    borderColor: "transparent",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Quick Navigation */}
      <div className="p-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Quick Navigate
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESET_LOCATIONS).map(([name]) => (
            <Button
              key={name}
              variant="secondary"
              size="sm"
              className="justify-start text-xs capitalize"
              onClick={() => handleFlyTo(name)}
            >
              {name.replace(/([A-Z])/g, " $1").trim()}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Legend */}
      <div className="p-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Legend
        </h3>
        <div className="space-y-1.5">
          {EVENT_CATEGORIES.filter((c) => visibleCategories.has(c)).map((cat) => (
            <div key={cat} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
              <span style={{ color: "var(--text-dim)" }}>{CATEGORY_LABELS[cat]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
