/**
 * @module components/map/data-layers/map-developments-layer
 * Headless component that renders Downtown Orlando development projects.
 * Color-coded by status: proposed (amber), in-progress (blue), completed (green).
 * Click-to-select triggers golden pulse + persistent popup + flyTo.
 * Hover shows popup for non-selected features only.
 * Syncs with the info panel carousel via selectedIndex / onSelectIndex.
 * Returns null — manages MapLibre sources/layers via useEffect.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../use-map";
import { stopDataLayerRotation } from "./layer-rotation";
import { injectPopupCSS } from "./layer-popup";
import {
  selectEventHighlight,
  deselectEventHighlight,
  startPulseAnimation,
} from "@/lib/map/venue-highlight";

/** Source and layer IDs. */
const DEV_SOURCE = "developments-source";
const DEV_GLOW = "developments-glow";
const DEV_CIRCLES = "developments-circles";
const DEV_LABELS = "developments-labels";

/** Development project from the API. */
interface DevProject {
  id: string;
  name: string;
  status: string;
  description: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  timelineStart: string | null;
  timelineCompletion: string | null;
  investment: string | null;
  statusColor: string;
  categoryColor: string;
}

/** Props for {@link MapDevelopmentsLayer}. */
interface MapDevelopmentsLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Callback when data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
  /** Currently selected project index (controlled by carousel). */
  selectedIndex?: number;
  /** Callback when a project is selected on the map (syncs carousel). */
  onSelectIndex?: (index: number) => void;
}

/** Status labels for display. */
const STATUS_LABELS: Record<string, string> = {
  proposed: "Proposed",
  "in-progress": "In Progress",
  completed: "Completed",
};

/** Category labels for display. */
const CAT_LABELS: Record<string, string> = {
  commercial: "Commercial",
  residential: "Residential",
  "mixed-use": "Mixed Use",
  "public-space": "Public Space",
  hospitality: "Hospitality",
  institutional: "Institutional",
};

/**
 * Builds rich HTML content for a development project popup.
 * Card-style layout: image with gradient overlay + badge, then details below.
 */
function buildDevPopupHtml(p: DevProject): string {
  const statusLabel = STATUS_LABELS[p.status] ?? p.status;
  const catLabel = CAT_LABELS[p.category] ?? p.category ?? "";
  const imgHtml = p.imageUrl
    ? `<div class="dl-img-wrap"><img class="dl-img" src="${p.imageUrl}" alt="" onerror="this.parentElement.style.display='none'" /><div class="dl-img-gradient"></div><div class="dl-img-badge"><span class="dl-badge" style="background:${p.statusColor};color:#fff">${statusLabel}</span></div></div>`
    : "";
  const hasStart = p.timelineStart && p.timelineStart !== "";
  const hasEnd = p.timelineCompletion && p.timelineCompletion !== "";
  const timelineHtml = hasStart || hasEnd
    ? `<div class="dl-timeline">${hasStart ? `<div><span class="dl-timeline-label">Start</span><br/>${p.timelineStart}</div>` : ""}${hasEnd ? `<div><span class="dl-timeline-label">Completion</span><br/>${p.timelineCompletion}</div>` : ""}</div>`
    : "";
  return (
    imgHtml +
    `<div class="dl-body">` +
    `<div class="dl-title">${p.name}</div>` +
    (!p.imageUrl ? `<div class="dl-badge" style="background:${p.statusColor};color:#fff">${statusLabel}</div> ` : "") +
    (catLabel ? `<div class="dl-category">${catLabel}</div>` : "") +
    `<div class="dl-detail">${p.description}</div>` +
    timelineHtml +
    (p.investment ? `<div class="dl-invest">${p.investment} investment</div>` : "") +
    (p.address ? `<div class="dl-address">\u{1F4CD} ${p.address}</div>` : "") +
    `</div>`
  );
}

/**
 * Builds popup HTML from GeoJSON feature properties.
 * Properties are all strings since MapLibre serializes them.
 * Same card-style layout as buildDevPopupHtml.
 */
