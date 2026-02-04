/**
 * @module components/map/map-status-bar
 * Fixed bottom bar displaying real-time map viewport coordinates
 * (latitude, longitude, zoom, pitch).
 */

"use client";

import { useEffect, useState } from "react";
import { useMap } from "./use-map";

interface MapStatus {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
}

export function MapStatusBar() {
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

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-6 px-4 font-mono text-xs"
      style={{
        height: "var(--status-bar-height)",
        background: "var(--surface)",
        borderTop: "1px solid var(--border-color)",
        color: "var(--text-dim)",
      }}
    >
      <StatusItem label="LAT" value={status.lat.toFixed(4)} />
      <StatusItem label="LNG" value={status.lng.toFixed(4)} />
      <StatusItem label="ZOOM" value={status.zoom.toFixed(1)} />
      <StatusItem label="PITCH" value={`${status.pitch.toFixed(0)}°`} />
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: "var(--brand-primary)" }}>{value}</span>
    </div>
  );
}
