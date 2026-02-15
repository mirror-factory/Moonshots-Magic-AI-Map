/**
 * @module components/map/data-layers/map-weather-layer
 * Headless weather overlay component: renders radar tiles from RainViewer
 * (free, no key) and fetches current conditions from Open-Meteo.
 * Zooms to user location and shows prominent weather UI on map.
 * Returns null — manages MapLibre sources/layers via useEffect.
 * Card UI is rendered by the unified DataLayerInfoPanel.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "../use-map";
import { flyToPoint } from "@/lib/map/camera-utils";
import type { WeatherSubType } from "@/lib/map/data-layers";

/** Source and layer IDs for weather radar overlay. */
const RADAR_SOURCE = "weather-radar-source";
const RADAR_LAYER = "weather-radar-layer";

/** Sky tint overlay source/layer IDs. */
const SKY_TINT_SOURCE = "weather-sky-tint-source";
const SKY_TINT_LAYER = "weather-sky-tint-layer";

/** Weather condition marker source/layer. */
const WEATHER_MARKER_SOURCE = "weather-marker-source";
const WEATHER_MARKER_LABEL = "weather-marker-label";

/** Returns a WMO weather code description + tint color. */
function getWeatherInfo(code: number): { label: string; tint: string; emoji: string } {
  if (code === 0) return { label: "Clear sky", tint: "rgba(255, 200, 50, 0.06)", emoji: "☀️" };
  if (code <= 3) return { label: "Partly cloudy", tint: "rgba(200, 200, 220, 0.06)", emoji: "⛅" };
  if (code <= 49) return { label: "Foggy", tint: "rgba(180, 180, 200, 0.08)", emoji: "🌫️" };
  if (code <= 69) return { label: "Rainy", tint: "rgba(60, 100, 200, 0.08)", emoji: "🌧️" };
  if (code <= 79) return { label: "Snowy", tint: "rgba(220, 230, 255, 0.08)", emoji: "🌨️" };
  if (code <= 99) return { label: "Thunderstorm", tint: "rgba(80, 60, 120, 0.10)", emoji: "⛈️" };
  return { label: "Weather active", tint: "rgba(100, 150, 255, 0.06)", emoji: "🌤️" };
}

/** Open-Meteo API URL for Orlando current weather. */
const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=28.54&longitude=-81.38&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m,relative_humidity_2m,apparent_temperature,precipitation,cloudcover&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch";

/** RainViewer API for latest radar tile timestamps. */
const RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";

/** Props for {@link MapWeatherLayer}. */
interface MapWeatherLayerProps {
  /** Whether this layer is active. */
  active: boolean;
  /** Weather sub-type to display. */
  subType: WeatherSubType;
  /** Callback when weather data is fetched. */
  onDataReady?: (data: unknown) => void;
  /** Callback when loading state changes. */
  onLoadingChange?: (loading: boolean) => void;
}

