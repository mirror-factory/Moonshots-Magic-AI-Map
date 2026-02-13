/**
 * @module components/chat/event-card
 * Compact, fixed-height card displaying a single event's title,
 * venue, date/time, and price within the chat panel carousel.
 * Includes a "Learn More" button that triggers cinematic map view.
 */

"use client";

import { MapPin, Calendar, Tag } from "lucide-react";
import type { EventCategory } from "@/lib/registries/types";

/** Brand primary blue color. */
const BRAND_BLUE = "#3560FF";

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
}

/** Props for {@link EventCard}. */
interface EventCardProps {
  event: EventCardEvent;
  /** Called when user taps "Show on Map" — cinematic fly + card + rotation. */
  onShowOnMap?: (coordinates: [number, number], title: string, eventId: string) => void;
  /** Called when user taps "Directions". */
  onGetDirections?: (coordinates: [number, number], title: string) => void;
}

/** Fixed-height event card for carousel display. */
export function EventCard({ event, onShowOnMap }: EventCardProps) {
  const hasCoords = !!event.coordinates;
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

  const priceLabel = event.price?.isFree
    ? "Free"
    : event.price
      ? `$${event.price.min}${event.price.max > event.price.min ? `–$${event.price.max}` : ""}`
      : "";

  return (
    <div
      className="flex h-[160px] flex-col justify-between rounded-xl border p-3"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Title */}
      <h4
        className="line-clamp-2 text-sm font-semibold leading-tight"
        style={{ color: "var(--text)" }}
      >
        {event.title}
      </h4>

      {/* Details */}
      <div className="mt-1.5 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
          <MapPin className="h-3 w-3 shrink-0" style={{ color: "var(--text-muted)" }} />
          <span className="truncate">{event.venue}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
          <Calendar className="h-3 w-3 shrink-0" style={{ color: "var(--text-muted)" }} />
          <span>{dateStr} · {timeStr}</span>
        </div>
        {priceLabel && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <Tag className="h-3 w-3 shrink-0" style={{ color: "var(--text-muted)" }} />
            <span style={{ color: event.price?.isFree ? "#00D4AA" : "var(--text-dim)" }}>
              {priceLabel}
            </span>
          </div>
        )}
      </div>

      {/* Learn More button */}
      {hasCoords && onShowOnMap && (
        <button
          onClick={() => onShowOnMap(event.coordinates!, event.title, event.id)}
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
  );
}
