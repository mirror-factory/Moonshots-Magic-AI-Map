/**
 * @module components/map/event-detail-panel-dropdown
 * Event detail panel designed for use inside a dropdown overlay.
 * Adapted from the v0 prototype's EventDetailPanel to work with
 * the project's {@link EventEntry} type and existing calendar infrastructure.
 * Provides back/close navigation, event metadata, and quick actions
 * (Ask AI, Show on Map, Add to Calendar, Share Event).
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
  /** Callback invoked when the user clicks "Ask AI", receives the event title. */
  onAskAI: (eventTitle: string) => void;
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
 * and quick actions including Ask AI, Show on Map,
 * Add to Calendar, and Share Event.
 *
 * @param props - Component props conforming to {@link EventDetailPanelDropdownProps}.
 * @returns The rendered event detail panel.
 */
export function EventDetailPanelDropdown({
  event,
  onBack,
  onClose,
  onAskAI,
  onShowMap,
  onGetDirections,
}: EventDetailPanelDropdownProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = `${event.title} — ${event.venue}, ${formatDateRange(event.startDate, event.endDate, event.allDay)}`;
    const shareUrl = event.url || window.location.href;

    // Use Web Share API on mobile when available
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Clipboard fallback
    const clipboardText = event.url
      ? `${shareText}\n${event.url}`
      : shareText;
    await navigator.clipboard.writeText(clipboardText);
    toast({
      title: "Copied!",
      description: "Event details copied to clipboard.",
    });
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col">
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
        {/* Hero Image with blurred backdrop, gradient, and title overlay */}
        {event.imageUrl ? (
          <div className="relative h-52 w-full overflow-hidden shrink-0">
            {/* Blurred background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "blur(4px)", transform: "scale(1.1)" }}
              loading="eager"
            />
            {/* Dark gradient overlay — darker at bottom */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)",
              }}
            />
            {/* Title + category overlaid at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
              <Badge
                className="mb-2 text-xs"
                style={{
                  background: "var(--brand-primary)",
                  color: "#fff",
                }}
              >
                {CATEGORY_LABELS[event.category]}
              </Badge>
              <h2
                className="font-oswald font-bold uppercase tracking-wide text-[16px] text-balance leading-tight"
                style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
              >
                {event.title}
              </h2>
            </div>
          </div>
        ) : (
          <div
            className="relative h-32 w-full flex items-end shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(0, 99, 205, 0.25) 0%, rgba(53, 96, 255, 0.1) 50%, rgba(0, 99, 205, 0.2) 100%)",
            }}
          >
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8" style={{ color: "rgba(0, 99, 205, 0.35)" }} />
            <div className="px-5 pb-4">
              <Badge
                className="mb-2 text-xs"
                style={{
                  background: "var(--brand-primary)",
                  color: "#fff",
                }}
              >
                {CATEGORY_LABELS[event.category]}
              </Badge>
              <h2
                className="font-oswald font-bold uppercase tracking-wide text-[16px] text-balance leading-tight"
                style={{ color: "var(--text)" }}
              >
                {event.title}
              </h2>
            </div>
          </div>
        )}

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

      {/* Quick Actions — single compact row of icon buttons */}
      <div
        className="flex items-center justify-center gap-2 border-t px-6 py-3 shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Button
          onClick={() => onAskAI(`__EVENT__:${event.id}:${event.title}`)}
          size="icon"
          className="h-9 w-9 shrink-0 text-white"
          style={{ background: "var(--brand-blue, #3B82F6)" }}
          title="Ask AI about this event"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        {onShowMap && event.coordinates && (
          <Button
            onClick={() => onShowMap(event)}
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 bg-transparent"
            title="Show on Map"
          >
            <Map className="h-4 w-4" />
          </Button>
        )}
        {onGetDirections && event.coordinates && (
          <Button
            onClick={() => onGetDirections(event)}
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 bg-transparent"
            title="Get Directions"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        )}
        <AddToCalendarButton event={event} size="icon" className="h-9 w-9 shrink-0" />
        <Button
          onClick={handleShare}
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 bg-transparent"
          title="Share Event"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
