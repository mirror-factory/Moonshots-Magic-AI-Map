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

/** Displays real-time map viewport coordinates in a bottom bar. */
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
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
      <div
        className="flex items-center gap-4 rounded-full px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-md"
        style={{
          background: "var(--chat-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-dim)",
        }}
      >
        <StatusItem label="LAT" value={status.lat.toFixed(4)} />
        <Separator />
        <StatusItem label="LNG" value={status.lng.toFixed(4)} />
        <Separator />
        <StatusItem label="Z" value={status.zoom.toFixed(1)} />
        <Separator />
        <StatusItem label="P" value={`${status.pitch.toFixed(0)}°`} />
      </div>
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: "var(--brand-primary)" }}>{value}</span>
    </div>
  );
}

function Separator() {
  return <div className="h-3 w-px" style={{ background: "var(--border-color)" }} />;
}
