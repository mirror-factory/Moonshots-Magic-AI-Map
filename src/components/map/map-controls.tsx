/**
 * @module components/map/map-controls
 * Top-left map overlay with brand logo events dropdown and a slide-out sidebar
 * showing AI-highlighted events. Category filtering removed in favor of
 * query-driven markers.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin } from "lucide-react";
import type { EventEntry } from "@/lib/registries/types";
import { PRESET_LOCATIONS } from "@/lib/map/config";
import { useMap } from "./use-map";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { EventSidebar } from "./event-sidebar";
import { EventDetail } from "./event-detail";
import { EventsDropdown } from "./events-dropdown";
import type { DatePreset } from "@/lib/map/event-filters";

interface MapControlsProps {
  open: boolean;
  events: EventEntry[];
  eventCount: number;
  /** Event IDs currently highlighted by the AI chat. */
  highlightedEventIds?: string[];
  /** Effective event IDs currently shown on the map (AI or date filter). */
  effectiveEventIds?: string[];
  /** Whether AI results are overriding the date filter. */
  aiResultsActive?: boolean;
  /** Active date preset when not overridden by AI. */
  activePreset?: DatePreset;
  /** Callback when user changes the date filter preset. */
  onPresetChange?: (preset: DatePreset) => void;
  onAskAbout?: (eventTitle: string) => void;
  /** Cinematic show-on-map handler (fly + card + orbit). */
  onShowEventOnMap?: (eventId: string) => void;
  /** Event ID to auto-open in the dropdown detail view. */
  detailEventId?: string | null;
  /** Clear the externally-set detail event ID. */
  onClearDetailEvent?: () => void;
}

/** Slide-out panel with AI-highlighted event list and navigation. */
export function MapControls({
  open,
  events,
  eventCount,
  highlightedEventIds,
  effectiveEventIds,
  aiResultsActive,
  activePreset,
  onPresetChange,
  onAskAbout,
  onShowEventOnMap,
  detailEventId,
  onClearDetailEvent,
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
    if (onShowEventOnMap) {
      onShowEventOnMap(event.id);
    } else if (map) {
      map.flyTo({
        center: event.coordinates,
        zoom: 17,
        pitch: 60,
        duration: 2000,
      });
    }
  }, [map, onShowEventOnMap]);

  const handleBackToList = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  // Show only AI-highlighted events
  const highlightedEvents = useMemo(() => {
    if (!highlightedEventIds?.length) return [];
    const idSet = new Set(highlightedEventIds);
    return events.filter((e) => idSet.has(e.id));
  }, [events, highlightedEventIds]);

  return (
    <>
      {/* Top-left header: Logo dropdown with glass pill */}
      <div
        className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-2xl px-2 py-1"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <EventsDropdown
          events={events}
          highlightedEventIds={highlightedEventIds}
          effectiveEventIds={effectiveEventIds}
          aiResultsActive={aiResultsActive}
          activePreset={activePreset}
          onPresetChange={onPresetChange}
          onAskAbout={onAskAbout}
          onShowOnMap={handleShowOnMap}
          detailEventId={detailEventId}
          onClearDetailEvent={onClearDetailEvent}
        />
      </div>

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
              width: "min(var(--panel-width), calc(100vw - 2rem))",
              maxHeight: "calc(100% - 140px)",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(var(--glass-blur))",
              WebkitBackdropFilter: "blur(var(--glass-blur))",
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
                  style={{ background: "var(--glass-bg)" }}
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
                  Quick Navigate
                </h3>
              </div>

              <div className="space-y-2">
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
                      <SelectValue placeholder="Jump to location" />
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--glass-bg)",
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

            {/* Event List — shows only highlighted events */}
            {highlightedEvents.length > 0 ? (
              <EventSidebar
                events={highlightedEvents}
                onEventClick={handleEventClick}
              />
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  Ask the AI to find events
                </p>
              </div>
            )}

            <Separator />

            {/* Event Count Footer */}
            <div
              className="px-4 py-3"
              style={{ borderColor: "var(--border-color)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {highlightedEvents.length > 0
                  ? `${highlightedEvents.length} events highlighted`
                  : `${eventCount} events available`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
