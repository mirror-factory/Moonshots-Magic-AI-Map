/**
 * @module components/map/data-layers/data-layer-info-panel
 * Unified bottom-left info panel that shows data summary, source attribution,
 * and AI analysis for the currently active data layer.
 * Includes a shimmer loading state while AI analysis is being generated.
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  AlertTriangle,
  Building2,
  Home,
  Bus,
  ChevronLeft,
  ChevronRight,
  Plane,
  Train,
  MapPin,
} from "lucide-react";
import {
  DATA_LAYER_CONFIGS,
  type DataLayerKey,
  type WeatherSubType,
} from "@/lib/map/data-layers";

/**
 * Formats a model ID like "anthropic/claude-3-5-haiku-latest" into a readable name.
 * @param modelId - The raw model identifier string.
 * @returns A human-friendly model name.
 */
function formatModelName(modelId: string): string {
  // "anthropic/claude-3-5-haiku-latest" → "Claude 3.5 Haiku"
  const parts = modelId.split("/");
  const name = parts[parts.length - 1]
    .replace(/-latest$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/(\d) (\d)/g, "$1.$2"); // "3 5" → "3.5"
  return name;
}

/** Data source attribution per layer. */
const DATA_SOURCES: Partial<Record<DataLayerKey, string>> = {
  weather: "Open-Meteo + RainViewer",
  transit: "LYNX GTFS-RT Feed",
  cityData: "Orlando Open Data (Socrata)",
  nwsAlerts: "National Weather Service",
  aircraft: "OpenSky Network",
  sunrail: "SunRail GTFS Static",
  developments: "Downtown Orlando DDB",
  countyData: "Orange County GIS (OCGIS)",
  evChargers: "NREL AFDC",
  airQuality: "AirNow EPA",
};

/** Props for {@link DataLayerInfoPanel}. */
interface DataLayerInfoPanelProps {
  /** Which layer is active. */
  layerKey: DataLayerKey;
  /** Raw data from the layer fetch. */
  data: unknown;
  /** Whether data is currently loading. */
  isLoading?: boolean;
  /** Whether AI analysis is being generated. */
  isAnalyzing?: boolean;
  /** AI analysis content, if available. */
  analysisContent?: string;
  /** AI model identifier used for the analysis. */
  analysisModel?: string;
  /** Weather sub-type (only for weather layer). */
  weatherSubType?: WeatherSubType;
  /** Callback to dismiss the panel. */
  onClose: () => void;
  /** Currently selected development index (synced with map). */
  selectedDevIndex?: number;
  /** Callback when carousel navigates to a different development. */
  onSelectDevIndex?: (index: number) => void;
}

