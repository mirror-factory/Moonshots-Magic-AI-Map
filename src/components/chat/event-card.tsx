/**
 * @module components/chat/event-card
 * Compact card displaying a single event's category badge, title,
 * description snippet, venue, date, and price within the chat panel.
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/map/config";
import type { EventCategory } from "@/lib/registries/types";

interface EventCardEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  city: string;
  startDate: string;
  price?: { min: number; max: number; isFree: boolean };
  tags: string[];
  featured?: boolean;
}

interface EventCardProps {
  event: EventCardEvent;
}

export function EventCard({ event }: EventCardProps) {
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
            background: CATEGORY_COLORS[event.category],
            color: "#000",
            borderColor: "transparent",
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
    </div>
  );
}
