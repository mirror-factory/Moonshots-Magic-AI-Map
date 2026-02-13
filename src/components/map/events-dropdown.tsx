/**
 * @module components/map/events-dropdown
 * Popover-based events dropdown triggered by the brand logo. Shows AI-highlighted
 * events when available, with search within results. Falls back to all events
 * when nothing is highlighted.
 */

"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  MapPin,
  X,
  ChevronDown,
  Sparkles,
  Filter,
  ExternalLink,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { EventEntry, EventCategory } from "@/lib/registries/types";
import { CATEGORY_LABELS } from "@/lib/map/config";
import { EventDetailPanelDropdown } from "./event-detail-panel-dropdown";
import { type DatePreset, DATE_PRESET_LABELS } from "@/lib/map/event-filters";

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

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * Props for {@link EventsDropdown}.
 */
export interface EventsDropdownProps {
  /** Array of all events. */
  events: EventEntry[];
  /** Event IDs currently highlighted by the AI chat. */
  highlightedEventIds?: string[];
  /** Effective event IDs currently shown on the map (AI or date filter). */
  effectiveEventIds?: string[];
  /** Whether AI results are overriding the date filter. */
  aiResultsActive?: boolean;
  /** Active date preset when not overridden by AI. */
  activePreset?: DatePreset;
  /** Callback when user changes the date filter preset. */
  onPresetChange?: (preset: DatePreset) => void;
  /** Callback fired when the user asks the AI about a specific event. */
  onAskAbout?: (eventTitle: string) => void;
  /** Callback fired when the user requests to show an event on the map. */
  onShowOnMap?: (event: EventEntry) => void;
  /** Event ID to auto-open in the detail view (from map popup "More Detail"). */
  detailEventId?: string | null;
  /** Clears the externally-set detail event ID. */
  onClearDetailEvent?: () => void;
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
// Virtualized list
// ---------------------------------------------------------------------------

/** Height of each event row in pixels. */
const ROW_HEIGHT = 76;
/** Extra rows to render above/below the visible area. */
const OVERSCAN = 5;
/** Max visible height of the scrollable list. */
const LIST_HEIGHT = 480;

/** Props for {@link VirtualEventList}. */
interface VirtualEventListProps {
  events: EventEntry[];
  searchQuery: string;
  onEventClick: (event: EventEntry) => void;
  onShowOnMap?: (event: EventEntry) => void;
}

/**
 * Renders a virtualized list of event rows. Only mounts DOM nodes
 * for items in or near the visible scroll window.
 *
 * @param props - Component props.
 * @returns The rendered virtualized event list.
 */
function VirtualEventList({ events, searchQuery, onEventClick, onShowOnMap }: VirtualEventListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Key for remounting the scroll container when the list changes (resets scroll)
  const listKey = useMemo(
    () => `${events.length}-${events[0]?.id ?? "empty"}`,
    [events],
  );

  if (events.length === 0) {
    return (
      <div className="max-h-[480px] overflow-y-auto px-6 py-16 text-center">
        {searchQuery ? (
          <>
            <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground/20" />
            <p className="mb-1 text-sm font-medium text-muted-foreground">No matching events</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search</p>
          </>
        ) : (
          <>
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground/20" />
            <p className="mb-1 text-sm font-medium text-muted-foreground">No events for this period</p>
            <p className="text-xs text-muted-foreground">Try a different filter or ask the AI</p>
          </>
        )}
      </div>
    );
  }

  const totalHeight = events.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(LIST_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;
  const endIndex = Math.min(events.length, startIndex + visibleCount);

  return (
    <div
      key={listKey}
      ref={scrollRef}
      className="overflow-y-auto"
      style={{ maxHeight: LIST_HEIGHT }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
    >
      <div className="relative px-3 py-2" style={{ height: totalHeight }}>
        {events.slice(startIndex, endIndex).map((event, i) => {
          const index = startIndex + i;
          return (
            <button
              type="button"
              key={event.id}
              onClick={() => onEventClick(event)}
              className="group absolute left-3 right-3 overflow-hidden rounded-lg px-4 py-3 text-left transition-colors duration-150 hover:bg-accent/50"
              style={{ top: index * ROW_HEIGHT, height: ROW_HEIGHT }}
            >
              <div className="absolute bottom-0 left-0 top-0 w-0 bg-primary/20 transition-all duration-200 group-hover:w-1" />
              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1.5 line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>
                  <div className="mb-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>
                        {formatEventDate(event.startDate)} &middot;{" "}
                        {event.allDay ? "All Day" : formatEventTime(event.startDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="shrink-0 border-primary/20 bg-primary/10 text-xs text-primary"
                  >
                    {CATEGORY_LABELS[event.category]}
                  </Badge>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-all hover:bg-primary/10 group-hover:opacity-100"
                      title="Visit site"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-primary" />
                    </a>
                  )}
                  {onShowOnMap && event.coordinates && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); onShowOnMap(event); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onShowOnMap(event); } }}
                      className="flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-all hover:bg-primary/10 group-hover:opacity-100"
                      title="Show on map"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Events dropdown popover anchored to the brand logo.
 *
 * Shows AI-highlighted events when available (query-driven), with search
 * within results. Falls back to all events when nothing is highlighted.
 *
 * @param props - Component props.
 * @returns The rendered popover dropdown.
 */
export function EventsDropdown({
  events,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  highlightedEventIds,
  effectiveEventIds,
  aiResultsActive,
  activePreset,
  onPresetChange,
  onAskAbout,
  onShowOnMap,
  detailEventId,
  onClearDetailEvent,
}: EventsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [sourceFilterOpen, setSourceFilterOpen] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState<Set<string>>(new Set());
  const [venueFilterOpen, setVenueFilterOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const hasEffective = (effectiveEventIds?.length ?? 0) > 0;

  // Base event list: effective (AI or date-filtered) events, otherwise all
  const baseEvents = useMemo(() => {
    if (!hasEffective) return events;
    const idSet = new Set(effectiveEventIds);
    return events.filter((e) => idSet.has(e.id));
  }, [events, effectiveEventIds, hasEffective]);

  // Apply search + category + date range filters on top of base events
  const filteredEvents = useMemo(() => {
    let filtered = baseEvents;

    // Category filter (multi-select)
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((e) => selectedCategories.has(e.category));
    }

    // Source/provider filter (multi-select)
    if (selectedSources.size > 0) {
      filtered = filtered.filter((e) => selectedSources.has(e.source.type));
    }

    // Venue filter (multi-select)
    if (selectedVenues.size > 0) {
      filtered = filtered.filter((e) => selectedVenues.has(e.venue));
    }

    // Custom date range filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter((e) => new Date(e.startDate) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => new Date(e.startDate) <= to);
    }

    // Text search filter
    const lowerQuery = searchQuery.toLowerCase();
    if (lowerQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerQuery) ||
          event.venue.toLowerCase().includes(lowerQuery),
      );
    }

    return filtered;
  }, [baseEvents, searchQuery, selectedCategories, selectedSources, selectedVenues, dateFrom, dateTo]);

  const activeFilterCount =
    selectedCategories.size + selectedSources.size + selectedVenues.size + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  /** Available categories derived from the base events. */
  const availableCategories = useMemo(() => {
    const counts = new Map<EventCategory, number>();
    for (const e of baseEvents) {
      counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ category: cat, count }));
  }, [baseEvents]);

  /** Available source providers derived from the base events. */
  const availableSources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of baseEvents) {
      counts.set(e.source.type, (counts.get(e.source.type) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => ({ source, count }));
  }, [baseEvents]);

