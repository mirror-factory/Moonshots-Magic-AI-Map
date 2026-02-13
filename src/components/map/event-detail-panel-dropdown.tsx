/**
 * @module components/map/event-detail-panel-dropdown
 * Event detail panel designed for use inside a dropdown overlay.
 * Adapted from the v0 prototype's EventDetailPanel to work with
 * the project's {@link EventEntry} type and existing calendar infrastructure.
 * Provides back/close navigation, event metadata, and quick actions
 * (Ask Ditto, Show on Map, Add to Calendar, Share Event).
 */

"use client";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  Map,
  Share2,
  Navigation,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCalendarButton } from "@/components/calendar/add-to-calendar-button";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_LABELS } from "@/lib/map/config";
import type { EventEntry, EventSource } from "@/lib/registries/types";

/** Display labels for event source providers. */
const SOURCE_LABELS: Record<string, string> = {
  manual: "Curated",
  ticketmaster: "Ticketmaster",
  eventbrite: "Eventbrite",
  serpapi: "Google Events",
  scraper: "TKX",
  predicthq: "PredictHQ",
  overpass: "OpenStreetMap",
};

/** Resolves the source type string from an EventSource. */
function getSourceType(source: EventSource): string {
  return source.type;
}

/** Props for the {@link EventDetailPanelDropdown} component. */
export interface EventDetailPanelDropdownProps {
  /** The event to display in full detail. */
  event: EventEntry;
  /** Callback invoked when the user clicks the back button. */
  onBack: () => void;
  /** Callback invoked when the user clicks the close button. */
  onClose: () => void;
  /** Callback invoked when the user clicks "Ask Ditto", receives the event title. */
  onAskDitto: (eventTitle: string) => void;
  /** Optional callback to pan/zoom the map to the event location. */
  onShowMap?: (event: EventEntry) => void;
  /** Optional callback to get directions to the event. */
  onGetDirections?: (event: EventEntry) => void;
}

/**
 * Formats a date range for human-readable display.
 *
 * @param start - ISO 8601 start date string.
 * @param end - Optional ISO 8601 end date string.
 * @param allDay - Whether the event spans the full day.
 * @returns Formatted date string with optional time range.
 */
function formatDateRange(
  start: string,
  end?: string,
  allDay?: boolean,
): string {
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

/**
 * Event detail panel designed for dropdown/overlay contexts.
 * Displays full event information with back/close navigation
 * and quick actions including Ask Ditto, Show on Map,
 * Add to Calendar, and Share Event.
 *
 * @param props - Component props conforming to {@link EventDetailPanelDropdownProps}.
 * @returns The rendered event detail panel.
 */
export function EventDetailPanelDropdown({
  event,
  onBack,
  onClose,
  onAskDitto,
  onShowMap,
  onGetDirections,
}: EventDetailPanelDropdownProps) {
  const { toast } = useToast();

  const handleShare = () => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Event link copied to clipboard.",
    });
  };

  return (
    <div className="flex flex-col" style={{ height: 600, maxHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Hero Image */}
        {event.imageUrl ? (
          <div className="relative h-36 w-full overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge
              className="absolute bottom-3 left-4 text-xs"
              style={{
                background: "var(--brand-primary)",
                color: "#fff",
              }}
            >
              {CATEGORY_LABELS[event.category]}
            </Badge>
          </div>
        ) : (
          <div
            className="relative h-24 w-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(0, 99, 205, 0.25) 0%, rgba(53, 96, 255, 0.1) 50%, rgba(0, 99, 205, 0.2) 100%)",
            }}
          >
            <Sparkles className="h-8 w-8" style={{ color: "rgba(0, 99, 205, 0.35)" }} />
            <Badge
              className="absolute bottom-3 left-4 text-xs"
              style={{
                background: "var(--brand-primary)",
                color: "#fff",
              }}
            >
              {CATEGORY_LABELS[event.category]}
            </Badge>
          </div>
        )}

        {/* Event Header */}
        <div className="space-y-2 px-6">
          <h2
            className="font-oswald font-bold uppercase tracking-wide text-[14px] text-balance leading-tight"
            style={{ color: "var(--text)" }}
          >
            {event.title}
          </h2>
        </div>

        {/* Event Details */}
        <div className="space-y-3 text-sm px-6">
          <div className="flex items-start gap-3">
            <Calendar
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--text-muted)" }}
            />
            <div>
              <div className="font-medium" style={{ color: "var(--text)" }}>
                {formatDateRange(event.startDate, event.endDate, event.allDay)}
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                {event.timezone}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--text-muted)" }}
            />
            <div>
              <div className="font-medium" style={{ color: "var(--text)" }}>
                {event.venue}
              </div>
              <div style={{ color: "var(--text-dim)" }}>
                {event.address}, {event.city}
              </div>
            </div>
          </div>

          {/* Source Provider */}
          {SOURCE_LABELS[getSourceType(event.source)] && (
            <div className="flex items-center gap-3">
              <span
                className="h-5 w-5 flex-shrink-0 flex items-center justify-center text-[10px] font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                ↗
              </span>
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium hover:underline"
                  style={{ color: "#3B82F6" }}
                >
                  via {SOURCE_LABELS[getSourceType(event.source)]}
                </a>
              ) : (
                <div
                  className="text-xs font-medium"
                  style={{ color: "var(--text-dim)" }}
                >
                  via {SOURCE_LABELS[getSourceType(event.source)]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description — only when non-empty */}
        {event.description?.trim() && (
          <>
            <div className="px-6">
              <Separator />
            </div>
            <div className="space-y-2 px-6">
              <h3 className="oswald-h4 text-sm" style={{ color: "var(--text)" }}>
                About this event
              </h3>
              <p
                className="text-sm leading-relaxed overflow-y-auto"
                style={{ color: "var(--text-dim)", maxHeight: 120 }}
              >
                {event.description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions — inline icon row, pinned to bottom */}
      <div
        className="flex items-center gap-2 border-t px-6 py-3 shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <span
          className="text-xs font-semibold mr-auto"
          style={{ color: "var(--text-muted)" }}
        >
          Quick Actions
        </span>

        {/* Ask Ditto — highlighted */}
        <Button
          onClick={() => onAskDitto(`__EVENT__:${event.id}:${event.title}`)}
          size="icon"
          className="h-8 w-8"
          style={{
            background: "var(--brand-primary)",
            color: "var(--brand-primary-foreground)",
          }}
          title="Ask Ditto"
        >
          <Sparkles className="h-4 w-4" />
        </Button>

        {/* Show on Map */}
        {onShowMap && event.coordinates && (
          <Button
            onClick={() => onShowMap(event)}
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            title="Show on Map"
          >
            <Map className="h-4 w-4" />
          </Button>
        )}

        {/* Add to Calendar */}
        <AddToCalendarButton
          event={event}
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
        />

        {/* Share Event */}
        <Button
          onClick={handleShare}
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          title="Share Event"
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {/* Get Directions */}
        {onGetDirections && event.coordinates && (
          <Button
            onClick={() => onGetDirections(event)}
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            title="Get Directions"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
