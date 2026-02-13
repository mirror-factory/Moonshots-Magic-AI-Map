/**
 * @module components/map/map-status-bar
 * Map overlay controls split across 4 positions:
 * - Top center: Date filter chips
 * - Top right: Theme, 3D, isochrone, settings toggles
 * - Bottom left: My location button
 * - Bottom center: Minimal coordinate readout
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

/** Props for {@link MapStatusBar}. */
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

/** Map overlay controls — filter chips, toolbar, location button, and coordinate readout. */
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

  const presets: DatePreset[] = ["all", "today", "weekend", "week", "month"];

  // Shared glass pill styles for top overlays
  const glassPill = {
    background: isDark ? "rgba(10, 10, 15, 0.7)" : "rgba(255, 255, 255, 0.8)",
    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.12)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  // Icon colors adapt to theme
  const iconActive = isDark ? "#ffffff" : "#0a0a0f";
  const iconMuted = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.45)";

  return (
    <>
      {/* ─── TOP CENTER: Date filter chips ─── */}
      {onPresetChange && (
        <div
          className="absolute left-1/2 top-6 z-20 -translate-x-1/2"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          <div
            className="flex items-center gap-1 rounded-full px-1.5 py-1"
            style={glassPill}
          >
            {aiResultsActive ? (
              <button
                onClick={onClearAiResults}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  background: "#3560FF",
                  color: "#ffffff",
                }}
              >
                AI Results
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              presets.map((preset) => {
                const isActive = activePreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => onPresetChange(preset)}
                    className="rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all hover:opacity-80"
                    style={{
                      background: isActive ? "#3560FF" : "transparent",
                      color: isActive
                        ? "#ffffff"
                        : isDark
                          ? "rgba(255, 255, 255, 0.65)"
                          : "rgba(0, 0, 0, 0.6)",
                      border: isActive
                        ? "1px solid transparent"
                        : isDark
                          ? "1px solid rgba(255, 255, 255, 0.15)"
                          : "1px solid rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {DATE_PRESET_LABELS[preset]}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── TOP RIGHT: Toolbar ─── */}
      <div
        className="absolute right-4 top-6 z-20 flex items-center gap-1 rounded-full px-1.5 py-1"
        style={glassPill}
      >
        {/* 3D Toggle */}
        {onToggle3D && (
          <ToolbarButton
            onClick={onToggle3D}
            active={mode3D}
            activeColor={iconActive}
            mutedColor={iconMuted}
            label={mode3D ? "Disable 3D" : "Enable 3D"}
          >
            <Box className="h-4 w-4" />
          </ToolbarButton>
        )}
        {/* Isochrone Toggle */}
        {onToggleIsochrone && (
          <ToolbarButton
            onClick={onToggleIsochrone}
            active={isochroneActive ?? false}
            activeColor={iconActive}
            mutedColor={iconMuted}
            label={isochroneActive ? "Hide travel zones" : "Travel zones"}
          >
            {isochroneLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </ToolbarButton>
        )}
        {/* Theme Toggle */}
        <ToolbarButton
          onClick={() => setTheme(isDark ? "light" : "dark")}
          active
          activeColor={iconActive}
          mutedColor={iconMuted}
          label={isDark ? "Light mode" : "Dark mode"}
        >
          {mounted ? (
            isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4" />
          )}
        </ToolbarButton>
        {/* Replay Intro */}
        {introContext && (
          <ToolbarButton
            onClick={() => introContext.showIntro()}
            active
            activeColor={iconActive}
            mutedColor={iconMuted}
            label="Replay intro"
          >
            <Play className="h-4 w-4" />
          </ToolbarButton>
        )}
        {/* Settings */}
        <ToolbarButton
          onClick={() => setSettingsOpen(true)}
          active={false}
          activeColor={iconActive}
          mutedColor={iconMuted}
          label="Settings"
        >
          <Settings className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* ─── BOTTOM LEFT: My Location ─── */}
      <div className="absolute bottom-4 left-4 z-20">
        <button
          onClick={flyToCurrentLocation}
          className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105"
          style={{
            ...glassPill,
            color: locating ? "#3560FF" : iconMuted,
          }}
          aria-label="Go to my location"
          title="My location"
        >
          {locating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LocateFixed className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* ─── BOTTOM CENTER: Coordinate readout ─── */}
      <div
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 rounded-t-lg px-4 py-1 text-[10px] backdrop-blur-md"
        style={{
          background: isDark ? "rgba(10, 10, 15, 0.6)" : "rgba(0, 0, 0, 0.35)",
          color: "rgba(255, 255, 255, 0.5)",
          fontFamily: "var(--font-rajdhani)",
        }}
      >
        {status.lat.toFixed(4)}, {status.lng.toFixed(4)} · z{status.zoom.toFixed(1)} · {status.pitch.toFixed(0)}°
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

/** A single icon button in the top-right toolbar. */
function ToolbarButton({
  onClick,
  active,
  activeColor,
  mutedColor,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  activeColor: string;
  mutedColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10"
      style={{ color: active ? activeColor : mutedColor }}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
