/**
 * @module components/map/map-popups
 * Handles hover and click popup interactions on the events layer.
 * Hover: lightweight frosted-glass tooltip with event name, image, date.
 * Click: pinned popup with action buttons (Ask Ditto, Directions, Detail).
 */

"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./use-map";
import { CATEGORY_LABELS } from "@/lib/map/config";
import type { EventCategory } from "@/lib/registries/types";

/** Props for {@link MapPopups}. */
interface MapPopupsProps {
  /** Callback when user clicks "Ask about this". */
  onAskAbout?: (eventTitle: string) => void;
  /** Callback when user clicks "Directions". */
  onGetDirections?: (coordinates: [number, number], eventTitle: string) => void;
  /** Callback when user clicks "More Detail" — opens the events dropdown. */
  onOpenDetail?: (eventId: string) => void;
}

/**
 * Format an ISO date string into a short display string.
 * @param iso - ISO 8601 date string.
 * @returns Formatted string like "Fri, Feb 14 · 7:00 PM".
 */
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Shared frosted-glass CSS for popups. */
const GLASS_BG = `
  background: rgba(15, 15, 20, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #e0e4ef;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
`;

/** Branded placeholder gradient for events without images. */
const PLACEHOLDER_BG = `
  background: linear-gradient(135deg, rgba(0, 99, 205, 0.3) 0%, rgba(53, 96, 255, 0.15) 50%, rgba(0, 99, 205, 0.25) 100%);
  backdrop-filter: blur(8px);
  display:flex;align-items:center;justify-content:center;
`;

/**
 * Build hover tooltip HTML.
 * @param props - GeoJSON feature properties.
 * @returns HTML string for the hover popup.
 */
function hoverHTML(props: Record<string, unknown>): string {
  const title = String(props.title ?? "");
  const venue = String(props.venue ?? "");
  const dateStr = fmtDate(String(props.startDate ?? ""));
  const imageUrl = String(props.imageUrl ?? "");
  const category = String(props.category ?? "");
  const categoryLabel = CATEGORY_LABELS[category as EventCategory] ?? category;
  const color = String(props.color ?? "#888");

  const imgBlock = imageUrl
    ? `<img src="${imageUrl}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
    : `<div style="width:100%;height:60px;border-radius:8px;margin-bottom:8px;${PLACEHOLDER_BG}">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
       </div>`;

  return `
    <div style="${GLASS_BG} padding:10px; max-width:240px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
      ${imgBlock}
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
        <span style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;">${categoryLabel}</span>
      </div>
      <h3 style="margin:0 0 4px;font-size:13px;font-weight:600;color:#fff;line-height:1.3;">${title}</h3>
      <p style="margin:0 0 2px;font-size:11px;color:rgba(255,255,255,0.5);">${venue}</p>
      <p style="margin:0;font-size:11px;color:rgba(100,160,255,0.9);">${dateStr}</p>
    </div>
  `;
}

/**
 * Build click popup HTML with action buttons.
 * @param props - GeoJSON feature properties.
 * @param coords - [lng, lat] coordinates for directions.
 * @returns HTML string for the pinned click popup.
 */
function clickHTML(props: Record<string, unknown>, coords: [number, number]): string {
  const title = String(props.title ?? "");
  const venue = String(props.venue ?? "");
  const dateStr = fmtDate(String(props.startDate ?? ""));
  const imageUrl = String(props.imageUrl ?? "");
  const category = String(props.category ?? "");
  const categoryLabel = CATEGORY_LABELS[category as EventCategory] ?? category;
  const color = String(props.color ?? "#888");
  const id = String(props.id ?? "");
  const url = String(props.url ?? "");
  const safeTitle = title.replace(/"/g, "&quot;");

  const imgBlock = imageUrl
    ? `<img src="${imageUrl}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:10px;" />`
    : `<div style="width:100%;height:80px;border-radius:8px;margin-bottom:10px;${PLACEHOLDER_BG}">
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
       </div>`;

  const btnBase = `
    border:none;
    padding:5px 0;
    border-radius:6px;
    font-size:10px;
    font-weight:500;
    cursor:pointer;
    text-align:center;
    transition: opacity 0.15s;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:4px;
  `;

  const iconSvg = (d: string) => `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const sparkles = iconSvg(`<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>`);
  const compass = iconSvg(`<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`);
  const info = iconSvg(`<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`);
  const extLink = iconSvg(`<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`);

  const visitSiteBtn = url
    ? `<a class="popup-visit-btn" href="${url}" target="_blank" rel="noopener noreferrer"
         style="${btnBase} background:rgba(255,255,255,0.08);color:#e0e4ef;border:1px solid rgba(255,255,255,0.12);text-decoration:none;">
         ${extLink} Visit Site
       </a>`
    : `<div></div>`;

  return `
    <div style="${GLASS_BG} padding:12px; max-width:280px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
      ${imgBlock}
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
        <span style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;">${categoryLabel}</span>
      </div>
      <h3 style="margin:0 0 4px;font-size:14px;font-weight:600;color:#fff;line-height:1.3;">${title}</h3>
      <p style="margin:0 0 2px;font-size:11px;color:rgba(255,255,255,0.5);">${venue}</p>
      <p style="margin:0 0 10px;font-size:11px;color:rgba(100,160,255,0.9);">${dateStr}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
        <button class="popup-ask-btn" data-id="${id}" data-title="${safeTitle}"
          style="${btnBase} background:#3560FF;color:#fff;">
          ${sparkles} Ask Ditto
        </button>
        <button class="popup-directions-btn" data-lng="${coords[0]}" data-lat="${coords[1]}" data-title="${safeTitle}"
          style="${btnBase} background:rgba(255,255,255,0.08);color:#e0e4ef;border:1px solid rgba(255,255,255,0.12);">
          ${compass} Directions
        </button>
        <button class="popup-detail-btn" data-id="${id}"
          style="${btnBase} background:rgba(255,255,255,0.08);color:#e0e4ef;border:1px solid rgba(255,255,255,0.12);">
          ${info} More Detail
        </button>
        ${visitSiteBtn}
      </div>
    </div>
  `;
}

