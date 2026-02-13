/**
 * @module components/chat/event-card
 * Compact card displaying a single event's category badge, title,
 * description snippet, venue, date, and price within the chat panel.
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/map/config";
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
}

interface EventCardProps {
  event: EventCardEvent;
  /** Called when user taps "Show on Map". */
  onShowOnMap?: (coordinates: [number, number], title: string) => void;
  /** Called when user taps "Fly There". */
  onFlyTo?: (coordinates: [number, number], title: string) => void;
  /** Called when user taps "Directions". */
  onGetDirections?: (coordinates: [number, number], title: string) => void;
}

/** Compact card displaying a single event's details in the chat. */
export function EventCard({ event, onShowOnMap, onFlyTo, onGetDirections }: EventCardProps) {
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
      : "TBD";

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: "var(--surface-2)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Badge
          className="text-xs"
          style={{
            background: `${BRAND_BLUE}20`,
            color: BRAND_BLUE,
            border: `1px solid ${BRAND_BLUE}40`,
          }}
        >
          {CATEGORY_LABELS[event.category]}
        </Badge>
        {event.featured && (
          <Badge variant="outline" className="text-xs" style={{ color: "var(--brand-primary)", borderColor: "var(--brand-primary)" }}>
            Featured
          </Badge>
        )}
      </div>
      <h4 className="mb-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
        {event.title}
      </h4>
      <p className="mb-2 line-clamp-2 text-xs" style={{ color: "var(--text-dim)" }}>
        {event.description}
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{event.venue}</span>
        <span>{dateStr} {timeStr}</span>
        <span style={{ color: event.price?.isFree ? "var(--success)" : "var(--text-dim)" }}>
          {priceLabel}
        </span>
      </div>
      {hasCoords && (onShowOnMap || onFlyTo || onGetDirections) && (
        <div className="mt-2 flex gap-1.5 border-t pt-2" style={{ borderColor: "var(--border-color)" }}>
          {onShowOnMap && (
            <button
              onClick={() => onShowOnMap(event.coordinates!, event.title)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:opacity-80"
              style={{ background: "var(--surface-3, var(--surface-2))", color: "var(--text-dim)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Show on Map
            </button>
          )}
          {onFlyTo && (
            <button
              onClick={() => onFlyTo(event.coordinates!, event.title)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:opacity-80"
              style={{ background: "var(--surface-3, var(--surface-2))", color: "var(--text-dim)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Fly There
            </button>
          )}
          {onGetDirections && (
            <button
              onClick={() => onGetDirections(event.coordinates!, event.title)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:opacity-80"
              style={{ background: BRAND_BLUE, color: "#ffffff" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Directions
            </button>
          )}
        </div>
      )}
    </div>
  );
}
