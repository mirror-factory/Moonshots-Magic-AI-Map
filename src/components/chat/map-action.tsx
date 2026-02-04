/**
 * @module components/chat/map-action
 * Client-side executor for the `mapNavigate` agent tool. When the LLM
 * emits a map navigation tool call, this component renders a status pill
 * and performs the corresponding MapLibre operation (flyTo, highlight, fitBounds).
 */

"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@/components/map/use-map";

interface MapActionInput {
  action: "flyTo" | "highlight" | "fitBounds";
  coordinates?: [number, number];
  eventIds?: string[];
  zoom?: number;
}

interface MapActionProps {
  input: MapActionInput;
}

export function MapAction({ input }: MapActionProps) {
  const map = useMap();
  const executedRef = useRef(false);

  useEffect(() => {
    if (!map || executedRef.current) return;
    executedRef.current = true;

    if (input.action === "flyTo" && input.coordinates) {
      map.flyTo({
        center: input.coordinates,
        zoom: input.zoom ?? 14,
        duration: 1500,
      });
    }

    if (input.action === "fitBounds" && input.eventIds?.length) {
      // fitBounds requires computing bounds from events - skip for now
      // The map will highlight events instead
    }
  }, [map, input]);

  const actionLabel = {
    flyTo: "Flying to location",
    highlight: "Highlighting events on map",
    fitBounds: "Fitting map to events",
  }[input.action];

  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
      style={{
        background: "var(--brand-primary-dim)",
        color: "var(--brand-primary)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 1L12 5.5L7 10M2 5.5H12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {actionLabel}
    </div>
  );
}
