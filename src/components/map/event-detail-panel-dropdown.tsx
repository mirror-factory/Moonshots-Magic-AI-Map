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
  ExternalLink,
  MapPin,
  Sparkles,
  Map,
  Share2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCalendarButton } from "@/components/calendar/add-to-calendar-button";
import { useToast } from "@/hooks/use-toast";
import { CATEGORY_LABELS } from "@/lib/map/config";
import type { EventEntry } from "@/lib/registries/types";

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
 * Formats price information into a display string.
 *
 * @param price - Price object from an {@link EventEntry}.
 * @returns Human-readable price string (e.g. "Free", "$25", "$10 - $50").
 */
function formatPrice(price: EventEntry["price"]): string {
  if (!price || price.isFree) return "Free";
  if (price.min === price.max) return `$${price.min}`;
  return `$${price.min} - $${price.max}`;
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
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b"
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
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Hero Image */}
        {event.imageUrl && (
          <div
            className="relative h-44 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          >
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
        )}

        {/* Event Header */}
        <div className="space-y-3 px-6">
          {!event.imageUrl && (
            <Badge
              variant="outline"
              style={{
                background:
                  "color-mix(in srgb, var(--brand-primary) 10%, transparent)",
                color: "var(--brand-primary)",
                borderColor:
                  "color-mix(in srgb, var(--brand-primary) 20%, transparent)",
              }}
            >
              {CATEGORY_LABELS[event.category]}
            </Badge>
          )}
          <h2
            className="text-2xl font-bold text-balance leading-tight"
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

          {/* Price */}
          {event.price && (
            <div className="flex items-center gap-3">
              <span
                className="h-5 w-5 flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                $
              </span>
              <div className="font-medium" style={{ color: "var(--text)" }}>
                {formatPrice(event.price)}
              </div>
            </div>
          )}
        </div>

        <div className="px-6">
          <Separator />
        </div>

        {/* Description */}
        <div className="space-y-2 px-6">
          <h3 className="font-semibold" style={{ color: "var(--text)" }}>
            About this event
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-dim)" }}
          >
            {event.description}
          </p>
        </div>

        <div className="px-6">
          <Separator />
        </div>

        {/* Quick Actions — 2x2 grid */}
        <div className="space-y-3 px-6 pb-6">
          <h3
            className="font-semibold text-sm"
            style={{ color: "var(--text)" }}
          >
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {/* Ask Ditto */}
            <Button
              onClick={() => onAskDitto(`__EVENT__:${event.id}:${event.title}`)}
              className="h-auto flex-col gap-1 py-2.5 text-xs"
              style={{
                background: "var(--brand-primary)",
                color: "var(--brand-primary-foreground)",
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Ask Ditto</span>
            </Button>

            {/* Show on Map */}
            {onShowMap && event.coordinates ? (
              <Button
                onClick={() => onShowMap(event)}
                variant="outline"
                className="h-auto flex-col gap-1 bg-transparent py-2.5 text-xs"
              >
                <Map className="h-4 w-4" />
                <span className="font-medium">Show on Map</span>
              </Button>
            ) : (
              <div />
            )}

            {/* Add to Calendar */}
            <div className="[&>*]:w-full [&_button]:h-auto [&_button]:flex-col [&_button]:gap-1 [&_button]:py-2.5 [&_button]:text-xs">
              <AddToCalendarButton
                event={event}
                variant="outline"
                size="default"
              />
            </div>

            {/* Share Event */}
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-auto flex-col gap-1 bg-transparent py-2.5 text-xs"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium">Share Event</span>
            </Button>

            {/* Visit Site */}
            {event.url && (
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col gap-1 bg-transparent py-2.5 text-xs"
              >
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="font-medium">Visit Site</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
