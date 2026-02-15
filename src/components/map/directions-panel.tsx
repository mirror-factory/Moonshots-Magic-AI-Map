/**
 * @module components/map/directions-panel
 * Floating card showing route ETA, distance, travel mode selection,
 * turn-by-turn steps, and external map deep links.
 * Uses glass-morphism styling consistent with the chat panel.
 */

"use client";

import { useState, useCallback } from "react";
import {
  Car,
  Footprints,
  Bike,
  X,
  Loader2,
  Navigation,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  MoveUp,
  CornerUpRight,
  CornerUpLeft,
  MapPin,
} from "lucide-react";
import type { TravelProfile, DirectionsResult, RouteStep } from "@/lib/map/routing";
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
  /** Origin coordinates [lng, lat] for external map links. */
  origin?: [number, number] | null;
  /** Destination coordinates [lng, lat] for external map links. */
  destination?: [number, number] | null;
  /** Callback to fly the map camera to a coordinate. */
  onFlyToStep?: (coordinate: [number, number]) => void;
  /** Whether the origin came from actual GPS (true) or was unavailable. */
  originIsGps?: boolean;
  /** Callback to retry getting the user's location. */
  onRetryLocation?: () => void;
}

/** Travel mode option configuration. */
const TRAVEL_MODES: { profile: TravelProfile; icon: typeof Car; label: string }[] = [
  { profile: "driving-car", icon: Car, label: "Drive" },
  { profile: "foot-walking", icon: Footprints, label: "Walk" },
  { profile: "cycling-regular", icon: Bike, label: "Bike" },
];

/**
 * Maps ORS travel profiles to Google Maps travel modes.
 * @see https://developers.google.com/maps/documentation/urls/get-started#directions-action
 */
const GOOGLE_TRAVEL_MODES: Record<TravelProfile, string> = {
  "driving-car": "driving",
  "foot-walking": "walking",
  "cycling-regular": "bicycling",
};

/**
 * Maps ORS travel profiles to Apple Maps direction flags.
 * @see https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
 */
const APPLE_DIRFLG: Record<TravelProfile, string> = {
  "driving-car": "d",
  "foot-walking": "w",
  "cycling-regular": "b",
};


/**
 * Detects whether the user is on an Apple platform (iOS/macOS).
 * @returns True if on Apple platform.
 */
function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

/**
 * Builds a Google Maps directions URL.
 * @param origin - Origin [lng, lat].
 * @param destination - Destination [lng, lat].
 * @param profile - Travel profile.
 * @returns Google Maps URL string.
 */
function buildGoogleMapsUrl(
  origin: [number, number],
  destination: [number, number],
  profile: TravelProfile,
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&travelmode=${GOOGLE_TRAVEL_MODES[profile]}`;
}

/**
 * Builds an Apple Maps directions URL.
 * @param origin - Origin [lng, lat].
 * @param destination - Destination [lng, lat].
 * @param profile - Travel profile.
 * @returns Apple Maps URL string.
 */
function buildAppleMapsUrl(
  origin: [number, number],
  destination: [number, number],
  profile: TravelProfile,
): string {
  return `https://maps.apple.com/?saddr=${origin[1]},${origin[0]}&daddr=${destination[1]},${destination[0]}&dirflg=${APPLE_DIRFLG[profile]}`;
}

/** Icon component for route steps. */
function StepIcon({ instruction }: { instruction: string }) {
  const lower = instruction.toLowerCase();
  const iconProps = { className: "mt-0.5 h-3.5 w-3.5 shrink-0", style: { color: "var(--brand-primary)" } };

  if (lower.includes("turn left") || lower.includes("keep left")) {
    return <ArrowLeft {...iconProps} />;
  }
  if (lower.includes("turn right") || lower.includes("keep right")) {
    return <ArrowRight {...iconProps} />;
  }
  if (lower.includes("slight left") || lower.includes("bear left")) {
    return <CornerUpLeft {...iconProps} />;
  }
  if (lower.includes("slight right") || lower.includes("bear right")) {
    return <CornerUpRight {...iconProps} />;
  }
  if (lower.includes("arrive") || lower.includes("destination")) {
    return <MapPin {...iconProps} />;
  }
  return <MoveUp {...iconProps} />;
}

