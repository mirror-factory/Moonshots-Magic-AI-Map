/**
 * @module components/chat/center-chat
 * Center-stage chat component that replaces the floating FAB chat panel.
 * Always-visible input bar at bottom center, expands upward to show conversation.
 * Shows contextual Ditto greeting based on ambient context.
 */

"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import {
  ChevronDown,
  Pin,
  PinOff,
  Sparkles,
  Search,
  Rocket,
  Compass,
  Clapperboard,
  Lightbulb,
  Gift,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { EventList } from "./event-list";
import { EventCard } from "./event-card";
import { NewsletterCard } from "./newsletter-card";
import { MapAction } from "./map-action";
import { Sparkle } from "@/components/effects/sparkle";
import { VoiceInputButton } from "./voice-input-button";
import { speak, stopSpeaking, isSpeaking } from "@/lib/voice/cartesia-tts";
import { getChatPinned, setChatPinned } from "@/lib/settings";
import { getProfile, updateProfile } from "@/lib/profile-storage";
import { SuggestionTiles } from "./suggestion-tiles";
import { DittoAvatar, type DittoState } from "./ditto-avatar";
import { getDittoGreeting } from "./ditto-personality";
import { useMap } from "@/components/map/use-map";
import type { AmbientContext } from "@/lib/context/ambient-context";
import type { DatePreset } from "@/lib/map/event-filters";
import type { EventCategory } from "@/lib/registries/types";

interface CenterChatProps {
  /** Externally-provided input (e.g. from "Ask Ditto about" button). */
  initialInput?: string;
  /** Called after the external input is consumed. */
  onClearInitialInput?: () => void;
  /** Called to start a flyover tour. */
  onStartFlyover?: (eventIds: string[], theme?: string) => void;
  /** Called to get directions to coordinates. */
  onGetDirections?: (coordinates: [number, number]) => void;
  /** Called to highlight events on the map. */
  onHighlightEvents?: (eventIds: string[]) => void;
  /** Called to start cinematic presentation mode. */
  onStartPresentation?: () => void;
  /** Called to change the active date/category filter on the map. */
  onChangeFilter?: (preset?: DatePreset, category?: EventCategory) => void;
  /** Called for cinematic show-on-map: fly + card + rotation. */
  onShowEventOnMap?: (eventId: string) => void;
  /** Called to open event detail in the events dropdown. */
  onOpenDetail?: (eventId: string) => void;
  /** Ambient context for personalization. */
  ambientContext?: AmbientContext | null;
}

/** Quick action items for the dropdown menu. */
const QUICK_ACTIONS: { id: string; label: string; desc: string; Icon: LucideIcon; color: string; prompt: string }[] = [
  { id: "search", label: "Find Events", desc: "Search by date, category, vibe", Icon: Search, color: "#3560FF", prompt: "What events are happening this weekend in Orlando?" },
  { id: "personalize", label: "Personalize", desc: "Set your preferences", Icon: Sparkles, color: "#8B5CF6", prompt: "" },
  { id: "flyover", label: "Flyover Tour", desc: "3D cinematic event tour", Icon: Rocket, color: "#0EA5E9", prompt: "Take me on a flyover tour of the best events this week" },
  { id: "directions", label: "Get Directions", desc: "Walking or driving routes", Icon: Compass, color: "#10B981", prompt: "How do I get to the nearest event from downtown Orlando?" },
  { id: "presentation", label: "Orlando Tour", desc: "Narrated landmarks tour", Icon: Clapperboard, color: "#F59E0B", prompt: "" },
  { id: "recommend", label: "Recommendations", desc: "Personalized event picks", Icon: Lightbulb, color: "#EC4899", prompt: "What events would you recommend for me based on my profile?" },
  { id: "free", label: "Free Events", desc: "No-cost things to do", Icon: Gift, color: "#14B8A6", prompt: "Show me free events happening this month in Orlando" },
  { id: "family", label: "Family Friendly", desc: "Kid-friendly activities", Icon: Users, color: "#F97316", prompt: "What family-friendly events are happening this week?" },
];

