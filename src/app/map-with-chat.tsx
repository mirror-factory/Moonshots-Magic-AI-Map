/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the floating
 * chat panel. Manages the "Ask about this" bridge between map popups
 * and the chat input. Shows intro modal for first-time visitors.
 */

"use client";

import { useState, useCallback, useRef, createContext, useContext } from "react";
import { MapContainer } from "@/components/map/map-container";
import { ChatPanel } from "@/components/chat/chat-panel";
import { IntroModal } from "@/components/intro/intro-modal";
import type { EventEntry } from "@/lib/registries/types";

const INTRO_STORAGE_KEY = "moonshots_intro_seen";

/** Context for triggering intro modal replay. */
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

/** Composes the full-screen map with the floating chat panel. */
export function MapWithChat({ events }: MapWithChatProps) {
  const [chatInput, setChatInput] = useState<string | undefined>();
  const [introOpen, setIntroOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(INTRO_STORAGE_KEY);
  });
  const flyoverHandlerRef = useRef<FlyoverHandler | null>(null);

  const handleDismissIntro = useCallback(() => {
    localStorage.setItem(INTRO_STORAGE_KEY, "true");
    setIntroOpen(false);
  }, []);

  const handleShowIntro = useCallback(() => {
    setIntroOpen(true);
  }, []);

  const handleAskAbout = useCallback((title: string) => {
    setChatInput(title);
  }, []);

  const handleStartPersonalization = useCallback(() => {
    // Use a special prefix to trigger personalization flow
    setChatInput("__PERSONALIZE__");
  }, []);

  const handleClearInput = useCallback(() => {
    setChatInput(undefined);
  }, []);

  const handleFlyoverRequest = useCallback((handler: FlyoverHandler) => {
    console.log("[MapWithChat] Flyover handler registered");
    flyoverHandlerRef.current = handler;
  }, []);

  const startFlyover = useCallback((eventIds: string[], theme?: string) => {
    console.log("[MapWithChat] startFlyover called with", eventIds.length, "events");
    if (flyoverHandlerRef.current) {
      flyoverHandlerRef.current(eventIds, theme);
    } else {
      console.warn("[MapWithChat] No flyover handler registered!");
    }
  }, []);

  return (
    <IntroContext.Provider value={{ showIntro: handleShowIntro }}>
      <IntroModal open={introOpen} onDismiss={handleDismissIntro} />
      <MapContainer events={events} onAskAbout={handleAskAbout} onFlyoverRequest={handleFlyoverRequest} onStartPersonalization={handleStartPersonalization}>
        <ChatPanel initialInput={chatInput} onClearInitialInput={handleClearInput} onStartFlyover={startFlyover} />
      </MapContainer>
    </IntroContext.Provider>
  );
}
