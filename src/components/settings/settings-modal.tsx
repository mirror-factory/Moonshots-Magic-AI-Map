/**
 * @module components/settings/settings-modal
 * Settings dialog for AI model selection and API configuration.
 * Provides model picker, API key management, and documentation links.
 */

"use client";

import { useState } from "react";
import { X, ExternalLink, Check, AlertCircle, Sparkles, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "./model-selector";
import {
  getStoredModel,
  setStoredModel,
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  maskApiKey,
  getModelById,
  type ModelId,
} from "@/lib/settings";
import { getEventSourceStats } from "@/lib/registries/events";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onStartPersonalization?: () => void;
}

/** Settings dialog with AI model selection and API configuration. */
export function SettingsModal({ open, onClose, onStartPersonalization }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <SettingsModalContent
          onClose={onClose}
          onStartPersonalization={onStartPersonalization}
        />
      )}
    </AnimatePresence>
  );
}

interface SettingsModalContentProps {
  onClose: () => void;
  onStartPersonalization?: () => void;
}

/**
 * Inner content of the settings modal.
 * Mounts/unmounts with the dialog so useState initializers run fresh each open.
 */
function SettingsModalContent({ onClose, onStartPersonalization }: SettingsModalContentProps) {
  const [selectedModel, setSelectedModel] = useState<ModelId>(() => getStoredModel());
  const [apiKey, setApiKey] = useState("");
  const [storedKey, setStoredKey] = useState<string | undefined>(() => getStoredApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setStoredModel(selectedModel);
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setStoredKey(apiKey.trim());
      setApiKey("");
      setShowKeyInput(false);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearApiKey = () => {
    clearStoredApiKey();
    setStoredKey(undefined);
    setApiKey("");
    setShowKeyInput(false);
  };

  const currentModel = getModelById(selectedModel);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto w-auto max-w-md -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
            style={{ color: "var(--text-dim)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-6">
          {/* AI Model Selection */}
          <section>
            <h3
              className="mb-3 text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              AI Model
            </h3>
            <ModelSelector value={selectedModel} onChange={setSelectedModel} />
            {currentModel && (
              <p
                className="mt-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Using {currentModel.name} via {currentModel.provider}
              </p>
            )}
          </section>

          {/* Personalization */}
          {onStartPersonalization && (
            <section>
              <h3
                className="mb-3 text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                Personalization
              </h3>
              <div
                className="rounded-lg p-4"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <p
                  className="mb-3 text-sm"
                  style={{ color: "var(--text-dim)" }}
                >
                  Tell Ditto about your preferences to get personalized event recommendations.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onStartPersonalization();
                  }}
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" style={{ color: "var(--brand-primary)" }} />
                  Start Personalization Interview
                </Button>
              </div>
            </section>
          )}

          {/* API Key Configuration */}
          <section>
            <h3
              className="mb-3 text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              API Gateway
            </h3>
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-color)",
              }}
            >
              {storedKey ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" style={{ color: "#10B981" }} />
                      <span className="text-sm" style={{ color: "var(--text)" }}>
                        API key configured
                      </span>
                    </div>
                    <code
                      className="rounded px-2 py-0.5 text-xs font-mono"
                      style={{
                        background: "var(--surface-3)",
                        color: "var(--text-dim)",
                      }}
                    >
                      {maskApiKey(storedKey)}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeyInput(true)}
                      className="text-xs"
                    >
                      Change
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearApiKey}
                      className="text-xs"
                      style={{ color: "#EF4444" }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                    <span className="text-sm" style={{ color: "var(--text-dim)" }}>
                      Using default API key
                    </span>
                  </div>
                  {!showKeyInput && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeyInput(true)}
                      className="text-xs"
                    >
                      Add custom API key
                    </Button>
                  )}
                </div>
              )}

              {showKeyInput && (
                <div className="mt-3 space-y-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API key (e.g., vck_...)"
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text)",
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowKeyInput(false);
                        setApiKey("");
                      }}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Event Sources */}
          <EventSourcesSection />

          {/* Documentation Links */}
          <section>
            <h3
              className="mb-3 text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Documentation
            </h3>
            <div className="space-y-2">
              <a
                href="/roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-black/5"
                style={{
                  border: "1px solid var(--border-color)",
                }}
              >
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  Roadmap
                </span>
                <ExternalLink className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
              </a>
              <a
                href="/docs/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-black/5"
                style={{
                  border: "1px solid var(--border-color)",
                }}
              >
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  AI Capabilities Guide
                </span>
                <ExternalLink className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
              </a>
              <a
                href="https://vercel.com/docs/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-black/5"
                style={{
                  border: "1px solid var(--border-color)",
                }}
              >
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  Vercel AI SDK Docs
                </span>
                <ExternalLink className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
              </a>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 border-t px-5 py-4"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              background: "var(--brand-primary)",
              color: "var(--brand-primary-foreground)",
            }}
          >
            {saved ? (
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" /> Saved
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </motion.div>
    </>
  );
}

/** Source type to icon color mapping for visual distinction. */
const SOURCE_COLORS: Record<string, string> = {
  ticketmaster: "#009CDE",
  eventbrite: "#F05537",
  serpapi: "#34A853",
  scraper: "#8B5CF6",
  manual: "#6B7280",
  overpass: "#F59E0B",
  predicthq: "#EC4899",
};

/** Displays event source breakdown and sync metadata. */
function EventSourcesSection() {
  const stats = getEventSourceStats();
  const syncDate = new Date(stats.lastSynced);
  const syncStr = syncDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <section>
      <h3
        className="mb-3 text-sm font-medium flex items-center gap-2"
        style={{ color: "var(--text)" }}
      >
        <Database className="h-4 w-4" style={{ color: "var(--brand-primary)" }} />
        Event Sources
      </h3>
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Summary row */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
            {stats.total.toLocaleString()} total events
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Synced {syncStr}
          </span>
        </div>

        {/* Source breakdown */}
        <div className="space-y-2">
          {stats.sources.map((src) => {
            const pct = Math.round((src.count / stats.total) * 100);
            const color = SOURCE_COLORS[src.type] ?? "var(--text-dim)";
            return (
              <div key={src.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                    {src.label}
                  </span>
                  <span className="text-xs tabular-nums" style={{ color: "var(--text-dim)" }}>
                    {src.count.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ background: "var(--surface-3)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sync info */}
        <p className="text-xs pt-1" style={{ color: "var(--text-muted)" }}>
          Events are synced from Ticketmaster, Eventbrite, SerpApi, and Orlando-area
          web sources. Run <code
            className="rounded px-1 py-0.5 text-[10px] font-mono"
            style={{ background: "var(--surface-3)" }}
          >pnpm sync-events</code> to refresh.
        </p>
      </div>
    </section>
  );
}