/** Center-stage chat bar with expand-upward conversation panel. */
export function CenterChat({
  initialInput,
  onClearInitialInput,
  onStartFlyover,
  onGetDirections,
  onHighlightEvents,
  onStartPresentation,
  onChangeFilter,
  onShowEventOnMap,
  onOpenDetail,
  ambientContext = null,
}: CenterChatProps) {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(() => getChatPinned());
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [dittoState, setDittoState] = useState<DittoState>("greeting");
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const greetingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const map = useMap();

  /** Show an event on the map with cinematic fly + rotation + card. */
  const handleShowOnMap = useCallback(
    (coordinates: [number, number], _title?: string, eventId?: string) => {
      void _title;
      if (eventId && onShowEventOnMap) {
        // Use cinematic handler: fly + card + gentle orbit
        onShowEventOnMap(eventId);
      } else {
        // Fallback: simple flyTo for coordinates without event ID
        map?.flyTo({ center: coordinates, zoom: 15, duration: 1500 });
      }
    },
    [map, onShowEventOnMap],
  );

  /** Trigger directions from the card. */
  const handleCardDirections = useCallback(
    (coordinates: [number, number], _title?: string) => {
      void _title;
      onGetDirections?.(coordinates);
    },
    [onGetDirections],
  );

  const { messages, sendMessage, status, stop, addToolOutput } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;

      if (toolCall.toolName === "getUserProfile") {
        const profile = getProfile();
        addToolOutput({
          tool: "getUserProfile",
          toolCallId: toolCall.toolCallId,
          output: profile,
        });
      }

      if (toolCall.toolName === "updateUserProfile") {
        const input = toolCall.input as {
          name?: string;
          categories?: string[];
          vibes?: string[];
          priceRange?: string;
          preferredDays?: string[];
          preferredTimes?: string[];
          travelRadius?: number;
          hasKids?: boolean;
          hasPets?: boolean;
          goals?: string[];
        };

        const current = getProfile();
        const updates: Parameters<typeof updateProfile>[0] = {};

        if (input.name) updates.name = input.name;
        if (input.categories) {
          updates.interests = { ...current.interests, categories: input.categories as never[] };
        }
        if (input.vibes) {
          updates.interests = { ...current.interests, ...updates.interests, vibes: input.vibes as never[] };
        }
        if (input.priceRange) {
          updates.interests = { ...current.interests, ...updates.interests, priceRange: input.priceRange as never };
        }
        if (input.preferredDays) {
          updates.availability = { ...current.availability, preferredDays: input.preferredDays as never[] };
        }
        if (input.preferredTimes) {
          updates.availability = { ...current.availability, ...updates.availability, preferredTimes: input.preferredTimes as never[] };
        }
        if (input.travelRadius !== undefined) {
          updates.availability = { ...current.availability, ...updates.availability, travelRadius: input.travelRadius };
        }
        if (input.hasKids !== undefined) {
          updates.context = { ...current.context, hasKids: input.hasKids };
        }
        if (input.hasPets !== undefined) {
          updates.context = { ...current.context, ...updates.context, hasPets: input.hasPets };
        }
        if (input.goals) updates.goals = input.goals;

        const updatedProfile = updateProfile(updates);
        addToolOutput({
          tool: "updateUserProfile",
          toolCallId: toolCall.toolCallId,
          output: { success: true, profile: updatedProfile },
        });
      }

      if (toolCall.toolName === "startFlyover") {
        const input = toolCall.input as { eventIds: string[]; theme?: string };
        if (onStartFlyover) {
          onStartFlyover(input.eventIds, input.theme);
        }
        addToolOutput({
          tool: "startFlyover",
          toolCallId: toolCall.toolCallId,
          output: { started: true, eventCount: input.eventIds.length, theme: input.theme },
        });
      }

      if (toolCall.toolName === "highlightEvents") {
        const input = toolCall.input as { eventIds: string[]; fitBounds?: boolean };
        onHighlightEvents?.(input.eventIds);
        addToolOutput({
          tool: "highlightEvents",
          toolCallId: toolCall.toolCallId,
          output: {
            highlighted: true,
            count: input.eventIds.length,
            cleared: input.eventIds.length === 0,
          },
        });
      }

      if (toolCall.toolName === "mapNavigate") {
        const input = toolCall.input as {
          action: string;
          coordinates?: [number, number];
          eventIds?: string[];
          zoom?: number;
        };
        // Execute the map action directly
        if (input.action === "flyTo" && input.coordinates) {
          map?.flyTo({ center: input.coordinates, zoom: input.zoom ?? 14, duration: 1500 });
        }
        if (input.action === "highlight" && input.eventIds) {
          onHighlightEvents?.(input.eventIds);
        }
        addToolOutput({
          tool: "mapNavigate",
          toolCallId: toolCall.toolCallId,
          output: { action: input.action, status: "executed" },
        });
      }

      if (toolCall.toolName === "getDirectionsTool") {
        const input = toolCall.input as { eventId: string; coordinates: [number, number]; title: string };
        onGetDirections?.(input.coordinates);
        addToolOutput({
          tool: "getDirectionsTool",
          toolCallId: toolCall.toolCallId,
          output: { started: true, destination: input.title },
        });
      }

      if (toolCall.toolName === "changeEventFilter") {
        const input = toolCall.input as { preset?: string; category?: string };
        onChangeFilter?.(
          input.preset as DatePreset | undefined,
          input.category as EventCategory | undefined,
        );
        addToolOutput({
          tool: "changeEventFilter",
          toolCallId: toolCall.toolCallId,
          output: {
            applied: true,
            preset: input.preset ?? "unchanged",
            category: input.category ?? "all",
          },
        });
      }

      if (toolCall.toolName === "startPresentation") {
        onStartPresentation?.();
        addToolOutput({
          tool: "startPresentation",
          toolCallId: toolCall.toolCallId,
          output: { started: true },
        });
      }
    },
  });

  // Ditto state machine: greeting → idle → thinking/celebrating
  useEffect(() => {
    if (status === "streaming" || status === "submitted") {
      setDittoState("thinking");
    } else if (messages.length > 0) {
      // Briefly celebrate when events arrive
      const lastMsg = messages[messages.length - 1];
      const hasEvents = lastMsg?.role === "assistant" && lastMsg.parts.some(
        (p) => p.type.startsWith("tool-searchEvents") || p.type.startsWith("tool-rankEvents"),
      );
      if (hasEvents) {
        setDittoState("celebrating");
        const timer = setTimeout(() => setDittoState("idle"), 2000);
        return () => clearTimeout(timer);
      }
      setDittoState("idle");
    }
  }, [status, messages]);

  // Initial greeting state → idle after 3s
  useEffect(() => {
    greetingTimerRef.current = setTimeout(() => {
      if (messages.length === 0) setDittoState("excited");
    }, 3000);
    return () => {
      if (greetingTimerRef.current) clearTimeout(greetingTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Request options that include ambient context in the body (memoized for stable deps). */
  const requestOptions = useMemo(
    () => (ambientContext ? { body: { context: ambientContext } } : undefined),
    [ambientContext],
  );

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setExpanded(true);
      sendMessage({ text }, requestOptions);
    },
    [sendMessage, requestOptions],
  );

  const handleSuggestionClick = useCallback(
    (query: string) => {
      setExpanded(true);
      sendMessage({ text: query }, requestOptions);
    },
    [sendMessage, requestOptions],
  );

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (text.trim()) {
        setExpanded(true);
        sendMessage({ text }, requestOptions);
      }
    },
    [sendMessage, requestOptions],
  );

  const handleSpeak = useCallback(async (messageId: string, text: string) => {
    if (isSpeaking() && speakingMessageId === messageId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      stopSpeaking();
      setSpeakingMessageId(messageId);
      try {
        await speak(text);
      } finally {
        setSpeakingMessageId(null);
      }
    }
  }, [speakingMessageId]);

  // Click outside to collapse (skipped when pinned) and close quick actions
  useEffect(() => {
    if (!expanded && !quickActionsOpen) return;
    if (expanded && pinned && !quickActionsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (quickActionsOpen) {
        setQuickActionsOpen(false);
      }
      if (expanded && !pinned && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded, pinned, quickActionsOpen]);

  // Auto-expand and send when initialInput is provided
  const lastProcessedInputRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialInput) {
      lastProcessedInputRef.current = null;
      return;
    }
    if (initialInput === lastProcessedInputRef.current) return;
    lastProcessedInputRef.current = initialInput;
    setExpanded(true);

    const timeoutId = setTimeout(() => {
      if (initialInput === "__PERSONALIZE__") {
        sendMessage({ text: "Personalize my experience" });
      } else if (initialInput.startsWith("__EVENT__:")) {
        // Format: __EVENT__:id:title — look up by ID for reliable results
        const parts = initialInput.slice("__EVENT__:".length);
        const colonIdx = parts.indexOf(":");
        const eventId = parts.slice(0, colonIdx);
        const title = parts.slice(colonIdx + 1);
        sendMessage({ text: `Tell me about "${title}" (event ID: ${eventId}). Use getEventDetails to look it up.` });
      } else {
        sendMessage({ text: `Tell me about "${initialInput}"` });
      }
      onClearInitialInput?.();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [initialInput, sendMessage, onClearInitialInput]);

  // Auto-expand when messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setExpanded(true);
    }
  }, [messages.length]);

  const profile = typeof window !== "undefined" ? getProfile() : null;
  const greeting = getDittoGreeting(ambientContext, profile?.name);

  const handleSuggestionSelect = useCallback((query: string) => {
    handleSuggestionClick(query);
  }, [handleSuggestionClick]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-4 z-30 sm:bottom-10 sm:right-8"
      style={{ width: "min(420px, 88vw)" }}
    >
      {/* Suggestion tiles - visible only when collapsed and no messages */}
      <AnimatePresence>
        {!expanded && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3"
          >
            <SuggestionTiles onSelect={handleSuggestionSelect} context={ambientContext} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified chat panel — single container for header + messages + input */}
      <div
        className="grain-texture glow-border flex flex-col rounded-2xl shadow-2xl"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          maxHeight: expanded ? "70vh" : "auto",
        }}
      >
        {/* Header + Messages — only when expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(70vh - 60px)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex min-h-0 flex-col overflow-hidden"
            >
              {/* Header with Ditto and collapse */}
              <div
                className="flex flex-shrink-0 items-center justify-between border-b px-4 py-2"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex items-center gap-3">
                  <DittoAvatar state={dittoState} size={36} />
                  <div>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)", fontFamily: "var(--font-chakra-petch)" }}
                    >
                      Ditto
                    </h3>
                    <p className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                      Your Orlando event guide
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* Quick Actions dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setQuickActionsOpen((prev) => !prev)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      aria-label="Quick actions"
                      title="Quick actions"
                    >
                      <Sparkles className="h-4 w-4" style={{ color: quickActionsOpen ? "var(--brand-primary, #3560ff)" : "var(--text-dim)" }} />
                    </button>
                    <AnimatePresence>
                      {quickActionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl shadow-xl"
                          style={{
                            background: "var(--glass-bg)",
                            border: "1px solid var(--glass-border)",
                            backdropFilter: "blur(16px)",
                          }}
                        >
                          <div className="p-1.5">
                            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                              Quick Actions
                            </p>
                            {QUICK_ACTIONS.map((action) => (
                              <button
                                key={action.id}
                                onClick={() => {
                                  setQuickActionsOpen(false);
                                  if (action.id === "presentation") {
                                    onStartPresentation?.();
                                  } else if (action.id === "personalize") {
                                    handleSend("Personalize my experience");
                                  } else {
                                    handleSend(action.prompt);
                                  }
                                }}
                                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                              >
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md" style={{ background: action.color, color: "#fff" }}>
                                  <action.Icon className="h-3.5 w-3.5" />
                                </span>
                                <div className="min-w-0">
                                  <div className="font-medium" style={{ color: "var(--text)" }}>{action.label}</div>
                                  <div className="truncate text-[10px]" style={{ color: "var(--text-dim)" }}>{action.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    className="rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Collapse chat"
                  >
                    <ChevronDown className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                  </button>
                </div>
              </div>

              {/* Scrollable messages area — StickToBottom manages its own scroll */}
              <Conversation className="min-h-0 flex-1">
                  <ConversationContent className="px-4 py-4">
                    {messages.map((message, index) => (
                      <Message key={`${message.id}-${index}`} from={message.role}>
                        <MessageContent>
                          {message.parts.map((part, i) => {
                            const key = `${message.id}-${i}`;

                            if (part.type === "text") {
                              const qaMatch = part.text.match(
                                /QUESTION:\s*([\s\S]+?)\nOPTIONS:\s*([\s\S]+?)(?:\n|$)/
                              );
                              if (qaMatch) {
                                const question = qaMatch[1].trim();
                                const options = qaMatch[2].split("|").map((s) => s.trim()).filter(Boolean);
                                const remainingText = part.text
                                  .replace(/QUESTION:\s*[\s\S]+?\nOPTIONS:\s*[\s\S]+?(?:\n|$)/, "")
                                  .trim();
                                return (
                                  <div key={key}>
                                    {remainingText && <MessageResponse>{remainingText}</MessageResponse>}
                                    <MessageResponse>{question}</MessageResponse>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {options.map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => handleSuggestionClick(opt)}
                                          className="rounded-lg px-3 py-1.5 text-xs transition-colors"
                                          style={{
                                            background: "var(--surface-2)",
                                            color: "var(--text)",
                                            border: "1px solid var(--border-color)",
                                          }}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }

                              // Parse ACTION: markers into tappable buttons
                              const actionRegex = /ACTION:\s*(.+?)\s*\|\s*type:\s*(\w+)\s*\|\s*(.+?)(?:\n|$)/g;
                              const hasActions = actionRegex.test(part.text);
                              if (hasActions) {
                                actionRegex.lastIndex = 0;
                                const segments: Array<{ type: "text"; content: string } | { type: "action"; label: string; actionType: string; params: string }> = [];
                                let lastIdx = 0;
                                let match: RegExpExecArray | null;
                                while ((match = actionRegex.exec(part.text)) !== null) {
                                  if (match.index > lastIdx) {
                                    segments.push({ type: "text", content: part.text.slice(lastIdx, match.index).trim() });
                                  }
                                  segments.push({ type: "action", label: match[1].trim(), actionType: match[2].trim(), params: match[3].trim() });
                                  lastIdx = match.index + match[0].length;
                                }
                                if (lastIdx < part.text.length) {
                                  const remaining = part.text.slice(lastIdx).trim();
                                  if (remaining) segments.push({ type: "text", content: remaining });
                                }
                                return (
                                  <div key={key}>
                                    {segments.map((seg, si) => {
                                      if (seg.type === "text") {
                                        return <MessageResponse key={si}>{seg.content}</MessageResponse>;
                                      }
                                      const handleAction = () => {
                                        try {
                                          if (seg.actionType === "flyover") {
                                            const idsMatch = seg.params.match(/eventIds:\s*(\[.*?\])/);
                                            const themeMatch = seg.params.match(/theme:\s*"(.*?)"/);
                                            if (idsMatch) {
                                              const ids = JSON.parse(idsMatch[1]) as string[];
                                              onStartFlyover?.(ids, themeMatch?.[1]);
                                            }
                                          } else if (seg.actionType === "directions") {
                                            const coordMatch = seg.params.match(/coordinates:\s*\[([-\d.]+),([-\d.]+)\]/);
                                            if (coordMatch) {
                                              onGetDirections?.([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]);
                                            }
                                          } else if (seg.actionType === "showOnMap") {
                                            const coordMatch = seg.params.match(/coordinates:\s*\[([-\d.]+),([-\d.]+)\]/);
                                            const titleMatch = seg.params.match(/title:\s*"(.*?)"/);
                                            if (coordMatch) {
                                              handleShowOnMap(
                                                [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])],
                                                titleMatch?.[1] ?? "",
                                              );
                                            }
                                          }
                                        } catch {
                                          // Gracefully ignore parse errors
                                        }
                                      };
                                      return (
                                        <button
                                          key={si}
                                          onClick={handleAction}
                                          className="my-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                                          style={{
                                            background: "#3560FF",
                                            color: "#ffffff",
                                            boxShadow: "0 0 12px rgba(53,96,255,0.3)",
                                          }}
                                        >
                                          {seg.actionType === "flyover" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                                          )}
                                          {seg.actionType === "directions" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                                          )}
                                          {seg.actionType === "showOnMap" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                          )}
                                          {seg.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              }

                              return <MessageResponse key={key}>{part.text}</MessageResponse>;
                            }

                            if (part.type === "reasoning") {
                              return (
                                <Reasoning key={key} isStreaming={status === "streaming"}>
                                  <ReasoningTrigger />
                                  <ReasoningContent>{part.text}</ReasoningContent>
                                </Reasoning>
                              );
                            }

                            if (part.type === "tool-searchEvents") {
                              if (part.state === "output-available" && part.output) {
                                const output = part.output as { events: Array<Record<string, unknown>> };
                                return (
                                  <EventList
                                    key={key}
                                    events={output.events as never[]}
                                    onShowOnMap={handleShowOnMap}
                                    onOpenDetail={onOpenDetail}
                                    onGetDirections={handleCardDirections}
                                  />
                                );
                              }
                              return (
                                <Tool key={key}>
                                  <ToolHeader type={part.type} state={part.state} title="Searching events..." />
                                </Tool>
                              );
                            }

                            if (part.type === "tool-getEventDetails") {
                              if (part.state === "output-available" && part.output) {
                                return (
                                  <EventCard
                                    key={key}
                                    event={part.output as never}
                                    onShowOnMap={handleShowOnMap}
                                    onOpenDetail={onOpenDetail}
                                    onGetDirections={handleCardDirections}
                                  />
                                );
                              }
                              return (
                                <Tool key={key}>
                                  <ToolHeader type={part.type} state={part.state} title="Getting event details..." />
                                </Tool>
                              );
                            }

                            if (part.type === "tool-searchNewsletters") {
                              if (part.state === "output-available" && part.output) {
                                const output = part.output as { newsletters: Array<Record<string, unknown>> };
                                return <NewsletterCard key={key} items={output.newsletters as never[]} />;
                              }
                              return (
                                <Tool key={key}>
                                  <ToolHeader type={part.type} state={part.state} title="Searching newsletters..." />
                                </Tool>
                              );
                            }

                            if (part.type === "tool-rankEvents") {
                              if (part.state === "output-available" && part.output) {
                                const output = part.output as { events: Array<Record<string, unknown>> };
                                return (
                                  <EventList
                                    key={key}
                                    events={output.events as never[]}
                                    ranked
                                    onShowOnMap={handleShowOnMap}
                                    onOpenDetail={onOpenDetail}
                                    onGetDirections={handleCardDirections}
                                  />
                                );
                              }
                              return (
                                <Tool key={key}>
                                  <ToolHeader type={part.type} state={part.state} title="Ranking events..." />
                                </Tool>
                              );
                            }

                            if (part.type === "tool-mapNavigate") {
                              return <MapAction key={key} input={part.input as never} />;
                            }

                            if (part.type === "tool-getUserProfile") return null;

                            if (part.type === "tool-updateUserProfile") {
                              if (part.state === "output-available") {
                                return (
                                  <div key={key} className="text-sm text-green-600 dark:text-green-400">
                                    Profile updated successfully
                                  </div>
                                );
                              }
                              return null;
                            }

                            if (part.type === "tool-startFlyover") {
                              if (part.state === "output-available") {
                                const output = part.output as { eventCount: number; theme?: string };
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                                    style={{ background: "var(--surface-2)" }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M22 2L11 13" />
                                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                    </svg>
                                    <span>
                                      Starting flyover tour
                                      {output.theme ? ` (${output.theme})` : ""} with {output.eventCount} events...
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <Tool key={key}>
                                  <ToolHeader type={part.type} state={part.state} title="Preparing flyover tour..." />
                                </Tool>
                              );
                            }

                            if (part.type === "tool-highlightEvents") {
                              if (part.state === "output-available") {
                                const output = part.output as { count: number; cleared: boolean };
                                if (output.cleared) return null;
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                                    style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    Highlighting {output.count} event{output.count !== 1 ? "s" : ""} on the map
                                  </div>
                                );
                              }
                              return null;
                            }

                            if (part.type === "tool-getDirectionsTool") {
                              if (part.state === "output-available") {
                                const output = part.output as { destination: string };
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                                    style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                    </svg>
                                    Getting directions to {output.destination}...
                                  </div>
                                );
                              }
                              return null;
                            }

                            if (part.type === "tool-changeEventFilter") {
                              if (part.state === "output-available") {
                                const output = part.output as { preset: string; category: string };
                                const label = output.preset !== "unchanged"
                                  ? `Filter set to: ${output.preset}${output.category !== "all" ? ` / ${output.category}` : ""}`
                                  : `Category filter: ${output.category}`;
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                                    style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    {label}
                                  </div>
                                );
                              }
                              return null;
                            }

                            if (part.type === "tool-startPresentation") {
                              if (part.state === "output-available") {
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                                    style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M5 3l14 9-14 9V3z" />
                                    </svg>
                                    Launching presentation...
                                  </div>
                                );
                              }
                              return null;
                            }

                            if (part.type.startsWith("tool-")) {
                              return (
                                <Tool key={key}>
                                  <ToolHeader type={part.type as never} state={(part as never as { state: string }).state as never} />
                                  <ToolContent>
                                    <ToolOutput output={(part as never as { output: unknown }).output} errorText={undefined} />
                                  </ToolContent>
                                </Tool>
                              );
                            }

                            return null;
                          })}
                        </MessageContent>
                        {message.role === "assistant" && (
                          <MessageActions>
                            <MessageAction
                              tooltip={speakingMessageId === message.id ? "Stop" : "Read aloud"}
                              onClick={() => {
                                const text = message.parts
                                  .filter((p) => p.type === "text")
                                  .map((p) => (p as { text: string }).text)
                                  .join("\n");
                                handleSpeak(message.id, text);
                              }}
                            >
                              {speakingMessageId === message.id ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="6" y="4" width="4" height="16" rx="1" />
                                  <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                              )}
                            </MessageAction>
                            <MessageAction
                              tooltip="Copy"
                              onClick={() => {
                                const text = message.parts
                                  .filter((p) => p.type === "text")
                                  .map((p) => (p as { text: string }).text)
                                  .join("\n");
                                navigator.clipboard.writeText(text);
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                            </MessageAction>
                          </MessageActions>
                        )}
                      </Message>
                    ))}

                    {(status === "submitted" || status === "streaming") && (
                      <Sparkle active count={20}>
                        <Shimmer>Ditto is thinking...</Shimmer>
                      </Sparkle>
                    )}
                  </ConversationContent>
                  <ConversationScrollButton />
                </Conversation>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar — always at the bottom of the unified panel */}
        <div
          className="flex-shrink-0"
          style={{
            borderTop: expanded ? "1px solid var(--border-color)" : "none",
          }}
        >
          {/* Contextual greeting with Ditto avatar */}
          {!expanded && (
            <div className="flex items-center gap-2 px-4 pt-3">
              <DittoAvatar state={dittoState} size={24} />
              <p
                className="text-xs"
                style={{ color: "var(--text-dim)", fontFamily: "var(--font-chakra-petch)" }}
              >
                {messages.length === 0 ? greeting : "Tap to continue chatting with Ditto"}
              </p>
            </div>
          )}
          <div
            className="px-3 py-2"
            onClick={() => !expanded && messages.length > 0 && setExpanded(true)}
          >
            <PromptInput
              onSubmit={(message) => {
                handleSend(message.text);
              }}
            >
              <PromptInputTextarea
                placeholder="Ask Ditto about Orlando events..."
                onFocus={() => messages.length > 0 && setExpanded(true)}
              />
              <PromptInputFooter>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const next = !pinned;
                      setPinned(next);
                      setChatPinned(next);
                    }}
                    className="rounded-md p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label={pinned ? "Unpin chat (allow auto-close)" : "Pin chat open"}
                    title={pinned ? "Unpin chat" : "Pin chat open"}
                  >
                    {pinned ? (
                      <Pin className="h-4 w-4" style={{ color: "var(--brand-primary, #3560ff)" }} />
                    ) : (
                      <PinOff className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
                    )}
                  </button>
                  <VoiceInputButton
                    onTranscript={handleVoiceTranscript}
                    disabled={status === "submitted" || status === "streaming"}
                  />
                </div>
                <PromptInputSubmit
                  status={status === "submitted" || status === "streaming" ? status : undefined}
                  onStop={stop}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
          <p
            className="px-4 pb-2 text-center text-[10px] leading-tight"
            style={{ color: "var(--text-dim)", opacity: 0.6 }}
          >
            Event data from Ticketmaster, Eventbrite, Google &amp; others. Always verify details — AI can make mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
