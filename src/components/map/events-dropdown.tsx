/**
 * @module components/map/events-dropdown
 * Popover-based events dropdown triggered by the brand logo. Provides search,
 * category filtering, a scrollable event list with staggered fade-in animation,
 * and an inline event detail panel. Adapted from the v0 prototype for the
 * project's {@link EventEntry} data model.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  MapPin,
  X,
  ChevronDown,
  Filter,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  EVENT_CATEGORIES,
  type EventCategory,
  type EventEntry,
} from "@/lib/registries/types";
import { CATEGORY_LABELS } from "@/lib/map/config";
import { EventDetailPanelDropdown } from "./event-detail-panel-dropdown";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * Props for {@link EventsDropdown}.
 */
export interface EventsDropdownProps {
  /** Array of events to display in the dropdown. */
  events: EventEntry[];
  /** Callback fired when the user asks the AI about a specific event. */
  onAskAbout?: (eventTitle: string) => void;
  /** Callback fired when the user requests to show an event on the map. */
  onShowOnMap?: (event: EventEntry) => void;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Formats an ISO date string into a short human-readable date.
 *
 * @param startDate - ISO 8601 date string.
 * @returns Formatted date like "Fri, Jun 20".
 */
function formatEventDate(startDate: string): string {
  const date = new Date(startDate);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats an ISO date string into a short human-readable time.
 *
 * @param startDate - ISO 8601 date string.
 * @returns Formatted time like "7:00 PM".
 */
function formatEventTime(startDate: string): string {
  const date = new Date(startDate);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Events dropdown popover anchored to the brand logo.
 *
 * Features:
 * - Search by event title or venue name
 * - Multi-select category filter via nested dropdown
 * - Scrollable event list with staggered fade-in animation
 * - Inline {@link EventDetailPanelDropdown} when an event is selected
 * - Dark/light mode brand logos
 * - Grain texture background overlay
 *
 * @param props - Component props.
 * @returns The rendered popover dropdown.
 *
 * @example
 * ```tsx
 * <EventsDropdown
 *   events={allEvents}
 *   onAskAbout={(title) => openChat(title)}
 *   onShowOnMap={(evt) => flyTo(evt.coordinates)}
 * />
 * ```
 */
export function EventsDropdown({
  events,
  onAskAbout,
  onShowOnMap,
}: EventsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    EventCategory[]
  >([]);
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);

  // ---- Category toggle ----

  const toggleCategory = useCallback((category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }, []);

  // ---- Filtered events ----

  const filteredEvents = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(lowerQuery) ||
        event.venue.toLowerCase().includes(lowerQuery);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.category);
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategories]);

  // ---- Handlers ----

  const handleEventClick = useCallback((event: EventEntry) => {
    setSelectedEvent(event);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedEvent(null);
    setSearchQuery("");
    setSelectedCategories([]);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleAskAbout = useCallback(
    (eventTitle: string) => {
      onAskAbout?.(eventTitle);
      handleClose();
    },
    [onAskAbout, handleClose],
  );

  const handleShowOnMap = useCallback(
    (event: EventEntry) => {
      onShowOnMap?.(event);
      handleClose();
    },
    [onShowOnMap, handleClose],
  );

  // ---- Render ----

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto rounded-lg p-0 pr-2 transition-all duration-200 hover:scale-105 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
          >
            <div className="relative">
              {/* Dark-mode logo */}
              <Image
                src="/moonshots-magic-logo-dark.svg"
                alt="Moonshots & Magic"
                width={160}
                height={48}
                className="hidden h-12 w-auto cursor-pointer transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:block"
                priority
              />
              {/* Light-mode logo (black + blue) */}
              <Image
                src="/moonshots-magic-logo-light-blue.svg"
                alt="Moonshots & Magic"
                width={160}
                height={48}
                className="block h-12 w-auto cursor-pointer transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:hidden"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Badge
                variant="secondary"
                className="border border-blue-500/30 bg-blue-600/80 px-2 py-0.5 text-xs font-medium text-white transition-colors hover:bg-blue-600/90 dark:bg-blue-500/70 dark:hover:bg-blue-500/80"
              >
                tap to view events
              </Badge>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="grain-texture w-[440px] border-border/40 bg-card/95 p-0 shadow-2xl backdrop-blur-xl"
          align="start"
          sideOffset={12}
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {selectedEvent ? (
            <div className="flex flex-col" style={{ maxHeight: "calc(100vh - 120px)" }}>
              <EventDetailPanelDropdown
                event={selectedEvent}
                onBack={handleBack}
                onClose={handleClose}
                onAskDitto={handleAskAbout}
                onShowMap={onShowOnMap ? handleShowOnMap : undefined}
              />
            </div>
          ) : (
            <div className="relative z-10 flex flex-col">
              {/* Header */}
              <div className="border-b border-border/40 px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-foreground">
                      Orlando Events
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Discover what&apos;s happening
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="-mt-1 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="border-b border-border/40 px-6 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border/50 bg-background/50 pl-9 pr-9 transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Category Filters */}
              <div className="border-b border-border/40 px-6 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-between border-border/50 bg-background/50 hover:bg-accent"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Filter className="h-3.5 w-3.5" />
                        {selectedCategories.length === 0
                          ? "All Categories"
                          : `${selectedCategories.length} selected`}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[380px] border-border/40 bg-card/95 backdrop-blur-xl"
                    align="start"
                  >
                    <div className="p-2">
                      <div className="mb-2 flex items-center justify-between px-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Filter by category
                        </span>
                        {selectedCategories.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategories([])}
                            className="h-6 px-2 text-xs text-primary hover:text-primary"
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      {EVENT_CATEGORIES.map((category) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(category);
                          }}
                          className={`cursor-pointer ${
                            selectedCategories.includes(category)
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          <div className="flex w-full items-center gap-2">
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                                selectedCategories.includes(category)
                                  ? "border-primary-foreground bg-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {selectedCategories.includes(category) && (
                                <Check className="h-3 w-3 text-primary" />
                              )}
                            </div>
                            <span className="flex-1">
                              {CATEGORY_LABELS[category]}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Events List */}
              <div className="max-h-[480px] overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/20" />
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      No events found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your filters or search
                    </p>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    {filteredEvents.map((event, index) => (
                      <button
                        type="button"
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className="group relative w-full overflow-hidden rounded-lg px-4 py-3 text-left transition-all duration-200 hover:bg-accent/50"
                        style={{
                          animation: `eventsDropdownFadeIn 0.3s ease-out ${index * 0.03}s both`,
                        }}
                      >
                        {/* Left accent bar on hover */}
                        <div className="absolute bottom-0 left-0 top-0 w-0 bg-primary/20 transition-all duration-200 group-hover:w-1" />

                        <div className="flex items-start justify-between gap-3 pl-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="mb-1.5 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                              {event.title}
                            </h3>
                            <div className="mb-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span>
                                  {formatEventDate(event.startDate)} &middot;{" "}
                                  {event.allDay
                                    ? "All Day"
                                    : formatEventTime(event.startDate)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="shrink-0 border-primary/20 bg-primary/10 text-xs text-primary"
                            >
                              {CATEGORY_LABELS[event.category]}
                            </Badge>
                            <Sparkles className="h-4 w-4 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredEvents.length > 0 && (
                <div className="border-t border-border/40 bg-secondary/30 px-6 py-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    {filteredEvents.length} of {events.length} events
                  </p>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <style jsx global>{`
        @keyframes eventsDropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
