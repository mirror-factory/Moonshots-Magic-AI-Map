/**
 * @module agents/tools/toggle-data-layer
 * AI SDK tool for toggling real-time data layers on the map.
 * This is a **client-side only** tool — it has no `execute` function.
 * The tool invocation is handled in the CenterChat onToolCall handler.
 */

import { tool } from "ai";
import { z } from "zod";

/** Agent tool: toggle a data layer on/off (no server execute). */
export const toggleDataLayer = tool({
  description:
    "Toggle a real-time data layer on the map. Available layers: weather (temperature/wind/rain/radar), transit (LYNX bus positions), cityData (permits/code enforcement), nwsAlerts (NWS weather alerts), aircraft (live planes near MCO), sunrail (commuter rail stops/routes), developments (downtown projects), countyData (parks/trails/art/fire stations), evChargers (EV charging stations), airQuality (EPA air quality). Use this when users ask about weather, transit, city data, aircraft, trains, parks, EV chargers, or other overlays.",
  inputSchema: z.object({
    layerKey: z
      .enum(["weather", "transit", "cityData", "nwsAlerts", "aircraft", "sunrail", "developments", "countyData", "evChargers", "airQuality"])
      .describe("Which data layer to toggle"),
    action: z
      .enum(["on", "off", "toggle"])
      .default("toggle")
      .describe("Whether to turn on, off, or toggle the layer"),
  }),
  // No execute function - this is a client-side tool
});
