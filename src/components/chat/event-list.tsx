/**
 * @module components/chat/event-list
 * Renders a vertical list of {@link EventCard} components. Supports an
 * optional `ranked` mode that prefixes each card with a numbered badge.
 */

"use client";

import { EventCard, type EventCardEvent } from "./event-card";

interface EventListProps {
  events: EventCardEvent[];
  ranked?: boolean;
  /** Called when user taps "Show on Map" on a card. */
  onShowOnMap?: (coordinates: [number, number], title: string) => void;
  /** Called when user taps "Fly There" on a card. */
  onFlyTo?: (coordinates: [number, number], title: string) => void;
  /** Called when user taps "Directions" on a card. */
  onGetDirections?: (coordinates: [number, number], title: string) => void;
}

/** Vertical list of event cards, optionally numbered for ranked results. */
export function EventList({ events, ranked, onShowOnMap, onFlyTo, onGetDirections }: EventListProps) {
  if (!events.length) {
    return (
      <p className="text-xs" style={{ color: "var(--text-dim)" }}>
        No events found matching your criteria.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-2">
          {ranked && (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: "var(--brand-primary)",
                color: "var(--brand-primary-foreground)",
              }}
            >
              {idx + 1}
            </span>
          )}
          <div className="flex-1">
            <EventCard
              event={event}
              onShowOnMap={onShowOnMap}
              onFlyTo={onFlyTo}
              onGetDirections={onGetDirections}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
