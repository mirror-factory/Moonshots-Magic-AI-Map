/**
 * @module lib/map/venue-highlight
 * Shared venue highlight system for rendering canvas-based event cards
 * and golden pulsating orbs on the MapLibre map. Used by both the flyover
 * system and the interactive map popups.
 */

import type maplibregl from "maplibre-gl";

// ── Constants ────────────────────────────────────────────────────────────

/** Selection highlight source and layer IDs. */
export const HIGHLIGHT_SOURCE = "venue-highlight-source";
export const HIGHLIGHT_PULSE_LAYER = "venue-highlight-pulse";
export const HIGHLIGHT_GLOW_LAYER = "venue-highlight-glow";
export const HIGHLIGHT_IMAGE_LAYER = "venue-highlight-image";
export const HIGHLIGHT_IMAGE_ID = "venue-highlight-img";

/** Hover-only source and layer IDs (separate from selection). */
export const HOVER_SOURCE = "venue-hover-source";
export const HOVER_IMAGE_LAYER = "venue-hover-image";
export const HOVER_IMAGE_ID = "venue-hover-img";

const CARD_WIDTH = 340;
const CARD_HEIGHT = 110;
const THUMB_WIDTH = 100;

// ── Pulse Animation ──────────────────────────────────────────────────────

/** Module-level animation frame ID for the pulse loop. */
let pulseAnimFrame: number | null = null;

/** Starts a continuous pulsation animation on the highlight layers. */
export function startPulseAnimation(map: maplibregl.Map): void {
  stopPulseAnimation();

  const startTime = performance.now();

  const animate = () => {
    if (!map.getStyle()) { pulseAnimFrame = null; return; }

    const t = (performance.now() - startTime) / 1000;
    const pulse = Math.sin(t * 2.5) * 0.5 + 0.5;

    if (map.getLayer(HIGHLIGHT_GLOW_LAYER)) {
      map.setPaintProperty(HIGHLIGHT_GLOW_LAYER, "circle-radius", 40 + pulse * 40);
      map.setPaintProperty(HIGHLIGHT_GLOW_LAYER, "circle-opacity", 0.08 + pulse * 0.18);
    }

    if (map.getLayer(HIGHLIGHT_PULSE_LAYER)) {
      map.setPaintProperty(HIGHLIGHT_PULSE_LAYER, "circle-radius", 14 + pulse * 14);
      map.setPaintProperty(HIGHLIGHT_PULSE_LAYER, "circle-opacity", 0.3 + pulse * 0.35);
      map.setPaintProperty(HIGHLIGHT_PULSE_LAYER, "circle-stroke-opacity", 0.5 + pulse * 0.4);
    }

    pulseAnimFrame = requestAnimationFrame(animate);
  };

  pulseAnimFrame = requestAnimationFrame(animate);
}

/** Stops the pulse animation. */
export function stopPulseAnimation(): void {
  if (pulseAnimFrame !== null) {
    cancelAnimationFrame(pulseAnimFrame);
    pulseAnimFrame = null;
  }
}

// ── Card Info ────────────────────────────────────────────────────────────

/** Event info for the highlight card. */
export interface HighlightCardInfo {
  /** Event title. */
  title: string;
  /** Venue name. */
  venue: string;
  /** Formatted date string. */
  date: string;
  /** Source label. */
  source: string;
  /** Price label (e.g. "Free", "$25"). */
  price: string;
}

// ── Canvas Card Rendering ────────────────────────────────────────────────

/** Truncates text to fit within a pixel width. */
function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(t + "...").width > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "...";
}

/**
 * Renders a horizontal flyover card onto a canvas and registers it with the map.
 * @param map - MapLibre map instance.
 * @param url - Image URL to load.
 * @param imageId - ID to register the image under.
 * @param info - Event text info for the right panel.
 * @returns Promise resolving to true if rendered successfully.
 */
