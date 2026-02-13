/**
 * @module components/map/map-popups
 * Handles click-to-popup interactions on the events layer. Shows event
 * details in a MapLibre popup with an "Ask about this" button that bridges
 * to the chat panel.
 */

"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./use-map";
import { CATEGORY_LABELS } from "@/lib/map/config";
import type { EventCategory } from "@/lib/registries/types";

interface MapPopupsProps {
  onAskAbout?: (eventTitle: string) => void;
  onGetDirections?: (coordinates: [number, number], eventTitle: string) => void;
}

/** Handles click-to-popup interactions on the events map layer. */
export function MapPopups({ onAskAbout, onGetDirections }: MapPopupsProps) {
  const map = useMap();
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      const features = e.features;
      if (!features?.length) return;

      const feature = features[0];
      const props = feature.properties;
      if (!props) return;

      const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

      // Format date
      const date = new Date(props.startDate);
      const dateStr = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      const categoryLabel = CATEGORY_LABELS[props.category as EventCategory] ?? props.category;
      const priceLabel = props.isFree === true || props.isFree === "true" ? "Free" : "Paid";

      const html = `
        <div style="font-family: var(--font-geist-sans), sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
              background: var(--category-${props.category});
              color: #000;
            ">${categoryLabel}</span>
            <span style="font-size: 11px; color: var(--text-dim);">${priceLabel}</span>
          </div>
          <h3 style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: var(--text);">${props.title}</h3>
          <p style="margin: 0 0 4px; font-size: 12px; color: var(--text-dim);">${props.venue}</p>
          <p style="margin: 0 0 10px; font-size: 12px; color: var(--text-dim);">${dateStr}</p>
          <div style="display: flex; gap: 6px;">
            <button
              class="popup-ask-btn"
              data-id="${props.id}"
              data-title="${props.title.replace(/"/g, "&quot;")}"
              style="
                background: var(--brand-primary);
                color: var(--brand-primary-foreground);
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                flex: 1;
              "
            >Ask about this</button>
            <button
              class="popup-directions-btn"
              data-lng="${coords[0]}"
              data-lat="${coords[1]}"
              data-title="${props.title.replace(/"/g, "&quot;")}"
              style="
                background: var(--surface-2);
                color: var(--text);
                border: 1px solid var(--border-color);
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                white-space: nowrap;
              "
            >Directions</button>
          </div>
        </div>
      `;

      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ closeOnClick: true, maxWidth: "320px" })
        .setLngLat(coords)
        .setHTML(html)
        .addTo(map);

      // Wire up button clicks after popup is added to DOM
      setTimeout(() => {
        const askBtn = document.querySelector(".popup-ask-btn");
        if (askBtn && onAskAbout) {
          askBtn.addEventListener("click", () => {
            const id = askBtn.getAttribute("data-id") ?? "";
            const title = askBtn.getAttribute("data-title") ?? "";
            onAskAbout(id ? `__EVENT__:${id}:${title}` : title);
            popupRef.current?.remove();
          });
        }

        const dirBtn = document.querySelector(".popup-directions-btn");
        if (dirBtn && onGetDirections) {
          dirBtn.addEventListener("click", () => {
            const lng = parseFloat(dirBtn.getAttribute("data-lng") ?? "0");
            const lat = parseFloat(dirBtn.getAttribute("data-lat") ?? "0");
            const title = dirBtn.getAttribute("data-title") ?? "";
            onGetDirections([lng, lat], title);
            popupRef.current?.remove();
          });
        }
      }, 50);
    };

    // Change cursor on hover
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "events-layer", handleClick);
    map.on("mouseenter", "events-layer", handleMouseEnter);
    map.on("mouseleave", "events-layer", handleMouseLeave);

    return () => {
      map.off("click", "events-layer", handleClick);
      map.off("mouseenter", "events-layer", handleMouseEnter);
      map.off("mouseleave", "events-layer", handleMouseLeave);
      popupRef.current?.remove();
    };
  }, [map, onAskAbout, onGetDirections]);

  return null;
}
