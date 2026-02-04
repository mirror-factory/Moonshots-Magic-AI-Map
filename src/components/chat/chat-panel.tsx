/**
 * @module components/chat/chat-panel
 * Floating chat panel powered by the AI SDK `useChat` hook. Renders
 * conversation messages, tool output cards (events, newsletters, map
 * actions), and a prompt input with suggestion chips.
 */

"use client";

import { useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
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

interface ChatPanelProps {
  initialInput?: string;
  onClearInitialInput?: () => void;
}

const SUGGESTIONS = [
  "What's happening this weekend?",
  "Find live music near downtown Orlando",
  "Top 5 family-friendly events this month",
  "Any food festivals coming up?",
];

/** Floating chat panel with AI-powered event discovery conversation. */
export function ChatPanel({ initialInput, onClearInitialInput }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, status, stop } = useChat();

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

  // Auto-open and prefill when initialInput changes
  if (initialInput && !open) {
    setOpen(true);
    sendMessage({ text: `Tell me about "${initialInput}"` });
    onClearInitialInput?.();
  }

  if (!open) {
    return <ChatTrigger onClick={() => setOpen(true)} />;
  }

  return (
    <div
      className="fixed bottom-12 right-4 z-30 flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
      style={{
        width: "var(--chat-width)",
        maxHeight: "calc(100vh - 80px)",
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
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
            Moonshots & Magic
          </h3>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Orlando event discovery
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded"
          style={{ color: "var(--text-dim)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <Conversation className="flex-1">
        <ConversationContent className="px-4 py-4">
          {messages.length === 0 && (
            <>
              <ConversationEmptyState
                title="Moonshots & Magic"
                description="Ask me about events in Orlando & Central Florida. I can search events, recommend activities, and show them on the map."
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
            <Shimmer>Thinking...</Shimmer>
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
            <PromptInputSubmit
              status={status === "submitted" || status === "streaming" ? status : undefined}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