function buildPropsPopupHtml(props: Record<string, unknown>): string {
  const statusLabel = STATUS_LABELS[String(props.status)] ?? String(props.status);
  const catLabel = CAT_LABELS[String(props.category)] ?? String(props.category ?? "");
  const color = String(props.color);
  const imgUrl = props.imageUrl && String(props.imageUrl) !== "" ? String(props.imageUrl) : "";
  const imgHtml = imgUrl
    ? `<div class="dl-img-wrap"><img class="dl-img" src="${imgUrl}" alt="" onerror="this.parentElement.style.display='none'" /><div class="dl-img-gradient"></div><div class="dl-img-badge"><span class="dl-badge" style="background:${color};color:#fff">${statusLabel}</span></div></div>`
    : "";
  const hasStart = props.timelineStart && String(props.timelineStart) !== "";
  const hasEnd = props.timelineCompletion && String(props.timelineCompletion) !== "";
  const timelineHtml = hasStart || hasEnd
    ? `<div class="dl-timeline">${hasStart ? `<div><span class="dl-timeline-label">Start</span><br/>${String(props.timelineStart)}</div>` : ""}${hasEnd ? `<div><span class="dl-timeline-label">Completion</span><br/>${String(props.timelineCompletion)}</div>` : ""}</div>`
    : "";
  const invest = props.investment && String(props.investment) !== "" ? String(props.investment) : "";
  return (
    imgHtml +
    `<div class="dl-body">` +
    `<div class="dl-title">${props.name ?? "Project"}</div>` +
    (!imgUrl ? `<span class="dl-badge" style="background:${color};color:#fff">${statusLabel}</span> ` : "") +
    (catLabel ? `<div class="dl-category">${catLabel}</div>` : "") +
    `<div class="dl-detail">${props.description ?? ""}</div>` +
    timelineHtml +
    (invest ? `<div class="dl-invest">${invest} investment</div>` : "") +
    (props.address ? `<div class="dl-address">\u{1F4CD} ${String(props.address)}</div>` : "") +
    `</div>`
  );
}

