/**
 * @module components/chat/map-action
 * Client-side executor for the `mapNavigate` agent tool. When the LLM
 * emits a map navigation tool call, this component renders a status pill
 * and performs the corresponding MapLibre operation (flyTo, highlight, fitBounds).
 * Uses the unified camera-utils for all navigation.
 */

"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@/components/map/use-map";
import { flyToPoint, fitBoundsToPoints } from "@/lib/map/camera-utils";

/** Input shape for map navigation actions. */
interface MapActionInput {
  /** The navigation action to perform. */
  action: "flyTo" | "highlight" | "fitBounds";
  /** Target coordinates [lng, lat] for flyTo. */
  coordinates?: [number, number];
  /** Event IDs to highlight or fit bounds to. */
  eventIds?: string[];
  /** Target zoom level. */
  zoom?: number;
}

/** Props for {@link MapAction}. */
interface MapActionProps {
  /** The navigation input from the AI tool call. */
  input: MapActionInput;
  /** All events for resolving event IDs to coordinates. */
  events?: Array<{ id: string; coordinates?: [number, number] }>;
}

/** Executes a map navigation tool call and renders a status pill. */
export function MapAction({ input, events }: MapActionProps) {
  const map = useMap();
  const executedRef = useRef(false);

  useEffect(() => {
    if (!map || executedRef.current || !input) return;
    executedRef.current = true;

    if (input.action === "flyTo" && input.coordinates) {
      void flyToPoint(map, input.coordinates, {
        zoom: input.zoom ?? 14,
        duration: 1500,
      });
    }

    if (input.action === "fitBounds" && input.eventIds?.length && events) {
      const coords = input.eventIds
        .map((id) => events.find((e) => e.id === id)?.coordinates)
        .filter((c): c is [number, number] => c !== undefined);

      if (coords.length > 0) {
        void fitBoundsToPoints(map, coords, {
          padding: { top: 100, bottom: 100, left: 100, right: 400 },
          maxZoom: 15,
          duration: 1200,
        });
      }
    }
  }, [map, input, events]);

  if (!input) return null;

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
