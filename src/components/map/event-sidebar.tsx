/**
 * @module components/map/event-sidebar
 * Scrollable event list component for the sidebar. Displays filtered events
 * with search and sorting capabilities.
 */

"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { EventEntry } from "@/lib/registries/types";
import { EventListItem } from "./event-list-item";

interface EventSidebarProps {
  events: EventEntry[];
  onEventClick: (event: EventEntry) => void;
}

/** Scrollable event list with search. */
export function EventSidebar({
  events,
  onEventClick,
}: EventSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.venue.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sort by date (soonest first)
    result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return result;
  }, [events, searchQuery]);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Search Input */}
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>

      {/* Event List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              {searchQuery ? "No events match your search" : "No events to show"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs underline"
                style={{ color: "var(--brand-primary)" }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1 pb-2">
            {filteredEvents.map((event) => (
              <EventListItem
                key={event.id}
                event={event}
                onClick={onEventClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