/** Unified info panel showing data summary + source + AI analysis for a layer. */
export function DataLayerInfoPanel({
  layerKey,
  data,
  isLoading,
  isAnalyzing,
  analysisContent,
  analysisModel,
  weatherSubType,
  onClose,
  selectedDevIndex,
  onSelectDevIndex,
}: DataLayerInfoPanelProps) {
  const [dismissed, setDismissed] = useState(false);
  const config = DATA_LAYER_CONFIGS[layerKey];

  // Per-project AI analysis for developments (replaces generic analysis at top)
  const [devProjectAnalysis, setDevProjectAnalysis] = useState<string | null>(null);
  const [devProjectAnalyzing, setDevProjectAnalyzing] = useState(false);
  const devAnalysisAbortRef = useRef<AbortController | null>(null);

  const devData = layerKey === "developments" ? (data as { projects?: { name: string; status: string; description: string; category?: string; investment?: string | null; timelineStart?: string | null; timelineCompletion?: string | null }[] }) : null;
  const devIdx = selectedDevIndex !== undefined && selectedDevIndex >= 0 && (devData?.projects?.length ?? 0) > selectedDevIndex
    ? selectedDevIndex : 0;
  const devProject = devData?.projects?.[devIdx];

  useEffect(() => {
    if (layerKey !== "developments" || !devProject) return;

    setDevProjectAnalysis(null);
    setDevProjectAnalyzing(true);

    devAnalysisAbortRef.current?.abort();
    const controller = new AbortController();
    devAnalysisAbortRef.current = controller;

    fetch("/api/layers/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layerKey: "developments", data: { project: devProject } }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => {
        if (result?.analysis && !controller.signal.aborted) {
          setDevProjectAnalysis(result.analysis);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setDevProjectAnalyzing(false);
      });

    return () => controller.abort();
  }, [layerKey, devProject]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    onClose();
  }, [onClose]);

  if (dismissed) return null;

  // Show panel even while loading (with skeleton) or when data is ready
  const hasData = !!data;

  return (
    <div
      className="absolute bottom-16 left-4 z-20 w-80 overflow-y-auto rounded-xl p-4 shadow-xl"
      style={{
        background: "rgba(10, 10, 15, 0.88)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        fontFamily: "var(--font-rajdhani)",
        maxHeight: "calc(100vh - 10rem)",
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "rgba(255, 255, 255, 0.5)" }}
        >
          {config.icon} {config.label}
        </span>
        <button
          onClick={handleDismiss}
          className="rounded p-0.5 transition-colors hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" style={{ color: "rgba(255, 255, 255, 0.4)" }} />
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading && !hasData && (
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="h-4 w-1/2 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
      )}

      {/* AI Analysis section — per-project for developments, generic for others */}
      {layerKey === "developments" ? (
        devProjectAnalysis ? (
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#3560FF" }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
              {devProjectAnalysis}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 animate-pulse" style={{ color: "#3560FF" }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                {devProjectAnalyzing ? `Analyzing ${devProject?.name ?? "project"}...` : "Waiting for analysis..."}
              </p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full w-1/3 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, transparent, #3560FF, transparent)",
                    animation: "shimmer-slide 1.5s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        )
      ) : analysisContent ? (
        <div>
          <div className="flex items-start gap-2.5">
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "#3560FF" }}
            />
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255, 255, 255, 0.75)" }}
            >
              {analysisContent}
            </p>
          </div>
          {analysisModel && (
            <p
              className="mt-2 text-right text-[10px] italic"
              style={{ color: "rgba(255, 255, 255, 0.25)" }}
            >
              Analyzed by {formatModelName(analysisModel)}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <Sparkles
            className="h-4 w-4 shrink-0 animate-pulse"
            style={{ color: "#3560FF" }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              {isAnalyzing || !hasData ? `Analyzing ${config.label.toLowerCase()}...` : "Waiting for analysis..."}
            </p>
            {/* Shimmer bar */}
            <div
              className="mt-1.5 h-1 overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full w-1/3 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, #3560FF, transparent)",
                  animation: "shimmer-slide 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Layer-specific data summary */}
      {hasData && (
        <>
          <div className="mx-1 my-3 h-px" style={{ background: "rgba(255, 255, 255, 0.08)" }} />
          {layerKey === "weather" && <WeatherSummary data={data} subType={weatherSubType} />}
          {layerKey === "transit" && <TransitSummary data={data} />}
          {layerKey === "cityData" && <CityDataSummarySection data={data} />}
          {layerKey === "developments" && <DevelopmentsSummary data={data} selectedIndex={selectedDevIndex} onSelectIndex={onSelectDevIndex} />}
          {layerKey === "aircraft" && <AircraftSummary data={data} />}
          {layerKey === "sunrail" && <SunrailSummary data={data} />}
          {layerKey === "countyData" && <CountyDataSummary data={data} />}
          {layerKey === "nwsAlerts" && <NwsAlertsSummary data={data} />}
        </>
      )}

      {/* Data source attribution */}
      <div
        className="mt-3 rounded-md px-2.5 py-1.5"
        style={{ background: "rgba(255, 255, 255, 0.05)" }}
      >
        <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
          Source: {DATA_SOURCES[layerKey] ?? "Live data feed"}
        </p>
      </div>

      {/* Inline keyframes for shimmer */}
      <style>{`
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

// ── Weather Summary ────────────────────────────────────────────────

/** WMO weather code to description + icon. */
function weatherCodeInfo(code: number): { label: string; icon: React.ReactNode } {
  const cls = "h-5 w-5";
  if (code === 0) return { label: "Clear sky", icon: <Sun className={cls} /> };
  if (code <= 3) return { label: "Partly cloudy", icon: <Cloud className={cls} /> };
  if (code <= 49) return { label: "Foggy", icon: <CloudFog className={cls} /> };
  if (code <= 59) return { label: "Drizzle", icon: <CloudRain className={cls} /> };
  if (code <= 69) return { label: "Rain", icon: <CloudRain className={cls} /> };
  if (code <= 79) return { label: "Snow", icon: <CloudSnow className={cls} /> };
  if (code <= 84) return { label: "Rain showers", icon: <CloudRain className={cls} /> };
  if (code <= 86) return { label: "Snow showers", icon: <CloudSnow className={cls} /> };
  if (code <= 99) return { label: "Thunderstorm", icon: <CloudLightning className={cls} /> };
  return { label: "Unknown", icon: <Cloud className={cls} /> };
}

/** Weather data summary card content. */
function WeatherSummary({ data, subType }: { data: unknown; subType?: WeatherSubType }) {
  const d = data as { current?: Record<string, number> };
  const c = d.current;
  if (!c) return null;

  const temp = Math.round(c.temperature_2m);
  const feelsLike = Math.round(c.apparent_temperature);
  const code = c.weathercode;
  const windSpeed = Math.round(c.windspeed_10m);
  const humidity = c.relative_humidity_2m;
  const precip = c.precipitation;
  const clouds = c.cloudcover;
  const { label, icon } = weatherCodeInfo(code);

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <span style={{ color: "#60a5fa" }}>{icon}</span>
        <div>
          <p className="text-2xl font-bold leading-none text-white">{temp}°F</p>
          <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            {label} · Feels {feelsLike}°
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <StatRow icon={<Wind className="h-3.5 w-3.5" />} label="Wind" value={`${windSpeed} mph`} />
        <StatRow icon={<Droplets className="h-3.5 w-3.5" />} label="Humidity" value={`${humidity}%`} />
        <StatRow icon={<CloudRain className="h-3.5 w-3.5" />} label="Precip" value={`${precip}"`} />
        <StatRow icon={<Eye className="h-3.5 w-3.5" />} label="Clouds" value={`${clouds}%`} />
      </div>
      {subType === "radar" && (
        <div className="mt-3 rounded-md px-2.5 py-1.5" style={{ background: "rgba(53, 96, 255, 0.15)" }}>
          <p className="text-xs font-medium" style={{ color: "rgba(53, 96, 255, 0.8)" }}>
            Radar overlay active on map
          </p>
        </div>
      )}
    </>
  );
}

// ── Transit Summary ────────────────────────────────────────────────

/** Transit data summary card content. */
function TransitSummary({ data }: { data: unknown }) {
  const d = data as { busCount?: number; routeCount?: number };
  const busCount = d.busCount ?? 0;
  const routeCount = d.routeCount ?? 0;

  return (
    <div className="flex items-center gap-3">
      <Bus className="h-6 w-6" style={{ color: "#0077C8" }} />
      <div>
        <p className="text-2xl font-bold leading-none text-white">{busCount}</p>
        <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          active buses · {routeCount} routes
        </p>
      </div>
    </div>
  );
}

// ── City Data Summary ──────────────────────────────────────────────

/** Category info for the type badge. */
const CATEGORY_INFO: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  codeEnforcement: { label: "Code Enforcement", color: "#f87171", icon: <AlertTriangle className="h-4 w-4" /> },
  commercialPermit: { label: "Commercial", color: "#60a5fa", icon: <Building2 className="h-4 w-4" /> },
  residentialPermit: { label: "Residential", color: "#4ade80", icon: <Home className="h-4 w-4" /> },
};

/** City data summary card content. */
function CityDataSummarySection({ data }: { data: unknown }) {
  const d = data as { summary?: { total?: number; codeEnforcement?: number; commercialPermits?: number; residentialPermits?: number } };
  const summary = d.summary;
  if (!summary) return null;

  return (
    <>
      <p className="mb-3 text-2xl font-bold text-white">
        {summary.total ?? 0}{" "}
        <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.5)" }}>
          active cases
        </span>
      </p>
      <div className="space-y-2">
        {(summary.codeEnforcement ?? 0) > 0 && (
          <CategoryRow info={CATEGORY_INFO.codeEnforcement} count={summary.codeEnforcement!} />
        )}
        {(summary.commercialPermits ?? 0) > 0 && (
          <CategoryRow info={CATEGORY_INFO.commercialPermit} count={summary.commercialPermits!} />
        )}
        {(summary.residentialPermits ?? 0) > 0 && (
          <CategoryRow info={CATEGORY_INFO.residentialPermit} count={summary.residentialPermits!} />
        )}
      </div>
    </>
  );
}

