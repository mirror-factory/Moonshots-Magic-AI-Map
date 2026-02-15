/**
 * @module components/map/event-detail
 * Full event detail view in the sidebar. Displays hero image, title,
 * date/time, venue, description, pricing, and action buttons.
 */

"use client";

import { ArrowLeft, Calendar, MapPin, ExternalLink, Tag, MessageCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/map/config";
import { AddToCalendarButton } from "@/components/calendar/add-to-calendar-button";
import type { EventEntry } from "@/lib/registries/types";

/** Brand primary blue color. */
const BRAND_BLUE = "#3560FF";

interface EventDetailProps {
  event: EventEntry;
  onBack: () => void;
  onShowOnMap: (event: EventEntry) => void;
  onAskAI?: (eventTitle: string) => void;
  onGetDirections?: (event: EventEntry) => void;
}

/**
 * Formats a date range for display.
 * @param start - Start date ISO string.
 * @param end - Optional end date ISO string.
 * @param allDay - Whether the event is all day.
 * @returns Formatted date string.
 */
function formatDateRange(start: string, end?: string, allDay?: boolean): string {
  const startDate = new Date(start);
  const dateStr = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (allDay) return dateStr;

  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (end) {
    const endDate = new Date(end);
    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} · ${startTime} - ${endTime}`;
  }

  return `${dateStr} · ${startTime}`;
}

/** Full event detail view in the sidebar. */
export function EventDetail({ event, onBack, onShowOnMap, onAskAI, onGetDirections }: EventDetailProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header with Back Button */}
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: "var(--text)" }}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
          Back to list
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Image */}
        {event.imageUrl ? (
          <div
            className="relative h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge
              className="absolute bottom-3 left-3 text-xs"
              style={{
                background: BRAND_BLUE,
                color: "#fff",
              }}
            >
              {CATEGORY_LABELS[event.category]}
            </Badge>
          </div>
        ) : (
          <div
            className="flex h-32 w-full items-center justify-center"
            style={{ background: "var(--surface-2)" }}
          >
            <Badge
              className="text-xs"
              style={{
                background: BRAND_BLUE,
                color: "#fff",
              }}
            >
              {CATEGORY_LABELS[event.category]}
            </Badge>
          </div>
        )}

        {/* Event Info */}
        <div className="space-y-4 p-4">
          {/* Title */}
          <h2
            className="oswald-h2 text-lg leading-tight"
            style={{ color: "var(--text)" }}
          >
            {event.title}
          </h2>

          {/* Date/Time */}
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--brand-primary)" }} />
            <div>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {formatDateRange(event.startDate, event.endDate, event.allDay)}
              </p>
              {/* timezone omitted — all events are Eastern */}
            </div>
          </div>

          {/* Venue & Address */}
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--brand-primary)" }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {event.venue}
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {event.address}, {event.city}
              </p>
            </div>
          </div>

          {/* Description */}
          <div
            className="rounded-lg p-3"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-dim)" }}
            >
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.slice(0, 6).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-dim)",
                  }}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons — single compact row */}
      <div
        className="flex items-center justify-center gap-2 border-t px-4 py-3"
        style={{ borderColor: "var(--border-color)" }}
      >
        {onAskAI && (
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            style={{
              background: "var(--brand-primary)",
              color: "var(--brand-primary-foreground)",
            }}
            onClick={() => onAskAI(`__EVENT__:${event.id}:${event.title}`)}
            title="Ask AI"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        )}
        <AddToCalendarButton event={event} size="icon" className="h-9 w-9 shrink-0" />
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onShowOnMap(event)}
          title="Show on Map"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        {onGetDirections && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => onGetDirections(event)}
            title="Get Directions"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        )}
        {event.url && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            asChild
          >
            <a href={event.url} target="_blank" rel="noopener noreferrer" title="More Info">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