/** Renders downtown Orlando development projects with carousel sync. */
export function MapDevelopmentsLayer({
  active,
  onDataReady,
  onLoadingChange,
  selectedIndex,
  onSelectIndex,
}: MapDevelopmentsLayerProps) {
  const map = useMap();
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onSelectIndexRef = useRef(onSelectIndex);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;
  onSelectIndexRef.current = onSelectIndex;

  /** Cached projects for index-based navigation. */
  const projectsRef = useRef<DevProject[]>([]);
  /** Currently highlighted index on the map (internal tracking). */
  const currentIndexRef = useRef<number>(-1);
  /** Persistent popup shown on click/select (stays until deselected). */
  const persistentPopupRef = useRef<maplibregl.Popup | null>(null);

  /** Fly to a project by index and show golden pulse + persistent popup. */
  const flyToProject = useCallback((index: number) => {
    if (!map || !map.getStyle()) return;
    const projects = projectsRef.current;
    if (index < 0 || index >= projects.length) return;

    const p = projects[index];
    const coords: [number, number] = [p.longitude, p.latitude];
    currentIndexRef.current = index;

    // Close previous persistent popup
    persistentPopupRef.current?.remove();
    persistentPopupRef.current = null;

    // Golden pulse only (no canvas card)
    stopDataLayerRotation();
    selectEventHighlight(map, coords);
    startPulseAnimation(map);

    // Create persistent popup with rich project details
    injectPopupCSS();
    const popup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: "dl-popup",
      offset: 20,
      maxWidth: "320px",
    });

    popup
      .setLngLat(coords)
      .setHTML(buildDevPopupHtml(p))
      .addTo(map);

    // Handle popup close → deselect
    popup.on("close", () => {
      if (persistentPopupRef.current === popup) {
        persistentPopupRef.current = null;
        currentIndexRef.current = -1;
        deselectEventHighlight(map);
      }
    });

    persistentPopupRef.current = popup;

    // FlyTo with cinematic pitch, offset slightly down so popup is centered
    map.flyTo({
      center: coords,
      zoom: Math.max(map.getZoom(), 16),
      pitch: 55,
      duration: 1500,
      offset: [0, 60],
    });
  }, [map]);

  // React to carousel index changes (external navigation)
  useEffect(() => {
    if (selectedIndex === undefined || selectedIndex < 0) return;
    if (selectedIndex === currentIndexRef.current) return;
    if (!active || projectsRef.current.length === 0) return;
    flyToProject(selectedIndex);
  }, [selectedIndex, active, flyToProject]);

  // Main data fetch + layer setup
  useEffect(() => {
    if (!map) return;

    let cancelled = false;
    let cleanupFns: (() => void)[] = [];

    const cleanup = () => {
      cancelled = true;
      for (const fn of cleanupFns) fn();
      cleanupFns = [];
      stopDataLayerRotation();
      persistentPopupRef.current?.remove();
      persistentPopupRef.current = null;
      deselectEventHighlight(map);
      currentIndexRef.current = -1;
      if (map.getLayer(DEV_LABELS)) map.removeLayer(DEV_LABELS);
      if (map.getLayer(DEV_CIRCLES)) map.removeLayer(DEV_CIRCLES);
      if (map.getLayer(DEV_GLOW)) map.removeLayer(DEV_GLOW);
      if (map.getSource(DEV_SOURCE)) map.removeSource(DEV_SOURCE);
    };

    if (!active) {
      cleanup();
      projectsRef.current = [];
      return;
    }

    onLoadingChangeRef.current?.(true);

    fetch("/api/layers/developments", { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`Developments API ${res.status}`);
        return res.json();
      })
      .then((data: { projects: DevProject[]; summary: Record<string, number> }) => {
        if (!map.getStyle() || cancelled) return;

        // Cache projects for index-based navigation
        projectsRef.current = data.projects;

        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.projects.map((p, i) => ({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [p.longitude, p.latitude],
            },
            properties: {
              id: p.id,
              index: i,
              name: p.name,
              status: p.status,
              color: p.statusColor,
              description: p.description,
              address: p.address,
              category: p.category,
              imageUrl: p.imageUrl ?? "",
              timelineStart: p.timelineStart ?? "",
              timelineCompletion: p.timelineCompletion ?? "",
              investment: p.investment ?? "",
            },
          })),
        };

        if (!map.getSource(DEV_SOURCE)) {
          map.addSource(DEV_SOURCE, { type: "geojson", data: geojson });
        } else {
          (map.getSource(DEV_SOURCE) as maplibregl.GeoJSONSource).setData(geojson);
        }

        // Glow
        if (!map.getLayer(DEV_GLOW)) {
          map.addLayer({
            id: DEV_GLOW,
            type: "circle",
            source: DEV_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                10, 14, 16, 30,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
              "circle-opacity": 0.25,
              "circle-blur": 0.5,
            },
          });
        }

        // Core dot
        if (!map.getLayer(DEV_CIRCLES)) {
          map.addLayer({
            id: DEV_CIRCLES,
            type: "circle",
            source: DEV_SOURCE,
            paint: {
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                10, 6, 16, 12,
              ] as unknown as maplibregl.ExpressionSpecification,
              "circle-color": ["get", "color"] as unknown as maplibregl.ExpressionSpecification,
              "circle-opacity": 0.9,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });
        }

        // Labels
        if (!map.getLayer(DEV_LABELS)) {
          map.addLayer({
            id: DEV_LABELS,
            type: "symbol",
            source: DEV_SOURCE,
            layout: {
              "text-field": ["get", "name"] as unknown as maplibregl.ExpressionSpecification,
              "text-size": 11,
              "text-offset": [0, 1.6] as [number, number],
              "text-anchor": "top",
              "text-font": ["Open Sans Bold"],
              "text-allow-overlap": false,
              "text-max-width": 12,
            },
            paint: {
              "text-color": "#ffffff",
              "text-halo-color": "rgba(0, 0, 0, 0.8)",
              "text-halo-width": 1.5,
            },
          });
        }

        // ── Custom hover popup (skips the currently selected feature) ──
        injectPopupCSS();
        const hoverPopup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: "dl-popup",
          offset: 12,
          maxWidth: "280px",
        });

        const onMouseEnter = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
          if (!e.features?.length) return;
          const feature = e.features[0];
          const featureIdx = Number(feature.properties?.index ?? -1);

          // Skip hover popup for the currently selected feature (it has a persistent popup)
          if (featureIdx === currentIndexRef.current) return;

          map.getCanvas().style.cursor = "pointer";
          const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
          const props = feature.properties ?? {};
          hoverPopup.setLngLat(coords).setHTML(buildPropsPopupHtml(props as Record<string, unknown>)).addTo(map);
        };

        const onMouseLeave = () => {
          map.getCanvas().style.cursor = "";
          hoverPopup.remove();
        };

        map.on("mouseenter", DEV_CIRCLES, onMouseEnter);
        map.on("mouseleave", DEV_CIRCLES, onMouseLeave);
        cleanupFns.push(() => {
          map.off("mouseenter", DEV_CIRCLES, onMouseEnter);
          map.off("mouseleave", DEV_CIRCLES, onMouseLeave);
          hoverPopup.remove();
        });

        // ── Click-to-select: notify carousel of selection ──
        const handleClick = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
          if (!e.features?.length) return;
          const feature = e.features[0];
          const props = feature.properties ?? {};
          const idx = Number(props.index ?? 0);

          if (idx === currentIndexRef.current) return;

          // Close hover popup if visible
          hoverPopup.remove();

          // Notify carousel (which will trigger flyToProject via the effect)
          onSelectIndexRef.current?.(idx);
        };

        // Click on empty map deselects
        const handleMapClick = (e: maplibregl.MapMouseEvent) => {
          if (currentIndexRef.current < 0) return;
          const features = map.queryRenderedFeatures(e.point, { layers: [DEV_CIRCLES] });
          if (features.length > 0) return;
          currentIndexRef.current = -1;
          persistentPopupRef.current?.remove();
          persistentPopupRef.current = null;
          deselectEventHighlight(map);
        };

        map.on("click", DEV_CIRCLES, handleClick);
        map.on("click", handleMapClick);
        cleanupFns.push(() => {
          map.off("click", DEV_CIRCLES, handleClick);
          map.off("click", handleMapClick);
        });

        // Auto-select first project on initial load — fly directly
        // (can't rely on the selectedIndex effect because parent state may already be 0)
        if (data.projects.length > 0) {
          flyToProject(0);
          onSelectIndexRef.current?.(0);
        }

        onDataReadyRef.current?.(data);
      })
      .catch((err) => {
        console.error("[Developments] Fetch failed:", err);
      })
      .finally(() => {
        onLoadingChangeRef.current?.(false);
      });

    return cleanup;
  }, [map, active, flyToProject]);

  return null;
}