// ── Developments Summary (Carousel) ──────────────────────────────

/** Development project shape from API. */
interface DevProject {
  name: string;
  status: string;
  description: string;
  address?: string;
  category?: string;
  imageUrl?: string | null;
  timelineStart?: string | null;
  timelineCompletion?: string | null;
  investment?: string | null;
}

/** Status badge colors. */
const STATUS_COLORS: Record<string, string> = {
  proposed: "#f59e0b",
  "in-progress": "#3b82f6",
  completed: "#22c55e",
};

/** Status label formatting. */
const STATUS_LABELS: Record<string, string> = {
  proposed: "Proposed",
  "in-progress": "In Progress",
  completed: "Completed",
};

/** Category label formatting. */
const CATEGORY_LABELS: Record<string, string> = {
  commercial: "Commercial",
  residential: "Residential",
  "mixed-use": "Mixed Use",
  "public-space": "Public Space",
  hospitality: "Hospitality",
  institutional: "Institutional",
};

/** Minimal developments carousel — name + status badge + category + nav arrows. */
function DevelopmentsSummary({
  data,
  selectedIndex,
  onSelectIndex,
}: {
  data: unknown;
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
}) {
  const d = data as { projects?: DevProject[]; summary?: Record<string, number> };
  const projects = d.projects ?? [];
  const summary = d.summary;

  // Use controlled index from parent, fallback to 0
  const idx = selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < projects.length
    ? selectedIndex
    : 0;

  if (projects.length === 0) return null;

  const project = projects[idx];
  const statusColor = STATUS_COLORS[project.status] ?? "#888";
  const statusLabel = STATUS_LABELS[project.status] ?? project.status;
  const categoryLabel = CATEGORY_LABELS[project.category ?? ""] ?? project.category;

  const goPrev = () => {
    const next = (idx - 1 + projects.length) % projects.length;
    onSelectIndex?.(next);
  };

  const goNext = () => {
    const next = (idx + 1) % projects.length;
    onSelectIndex?.(next);
  };

  return (
    <>
      {/* Summary counts */}
      {summary && (
        <div className="mb-3 flex items-center gap-3">
          <Building2 className="h-5 w-5" style={{ color: "#60a5fa" }} />
          <div>
            <p className="text-2xl font-bold leading-none text-white">{summary.total ?? projects.length}</p>
            <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              {summary.proposed ?? 0} proposed · {summary.inProgress ?? 0} in progress · {summary.completed ?? 0} completed
            </p>
          </div>
        </div>
      )}

      {/* Compact carousel card — name + status + category only */}
      <div
        className="rounded-lg px-3 py-2.5"
        style={{ background: "rgba(255, 255, 255, 0.05)", border: `1px solid ${statusColor}33` }}
      >
        {/* Navigation header */}
        <div className="mb-1.5 flex items-center justify-between">
          <button
            onClick={goPrev}
            className="rounded p-0.5 transition-colors hover:bg-white/10"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.5)" }} />
          </button>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
            {idx + 1} / {projects.length}
          </span>
          <button
            onClick={goNext}
            className="rounded p-0.5 transition-colors hover:bg-white/10"
            aria-label="Next project"
          >
            <ChevronRight className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.5)" }} />
          </button>
        </div>

        {/* Project name + status badge + category */}
        <p className="text-sm font-semibold text-white">{project.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
            style={{ background: statusColor, color: "#fff" }}
          >
            {statusLabel}
          </span>
          {categoryLabel && (
            <span className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
              {categoryLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

// ── Aircraft Summary ──────────────────────────────────────────────

/** Aircraft data summary card content. */
function AircraftSummary({ data }: { data: unknown }) {
  const d = data as { aircraftCount?: number; aircraft?: { onGround?: boolean }[] };
  const total = d.aircraftCount ?? d.aircraft?.length ?? 0;
  const inFlight = d.aircraft?.filter((a) => !a.onGround).length ?? total;

  return (
    <div className="flex items-center gap-3">
      <Plane className="h-6 w-6" style={{ color: "#3b82f6" }} />
      <div>
        <p className="text-2xl font-bold leading-none text-white">{inFlight}</p>
        <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          aircraft in flight{total > inFlight ? ` · ${total - inFlight} on ground` : ""}
        </p>
      </div>
    </div>
  );
}

// ── SunRail Summary ──────────────────────────────────────────────

/** SunRail data summary card content. */
function SunrailSummary({ data }: { data: unknown }) {
  const d = data as { stationCount?: number; stations?: unknown[] };
  const count = d.stationCount ?? d.stations?.length ?? 0;

  return (
    <div className="flex items-center gap-3">
      <Train className="h-6 w-6" style={{ color: "#005DAA" }} />
      <div>
        <p className="text-2xl font-bold leading-none text-white">{count}</p>
        <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          SunRail stations · 3 zones
        </p>
      </div>
    </div>
  );
}

// ── County Data Summary ──────────────────────────────────────────

/** Category colors for county data POI types. */
const COUNTY_CATEGORY_COLORS: Record<string, string> = {
  Parks: "#22c55e",
  Trails: "#84cc16",
  "Public Art": "#a855f7",
  "Fire Stations": "#ef4444",
};

/** County data summary card content. */
function CountyDataSummary({ data }: { data: unknown }) {
  const d = data as { summary?: Record<string, number>; points?: unknown[] };
  const summary = d.summary;
  const total = d.points?.length ?? 0;

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <MapPin className="h-6 w-6" style={{ color: "#60a5fa" }} />
        <div>
          <p className="text-2xl font-bold leading-none text-white">{total}</p>
          <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>points of interest</p>
        </div>
      </div>
      {summary && (
        <div className="space-y-1.5">
          {Object.entries(summary).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: COUNTY_CATEGORY_COLORS[cat] ?? "#94a3b8" }}
              />
              <span className="flex-1 truncate text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>{cat}</span>
              <span className="text-xs font-semibold text-white">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NWS Alerts Summary ──────────────────────────────────────────

/** NWS alerts summary card content. */
function NwsAlertsSummary({ data }: { data: unknown }) {
  const d = data as { alertCount?: number; alerts?: { event?: string; severity?: string }[] };
  const count = d.alertCount ?? d.alerts?.length ?? 0;

  if (count === 0) {
    return (
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6" style={{ color: "#22c55e" }} />
        <div>
          <p className="text-lg font-bold text-white">All Clear</p>
          <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>No active weather alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <AlertTriangle className="h-6 w-6" style={{ color: "#f59e0b" }} />
        <div>
          <p className="text-2xl font-bold leading-none text-white">{count}</p>
          <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>active alerts</p>
        </div>
      </div>
      <div className="space-y-1">
        {d.alerts?.slice(0, 3).map((a, i) => (
          <p key={i} className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            {a.event ?? "Alert"} — {a.severity ?? "Unknown"}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────

/** Single stat row for weather. */
function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{icon}</span>
      <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{label}</span>
      <span className="ml-auto text-sm font-medium text-white">{value}</span>
    </div>
  );
}

/** Single category row for city data. */
function CategoryRow({ info, count }: { info: { label: string; color: string; icon: React.ReactNode }; count: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span style={{ color: info.color }}>{info.icon}</span>
      <span className="flex-1 text-sm" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
        {info.label}
      </span>
      <span className="text-sm font-semibold" style={{ color: info.color }}>
        {count}
      </span>
    </div>
  );
}