/** Renders a single route step row. */
function StepRow({ step }: { step: RouteStep }) {
  return (
    <div className="flex items-start gap-2.5 py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
      <StepIcon instruction={step.instruction} />
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-snug" style={{ color: "var(--text)" }}>
          {step.instruction}
        </p>
        <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-dim)" }}>
          {formatDistance(step.distance)}
        </p>
      </div>
    </div>
  );
}

/** Floating panel displaying route ETA, distance, travel mode selector, steps, and external map links. */
export function DirectionsPanel({
  route,
  loading,
  profile,
  onProfileChange,
  onClose,
  error,
  origin,
  destination,
  onFlyToStep,
  originIsGps,
  onRetryLocation,
}: DirectionsPanelProps) {
  const [stepsExpanded, setStepsExpanded] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const apple = isApplePlatform();
  /** Navigate to a step and fly the map camera there. */
  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    const step = route?.steps[stepIndex];
    if (step?.coordinate && onFlyToStep) {
      onFlyToStep(step.coordinate);
    }
  }, [route, onFlyToStep]);

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
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--brand-primary)" }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                Getting your location...
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                Please allow location access when prompted
              </p>
            </div>
          </div>
        )}

        {error && (
          <div>
            <p className="text-sm" style={{ color: "#ef4444" }}>
              {error}
            </p>
            {onRetryLocation && (
              <button
                onClick={onRetryLocation}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors hover:opacity-90"
                style={{ background: "var(--brand-primary)", color: "#fff" }}
              >
                <Navigation className="h-3.5 w-3.5" />
                Retry with My Location
              </button>
            )}
          </div>
        )}

        {route && !loading && (
          <>
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

            {/* Origin indicator */}
            <div className="mt-2 flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: originIsGps ? "#3b82f6" : "#f59e0b" }}
              />
              <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                {originIsGps ? "From your location" : "Location unavailable"}
              </p>
            </div>

            {/* Step-by-step navigation */}
            {route.steps.length > 0 && (
              <div className="mt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
                {/* Current step highlight */}
                <div className="flex items-start gap-2.5 py-3">
                  <StepIcon instruction={route.steps[currentStep].instruction} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
                      {route.steps[currentStep].instruction}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--text-dim)" }}>
                      {formatDistance(route.steps[currentStep].distance)}
                    </p>
                  </div>
                </div>

                {/* Step nav bar */}
                <div
                  className="flex items-center justify-between py-2"
                  style={{ borderTop: "1px solid var(--border-color)" }}
                >
                  <button
                    onClick={() => goToStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
                    style={{ color: "var(--text-dim)" }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
                    Step {currentStep + 1} of {route.steps.length}
                  </span>
                  <button
                    onClick={() => goToStep(Math.min(route!.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === route.steps.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
                    style={{ color: "var(--text-dim)" }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* All steps (collapsible) */}
                <button
                  onClick={() => setStepsExpanded((v) => !v)}
                  className="flex w-full items-center justify-between py-2 text-xs font-medium transition-colors"
                  style={{ color: "var(--text-dim)", borderTop: "1px solid var(--border-color)" }}
                >
                  <span>{stepsExpanded ? "Hide" : "Show"} all steps</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${stepsExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {stepsExpanded && (
                  <div className="max-h-48 overflow-y-auto pb-1">
                    {route.steps.map((step, i) => (
                      <button
                        key={i}
                        onClick={() => goToStep(i)}
                        className="w-full text-left transition-colors"
                        style={{
                          background: i === currentStep ? "var(--surface-2)" : "transparent",
                          borderRadius: 8,
                        }}
                      >
                        <StepRow step={step} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Open in external maps */}
            {origin && destination && (
              <div
                className="mt-3 flex gap-2 pt-3"
                style={{ borderTop: "1px solid var(--border-color)" }}
              >
                {(apple
                  ? [
                      { label: "Apple Maps", url: buildAppleMapsUrl(origin, destination, profile) },
                      { label: "Google Maps", url: buildGoogleMapsUrl(origin, destination, profile) },
                    ]
                  : [
                      { label: "Google Maps", url: buildGoogleMapsUrl(origin, destination, profile) },
                      { label: "Apple Maps", url: buildAppleMapsUrl(origin, destination, profile) },
                    ]
                ).map(({ label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors hover:opacity-80"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    {label}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
