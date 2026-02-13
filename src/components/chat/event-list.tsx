/**
 * @module components/chat/event-list
 * Renders a horizontal carousel of {@link EventCard} components with
 * arrow navigation and event count indicator. Supports an optional
 * `ranked` mode that prefixes each card with a numbered badge.
 */

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard, type EventCardEvent } from "./event-card";

/** Props for {@link EventList}. */
interface EventListProps {
  events: EventCardEvent[];
  ranked?: boolean;
  /** Called when user taps "Show on Map" on a card. */
  onShowOnMap?: (coordinates: [number, number], title: string, eventId: string) => void;
  /** Called when user taps "Directions" on a card. */
  onGetDirections?: (coordinates: [number, number], title: string) => void;
  /** Called when user taps "Learn More" — opens event detail in dropdown. */
  onOpenDetail?: (eventId: string) => void;
}

/** Horizontal carousel of event cards with arrows and count indicator. */
export function EventList({ events, ranked, onShowOnMap, onGetDirections, onOpenDetail }: EventListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /** Recalculate whether arrows should be visible based on scroll position. */
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, events]);

  /** Scroll the carousel by one card width. */
  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 280;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  if (!events.length) {
    return (
      <p className="text-xs" style={{ color: "var(--text-dim)" }}>
        No events found matching your criteria.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Count indicator */}
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
          {events.length} event{events.length !== 1 ? "s" : ""}
        </span>
        {(canScrollLeft || canScrollRight) && (
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            — swipe to see more
          </span>
        )}
      </div>

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--glass-bg, rgba(0,0,0,0.6))", border: "1px solid var(--glass-border, rgba(255,255,255,0.1))" }}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
        </button>
      )}
      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--glass-bg, rgba(0,0,0,0.6))", border: "1px solid var(--glass-border, rgba(255,255,255,0.1))" }}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
        </button>
      )}

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
        {events.map((event, idx) => (
          <div key={event.id} className="w-[260px] shrink-0">
            {ranked && (
              <span
                className="mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: "var(--brand-primary)",
                  color: "var(--brand-primary-foreground)",
                }}
              >
                {idx + 1}
              </span>
            )}
            <EventCard
              event={event}
              onShowOnMap={onShowOnMap}
              onGetDirections={onGetDirections}
              onOpenDetail={onOpenDetail}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
