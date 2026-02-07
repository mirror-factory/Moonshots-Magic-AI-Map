/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the center-stage
 * chat bar. Manages the "Ask about this" bridge between map popups
 * and the chat input. Shows conversational onboarding for first-time visitors.
 * Fetches ambient context and live data on mount.
 */

"use client";

import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";
import { useTheme } from "next-themes";
import { MapContainer } from "@/components/map/map-container";
import { CenterChat } from "@/components/chat/center-chat";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { StaticStars } from "@/components/effects/static-stars";
import { AmbientParticles } from "@/components/effects/ambient-particles";
import { getAmbientContext, type AmbientContext } from "@/lib/context/ambient-context";
import type { EventEntry, EventCategory } from "@/lib/registries/types";

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

/** Composes the full-screen map with the center-stage chat bar. */
export function MapWithChat({ events: staticEvents }: MapWithChatProps) {
  const [chatInput, setChatInput] = useState<string | undefined>();
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
  });
  const [initialCategories, setInitialCategories] = useState<EventCategory[] | null>(null);
  const [ambientContext, setAmbientContext] = useState<AmbientContext | null>(null);
  const [liveEvents, setLiveEvents] = useState<EventEntry[]>([]);
  const flyoverHandlerRef = useRef<FlyoverHandler | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

  const handleOnboardingComplete = useCallback((categories: EventCategory[]) => {
    setInitialCategories(categories);
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

  return (
    <IntroContext.Provider value={{ showIntro: handleShowIntro }}>
      <OnboardingFlow
        open={onboardingOpen}
        events={events}
        ambientContext={ambientContext}
        onComplete={handleOnboardingComplete}
      />
      <MapContainer
        events={events}
        onAskAbout={handleAskAbout}
        onFlyoverRequest={handleFlyoverRequest}
        onStartPersonalization={handleStartPersonalization}
        initialCategories={initialCategories ?? undefined}
      >
        {/* Ambient effects — dark mode only */}
        {isDark && <StaticStars />}
        {isDark && <AmbientParticles />}

        <CenterChat
          initialInput={chatInput}
          onClearInitialInput={handleClearInput}
          onStartFlyover={startFlyover}
          ambientContext={ambientContext}
        />
      </MapContainer>
    </IntroContext.Provider>
  );
}
