/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the center-stage
 * chat bar. Manages the "Ask about this" bridge between map popups
 * and the chat input. Shows onboarding quiz for first-time visitors.
 */

"use client";

import { useState, useCallback, useRef, createContext, useContext } from "react";
import { MapContainer } from "@/components/map/map-container";
import { CenterChat } from "@/components/chat/center-chat";
import { OnboardingQuiz } from "@/components/onboarding/onboarding-quiz";
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
export function MapWithChat({ events }: MapWithChatProps) {
  const [chatInput, setChatInput] = useState<string | undefined>();
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
  });
  const [initialCategories, setInitialCategories] = useState<EventCategory[] | null>(null);
  const flyoverHandlerRef = useRef<FlyoverHandler | null>(null);

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
      <OnboardingQuiz open={onboardingOpen} onComplete={handleOnboardingComplete} />
      <MapContainer
        events={events}
        onAskAbout={handleAskAbout}
        onFlyoverRequest={handleFlyoverRequest}
        onStartPersonalization={handleStartPersonalization}
        initialCategories={initialCategories ?? undefined}
      >
        <CenterChat
          initialInput={chatInput}
          onClearInitialInput={handleClearInput}
          onStartFlyover={startFlyover}
        />
      </MapContainer>
    </IntroContext.Provider>
  );
}
