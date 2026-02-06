/**
 * @module components/settings/model-selector
 * AI model selection component with provider badges and context window info.
 * Displays available models grouped by provider with visual indicators.
 */

"use client";

import { AVAILABLE_MODELS, type ModelId } from "@/lib/settings";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (modelId: ModelId) => void;
}

const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: "#D97706",
  OpenAI: "#10B981",
  Google: "#3B82F6",
};

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  premium: { label: "Premium", color: "var(--brand-primary)" },
  fast: { label: "Fast", color: "var(--text-muted)" },
};

/** Renders a selectable list of AI models with provider badges. */
export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      {AVAILABLE_MODELS.map((model) => {
        const isSelected = value === model.id;
        const providerColor = PROVIDER_COLORS[model.provider] || "var(--text-dim)";
        const tier = TIER_LABELS[model.tier];

        return (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors"
            style={{
              background: isSelected ? "var(--surface-3)" : "transparent",
              border: `1px solid ${isSelected ? "var(--brand-primary)" : "var(--border-color)"}`,
            }}
          >
            <div className="flex items-center gap-3">
              {/* Selection indicator */}
              <div
                className="flex h-4 w-4 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: isSelected ? "var(--brand-primary)" : "var(--border-color)",
                }}
              >
                {isSelected && (
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--brand-primary)" }}
                  />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: isSelected ? "var(--text)" : "var(--text-dim)" }}
                  >
                    {model.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0"
                    style={{
                      borderColor: providerColor,
                      color: providerColor,
                    }}
                  >
                    {model.provider}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {model.contextWindow} context
                  </span>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: tier.color }}
                  >
                    {tier.label}
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
