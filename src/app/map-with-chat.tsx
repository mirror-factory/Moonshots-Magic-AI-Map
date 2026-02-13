/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the center-stage
 * chat bar. Manages the "Ask about this" bridge between map popups
 * and the chat input. Shows conversational onboarding for first-time visitors.
 * Fetches ambient context and live data on mount.
 */

"use client";

import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((m) => m.MapContainer),
  { ssr: false }
);
import { AnimatePresence } from "motion/react";
import { CenterChat } from "@/components/chat/center-chat";
import { PresentationPanel } from "@/components/presentation/presentation-panel";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { getAmbientContext, type AmbientContext } from "@/lib/context/ambient-context";
import type { EventEntry, EventCategory } from "@/lib/registries/types";
import type { DatePreset } from "@/lib/map/event-filters";

const ONBOARDING_STORAGE_KEY = "moonshots_onboarding_complete";

/** Context for triggering onboarding replay. */
interface IntroContextValue {
  showIntro: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

/**
 * Hook to access intro modal controls.
 * @returns Context with showIntro function, or null if not in context.
 */
export function useIntro(): IntroContextValue | null {
  return useContext(IntroContext);
}

interface MapWithChatProps {
  events: EventEntry[];
}

/** Type for the flyover start handler. */
type FlyoverHandler = (eventIds: string[], theme?: string) => void;

/** Type for the directions handler. */
type DirectionsHandler = (coordinates: [number, number]) => void;

/** Type for the filter change handler. */
type FilterChangeHandler = (preset?: DatePreset, category?: EventCategory) => void;

/** Composes the full-screen map with the center-stage chat bar. */
export function MapWithChat({ events: staticEvents }: MapWithChatProps) {
  const [chatInput, setChatInput] = useState<string | undefined>();
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
  });
  const [ambientContext, setAmbientContext] = useState<AmbientContext | null>(null);
  const [liveEvents, setLiveEvents] = useState<EventEntry[]>([]);
  const flyoverHandlerRef = useRef<FlyoverHandler | null>(null);
  const directionsHandlerRef = useRef<DirectionsHandler | null>(null);
  const filterChangeHandlerRef = useRef<FilterChangeHandler | null>(null);
  const [highlightedEventIds, setHighlightedEventIds] = useState<string[]>([]);
  const [presentationActive, setPresentationActive] = useState(false);
  const openDetailHandlerRef = useRef<((eventId: string) => void) | null>(null);
  const showOnMapHandlerRef = useRef<((eventId: string) => void) | null>(null);

  // Fetch ambient context on mount
  useEffect(() => {
    getAmbientContext().then(setAmbientContext).catch(() => {});
  }, []);

  // Fetch live events on mount
  useEffect(() => {
    fetch("/api/events/live")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.events) setLiveEvents(data.events as EventEntry[]);
      })
      .catch(() => {});
  }, []);

  // Merge static + live events, deduplicate by ID
  const events = (() => {
    if (liveEvents.length === 0) return staticEvents;
    const ids = new Set(staticEvents.map((e) => e.id));
    const merged = [...staticEvents];
    for (const ev of liveEvents) {
      if (!ids.has(ev.id)) merged.push(ev);
    }
    return merged;
  })();

  const handleOnboardingComplete = useCallback((_categories: string[]) => {
    void _categories; // Categories saved to profile; map uses query-driven markers
    setOnboardingOpen(false);
  }, []);

  const handleShowIntro = useCallback(() => {
    setOnboardingOpen(true);
  }, []);

  const handleAskAbout = useCallback((title: string) => {
    setChatInput(title);
  }, []);

  const handleStartPersonalization = useCallback(() => {
    setChatInput("__PERSONALIZE__");
  }, []);

  const handleClearInput = useCallback(() => {
    setChatInput(undefined);
  }, []);

  const handleFlyoverRequest = useCallback((handler: FlyoverHandler) => {
    flyoverHandlerRef.current = handler;
  }, []);

  const startFlyover = useCallback((eventIds: string[], theme?: string) => {
    if (flyoverHandlerRef.current) {
      flyoverHandlerRef.current(eventIds, theme);
    }
  }, []);

  const handleDirectionsRequest = useCallback((handler: DirectionsHandler) => {
    directionsHandlerRef.current = handler;
  }, []);

  const handleGetDirections = useCallback((coordinates: [number, number]) => {
    if (directionsHandlerRef.current) {
      directionsHandlerRef.current(coordinates);
    }
  }, []);

  const handleFilterChangeRequest = useCallback((handler: FilterChangeHandler) => {
    filterChangeHandlerRef.current = handler;
  }, []);

  const handleChangeFilter = useCallback((preset?: DatePreset, category?: EventCategory) => {
    if (filterChangeHandlerRef.current) {
      filterChangeHandlerRef.current(preset, category);
    }
  }, []);

  const handleStartPresentation = useCallback(() => {
    setPresentationActive(true);
  }, []);

  const handleEndPresentation = useCallback(() => {
    setPresentationActive(false);
  }, []);

  const handleClearHighlights = useCallback(() => {
    setHighlightedEventIds([]);
  }, []);

  const handleOpenDetailRequest = useCallback((handler: (eventId: string) => void) => {
    openDetailHandlerRef.current = handler;
  }, []);

  const handleShowOnMapRequest = useCallback((handler: (eventId: string) => void) => {
    showOnMapHandlerRef.current = handler;
  }, []);

  /** Cinematic show on map — fly + card + rotation. */
  const handleShowEventOnMap = useCallback((eventId: string) => {
    showOnMapHandlerRef.current?.(eventId);
  }, []);

  return (
    <IntroContext.Provider value={{ showIntro: handleShowIntro }}>
      <OnboardingFlow
        open={onboardingOpen}
        events={events}
        ambientContext={ambientContext}
        onComplete={handleOnboardingComplete}
        onDismiss={() => setOnboardingOpen(false)}
      />
      <MapContainer
        events={events}
        onAskAbout={handleAskAbout}
        onFlyoverRequest={handleFlyoverRequest}
        onDirectionsRequest={handleDirectionsRequest}
        onFilterChangeRequest={handleFilterChangeRequest}
        onStartPersonalization={handleStartPersonalization}
        onOpenDetailRequest={handleOpenDetailRequest}
        onShowOnMapRequest={handleShowOnMapRequest}
        highlightedEventIds={highlightedEventIds}
        onClearHighlights={handleClearHighlights}
      >
        <AnimatePresence mode="wait">
          {presentationActive ? (
            <PresentationPanel
              key="presentation"
              onExit={handleEndPresentation}
              onAskDitto={(context) => {
                handleEndPresentation();
                setChatInput(context);
              }}
            />
          ) : (
            <CenterChat
              key="chat"
              initialInput={chatInput}
              onClearInitialInput={handleClearInput}
              onStartFlyover={startFlyover}
              onGetDirections={handleGetDirections}
              onHighlightEvents={setHighlightedEventIds}
              onStartPresentation={handleStartPresentation}
              onChangeFilter={handleChangeFilter}
              onShowEventOnMap={handleShowEventOnMap}
              ambientContext={ambientContext}
            />
          )}
        </AnimatePresence>
      </MapContainer>
    </IntroContext.Provider>
  );
}
