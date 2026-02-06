/**
 * @module components/map/map-controls
 * Slide-out sidebar with text-based logo, hamburger-to-X toggle animation,
 * category filters, event list, and quick navigation dropdowns.
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Filter, MapPin, ChevronDown } from "lucide-react";
import { EVENT_CATEGORIES, type EventCategory, type EventEntry } from "@/lib/registries/types";
import { CATEGORY_LABELS, PRESET_LOCATIONS } from "@/lib/map/config";
import { useMap } from "./use-map";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { EventSidebar } from "./event-sidebar";
import { EventDetail } from "./event-detail";

interface MapControlsProps {
  open: boolean;
  onToggle: () => void;
  visibleCategories: Set<EventCategory>;
  onToggleCategory: (category: EventCategory) => void;
  events: EventEntry[];
  eventCount: number;
  onAskAbout?: (eventTitle: string) => void;
}

/** Fixed header with text logo and toggle button (always visible). */
function MapControlsHeader({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="absolute left-4 top-6 z-20 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-md"
      style={{
        background: "var(--chat-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Text Logo - always visible */}
      <div className="flex flex-col" style={{ lineHeight: "0.9" }}>
        <span className="text-base font-bold tracking-wide dark:text-white text-black">
          MOONSHOTS
        </span>
        <span className="text-base font-bold tracking-wide dark:text-white text-black" style={{ marginTop: "-2px" }}>
          & MAGIC
        </span>
      </div>

      {/* Toggle Button with hamburger/X animation */}
      <button
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ color: "var(--text)" }}
        title={open ? "Close panel" : "Open panel"}
      >
        <div className="relative h-4 w-4">
          {/* Hamburger lines / X animation */}
          <motion.span
            className="absolute left-0 h-0.5 w-4 rounded-full"
            style={{ background: "currentColor", top: "2px" }}
            animate={{
              rotate: open ? 45 : 0,
              y: open ? 5 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full"
            style={{ background: "currentColor" }}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute left-0 h-0.5 w-4 rounded-full"
            style={{ background: "currentColor", bottom: "2px" }}
            animate={{
              rotate: open ? -45 : 0,
              y: open ? -5 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </button>
    </div>
  );
}

/** Slide-out panel with category filters, event list, and navigation. */
export function MapControls({
  open,
  onToggle,
  visibleCategories,
  onToggleCategory,
  events,
  eventCount,
  onAskAbout,
}: MapControlsProps) {
  const map = useMap();
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);

  const handleFlyTo = useCallback((name: string) => {
    const loc = PRESET_LOCATIONS[name];
    if (loc && map) {
      map.flyTo({ center: loc.center, zoom: loc.zoom, duration: 1500 });
    }
  }, [map]);

  const handleEventClick = useCallback((event: EventEntry) => {
    setSelectedEvent(event);
  }, []);

  const handleShowOnMap = useCallback((event: EventEntry) => {
    if (map) {
      map.flyTo({
        center: event.coordinates,
        zoom: 15,
        duration: 1500,
      });
    }
  }, [map]);

  const handleBackToList = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  // Filter events by visible categories
  const filteredEvents = events.filter((e) => visibleCategories.has(e.category));

  return (
    <>
      {/* Fixed Header (always visible) */}
      <MapControlsHeader open={open} onToggle={onToggle} />

      {/* Sliding Panel (below header) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-4 top-[5.5rem] z-10 flex flex-col overflow-hidden rounded-2xl shadow-xl backdrop-blur-md"
            style={{
              width: "var(--panel-width)",
              maxHeight: "calc(100% - 140px)",
              background: "var(--chat-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Event Detail View (slides over list) */}
            <AnimatePresence>
              {selectedEvent && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute inset-0 z-10 flex flex-col overflow-hidden"
                  style={{ background: "var(--chat-bg)" }}
                >
                  <EventDetail
                    event={selectedEvent}
                    onBack={handleBackToList}
                    onShowOnMap={handleShowOnMap}
                    onAskAI={onAskAbout}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters Header */}
            <div className="p-4">
              <div className="mb-3">
                <h3
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Filters
                </h3>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                      Categories
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          background: "var(--surface-3)",
                          color: "var(--text-dim)",
                        }}
                      >
                        {visibleCategories.size}/{EVENT_CATEGORIES.length}
                      </Badge>
                      <ChevronDown className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56"
                    style={{
                      background: "var(--chat-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <DropdownMenuCheckboxItem
                        key={cat}
                        checked={visibleCategories.has(cat)}
                        onCheckedChange={() => onToggleCategory(cat)}
                        className="cursor-pointer"
                      >
                        {CATEGORY_LABELS[cat]}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Quick Navigate Dropdown */}
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value) handleFlyTo(value);
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                      <SelectValue placeholder="Quick Navigate" />
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--chat-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    {Object.keys(PRESET_LOCATIONS).map((name) => (
                      <SelectItem key={name} value={name} className="cursor-pointer capitalize">
                        {name.replace(/([A-Z])/g, " $1").trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Event List */}
            <EventSidebar
              events={filteredEvents}
              onEventClick={handleEventClick}
              visibleCategories={visibleCategories}
            />

            <Separator />

            {/* Event Count Footer */}
            <div
              className="px-4 py-3"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {filteredEvents.length} of {eventCount} events visible
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