/** Headless weather overlay: radar tiles on map + data fetch for info panel. */
export function MapWeatherLayer({
  active,
  subType,
  onDataReady,
  onLoadingChange,
}: MapWeatherLayerProps) {
  const map = useMap();
  const fetchedRef = useRef(false);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const onDataReadyRef = useRef(onDataReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  onDataReadyRef.current = onDataReady;
  onLoadingChangeRef.current = onLoadingChange;

  // Always show RainViewer radar tiles when weather layer is active
  useEffect(() => {
    if (!map || !active) return;

    const cleanup = () => {
      if (map.getLayer(RADAR_LAYER)) map.removeLayer(RADAR_LAYER);
      if (map.getSource(RADAR_SOURCE)) map.removeSource(RADAR_SOURCE);
    };

    let cancelled = false;

    /** Suppress RainViewer tile 404 errors (clear-sky areas have no tiles). */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const radarErrorHandler = (e: any) => {
      if (e?.error?.message?.includes("tilecache.rainviewer.com")) {
        e.preventDefault?.();
      }
    };

    (async () => {
      try {
        const res = await fetch(RAINVIEWER_API);
        if (!res.ok) throw new Error(`RainViewer ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        // Get latest radar frame timestamp
        const radarFrames = data?.radar?.past ?? [];
        const latestFrame = radarFrames[radarFrames.length - 1];
        if (!latestFrame?.path) return;

        // RainViewer tile URL: color scheme 6 = universal blue, smooth=1
        const tileUrl = `https://tilecache.rainviewer.com${latestFrame.path}/256/{z}/{x}/{y}/6/1_1.png`;

        cleanup();

        map.addSource(RADAR_SOURCE, {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: "&copy; RainViewer",
        });

        const beforeLayer = map.getLayer("events-glow-layer") ? "events-glow-layer" : undefined;
        map.addLayer(
          {
            id: RADAR_LAYER,
            type: "raster",
            source: RADAR_SOURCE,
            paint: {
              "raster-opacity": 0.75,
              "raster-fade-duration": 300,
            },
          },
          beforeLayer,
        );
        // Suppress 404 tile errors — RainViewer returns 404 for clear-sky tiles
        map.on("error", radarErrorHandler);
      } catch (err) {
        console.error("[WeatherLayer] RainViewer fetch failed:", err);
      }
    })();

    return () => {
      cancelled = true;
      map.off("error", radarErrorHandler);
      cleanup();
    };
  }, [map, active]);

  // Remove radar + overlays on deactivation
  useEffect(() => {
    if (!map || active) return;
    if (map.getLayer(RADAR_LAYER)) map.removeLayer(RADAR_LAYER);
    if (map.getSource(RADAR_SOURCE)) map.removeSource(RADAR_SOURCE);
    if (map.getLayer(SKY_TINT_LAYER)) map.removeLayer(SKY_TINT_LAYER);
    if (map.getSource(SKY_TINT_SOURCE)) map.removeSource(SKY_TINT_SOURCE);
    if (map.getLayer(WEATHER_MARKER_LABEL)) map.removeLayer(WEATHER_MARKER_LABEL);
    if (map.getSource(WEATHER_MARKER_SOURCE)) map.removeSource(WEATHER_MARKER_SOURCE);
    fetchedRef.current = false;
    setWeatherCode(null);
    setTemperature(null);
  }, [map, active]);

  // Fetch current weather from Open-Meteo
  useEffect(() => {
    if (!active || fetchedRef.current) return;

    onLoadingChangeRef.current?.(true);
    fetchedRef.current = true;

    fetch(OPEN_METEO_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const current = data?.current;
        if (current) {
          setWeatherCode(current.weathercode ?? current.weather_code ?? 0);
          setTemperature(Math.round(current.temperature_2m ?? 0));
        }
        onDataReadyRef.current?.(data);
      })
      .catch((err) => {
        console.error("[WeatherLayer] Open-Meteo fetch failed:", err);
      })
      .finally(() => {
        onLoadingChangeRef.current?.(false);
      });
  }, [active]);

  // Zoom to user location when weather activates
  useEffect(() => {
    if (!map || !active) return;

    // Use the map center (which is where the user is looking) as the weather location
    const center = map.getCenter();
    void flyToPoint(map, [center.lng, center.lat], {
      zoom: 13,
      pitch: 45,
      bearing: 0,
      duration: 1500,
    });
  // Only run once on activation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, active]);

  // Sky tint + prominent weather condition label on the map
  useEffect(() => {
    if (!map || !active || weatherCode === null) return;

    const info = getWeatherInfo(weatherCode);
    const tempStr = temperature !== null ? `${temperature}°F` : "";
    const label = `${info.emoji}  ${tempStr}  ${info.label}`;

    const cleanupOverlays = () => {
      if (map.getLayer(SKY_TINT_LAYER)) map.removeLayer(SKY_TINT_LAYER);
      if (map.getSource(SKY_TINT_SOURCE)) map.removeSource(SKY_TINT_SOURCE);
      if (map.getLayer(WEATHER_MARKER_LABEL)) map.removeLayer(WEATHER_MARKER_LABEL);
      if (map.getSource(WEATHER_MARKER_SOURCE)) map.removeSource(WEATHER_MARKER_SOURCE);
    };

    cleanupOverlays();

    // Full-extent sky tint polygon — stronger tint
    map.addSource(SKY_TINT_SOURCE, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[-82.5, 27.5], [-80, 27.5], [-80, 29.5], [-82.5, 29.5], [-82.5, 27.5]]],
        },
        properties: {},
      },
    });

    const beforeLayer = map.getLayer("events-glow-layer") ? "events-glow-layer" : undefined;
    map.addLayer(
      {
        id: SKY_TINT_LAYER,
        type: "fill",
        source: SKY_TINT_SOURCE,
        paint: {
          "fill-color": info.tint.replace(/[\d.]+\)$/, "1)"),
          "fill-opacity": 0.12,
        },
      },
      beforeLayer,
    );

    // Weather condition label — large and prominent at map center
    const center = map.getCenter();
    map.addSource(WEATHER_MARKER_SOURCE, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: { type: "Point", coordinates: [center.lng, center.lat] },
          properties: { label, temp: tempStr, condition: info.label },
        }],
      },
    });

    map.addLayer({
      id: WEATHER_MARKER_LABEL,
      type: "symbol",
      source: WEATHER_MARKER_SOURCE,
      layout: {
        "text-field": ["get", "label"],
        "text-size": [
          "interpolate", ["linear"], ["zoom"],
          8, 18,
          12, 28,
          16, 38,
        ],
        "text-font": ["Open Sans Bold"],
        "text-anchor": "center",
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-letter-spacing": 0.05,
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "rgba(0, 0, 0, 0.85)",
        "text-halo-width": 3,
        "text-halo-blur": 1,
        "text-opacity": 0.9,
      },
    });

    return cleanupOverlays;
  }, [map, active, weatherCode, temperature]);

  return null;
}
