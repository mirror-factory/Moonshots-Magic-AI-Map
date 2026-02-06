/**
 * @module components/map/event-list-item
 * Single event row in the sidebar list. Displays title, category badge,
 * date/time, and venue with click handler for detail view.
 */

"use client";

import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/map/config";
import type { EventEntry } from "@/lib/registries/types";

/** Brand primary blue color. */
const BRAND_BLUE = "#3560FF";

interface EventListItemProps {
  event: EventEntry;
  onClick: (event: EventEntry) => void;
}

/**
 * Formats an ISO date string for display.
 * @param dateStr - ISO 8601 date string.
 * @returns Formatted date string.
 */
function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats time from ISO date string.
 * @param dateStr - ISO 8601 date string.
 * @returns Formatted time string.
 */
function formatEventTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Single event row in the sidebar list. */
export function EventListItem({ event, onClick }: EventListItemProps) {
  return (
    <button
      onClick={() => onClick(event)}
      className="flex w-full flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
    >
      {/* Title and Category */}
      <div className="flex items-start justify-between gap-2">
        <h4
          className="line-clamp-2 text-sm font-medium leading-tight"
          style={{ color: "var(--text)" }}
        >
          {event.title}
        </h4>
        <Badge
          variant="secondary"
          className="shrink-0 text-[10px] px-1.5 py-0"
          style={{
            background: `${BRAND_BLUE}20`,
            color: BRAND_BLUE,
            border: `1px solid ${BRAND_BLUE}40`,
          }}
        >
          {CATEGORY_LABELS[event.category]}
        </Badge>
      </div>

      {/* Date and Venue */}
      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-dim)" }}>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatEventDate(event.startDate)}
          {!event.allDay && ` · ${formatEventTime(event.startDate)}`}
        </span>
        <span className="flex items-center gap-1 truncate">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </span>
      </div>
    </button>
  );
}
