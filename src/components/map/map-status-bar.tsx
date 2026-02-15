/**
 * @module components/map/map-status-bar
 * Minimal right-edge coordinate readout overlay.
 * All toolbar controls, filter chips, and geolocation logic have been
 * moved to {@link MapToolbar}.
 */

"use client";

import { useEffect, useState } from "react";
import { useMap } from "./use-map";

/** Live map position data for the coordinate readout. */
interface MapStatus {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
}

/** Props for {@link MapStatusBar}. */
export interface MapStatusBarProps {
  /** Whether the coordinate readout is visible. Defaults to false. */
  visible?: boolean;
}

/** Right-edge coordinate readout showing lat, lng, zoom, and pitch. */
export function MapStatusBar({ visible = false }: MapStatusBarProps) {
  const map = useMap();
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

  if (!visible) return null;

  return (
    <div
      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-lg px-2 py-1.5 text-[10px] leading-relaxed backdrop-blur-md"
      style={{
        background: "rgba(10, 10, 15, 0.6)",
        color: "rgba(255, 255, 255, 0.5)",
        fontFamily: "var(--font-rajdhani)",
        writingMode: "vertical-lr",
        textOrientation: "mixed",
      }}
    >
      {status.lat.toFixed(4)}, {status.lng.toFixed(4)} · z{status.zoom.toFixed(1)} · {status.pitch.toFixed(0)}°
    </div>
  );
}
