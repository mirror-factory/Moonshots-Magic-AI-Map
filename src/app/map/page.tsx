/**
 * @module app/map/page
 * Interactive map page (React Server Component). Loads all events from the registry
 * at build time and passes them to the client-side {@link MapWithChat} shell.
 */

import { getEventsByBounds } from "@/lib/registries/events";
import { MapWithChat } from "../map-with-chat";
import { PoweredByBadge } from "@/components/powered-by-badge";

/**
 * Florida geographic bounds for filtering events.
 * SW = Key West area, NE = North Florida border.
 */
const FLORIDA_SW: [number, number] = [-87.7, 24.4];
const FLORIDA_NE: [number, number] = [-79.8, 31.0];

/** Interactive map page that loads all events and renders the map-with-chat shell. */
export default function MapPage() {
  const events = getEventsByBounds(FLORIDA_SW, FLORIDA_NE);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapWithChat events={events} />
      <PoweredByBadge />
    </div>
  );
}
