/**
 * @module components/chat/center-chat
 * Center-stage chat component that replaces the floating FAB chat panel.
 * Always-visible input bar at bottom center, expands upward to show conversation.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { ChevronDown } from "lucide-react";
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
import { getProfile, updateProfile } from "@/lib/profile-storage";
import { SuggestionTiles } from "./suggestion-tiles";
import { DittoAvatar } from "./ditto-avatar";

interface CenterChatProps {
  /** Externally-provided input (e.g. from "Ask Ditto about" button). */
  initialInput?: string;
  /** Called after the external input is consumed. */
  onClearInitialInput?: () => void;
  /** Called to start a flyover tour. */
  onStartFlyover?: (eventIds: string[], theme?: string) => void;
}

/** Returns a time-of-day greeting string. */
function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
}

/** Center-stage chat bar with expand-upward conversation panel. */
export function CenterChat({ initialInput, onClearInitialInput, onStartFlyover }: CenterChatProps) {
  const [expanded, setExpanded] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    },
  });

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setExpanded(true);
      sendMessage({ text });
    },
    [sendMessage],
  );

  const handleSuggestionClick = useCallback(
    (query: string) => {
      setExpanded(true);
      sendMessage({ text: query });
    },
    [sendMessage],
  );

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (text.trim()) {
        setExpanded(true);
        sendMessage({ text });
      }
    },
    [sendMessage],
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

  // Click outside to collapse
  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

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
  const greeting = getGreeting(profile?.name);
  const dittoState = status === "streaming" || status === "submitted" ? "thinking" : messages.length > 0 ? "idle" : "excited";

  const handleSuggestionSelect = useCallback((query: string) => {
    handleSuggestionClick(query);
  }, [handleSuggestionClick]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center"
      style={{ width: "min(700px, 95vw)" }}
    >
      {/* Suggestion tiles - visible only when collapsed and no messages */}
      <AnimatePresence>
        {!expanded && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 w-full"
            style={{ maxWidth: "min(600px, 90vw)" }}
          >
            <SuggestionTiles onSelect={handleSuggestionSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded conversation panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-2 w-full overflow-hidden rounded-2xl shadow-2xl"
            style={{
              maxHeight: "70vh",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(var(--glass-blur))",
              WebkitBackdropFilter: "blur(var(--glass-blur))",
            }}
          >
            {/* Header with Ditto and collapse */}
            <div
              className="flex items-center justify-between border-b px-4 py-2"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <DittoAvatar state={dittoState} size={32} />
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
              <button
                onClick={() => setExpanded(false)}
                className="rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Collapse chat"
              >
                <ChevronDown className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
              </button>
            </div>

            {/* Messages */}
            <Conversation className="max-h-[55vh] min-h-0 flex-1">
              <ConversationContent className="px-4 py-4">
                {messages.map((message) => (
                  <Message key={message.id} from={message.role}>
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
                            return <EventList key={key} events={output.events as never[]} />;
                          }
                          return (
                            <Tool key={key}>
                              <ToolHeader type={part.type} state={part.state} title="Searching events..." />
                            </Tool>
                          );
                        }

                        if (part.type === "tool-getEventDetails") {
                          if (part.state === "output-available" && part.output) {
                            return <EventCard key={key} event={part.output as never} />;
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
                            return <EventList key={key} events={output.events as never[]} ranked />;
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

      {/* Always-visible input bar */}
      <div
        className="w-full rounded-2xl shadow-lg"
        style={{
          maxWidth: "min(600px, 90vw)",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
        }}
      >
        {/* Contextual greeting */}
        {!expanded && messages.length === 0 && (
          <div className="px-4 pt-3">
            <p
              className="text-xs"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-chakra-petch)" }}
            >
              {greeting}
            </p>
          </div>
        )}
        <div className="px-3 py-2">
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
              <VoiceInputButton
                onTranscript={handleVoiceTranscript}
                disabled={status === "submitted" || status === "streaming"}
              />
              <PromptInputSubmit
                status={status === "submitted" || status === "streaming" ? status : undefined}
                onStop={stop}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
