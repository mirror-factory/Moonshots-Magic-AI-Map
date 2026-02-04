/**
 * @module app/page
 * Home page (React Server Component). Loads all events from the registry
 * at build time and passes them to the client-side {@link MapWithChat} shell.
 */

import { getAllEvents } from "@/lib/registries/events";
import { MapWithChat } from "./map-with-chat";

/** Home page that loads all events and renders the map-with-chat shell. */
export default function Home() {
  const events = getAllEvents();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapWithChat events={events} />
    </div>
  );
}