export async function loadHighlightImage(
  map: maplibregl.Map,
  url: string,
  imageId: string,
  info?: HighlightCardInfo,
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = CARD_WIDTH;
      const h = CARD_HEIGHT;
      const stemH = 10;
      const totalH = h + stemH;
      const radius = 14;
      const thumbW = THUMB_WIDTH;
      const textX = thumbW + 12;
      const textMaxW = w - textX - 12;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = totalH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(false); return; }

      // Card background
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, radius);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "rgba(10, 10, 15, 0.92)";
      ctx.fillRect(0, 0, w, h);

      // Left thumbnail — centre-crop to fill
      const srcAspect = img.naturalWidth / img.naturalHeight;
      const dstAspect = thumbW / h;
      let srcX = 0, srcY = 0, srcW = img.naturalWidth, srcH = img.naturalHeight;
      if (srcAspect > dstAspect) {
        srcW = Math.round(img.naturalHeight * dstAspect);
        srcX = Math.round((img.naturalWidth - srcW) / 2);
      } else {
        srcH = Math.round(img.naturalWidth / dstAspect);
        srcY = Math.round((img.naturalHeight - srcH) / 2);
      }
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, thumbW, h);
      ctx.restore();

      // Right panel text
      if (info) {
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillText(truncateText(ctx, info.title, textMaxW), textX, 24);

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(truncateText(ctx, info.venue, textMaxW), textX, 42);

        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.fillText(truncateText(ctx, info.date, textMaxW), textX, 60);

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText(truncateText(ctx, info.source, textMaxW), textX, 78);

        if (info.price) {
          ctx.font = "bold 13px sans-serif";
          ctx.fillStyle = info.price === "Free" ? "#00D4AA" : "#66AAF0";
          ctx.fillText(info.price, textX, 98);
        }
      }

      // Stem connector triangle
      ctx.beginPath();
      ctx.moveTo(w / 2 - 7, h - 1);
      ctx.lineTo(w / 2, h + stemH);
      ctx.lineTo(w / 2 + 7, h - 1);
      ctx.closePath();
      ctx.fillStyle = "rgba(10, 10, 15, 0.92)";
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.roundRect(0.5, 0.5, w - 1, h - 1, radius);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const imageData = ctx.getImageData(0, 0, w, totalH);

      if (map.hasImage(imageId)) map.removeImage(imageId);
      map.addImage(imageId, {
        width: w,
        height: totalH,
        data: new Uint8Array(imageData.data.buffer),
      });

      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// ── Hover Card (lightweight, no pulse) ───────────────────────────────────

/**
 * Shows a floating event card above a point (hover only, no golden pulse).
 * Uses a separate source/layer set from the selection highlight.
 */
export function showHoverCard(
  map: maplibregl.Map,
  coordinates: [number, number],
  imageUrl?: string,
  cardInfo?: HighlightCardInfo,
): void {
  if (!map.getStyle()) return;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: { type: "Point", coordinates },
      properties: {},
    }],
  };

  const source = map.getSource(HOVER_SOURCE) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(geojson);
  } else {
    map.addSource(HOVER_SOURCE, { type: "geojson", data: geojson });
  }

  if (imageUrl) {
    if (map.getLayer(HOVER_IMAGE_LAYER)) {
      map.removeLayer(HOVER_IMAGE_LAYER);
    }

    loadHighlightImage(map, imageUrl, HOVER_IMAGE_ID, cardInfo).then((ok) => {
      if (!ok || !map.getStyle() || !map.getSource(HOVER_SOURCE)) return;
      if (map.getLayer(HOVER_IMAGE_LAYER)) return;

      map.addLayer({
        id: HOVER_IMAGE_LAYER,
        type: "symbol",
        source: HOVER_SOURCE,
        layout: {
          "icon-image": HOVER_IMAGE_ID,
          "icon-size": 1.0,
          "icon-anchor": "bottom",
          "icon-offset": [0, -24] as [number, number],
          "icon-allow-overlap": true,
        },
        paint: { "icon-opacity": 0.95 },
      });
    });
  }
}

/** Removes the hover card from the map. */
export function removeHoverCard(map: maplibregl.Map): void {
  if (!map.getStyle()) return;

  if (map.getLayer(HOVER_IMAGE_LAYER)) map.removeLayer(HOVER_IMAGE_LAYER);
  if (map.getSource(HOVER_SOURCE)) map.removeSource(HOVER_SOURCE);
  if (map.hasImage(HOVER_IMAGE_ID)) map.removeImage(HOVER_IMAGE_ID);
}

// ── Selection Highlight (card + golden pulse) ────────────────────────────

/**
 * Shows a full venue highlight: floating card + golden pulsating orb.
 * Used for click-to-select, show-on-map, and flyover.
 */
