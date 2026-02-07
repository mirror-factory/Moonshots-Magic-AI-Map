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
import { Sun, Moon, Settings, Play, Box } from "lucide-react";
import { useMap } from "./use-map";
import { useIntro } from "@/app/map-with-chat";
import { SettingsModal } from "@/components/settings/settings-modal";

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
}

/** Displays real-time map viewport coordinates in a bottom bar with theme toggle and settings. */
export function MapStatusBar({ mode3D = false, onToggle3D, onStartPersonalization }: MapStatusBarProps) {
  const map = useMap();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const introContext = useIntro();
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  const isDark = mounted && resolvedTheme === "dark";

  // Active button color: white in dark mode, dark gray/black in light mode
  const activeColor = isDark ? "#ffffff" : "#1a1a1a";
  const inactiveColor = "var(--text-dim)";

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div
          className="flex items-center justify-center gap-4 px-4 py-1.5 font-mono text-xs backdrop-blur-md"
          style={{
            background: "var(--chat-bg)",
            borderTop: "1px solid var(--border-color)",
            color: "var(--text-dim)",
            fontFamily: "var(--font-rajdhani)",
          }}
        >
          <StatusItem label="LAT" value={status.lat.toFixed(4)} activeColor={activeColor} />
          <Separator />
          <StatusItem label="LNG" value={status.lng.toFixed(4)} activeColor={activeColor} />
          <Separator />
          <StatusItem label="Z" value={status.zoom.toFixed(1)} activeColor={activeColor} />
          <Separator />
          <StatusItem label="P" value={`${status.pitch.toFixed(0)}°`} activeColor={activeColor} />
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
function StatusItem({ label, value, activeColor }: { label: string; value: string; activeColor: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: activeColor }}>{value}</span>
    </div>
  );
}

/** Vertical separator line. */
function Separator() {
  return <div className="h-3 w-px" style={{ background: "var(--border-color)" }} />;
}
