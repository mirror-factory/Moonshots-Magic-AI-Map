import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "e2e"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/components/**"],
      exclude: [
        "src/components/ui/**",
        "src/components/ai-elements/**",
        "src/components/map/**",
        "src/components/intro/**",
        "src/components/settings/**",
        "src/lib/voice/**",
        "src/lib/docs/**",
        "src/lib/flyover/flyover-audio.ts",
        "src/lib/flyover/camera-animator.ts",
        "src/lib/utils.ts",
        "src/components/effects/blurred-stars.tsx",
        "src/components/effects/static-stars.tsx",
        "src/components/effects/index.ts",
        "src/components/chat/event-list.tsx",
        "src/components/chat/newsletter-card.tsx",
        "src/components/chat/voice-input-button.tsx",
        "src/components/chat/chat-panel.tsx",
        "src/components/chat/center-chat.tsx",
        "src/components/chat/chat-trigger.tsx",
        "src/components/chat/ditto-avatar.tsx",
        "src/components/chat/ditto-personality.ts",
        "src/components/chat/suggestion-tiles.tsx",
        "src/components/effects/ambient-particles.tsx",
        "src/components/onboarding/**",
        "src/components/theme-toggle.tsx",
        "src/components/calendar/**",
        "src/lib/supabase/types.ts",
        "src/lib/supabase/middleware.ts",
        "src/lib/supabase/server.ts",
        "src/lib/registries/eventbrite-parser.ts",
        "**/*.d.ts",
        "**/*.stories.tsx",
      ],
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 60,
      },
    },
  },
});