/** Handles hover and click popup interactions on the events map layer. */
export function MapPopups({ onAskAbout, onGetDirections, onOpenDetail }: MapPopupsProps) {
  const map = useMap();
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);
  const clickPopupRef = useRef<maplibregl.Popup | null>(null);
  const isClickedRef = useRef(false);

  useEffect(() => {
    if (!map) return;

    // ---- Hover tooltip ----
    const handleMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
      if (isClickedRef.current) return; // Don't show hover when click popup is open
      const features = e.features;
      if (!features?.length) return;

      const feature = features[0];
      const props = feature.properties;
      if (!props) return;

      const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

      map.getCanvas().style.cursor = "pointer";

      if (!hoverPopupRef.current) {
        hoverPopupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          maxWidth: "260px",
          offset: 14,
          className: "event-hover-popup",
        });
      }

      hoverPopupRef.current
        .setLngLat(coords)
        .setHTML(hoverHTML(props))
        .addTo(map);
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      hoverPopupRef.current?.remove();
    };

    // ---- Click popup ----
    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      const features = e.features;
      if (!features?.length) return;

      const feature = features[0];
      const props = feature.properties;
      if (!props) return;

      const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

      // Remove hover popup
      hoverPopupRef.current?.remove();
      isClickedRef.current = true;

      // Remove previous click popup
      clickPopupRef.current?.remove();

      clickPopupRef.current = new maplibregl.Popup({
        closeOnClick: true,
        maxWidth: "300px",
        offset: 14,
        className: "event-click-popup",
      })
        .setLngLat(coords)
        .setHTML(clickHTML(props, coords))
        .addTo(map);

      clickPopupRef.current.on("close", () => {
        isClickedRef.current = false;
      });

      // Wire up buttons
      setTimeout(() => {
        const askBtn = document.querySelector(".popup-ask-btn");
        if (askBtn && onAskAbout) {
          askBtn.addEventListener("click", () => {
            const id = askBtn.getAttribute("data-id") ?? "";
            const title = askBtn.getAttribute("data-title") ?? "";
            onAskAbout(id ? `__EVENT__:${id}:${title}` : title);
            clickPopupRef.current?.remove();
          });
        }

        const dirBtn = document.querySelector(".popup-directions-btn");
        if (dirBtn && onGetDirections) {
          dirBtn.addEventListener("click", () => {
            const lng = parseFloat(dirBtn.getAttribute("data-lng") ?? "0");
            const lat = parseFloat(dirBtn.getAttribute("data-lat") ?? "0");
            const title = dirBtn.getAttribute("data-title") ?? "";
            onGetDirections([lng, lat], title);
            clickPopupRef.current?.remove();
          });
        }

        const detailBtn = document.querySelector(".popup-detail-btn");
        if (detailBtn && onOpenDetail) {
          detailBtn.addEventListener("click", () => {
            const id = detailBtn.getAttribute("data-id") ?? "";
            onOpenDetail(id);
            clickPopupRef.current?.remove();
          });
        }

        // Visit Site is an <a> tag — no JS handler needed
      }, 50);
    };

    map.on("mousemove", "events-layer", handleMouseMove);
    map.on("mouseleave", "events-layer", handleMouseLeave);
    map.on("click", "events-layer", handleClick);

    return () => {
      map.off("mousemove", "events-layer", handleMouseMove);
      map.off("mouseleave", "events-layer", handleMouseLeave);
      map.off("click", "events-layer", handleClick);
      hoverPopupRef.current?.remove();
      clickPopupRef.current?.remove();
    };
  }, [map, onAskAbout, onGetDirections, onOpenDetail]);

  return null;
}
