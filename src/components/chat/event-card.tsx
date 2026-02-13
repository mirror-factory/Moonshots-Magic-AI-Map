/**
 * @module components/chat/event-card
 * Compact, fixed-height card displaying a single event's title,
 * venue, and date/time within the chat panel carousel.
 * Includes a "Learn More" button that triggers cinematic map view.
 */

"use client";

import { MapPin, Calendar } from "lucide-react";
import type { EventCategory } from "@/lib/registries/types";

/** Brand primary blue color. */
const BRAND_BLUE = "#3560FF";

/** Source label mapping for display. */
const SOURCE_LABELS: Record<string, string> = {
  manual: "Curated",
  ticketmaster: "Ticketmaster",
  eventbrite: "Eventbrite",
  serpapi: "Google Events",
  scraper: "TKX",
  predicthq: "PredictHQ",
  overpass: "OpenStreetMap",
};

/** Shape of an event passed to the card. */
export interface EventCardEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  city: string;
  startDate: string;
  coordinates?: [number, number];
  price?: { min: number; max: number; isFree: boolean };
  tags: string[];
  featured?: boolean;
  imageUrl?: string;
  url?: string;
  source?: { type: string } | string;
}

/** Props for {@link EventCard}. */
interface EventCardProps {
  event: EventCardEvent;
  /** Called when user taps "Show on Map" — cinematic fly + card + rotation. */
  onShowOnMap?: (coordinates: [number, number], title: string, eventId: string) => void;
  /** Called when user taps "Directions". */
  onGetDirections?: (coordinates: [number, number], title: string) => void;
  /** Called when user taps "Learn More" — opens event detail in dropdown. */
  onOpenDetail?: (eventId: string) => void;
}

/** Fixed-height event card for carousel display. */
export function EventCard({ event, onShowOnMap, onOpenDetail }: EventCardProps) {
  const date = new Date(event.startDate);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const sourceType = typeof event.source === "object" && event.source
    ? event.source.type
    : typeof event.source === "string" ? event.source : "";
  const sourceLabel = SOURCE_LABELS[sourceType] ?? "";

  /** Dark blurred background — event image or branded placeholder gradient. */
  const bgImage = event.imageUrl
    ? `url(${event.imageUrl})`
    : "linear-gradient(135deg, rgba(53, 96, 255, 0.25) 0%, rgba(0, 20, 60, 0.6) 50%, rgba(53, 96, 255, 0.15) 100%)";

  return (
    <div
      className="relative flex h-[160px] flex-col justify-between overflow-hidden rounded-xl border p-3"
      style={{
        borderColor: "var(--glass-border)",
      }}
    >
      {/* Background layer: image or gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: bgImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: event.imageUrl ? "grayscale(1) contrast(1.1) brightness(0.9) blur(4px)" : "none",
          transform: event.imageUrl ? "scale(1.15)" : undefined,
        }}
      />
      {/* Dark scrim for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: event.imageUrl
            ? "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)"
            : "rgba(10, 10, 15, 0.55)",
        }}
      />

      {/* Content (above bg) */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Title */}
        <h4
          className="oswald-h4 line-clamp-2 text-[10px] leading-tight"
          style={{ color: "#ffffff" }}
        >
          {event.title}
        </h4>

        {/* Details */}
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            <MapPin className="h-3 w-3 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} />
            <span className="truncate">{event.venue}</span>
            {sourceLabel && (
              event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-auto shrink-0 rounded px-1 py-0.5 text-[9px] font-medium hover:underline"
                  style={{ color: "#3B82F6" }}
                >
                  {sourceLabel}
                </a>
              ) : (
                <span
                  className="ml-auto shrink-0 rounded px-1 py-0.5 text-[9px] font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                >
                  {sourceLabel}
                </span>
              )
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Calendar className="h-3 w-3 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }} />
            <span>{dateStr} · {timeStr}</span>
          </div>
        </div>

        {/* Learn More button — opens detail + cinematic show-on-map */}
        {(onOpenDetail || onShowOnMap) && (
          <button
            onClick={() => {
              if (onOpenDetail) onOpenDetail(event.id);
              if (onShowOnMap && event.coordinates) {
                onShowOnMap(event.coordinates, event.title, event.id);
              }
            }}
            className="mt-2 w-full rounded-lg py-1.5 text-[11px] font-medium transition-colors hover:opacity-90"
            style={{
              background: BRAND_BLUE,
              color: "#ffffff",
            }}
          >
            Learn More
          </button>
        )}
      </div>
    </div>
  );
}