export function selectEventHighlight(
  map: maplibregl.Map,
  coordinates: [number, number],
  imageUrl?: string,
  cardInfo?: HighlightCardInfo,
): void {
  if (!map.getStyle()) return;

  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: { type: "Point", coordinates },
      properties: {},
    }],
  };

  const source = map.getSource(HIGHLIGHT_SOURCE) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(geojson);
  } else {
    map.addSource(HIGHLIGHT_SOURCE, { type: "geojson", data: geojson });

    map.addLayer({
      id: HIGHLIGHT_GLOW_LAYER,
      type: "circle",
      source: HIGHLIGHT_SOURCE,
      paint: {
        "circle-radius": 60,
        "circle-color": "#FFD700",
        "circle-opacity": 0.15,
        "circle-blur": 1,
      },
    });

    map.addLayer({
      id: HIGHLIGHT_PULSE_LAYER,
      type: "circle",
      source: HIGHLIGHT_SOURCE,
      paint: {
        "circle-radius": 20,
        "circle-color": "#FFD700",
        "circle-opacity": 0.5,
        "circle-stroke-width": 3,
        "circle-stroke-color": "#FFD700",
        "circle-stroke-opacity": 0.8,
      },
    });

    startPulseAnimation(map);
  }

  if (imageUrl) {
    if (map.getLayer(HIGHLIGHT_IMAGE_LAYER)) {
      map.removeLayer(HIGHLIGHT_IMAGE_LAYER);
    }

    loadHighlightImage(map, imageUrl, HIGHLIGHT_IMAGE_ID, cardInfo).then((ok) => {
      if (!ok || !map.getStyle() || !map.getSource(HIGHLIGHT_SOURCE)) return;
      if (map.getLayer(HIGHLIGHT_IMAGE_LAYER)) return;

      map.addLayer({
        id: HIGHLIGHT_IMAGE_LAYER,
        type: "symbol",
        source: HIGHLIGHT_SOURCE,
        layout: {
          "icon-image": HIGHLIGHT_IMAGE_ID,
          "icon-size": 1.0,
          "icon-anchor": "bottom",
          "icon-offset": [0, -24] as [number, number],
          "icon-allow-overlap": true,
        },
        paint: { "icon-opacity": 0.95 },
      });
    });
  }
}

/** Removes the selection highlight (orb, pulse, card) from the map. */
export function deselectEventHighlight(map: maplibregl.Map): void {
  if (!map.getStyle()) return;

  stopPulseAnimation();

  if (map.getLayer(HIGHLIGHT_IMAGE_LAYER)) map.removeLayer(HIGHLIGHT_IMAGE_LAYER);
  if (map.getLayer(HIGHLIGHT_PULSE_LAYER)) map.removeLayer(HIGHLIGHT_PULSE_LAYER);
  if (map.getLayer(HIGHLIGHT_GLOW_LAYER)) map.removeLayer(HIGHLIGHT_GLOW_LAYER);
  if (map.getSource(HIGHLIGHT_SOURCE)) map.removeSource(HIGHLIGHT_SOURCE);
  if (map.hasImage(HIGHLIGHT_IMAGE_ID)) map.removeImage(HIGHLIGHT_IMAGE_ID);
}

// ── Card Info Builder ────────────────────────────────────────────────────

/**
 * Builds a HighlightCardInfo from event properties.
 * @param props - GeoJSON feature properties or event entry fields.
 * @returns Card info for the canvas renderer.
 */
export function buildCardInfo(props: {
  title?: string;
  venue?: string;
  startDate?: string;
  source?: { type: string } | string;
  price?: { min: number; max: number; isFree: boolean } | null;
}): HighlightCardInfo {
  const sourceType = typeof props.source === "object" && props.source
    ? props.source.type
    : String(props.source ?? "");

  const sourceLabel = sourceType === "manual" ? "Curated"
    : sourceType ? sourceType.charAt(0).toUpperCase() + sourceType.slice(1)
    : "";

  const priceLabel = props.price?.isFree
    ? "Free"
    : props.price
      ? `$${props.price.min}${props.price.max > props.price.min ? `–$${props.price.max}` : ""}`
      : "";

  return {
    title: props.title ?? "",
    venue: props.venue ?? "",
    date: props.startDate
      ? new Date(props.startDate).toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric",
          hour: "numeric", minute: "2-digit",
        })
      : "",
    source: sourceLabel,
    price: priceLabel,
  };
}
