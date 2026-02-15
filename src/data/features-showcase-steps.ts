/**
 * @module data/features-showcase-steps
 * Step definitions for the Features Showcase presentation.
 * Demonstrates live data layers, digital twin capabilities, and app features
 * with coordinated map camera movements and layer activations.
 */

import type { DataLayerKey } from "@/lib/map/data-layers";

/** A single step in the features showcase. */
export interface ShowcaseStep {
  /** Unique step identifier. */
  id: string;
  /** Step number (1-based). */
  step: number;
  /** Display title. */
  title: string;
  /** Short subtitle. */
  subtitle: string;
  /** Descriptive narrative shown in the panel. */
  narrative: string;
  /** Map coordinates [lng, lat] to fly to. */
  coordinates: [number, number];
  /** Camera zoom level. */
  zoom: number;
  /** Camera pitch in degrees. */
  pitch: number;
  /** Camera bearing in degrees. */
  bearing: number;
  /** Camera fly duration in milliseconds. */
  duration: number;
  /** How long to linger on this step before auto-advancing (ms). */
  lingerDuration: number;
  /** Data layer to activate during this step (null for none). */
  activateLayer: DataLayerKey | null;
  /** Icon emoji for the step. */
  icon: string;
  /** Event ID to select/highlight during this step (triggers cinematic show-on-map). */
  selectEventId?: string;
}

