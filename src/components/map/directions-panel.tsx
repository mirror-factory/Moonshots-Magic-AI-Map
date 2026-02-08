/**
 * @module components/map/directions-panel
 * Floating card showing route ETA, distance, and travel mode selection.
 * Uses glass-morphism styling consistent with the chat panel.
 */

"use client";

import { Car, Footprints, Bike, X, Loader2, Navigation } from "lucide-react";
import type { TravelProfile, DirectionsResult } from "@/lib/map/routing";
import { formatDuration, formatDistance } from "@/lib/map/routing";

/** Props for {@link DirectionsPanel}. */
export interface DirectionsPanelProps {
  /** Current route result, or null while loading. */
  route: DirectionsResult | null;
  /** Whether a route request is in progress. */
  loading: boolean;
  /** Currently selected travel profile. */
  profile: TravelProfile;
  /** Callback to change the travel profile. */
  onProfileChange: (profile: TravelProfile) => void;
  /** Callback to close the panel and clear the route. */
  onClose: () => void;
  /** Optional error message to display. */
  error?: string | null;
}

/** Travel mode option configuration. */
const TRAVEL_MODES: { profile: TravelProfile; icon: typeof Car; label: string }[] = [
  { profile: "driving-car", icon: Car, label: "Drive" },
  { profile: "foot-walking", icon: Footprints, label: "Walk" },
  { profile: "cycling-regular", icon: Bike, label: "Bike" },
];

/** Floating panel displaying route ETA, distance, and travel mode selector. */
export function DirectionsPanel({
  route,
  loading,
  profile,
  onProfileChange,
  onClose,
  error,
}: DirectionsPanelProps) {
  return (
    <div
      className="absolute left-4 top-24 z-30 w-72 rounded-2xl shadow-xl backdrop-blur-md"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4" style={{ color: "var(--brand-primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Directions
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="Close directions"
        >
          <X className="h-3.5 w-3.5" style={{ color: "var(--text-dim)" }} />
        </button>
      </div>

      {/* Travel Mode Selector */}
      <div className="flex gap-1 px-4 py-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
        {TRAVEL_MODES.map(({ profile: p, icon: Icon, label }) => (
          <button
            key={p}
            onClick={() => onProfileChange(p)}
            className="flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs transition-colors"
            style={{
              background: p === profile ? "var(--brand-primary)" : "transparent",
              color: p === profile ? "var(--brand-primary-foreground)" : "var(--text-dim)",
            }}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Route Info */}
      <div className="px-4 py-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--brand-primary)" }} />
            <span className="text-sm" style={{ color: "var(--text-dim)" }}>
              Finding route...
            </span>
          </div>
        )}

        {error && (
          <p className="text-sm" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {route && !loading && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                {formatDuration(route.duration)}
              </p>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                {formatDistance(route.distance)}
              </p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--brand-primary)", color: "var(--brand-primary-foreground)" }}
            >
              {TRAVEL_MODES.find((m) => m.profile === profile)?.icon && (() => {
                const Icon = TRAVEL_MODES.find((m) => m.profile === profile)!.icon;
                return <Icon className="h-5 w-5" />;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
