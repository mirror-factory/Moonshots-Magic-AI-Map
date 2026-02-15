/**
 * @module components/map/data-layers/layer-popup
 * Shared hover popup utility for data layer map markers.
 * Creates glass-morphism styled MapLibre popups on mouseenter/mouseleave.
 */

import maplibregl from "maplibre-gl";

/** Unique ID for the injected style element. */
const STYLE_ID = "dl-popup-styles";

/** CSS for data layer popups. */
const POPUP_CSS = `
.dl-popup .maplibregl-popup-content {
  background: rgba(10, 10, 15, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 12px;
  padding: 0;
  font-family: var(--font-rajdhani), system-ui, sans-serif;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  max-width: 320px;
  overflow: hidden;
}
.dl-popup .maplibregl-popup-content .maplibregl-popup-close-button {
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
  padding: 4px 8px;
  line-height: 1;
  z-index: 2;
}
.dl-popup .maplibregl-popup-content .maplibregl-popup-close-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
.dl-popup .maplibregl-popup-tip {
  border-top-color: rgba(10, 10, 15, 0.92);
}
.dl-popup .dl-img-wrap {
  position: relative;
  width: 100%;
  height: 130px;
  overflow: hidden;
}
.dl-popup .dl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.dl-popup .dl-img-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,15,0.85) 0%, transparent 60%);
}
.dl-popup .dl-img-badge {
  position: absolute;
  bottom: 6px;
  left: 10px;
}
.dl-popup .dl-body {
  padding: 0 0 8px;
}
.dl-popup .dl-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 1px;
  line-height: 1.2;
}
.dl-popup .dl-category {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 3px;
}
.dl-popup .dl-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 2px;
  line-height: 1.3;
}
.dl-popup .dl-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.dl-popup .dl-detail {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.4;
  margin-top: 4px;
}
.dl-popup .dl-timeline {
  display: flex;
  gap: 10px;
  margin-top: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}
.dl-popup .dl-timeline-label {
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  font-weight: 600;
  font-size: 9px;
}
.dl-popup .dl-invest {
  margin-top: 5px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(53, 96, 255, 0.9);
}
.dl-popup .dl-address {
  margin-top: 5px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
}
`;

/**
 * Injects popup CSS into document head.
 * Uses a fixed element ID so styles are always replaced on code updates.
 */
function injectCSS(): void {
  if (typeof document === "undefined") return;
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = POPUP_CSS;
}

/** Public entry point for injecting popup CSS (used by persistent popups). */
export function injectPopupCSS(): void {
  injectCSS();
}

/**
 * Adds hover popup behavior to a MapLibre circle or symbol layer.
 * Returns a cleanup function to remove listeners and popup.
 *
 * @param map - MapLibre map instance.
 * @param layerId - Layer ID to attach hover to.
 * @param formatContent - Function that receives feature properties and returns popup HTML.
 * @returns Cleanup function.
 */
export function addLayerHoverPopup(
  map: maplibregl.Map,
  layerId: string,
  formatContent: (props: Record<string, unknown>) => string,
): () => void {
  injectCSS();

  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "dl-popup",
    offset: 12,
    maxWidth: "280px",
  });

  const onMouseEnter = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
    if (!e.features?.length) return;
    map.getCanvas().style.cursor = "pointer";

    const feature = e.features[0];
    const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
    const props = feature.properties ?? {};

    popup.setLngLat(coords).setHTML(formatContent(props as Record<string, unknown>)).addTo(map);
  };

  const onMouseLeave = () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  };

  map.on("mouseenter", layerId, onMouseEnter);
  map.on("mouseleave", layerId, onMouseLeave);

  return () => {
    map.off("mouseenter", layerId, onMouseEnter);
    map.off("mouseleave", layerId, onMouseLeave);
    popup.remove();
  };
}
