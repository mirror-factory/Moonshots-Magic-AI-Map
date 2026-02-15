/**
 * @module components/map/map-search-bar
 * Geocoding search bar with autocomplete for the map.
 * Uses MapTiler Geocoding API to search places and fly the map to results.
 * Selecting a result shows a golden highlight orb + place card on the map.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  X,
  MapPin,
  Building2,
  TreePine,
  Navigation,
  Route,
} from "lucide-react";
import { useMap } from "./use-map";
import { geocodeForward, searchLocalVenues, type GeocodingResult, type LocalVenue } from "@/lib/map/geocoding";
import { flyToPoint } from "@/lib/map/camera-utils";
import {
  selectEventHighlight,
  deselectEventHighlight,
} from "@/lib/map/venue-highlight";

/** Debounce delay for search input (ms). */
const DEBOUNCE_MS = 300;

/** Props for {@link MapSearchBar}. */
export interface MapSearchBarProps {
  /** Callback to request directions to a coordinate [lng, lat]. */
  onGetDirections?: (coordinate: [number, number]) => void;
  /** When true, search bar takes full available width instead of 200→260px. */
  fullWidth?: boolean;
  /** Local venues for instant search before API results. */
  localVenues?: LocalVenue[];
  /** Called after directions are requested (e.g. to close the search tab). */
  onDirectionsRequested?: () => void;
}

/** Icon for each place type. */
function placeTypeIcon(type: string) {
  switch (type) {
    case "poi":
      return <MapPin className="h-3.5 w-3.5 flex-shrink-0" />;
    case "address":
    case "place":
      return <Building2 className="h-3.5 w-3.5 flex-shrink-0" />;
    case "region":
    case "country":
      return <Navigation className="h-3.5 w-3.5 flex-shrink-0" />;
    default:
      return <TreePine className="h-3.5 w-3.5 flex-shrink-0" />;
  }
}

/** Search bar with autocomplete dropdown, selected place card, and golden highlight. */
export function MapSearchBar({ onGetDirections, fullWidth = false, localVenues, onDirectionsRequested }: MapSearchBarProps) {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<GeocodingResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  /** When true, unmount cleanup skips removing the highlight (directions keep it). */
  const keepHighlightRef = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up highlight on unmount — skip if directions are keeping it
  useEffect(() => {
    return () => {
      if (map && !keepHighlightRef.current) deselectEventHighlight(map);
    };
  }, [map]);

  const doSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Instant local venue results (no network, no loading spinner)
    const localHits = localVenues ? searchLocalVenues(text, localVenues, 5) : [];
    if (localHits.length > 0) {
      setResults(localHits);
      setIsOpen(true);
    }

    setLoading(true);

    try {
      // Get map center for proximity bias
      const proximity = map ? [map.getCenter().lng, map.getCenter().lat] as [number, number] : undefined;

      const apiHits = await geocodeForward(text, {
        proximity,
        limit: 8,
        types: ["poi", "address", "place", "locality", "neighbourhood", "municipality"],
      });

      // Merge: local venues first, then API results (deduplicate by name)
      const localNames = new Set(localHits.map((h) => h.text.toLowerCase()));
      const dedupedApi = apiHits.filter((h) => !localNames.has(h.text.toLowerCase()));
      const merged = [...localHits, ...dedupedApi].slice(0, 10);

      setResults(merged);
      setIsOpen(merged.length > 0);
    } catch (err) {
      console.warn("[Search] Error:", err);
      // Keep local results if API fails
      if (localHits.length === 0) {
        setResults([]);
        setIsOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }, [map, localVenues]);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    // Clear selected place when typing new query
    if (selected) {
      setSelected(null);
      if (map) deselectEventHighlight(map);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      doSearch(value);
    }, DEBOUNCE_MS);
  }, [doSearch, selected, map]);

  const handleSelect = useCallback((result: GeocodingResult) => {
    setQuery(result.text);
    setIsOpen(false);
    setResults([]);
    setSelected(result);

    if (map) {
      // Golden highlight orb + text-only place card
      selectEventHighlight(map, result.center, undefined, {
        title: result.text,
        venue: result.placeName || "",
        date: "",
        source: "",
      });
      void flyToPoint(map, result.center, {
        zoom: result.placeType === "poi" ? 16 : 14,
        pitch: 50,
        duration: 1500,
      });
    }
  }, [map]);

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelected(null);
    if (map) deselectEventHighlight(map);
    inputRef.current?.focus();
  }, [map]);

  const handleDirections = useCallback(() => {
    if (selected && onGetDirections) {
      // Prevent unmount cleanup from removing the highlight
      keepHighlightRef.current = true;
      onGetDirections(selected.center);
      // Clear search bar state but keep the highlight card on the map
      setQuery("");
      setResults([]);
      setIsOpen(false);
      setSelected(null);
      onDirectionsRequested?.();
    }
  }, [selected, onGetDirections, onDirectionsRequested]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  return (
    <div ref={containerRef} className="relative z-20">
      {/* Search input */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
        style={{
          background: focused
            ? "rgba(10, 10, 15, 0.85)"
            : "rgba(10, 10, 15, 0.6)",
          border: focused
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: focused ? "0 0 20px rgba(0, 0, 0, 0.3)" : "none",
          width: fullWidth ? "100%" : focused || query ? "260px" : "200px",
        }}
      >
        <Search className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--text-dim)" }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search places..."
          className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/30"
          autoComplete="off"
        />
        {loading && (
          <div
            className="h-3 w-3 animate-spin rounded-full border border-transparent border-t-blue-400"
          />
        )}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="rounded p-0.5 transition-colors hover:bg-white/10"
          >
            <X className="h-3 w-3" style={{ color: "var(--text-dim)" }} />
          </button>
        )}
      </div>

      {/* Results dropdown (scrollable) */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full mt-1 overflow-y-auto rounded-xl py-1"
          style={{
            maxHeight: 320,
            background: "rgba(10, 10, 15, 0.88)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {results.map((result) => (
            <button
              key={result.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(result)}
              className="flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/5"
            >
              <span className="mt-0.5" style={{ color: "var(--brand-primary)" }}>
                {placeTypeIcon(result.placeType)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">
                  {result.text}
                </p>
                <p className="truncate text-[10px]" style={{ color: "var(--text-dim)" }}>
                  {result.placeName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected place card — shows pin info + directions button */}
      {selected && !isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(10, 10, 15, 0.88)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="mb-2 flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--brand-primary)" }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {selected.text}
              </p>
              <p className="truncate text-[10px]" style={{ color: "var(--text-dim)" }}>
                {selected.placeName}
              </p>
            </div>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="rounded p-0.5 transition-colors hover:bg-white/10"
            >
              <X className="h-3 w-3" style={{ color: "var(--text-dim)" }} />
            </button>
          </div>
          {onGetDirections && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleDirections}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors hover:opacity-90"
              style={{
                background: "var(--brand-primary)",
                color: "#fff",
              }}
            >
              <Route className="h-3.5 w-3.5" />
              Get Directions
            </button>
          )}
        </div>
      )}
    </div>
  );
}
