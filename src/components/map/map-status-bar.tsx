/**
 * @module components/map/map-status-bar
 * Fixed bottom bar displaying real-time map viewport coordinates
 * (latitude, longitude, zoom, pitch) with integrated theme toggle
 * and settings button.
 */

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon, Settings, Play, Box, Clock, Loader2, X, LocateFixed } from "lucide-react";
import { useMap } from "./use-map";
import { useIntro } from "@/app/map-with-chat";
import { SettingsModal } from "@/components/settings/settings-modal";
import { type DatePreset, DATE_PRESET_LABELS } from "@/lib/map/event-filters";

interface MapStatus {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
}

/** Subscribe to nothing - we just need to know if we're mounted. */
function subscribe() {
  return () => {};
}

/** Returns true only on the client, false during SSR. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

interface MapStatusBarProps {
  mode3D?: boolean;
  onToggle3D?: () => void;
  onStartPersonalization?: () => void;
  isochroneActive?: boolean;
  isochroneLoading?: boolean;
  onToggleIsochrone?: () => void;
  /** Currently active date filter preset. */
  activePreset?: DatePreset;
  /** Callback when user changes the date filter preset. */
  onPresetChange?: (preset: DatePreset) => void;
  /** Whether AI search results are currently overriding the date filter. */
  aiResultsActive?: boolean;
  /** Callback to clear AI search results and restore the date filter. */
  onClearAiResults?: () => void;
}

/** Displays real-time map viewport coordinates in a bottom bar with theme toggle and settings. */
export function MapStatusBar({ mode3D = false, onToggle3D, onStartPersonalization, isochroneActive, isochroneLoading, onToggleIsochrone, activePreset, onPresetChange, aiResultsActive, onClearAiResults }: MapStatusBarProps) {
  const map = useMap();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const introContext = useIntro();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<MapStatus>({
    lat: 28.5383,
    lng: -81.3792,
    zoom: 10,
    pitch: 0,
  });

  useEffect(() => {
    if (!map) return;

    const update = () => {
      const center = map.getCenter();
      setStatus({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
      });
    };

    update();
    map.on("move", update);
    return () => {
      map.off("move", update);
    };
  }, [map]);

  /** Fly the map to the user's current GPS location. */
  const flyToCurrentLocation = () => {
    if (!map || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 15,
          duration: 2000,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const isDark = mounted && resolvedTheme === "dark";

  // White icons in both modes: bright when active, muted when inactive
  const activeColor = "#ffffff";
  const inactiveColor = "rgba(255, 255, 255, 0.55)";

  const presets: DatePreset[] = ["all", "today", "weekend", "week", "month"];

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Date filter chips */}
        {onPresetChange && (
          <div
            className="flex items-center justify-center gap-1.5 px-3 py-1.5"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {aiResultsActive ? (
              <button
                onClick={onClearAiResults}
                className="flex items-center gap-1.5 rounded-full px-4 py-1 text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  background: "#3560FF",
                  color: "#ffffff",
                }}
              >
                AI Results
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => onPresetChange(preset)}
                  className="rounded-full px-4 py-1 text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    background: activePreset === preset ? "#3560FF" : "transparent",
                    color: activePreset === preset ? "#ffffff" : "rgba(255, 255, 255, 0.55)",
                    border: activePreset === preset ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {DATE_PRESET_LABELS[preset]}
                </button>
              ))
            )}
          </div>
        )}
        <div
          className="flex items-center justify-center gap-2 px-3 py-1.5 font-mono text-xs backdrop-blur-md sm:gap-4 sm:px-4"
          style={{
            background: isDark ? "rgba(10, 10, 15, 0.85)" : "rgba(20, 30, 60, 0.72)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            color: "rgba(255, 255, 255, 0.55)",
            fontFamily: "var(--font-rajdhani)",
          }}
        >
          <StatusItem label="LAT" value={status.lat.toFixed(4)} activeColor={activeColor} hideLabel />
          <Separator />
          <StatusItem label="LNG" value={status.lng.toFixed(4)} activeColor={activeColor} hideLabel />
          <Separator />
          <StatusItem label="Z" value={status.zoom.toFixed(1)} activeColor={activeColor} />
          <Separator />
          <StatusItem label="P" value={`${status.pitch.toFixed(0)}°`} activeColor={activeColor} />
          <Separator />
          {/* My Location */}
          <button
            onClick={flyToCurrentLocation}
            className="flex items-center justify-center transition-colors hover:opacity-70"
            style={{ color: locating ? activeColor : inactiveColor }}
            aria-label="Go to my location"
            title="My location"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LocateFixed className="h-3.5 w-3.5" />
            )}
          </button>
          <Separator />
          {/* 3D Toggle */}
          {onToggle3D && (
            <>
              <button
                onClick={onToggle3D}
                className="flex items-center gap-1 transition-colors hover:opacity-70"
                style={{ color: mode3D ? activeColor : inactiveColor }}
                aria-label={mode3D ? "Disable 3D mode" : "Enable 3D mode"}
                title={mode3D ? "Disable 3D" : "Enable 3D"}
              >
                <Box className="h-3.5 w-3.5" />
                <span className="text-[10px] font-medium">3D</span>
              </button>
              <Separator />
            </>
          )}
          {/* Isochrone Toggle */}
          {onToggleIsochrone && (
            <>
              <button
                onClick={onToggleIsochrone}
                className="flex items-center gap-1 transition-colors hover:opacity-70"
                style={{ color: isochroneActive ? activeColor : inactiveColor }}
                aria-label={isochroneActive ? "Hide travel zones" : "Show travel zones"}
                title={isochroneActive ? "Hide travel zones" : "Travel zones"}
              >
                {isochroneLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
              </button>
              <Separator />
            </>
          )}
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center justify-center transition-colors hover:opacity-70"
            style={{ color: activeColor }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mounted ? (
              isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />
            ) : (
              <div className="h-3.5 w-3.5" />
            )}
          </button>
          <Separator />
          {/* Replay Intro Button */}
          {introContext && (
            <>
              <button
                onClick={() => introContext.showIntro()}
                className="flex items-center justify-center transition-colors hover:opacity-70"
                style={{ color: activeColor }}
                aria-label="Replay welcome experience"
                title="Replay intro"
              >
                <Play className="h-3.5 w-3.5" />
              </button>
              <Separator />
            </>
          )}
          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center transition-colors hover:opacity-70"
            style={{ color: inactiveColor }}
            aria-label="Open settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onStartPersonalization={onStartPersonalization}
      />
    </>
  );
}

/** Displays a labeled value in the status bar. */
function StatusItem({ label, value, activeColor, hideLabel }: { label: string; value: string; activeColor: string; hideLabel?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={hideLabel ? "hidden sm:inline" : ""} style={{ color: "rgba(255, 255, 255, 0.35)" }}>{label}</span>
      <span style={{ color: activeColor }}>{value}</span>
    </div>
  );
}

/** Vertical separator line. */
function Separator() {
  return <div className="h-3 w-px" style={{ background: "rgba(255, 255, 255, 0.12)" }} />;
}