  /** Available venues derived from the base events. */
  const availableVenues = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of baseEvents) {
      counts.set(e.venue, (counts.get(e.venue) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([venue, count]) => ({ venue, count }));
  }, [baseEvents]);

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
    setSelectedCategories(new Set());
    setSelectedSources(new Set());
    setSelectedVenues(new Set());
    setDateFrom("");
    setDateTo("");
    setShowFilters(false);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategories(new Set());
    setSelectedSources(new Set());
    setSelectedVenues(new Set());
    setDateFrom("");
    setDateTo("");
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

  // Auto-open when detailEventId is set externally (e.g. from map popup "More Detail").
  // Uses the React-approved "previous value state" pattern to adjust state when props change.
  const [prevDetailEventId, setPrevDetailEventId] = useState<string | null>(null);
  if (detailEventId !== prevDetailEventId) {
    setPrevDetailEventId(detailEventId ?? null);
    if (detailEventId) {
      const match = events.find((e) => e.id === detailEventId);
      if (match) {
        setOpen(true);
        setSelectedEvent(match);
      }
      onClearDetailEvent?.();
    }
  }

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
                src="/moonshots-magic-logo-light.svg"
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
                {aiResultsActive
                  ? `${effectiveEventIds?.length ?? 0} results`
                  : hasEffective
                    ? `${effectiveEventIds?.length ?? 0} events`
                    : "tap to view events"}
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
                      {aiResultsActive
                        ? "Search Results"
                        : activePreset === "today"
                          ? "Today's Events"
                          : activePreset === "weekend"
                            ? "Weekend Events"
                            : activePreset === "week"
                              ? "This Week's Events"
                              : activePreset === "month"
                                ? "This Month's Events"
                                : "All Events"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {aiResultsActive
                        ? `${effectiveEventIds?.length ?? 0} events found`
                        : hasEffective
                          ? `${effectiveEventIds?.length ?? 0} events`
                          : "No events for this filter"}
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

              {/* Date filter chips */}
              {onPresetChange && !aiResultsActive && (
                <div className="flex items-center gap-1.5 border-b border-border/40 px-6 py-3">
                  {(["all", "today", "weekend", "week", "month"] as DatePreset[]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => onPresetChange(preset)}
                      className="rounded-full px-3 py-1 text-xs font-medium transition-all hover:opacity-80"
                      style={{
                        background: activePreset === preset ? "hsl(var(--primary))" : "transparent",
                        color: activePreset === preset ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                        border: activePreset === preset ? "1px solid transparent" : "1px solid hsl(var(--border) / 0.5)",
                      }}
                    >
                      {DATE_PRESET_LABELS[preset]}
                    </button>
                  ))}
                </div>
              )}

              {/* Search + filter toggle */}
              <div className="border-b border-border/40 px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={aiResultsActive ? "Filter results..." : "Search events..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 border-border/50 bg-background/50 pl-9 pr-9 text-sm transition-all focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
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
                  <Button
                    variant={showFilters ? "secondary" : "ghost"}
                    size="icon"
                    className="relative h-9 w-9 shrink-0"
                    onClick={() => setShowFilters((v) => !v)}
                    aria-label="Toggle filters"
                  >
                    <Filter className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Expandable filter panel */}
              {showFilters && (
                <div className="space-y-3 border-b border-border/40 px-6 py-3">
                  {/* Category multi-select dropdown */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Category</span>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-xs text-primary hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <Popover open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between gap-2 bg-background/50 text-xs"
                        >
                          {selectedCategories.size > 0
                            ? `${selectedCategories.size} selected`
                            : "All categories"}
                          <ChevronDown className={`h-3 w-3 transition-transform ${categoryFilterOpen ? "rotate-180" : ""}`} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-1" align="start" sideOffset={4}>
                        <div className="max-h-56 overflow-y-auto">
                          {availableCategories.map(({ category, count }) => {
                            const isSelected = selectedCategories.has(category);
                            return (
                              <button
                                key={category}
                                onClick={() => {
                                  setSelectedCategories((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(category)) next.delete(category);
                                    else next.add(category);
                                    return next;
                                  });
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-accent/50"
                              >
                                <span
                                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                                  style={{
                                    background: isSelected ? "hsl(var(--primary))" : "transparent",
                                    borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))",
                                  }}
                                >
                                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                </span>
                                <span className="flex-1 font-medium" style={{ color: "hsl(var(--foreground))" }}>
                                  {CATEGORY_LABELS[category]}
                                </span>
                                <span className="text-muted-foreground">{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Source/provider multi-select dropdown */}
                  {availableSources.length > 1 && (
                    <div>
                      <span className="mb-2 block text-xs font-medium text-muted-foreground">Source</span>
                      <Popover open={sourceFilterOpen} onOpenChange={setSourceFilterOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between gap-2 bg-background/50 text-xs"
                          >
                            {selectedSources.size > 0
                              ? `${selectedSources.size} selected`
                              : "All sources"}
                            <ChevronDown className={`h-3 w-3 transition-transform ${sourceFilterOpen ? "rotate-180" : ""}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[240px] p-1" align="start" sideOffset={4}>
                          <div className="max-h-48 overflow-y-auto">
                            {availableSources.map(({ source, count }) => {
                              const isSelected = selectedSources.has(source);
                              return (
                                <button
                                  key={source}
                                  onClick={() => {
                                    setSelectedSources((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(source)) next.delete(source);
                                      else next.add(source);
                                      return next;
                                    });
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-accent/50"
                                >
                                  <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                                    style={{
                                      background: isSelected ? "hsl(var(--primary))" : "transparent",
                                      borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))",
                                    }}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                  </span>
                                  <span className="flex-1 font-medium" style={{ color: "hsl(var(--foreground))" }}>
                                    {SOURCE_LABELS[source] ?? source}
                                  </span>
                                  <span className="text-muted-foreground">{count}</span>
                                </button>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {/* Venue multi-select dropdown */}
                  {availableVenues.length > 1 && (
                    <div>
                      <span className="mb-2 block text-xs font-medium text-muted-foreground">Venue</span>
                      <Popover open={venueFilterOpen} onOpenChange={setVenueFilterOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between gap-2 bg-background/50 text-xs"
                          >
                            {selectedVenues.size > 0
                              ? `${selectedVenues.size} selected`
                              : "All venues"}
                            <ChevronDown className={`h-3 w-3 transition-transform ${venueFilterOpen ? "rotate-180" : ""}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-1" align="start" sideOffset={4}>
                          <div className="max-h-56 overflow-y-auto">
                            {availableVenues.map(({ venue, count }) => {
                              const isSelected = selectedVenues.has(venue);
                              return (
                                <button
                                  key={venue}
                                  onClick={() => {
                                    setSelectedVenues((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(venue)) next.delete(venue);
                                      else next.add(venue);
                                      return next;
                                    });
                                  }}
                                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-accent/50"
                                >
                                  <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                                    style={{
                                      background: isSelected ? "hsl(var(--primary))" : "transparent",
                                      borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))",
                                    }}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                  </span>
                                  <span className="flex-1 truncate font-medium" style={{ color: "hsl(var(--foreground))" }}>
                                    {venue}
                                  </span>
                                  <span className="text-muted-foreground">{count}</span>
                                </button>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {/* Custom date range */}
                  <div>
                    <span className="mb-2 block text-xs font-medium text-muted-foreground">
                      Custom Date Range
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="h-8 flex-1 rounded-md border border-border/50 bg-background/50 px-2 text-xs text-foreground"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="h-8 flex-1 rounded-md border border-border/50 bg-background/50 px-2 text-xs text-foreground"
                      />
                      {(dateFrom || dateTo) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => { setDateFrom(""); setDateTo(""); }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Events List (virtualized) */}
              <VirtualEventList
                events={filteredEvents}
                searchQuery={searchQuery}
                onEventClick={handleEventClick}
                onShowOnMap={onShowOnMap ? handleShowOnMap : undefined}
              />

              {/* Footer */}
              {filteredEvents.length > 0 && (
                <div className="border-t border-border/40 bg-secondary/30 px-6 py-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    {filteredEvents.length} of {baseEvents.length} events
                  </p>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

    </>
  );
}
