/**
 * @module components/chat/chat-panel
 * Floating chat panel powered by the AI SDK `useChat` hook. Renders
 * conversation messages, tool output cards (events, newsletters, map
 * actions), and a prompt input with suggestion chips. Features genie
 * animation when opening/closing.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
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
import { ChatTrigger } from "./chat-trigger";
import { Sparkle } from "@/components/effects/sparkle";
import { VoiceInputButton } from "./voice-input-button";
import { speak, stopSpeaking, isSpeaking } from "@/lib/voice/cartesia-tts";
import { getProfile, updateProfile } from "@/lib/profile-storage";

interface ChatPanelProps {
  initialInput?: string;
  onClearInitialInput?: () => void;
  onStartFlyover?: (eventIds: string[], theme?: string) => void;
}

const SUGGESTIONS = [
  "What's happening this weekend?",
  "Find live music near downtown Orlando",
  "Top 5 family-friendly events this month",
  "Personalize my experience",
];

/** Floating chat panel with AI-powered event discovery conversation. */
export function ChatPanel({ initialInput, onClearInitialInput, onStartFlyover }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const { messages, sendMessage, status, stop, addToolOutput } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      // Check if it's a dynamic tool first for proper type narrowing
      if (toolCall.dynamic) {
        return;
      }

      // Handle getUserProfile - returns current profile to the AI
      if (toolCall.toolName === "getUserProfile") {
        const profile = getProfile();
        addToolOutput({
          tool: "getUserProfile",
          toolCallId: toolCall.toolCallId,
          output: profile,
        });
      }

      // Handle updateUserProfile - updates profile and confirms
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

        // Build partial update from provided fields
        const current = getProfile();
        const updates: Parameters<typeof updateProfile>[0] = {};

        if (input.name) updates.name = input.name;
        if (input.categories) {
          updates.interests = {
            ...current.interests,
            categories: input.categories as never[],
          };
        }
        if (input.vibes) {
          updates.interests = {
            ...current.interests,
            ...updates.interests,
            vibes: input.vibes as never[],
          };
        }
        if (input.priceRange) {
          updates.interests = {
            ...current.interests,
            ...updates.interests,
            priceRange: input.priceRange as never,
          };
        }
        if (input.preferredDays) {
          updates.availability = {
            ...current.availability,
            preferredDays: input.preferredDays as never[],
          };
        }
        if (input.preferredTimes) {
          updates.availability = {
            ...current.availability,
            ...updates.availability,
            preferredTimes: input.preferredTimes as never[],
          };
        }
        if (input.travelRadius !== undefined) {
          updates.availability = {
            ...current.availability,
            ...updates.availability,
            travelRadius: input.travelRadius,
          };
        }
        if (input.hasKids !== undefined) {
          updates.context = {
            ...current.context,
            hasKids: input.hasKids,
          };
        }
        if (input.hasPets !== undefined) {
          updates.context = {
            ...current.context,
            ...updates.context,
            hasPets: input.hasPets,
          };
        }
        if (input.goals) updates.goals = input.goals;

        const updatedProfile = updateProfile(updates);
        addToolOutput({
          tool: "updateUserProfile",
          toolCallId: toolCall.toolCallId,
          output: { success: true, profile: updatedProfile },
        });
      }

      // Handle startFlyover - triggers map flyover tour
      if (toolCall.toolName === "startFlyover") {
        const input = toolCall.input as {
          eventIds: string[];
          theme?: string;
        };

        console.log("[ChatPanel] startFlyover tool called with:", input.eventIds, input.theme);

        // Start the flyover tour
        if (onStartFlyover) {
          onStartFlyover(input.eventIds, input.theme);
        } else {
          console.warn("[ChatPanel] onStartFlyover callback not provided!");
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
      sendMessage({ text });
    },
    [sendMessage],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion });
    },
    [sendMessage],
  );

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      if (text.trim()) {
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

  // Track last processed input to avoid duplicate sends
  const lastProcessedInputRef = useRef<string | null>(null);

  // Reset the ref when initialInput is cleared (allows new "Ask Ditto" requests)
  useEffect(() => {
    if (!initialInput) {
      lastProcessedInputRef.current = null;
    }
  }, [initialInput]);

  // Auto-open and send message when initialInput is provided
  useEffect(() => {
    // Skip if no input or if we already processed this exact input
    if (!initialInput || initialInput === lastProcessedInputRef.current) {
      return;
    }

    // Mark this input as being processed
    lastProcessedInputRef.current = initialInput;

    // Open the chat panel
    setOpen(true);

    // Delay to ensure panel is visible and useChat is ready
    const timeoutId = setTimeout(() => {
      // Check for special personalization trigger
      if (initialInput === "__PERSONALIZE__") {
        sendMessage({ text: "Personalize my experience" });
      } else {
        sendMessage({ text: `Tell me about "${initialInput}"` });
      }
      onClearInitialInput?.();
    }, 150);

    return () => clearTimeout(timeoutId);
    // Note: sendMessage identity changes on every render from useChat, but we use the ref
    // to prevent duplicate sends, so it's safe to include in dependencies
  }, [initialInput, sendMessage, onClearInitialInput]);

  return (
    <>
      {/* Always-visible chat trigger */}
      <ChatTrigger open={open} onClick={handleToggle} />

      {/* Animated chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.3,
              y: 50,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              y: 50,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            style={{
              transformOrigin: "bottom right",
            }}
            className="fixed bottom-20 right-4 z-30 flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
          >
            <div
              className="flex flex-col"
              style={{
                width: "var(--chat-width)",
                maxHeight: "calc(100vh - 120px)",
                height: "600px",
                background: "var(--chat-bg)",
                backdropFilter: `blur(var(--chat-backdrop-blur))`,
                WebkitBackdropFilter: `blur(var(--chat-backdrop-blur))`,
                borderColor: "var(--border-color)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: "var(--border-color)" }}
              >
                <Sparkle active={messages.length === 0} count={12}>
                  <div style={{ lineHeight: "1.2" }}>
                    <h3 className="text-lg font-bold dark:text-white text-black">
                      Ditto
                    </h3>
                    <p className="text-xs" style={{ color: "var(--text-dim)", marginTop: "2px" }}>
                      Your Orlando event guide
                    </p>
                  </div>
                </Sparkle>
              </div>

              {/* Messages */}
              <Conversation className="flex-1 min-h-0">
                <ConversationContent className="px-4 py-4">
                  {messages.length === 0 && (
                    <>
                      <ConversationEmptyState
                        title="Meet Ditto"
                        description="I'm your guide to Orlando & Central Florida events. Ask me about what's happening, and I'll help you discover experiences that match your vibe."
                      />
                      <Suggestions className="mt-4">
                        {SUGGESTIONS.map((s) => (
                          <Suggestion key={s} suggestion={s} onClick={handleSuggestionClick} />
                        ))}
                      </Suggestions>
                    </>
                  )}

                  {messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.parts.map((part, i) => {
                          const key = `${message.id}-${i}`;

                          if (part.type === "text") {
                            // Check for Q&A format: QUESTION: ... OPTIONS: ...
                            // Using [\s\S] instead of . with s flag for ES5 compatibility
                            const qaMatch = part.text.match(
                              /QUESTION:\s*([\s\S]+?)\nOPTIONS:\s*([\s\S]+?)(?:\n|$)/
                            );
                            if (qaMatch) {
                              const question = qaMatch[1].trim();
                              const options = qaMatch[2]
                                .split("|")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              const remainingText = part.text
                                .replace(/QUESTION:\s*[\s\S]+?\nOPTIONS:\s*[\s\S]+?(?:\n|$)/, "")
                                .trim();

                              return (
                                <div key={key}>
                                  {remainingText && (
                                    <MessageResponse>{remainingText}</MessageResponse>
                                  )}
                                  <MessageResponse>{question}</MessageResponse>
                                  <Suggestions className="mt-3">
                                    {options.map((opt) => (
                                      <Suggestion
                                        key={opt}
                                        suggestion={opt}
                                        onClick={handleSuggestionClick}
                                      />
                                    ))}
                                  </Suggestions>
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

                          // Tool: searchEvents
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

                          // Tool: getEventDetails
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

                          // Tool: searchNewsletters
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

                          // Tool: rankEvents
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

                          // Tool: mapNavigate (client-side)
                          if (part.type === "tool-mapNavigate") {
                            return <MapAction key={key} input={part.input as never} />;
                          }

                          // Tool: getUserProfile (client-side, handled by onToolCall)
                          if (part.type === "tool-getUserProfile") {
                            // No visual output needed - execution handled in onToolCall
                            return null;
                          }

                          // Tool: updateUserProfile (client-side, handled by onToolCall)
                          if (part.type === "tool-updateUserProfile") {
                            // Show confirmation when profile is updated
                            if (part.state === "output-available") {
                              return (
                                <div key={key} className="text-sm text-green-600 dark:text-green-400">
                                  Profile updated successfully
                                </div>
                              );
                            }
                            return null;
                          }

                          // Tool: startFlyover (client-side, handled by onToolCall)
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

                          // Fallback for unknown tool parts
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

              {/* Input */}
              <div className="border-t px-4 py-3" style={{ borderColor: "var(--border-color)" }}>
                <PromptInput
                  onSubmit={(message) => {
                    handleSend(message.text);
                  }}
                >
                  <PromptInputTextarea placeholder="Ask about Orlando events..." />
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
