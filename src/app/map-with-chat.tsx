/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the floating
 * chat panel. Manages the "Ask about this" bridge between map popups
 * and the chat input.
 */

"use client";

import { useState, useCallback } from "react";
import { MapContainer } from "@/components/map/map-container";
import { ChatPanel } from "@/components/chat/chat-panel";
import type { EventEntry } from "@/lib/registries/types";

interface MapWithChatProps {
  events: EventEntry[];
}

export function MapWithChat({ events }: MapWithChatProps) {
  const [chatInput, setChatInput] = useState<string | undefined>();

  const handleAskAbout = useCallback((title: string) => {
    setChatInput(title);
  }, []);

  const handleClearInput = useCallback(() => {
    setChatInput(undefined);
  }, []);

  return (
    <MapContainer events={events} onAskAbout={handleAskAbout}>
      <ChatPanel initialInput={chatInput} onClearInitialInput={handleClearInput} />
    </MapContainer>
  );
}
