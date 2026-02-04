/**
 * @module app/map-with-chat
 * Client component that composes the full-screen map with the floating
 * chat panel. Manages the "Ask about this" bridge between map popups
 * and the chat input. Includes theme toggle and dark-mode visual effects.
 */

"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { MapContainer } from "@/components/map/map-container";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { FilmGrain, StaticStars, Vignette } from "@/components/effects";
import type { EventEntry } from "@/lib/registries/types";

interface MapWithChatProps {
  events: EventEntry[];
}

/** Composes the full-screen map with the floating chat panel. */
export function MapWithChat({ events }: MapWithChatProps) {
  const [chatInput, setChatInput] = useState<string | undefined>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleAskAbout = useCallback((title: string) => {
    setChatInput(title);
  }, []);

  const handleClearInput = useCallback(() => {
    setChatInput(undefined);
  }, []);

  return (
    <MapContainer events={events} onAskAbout={handleAskAbout}>
      {/* Theme toggle in top-right corner (below nav controls) */}
      <div className="absolute right-4 top-28 z-10">
        <ThemeToggle />
      </div>

      {/* Dark mode visual effects (brand aesthetic) */}
      {isDark && (
        <>
          <StaticStars />
          <Vignette />
          <FilmGrain />
        </>
      )}

      <ChatPanel initialInput={chatInput} onClearInitialInput={handleClearInput} />
    </MapContainer>
  );
}
