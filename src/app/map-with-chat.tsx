/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the center-stage
 * chat bar. Manages the "Ask about this" bridge between map popups
 * and the chat input. Shows conversational onboarding for first-time visitors.
 * Fetches ambient context and live data on mount.
 */

"use client";

import { useState, useCallback, useRef, useEffect, useMemo, createContext, useContext } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("@/components/map/map-container").then((m) => m.MapContainer),
  { ssr: false }
);
import { AnimatePresence } from "motion/react";
import { CenterChat } from "@/components/chat/center-chat";
import { PresentationPanel } from "@/components/presentation/presentation-panel";
import { FeaturesShowcase } from "@/components/presentation/features-showcase";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { StarfieldTransition } from "@/components/effects/starfield-transition";
import { getAmbientContext, type AmbientContext } from "@/lib/context/ambient-context";
import type { EventEntry, EventCategory } from "@/lib/registries/types";
import type { DatePreset } from "@/lib/map/event-filters";
import { getChatPosition, setChatPosition, type ChatPosition } from "@/lib/settings";

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
  const [showTransition, setShowTransition] = useState(false);
  const flyoverHandlerRef = useRef<FlyoverHandler | null>(null);
  const directionsHandlerRef = useRef<DirectionsHandler | null>(null);
  const filterChangeHandlerRef = useRef<FilterChangeHandler | null>(null);
  const [highlightedEventIds, setHighlightedEventIds] = useState<string[]>([]);
  const [presentationActive, setPresentationActive] = useState(false);
  const [showcaseActive, setShowcaseActive] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const openDetailHandlerRef = useRef<((eventId: string) => void) | null>(null);
  const closeDetailHandlerRef = useRef<(() => void) | null>(null);
  const closeDirectionsHandlerRef = useRef<(() => void) | null>(null);
  const showOnMapHandlerRef = useRef<((eventId: string) => void) | null>(null);
  const toggleDataLayerHandlerRef = useRef<((layerKey: string, action: "on" | "off" | "toggle") => void) | null>(null);
  const [chatPosition, setChatPositionState] = useState<ChatPosition>("center");
  const [flyoverActive, setFlyoverActive] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);

  // Load chat position on mount (deferred to avoid hydration mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatPositionState(getChatPosition());
  }, []);

  const handleChatPositionChange = useCallback((position: ChatPosition) => {
    setChatPositionState(position);
    setChatPosition(position);
  }, []);

  // Show starfield transition on mount (deferred to avoid hydration mismatch)
  useEffect(() => {
    const onboardingActive = !localStorage.getItem(ONBOARDING_STORAGE_KEY);
    sessionStorage.removeItem("show-transition");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!onboardingActive) setShowTransition(true);
  }, []);

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
    closeDirectionsHandlerRef.current?.();
    setOnboardingOpen(true);
  }, []);

  const handleAskAbout = useCallback((title: string) => {
    setChatInput(title);
  }, []);

  const handleStartPersonalization = useCallback(() => {
    closeDirectionsHandlerRef.current?.();
    setOnboardingOpen(true);
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
    // Clear AI-highlighted event listing so the map focuses on the route
    setHighlightedEventIds([]);
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
    closeDirectionsHandlerRef.current?.();
    setPresentationActive(true);
  }, []);

  const handleEndPresentation = useCallback(() => {
    setPresentationActive(false);
  }, []);

  const handleStartShowcase = useCallback(() => {
    closeDirectionsHandlerRef.current?.();
    setShowcaseActive(true);
  }, []);

  const handleEndShowcase = useCallback(() => {
    setShowcaseActive(false);
  }, []);

  const handleClearHighlights = useCallback(() => {
    setHighlightedEventIds([]);
  }, []);

  /** Data layer activation tracking (chat remains always visible). */
  const handleDataLayerActiveChange = useCallback(() => {
    // Chat no longer hides when data layers activate
  }, []);

  /** Flyover activation tracking - hide collapse button during flyover. */
  const handleFlyoverActiveChange = useCallback((active: boolean) => {
    setFlyoverActive(active);
  }, []);

  /** Toggle chat visibility from toolbar button. */
  const handleToggleChatVisible = useCallback(() => {
    setChatVisible((prev) => !prev);
  }, []);

  const handleLocationChange = useCallback((enabled: boolean) => {
    setLocationEnabled(enabled);
  }, []);

  const handleOpenDetailRequest = useCallback((handler: (eventId: string) => void) => {
    openDetailHandlerRef.current = handler;
  }, []);

  const handleCloseDetailRequest = useCallback((handler: () => void) => {
    closeDetailHandlerRef.current = handler;
  }, []);

  const handleCloseDirectionsRequest = useCallback((handler: () => void) => {
    closeDirectionsHandlerRef.current = handler;
  }, []);

  const handleShowOnMapRequest = useCallback((handler: (eventId: string) => void) => {
    showOnMapHandlerRef.current = handler;
  }, []);

  const handleToggleDataLayerRequest = useCallback(
    (handler: (layerKey: string, action: "on" | "off" | "toggle") => void) => {
      toggleDataLayerHandlerRef.current = handler;
    },
    [],
  );

  /** Toggle a data layer via AI chat. */
  const handleToggleDataLayer = useCallback(
    (layerKey: string, action: "on" | "off" | "toggle") => {
      toggleDataLayerHandlerRef.current?.(layerKey, action);
    },
    [],
  );

  /** Cinematic show on map — fly + card + rotation. */
  const handleShowEventOnMap = useCallback((eventId: string) => {
    showOnMapHandlerRef.current?.(eventId);
  }, []);

  /** Open event detail in the events dropdown. */
  const handleOpenDetail = useCallback((eventId: string) => {
    openDetailHandlerRef.current?.(eventId);
  }, []);

  /** Close event detail panel. */
  const handleCloseDetail = useCallback(() => {
    closeDetailHandlerRef.current?.();
  }, []);

  /** Gate location out of ambient context when user disables it. */
  const effectiveContext = useMemo<AmbientContext | null>(() => {
    if (!ambientContext) return null;
    if (locationEnabled) return ambientContext;
    return { ...ambientContext, location: null };
  }, [ambientContext, locationEnabled]);

  return (
    <IntroContext.Provider value={{ showIntro: handleShowIntro }}>
      {/* Starfield transition for page navigation */}
      <StarfieldTransition
        show={showTransition}
        onComplete={() => setShowTransition(false)}
        duration={2000}
      />
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
        onCloseDetailRequest={handleCloseDetailRequest}
        onCloseDirectionsRequest={handleCloseDirectionsRequest}
        onShowOnMapRequest={handleShowOnMapRequest}
        highlightedEventIds={highlightedEventIds}
        onClearHighlights={handleClearHighlights}
        onLocationChange={handleLocationChange}
        onToggleDataLayerRequest={handleToggleDataLayerRequest}
        onStartPresentation={handleStartPresentation}
        onStartShowcase={handleStartShowcase}
        chatPosition={chatPosition}
        onChatPositionChange={handleChatPositionChange}
        chatVisible={chatVisible}
        onToggleChatVisible={handleToggleChatVisible}
        onDataLayerActiveChange={handleDataLayerActiveChange}
        onFlyoverActiveChange={handleFlyoverActiveChange}
      >
        {/* Chat is always mounted — display:none preserves useChat state */}
        <CenterChat
          initialInput={chatInput}
          onClearInitialInput={handleClearInput}
          onStartFlyover={startFlyover}
          onGetDirections={handleGetDirections}
          onHighlightEvents={setHighlightedEventIds}
          onStartPresentation={handleStartPresentation}
          onChangeFilter={handleChangeFilter}
          onShowEventOnMap={handleShowEventOnMap}
          onOpenDetail={handleOpenDetail}
          onToggleDataLayer={handleToggleDataLayer}
          ambientContext={effectiveContext}
          visible={chatVisible}
          chatPosition={chatPosition}
          flyoverActive={flyoverActive}
        />
        {/* Presentation panels overlay alongside chat */}
        <AnimatePresence>
          {presentationActive && (
            <PresentationPanel
              key="presentation"
              onExit={handleEndPresentation}
              onAskAI={(context) => {
                setChatInput(context);
              }}
            />
          )}
          {showcaseActive && (
            <FeaturesShowcase
              key="showcase"
              onExit={handleEndShowcase}
              onToggleDataLayer={handleToggleDataLayer}
              onAskAI={(context) => {
                setChatInput(context);
              }}
              onShowEventOnMap={handleShowEventOnMap}
              onOpenDetail={handleOpenDetail}
              onCloseDetail={handleCloseDetail}
            />
          )}
        </AnimatePresence>
      </MapContainer>
    </IntroContext.Provider>
  );
}