/** Ordered steps for the Features Showcase presentation. */
export const SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    id: "intro-digital-twin",
    step: 1,
    title: "The Digital Twin",
    subtitle: "Orlando in Real Time",
    narrative:
      "Welcome to Moonshots & Magic — a living digital twin of Central Florida. Like the Orlando Economic Partnership's digital twin, this map layers real-time city data over an interactive 3D environment. But we go further: AI-powered insights, live event discovery, and cinematic storytelling — all in your browser.",
    coordinates: [-81.3780, 28.5431],
    zoom: 12.5,
    pitch: 50,
    bearing: -20,
    duration: 3000,
    lingerDuration: 14000,
    activateLayer: null,
    icon: "🌐",
  },
  {
    id: "weather-radar",
    step: 2,
    title: "Live Weather Radar",
    subtitle: "RainViewer + Open-Meteo",
    narrative:
      "Real-time weather radar from RainViewer overlays precipitation across the region, while Open-Meteo provides current conditions — temperature, wind speed, humidity, and cloud cover. Our AI assistant analyzes this data and can recommend whether it's a good day for outdoor events.",
    coordinates: [-81.3780, 28.5431],
    zoom: 10.5,
    pitch: 0,
    bearing: 0,
    duration: 2500,
    lingerDuration: 13000,
    activateLayer: "weather",
    icon: "🌦️",
  },
  {
    id: "nws-alerts",
    step: 3,
    title: "NWS Weather Alerts",
    subtitle: "National Weather Service",
    narrative:
      "Active weather warnings and advisories from the National Weather Service are displayed as alert zones across Central Florida. From severe thunderstorm watches to heat advisories, the AI summarizes severity and recommended actions so you can plan events safely.",
    coordinates: [-81.3780, 28.5431],
    zoom: 9.5,
    pitch: 0,
    bearing: 10,
    duration: 2500,
    lingerDuration: 12000,
    activateLayer: "nwsAlerts",
    icon: "⚠️",
  },
  {
    id: "transit-buses",
    step: 4,
    title: "Live Transit Tracking",
    subtitle: "LYNX Bus Network",
    narrative:
      "Every LYNX bus in Orlando is tracked in real time via the GTFS-RT feed. Each glowing dot represents a bus currently in service, labeled with its route number. This data helps visitors understand public transit options and plan routes to events across the city.",
    coordinates: [-81.3780, 28.5431],
    zoom: 13,
    pitch: 45,
    bearing: 15,
    duration: 2500,
    lingerDuration: 12000,
    activateLayer: "transit",
    icon: "🚌",
  },
  {
    id: "sunrail-commuter",
    step: 5,
    title: "SunRail Commuter Rail",
    subtitle: "DeBary to Poinciana",
    narrative:
      "The SunRail commuter rail system connects four counties along a 61.5-mile corridor through downtown Orlando. Station locations, zones, and route data from the GTFS static feed show how the region's rail spine ties neighborhoods to the urban core.",
    coordinates: [-81.3808, 28.5398],
    zoom: 12,
    pitch: 40,
    bearing: -5,
    duration: 2500,
    lingerDuration: 12000,
    activateLayer: "sunrail",
    icon: "🚆",
  },
  {
    id: "aircraft-tracking",
    step: 6,
    title: "Live Aircraft",
    subtitle: "OpenSky Network · MCO Airspace",
    narrative:
      "Aircraft near Orlando International Airport (MCO) are tracked live via the OpenSky Network. Each icon represents a real plane in flight — altitude, heading, and ground speed included. Watch arrivals and departures in real time over one of the busiest airports in the Southeast.",
    coordinates: [-81.3089, 28.4312],
    zoom: 11.5,
    pitch: 35,
    bearing: 20,
    duration: 3000,
    lingerDuration: 12000,
    activateLayer: "aircraft",
    icon: "✈️",
  },
  {
    id: "city-data",
    step: 7,
    title: "City Data Heatmap",
    subtitle: "Orlando Open Data (Socrata)",
    narrative:
      "Code enforcement cases from Orlando's open data portal appear as a heatmap. These are property maintenance violations, zoning issues, and building code complaints — things like overgrown lots, unpermitted construction, and signage violations. The heatmap reveals neighborhood patterns that tell a story about where the city is growing and changing.",
    coordinates: [-81.3780, 28.5431],
    zoom: 13,
    pitch: 40,
    bearing: -10,
    duration: 2500,
    lingerDuration: 13000,
    activateLayer: "cityData",
    icon: "🏙️",
  },
  {
    id: "developments",
    step: 8,
    title: "Downtown Developments",
    subtitle: "Downtown Orlando DDB",
    narrative:
      "35 development projects from the Downtown Development Board are mapped with color-coded status markers. From the $2 billion Creative Village to proposed mixed-use towers, each dot represents a project with investment amounts, timelines, and images — giving a real-time view of downtown's transformation.",
    coordinates: [-81.3810, 28.5420],
    zoom: 15,
    pitch: 55,
    bearing: -15,
    duration: 2500,
    lingerDuration: 13000,
    activateLayer: "developments",
    icon: "🏗️",
  },
  {
    id: "county-poi",
    step: 9,
    title: "Points of Interest",
    subtitle: "Orange County GIS (OCGIS)",
    narrative:
      "Parks, trails, public art installations, and fire stations from the Orange County GIS system are plotted across the region. This layer reveals the public infrastructure that makes Orlando livable — from the trail network connecting neighborhoods to the art that defines its character.",
    coordinates: [-81.3780, 28.5431],
    zoom: 12,
    pitch: 40,
    bearing: 5,
    duration: 2500,
    lingerDuration: 12000,
    activateLayer: "countyData",
    icon: "📍",
  },
  {
    id: "event-discovery",
    step: 10,
    title: "Event Discovery",
    subtitle: "AI-Powered Exploration",
    narrative:
      "Nearly 2,000 events from Ticketmaster, Eventbrite, and local sources are pinned across the map. Filter by date, distance, or category — or ask the AI to find something specific. It understands natural language: 'What's happening near Lake Eola this weekend?' returns curated results with reasoning.",
    coordinates: [-81.3734, 28.5432],
    zoom: 15,
    pitch: 55,
    bearing: 10,
    duration: 2500,
    lingerDuration: 13000,
    activateLayer: null,
    icon: "🎫",
    selectEventId: "eb-1980889796706",
  },
  {
    id: "flyover-tours",
    step: 11,
    title: "Cinematic Flyover Tours",
    subtitle: "AI Narration + 3D Camera",
    narrative:
      "Ask the AI to create a flyover tour of any set of events, and the map transforms into a cinematic experience. The camera swoops between locations with smooth 3D transitions while AI-generated narration plays, describing each stop. It's storytelling meets cartography.",
    coordinates: [-81.3780, 28.5431],
    zoom: 16,
    pitch: 60,
    bearing: -30,
    duration: 2500,
    lingerDuration: 12000,
    activateLayer: null,
    icon: "🎬",
  },
  {
    id: "vision-conclusion",
    step: 12,
    title: "The Vision",
    subtitle: "A Smarter City Map",
    narrative:
      "Moonshots & Magic is more than an events map. It's a proof of concept for what a city's digital presence could be — live data, AI intelligence, and immersive storytelling combined into a single interface. When visitors come to Orlando, they see a living city, not just a list of attractions. This is the digital twin, built for everyone.",
    coordinates: [-81.2, 28.5],
    zoom: 10.5,
    pitch: 0,
    bearing: 0,
    duration: 3000,
    lingerDuration: 14000,
    activateLayer: null,
    icon: "✨",
  },
];
