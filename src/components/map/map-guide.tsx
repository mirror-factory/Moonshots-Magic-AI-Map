/**
 * @module components/map/map-guide
 * First-time map guide overlay. Shows once after onboarding to explain
 * toolbar buttons and key features. Self-contained — manages its own
 * localStorage state with no props required.
 */

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  List,
  CalendarDays,
  Compass,
  Search,
  Layers,
  MessageCircle,
  LocateFixed,
  Settings,
  Play,
} from "lucide-react";

const GUIDE_STORAGE_KEY = "moonshots_map_guide_complete";
const ONBOARDING_STORAGE_KEY = "moonshots_onboarding_complete";

const TOOLBAR_FEATURES = [
  { icon: List, label: "Events List", desc: "Browse all Orlando events" },
  { icon: CalendarDays, label: "Date Filter", desc: "Filter by today, weekend, week, month" },
  { icon: Compass, label: "Distance", desc: "Find events within 1\u201310 miles" },
  { icon: Search, label: "Search", desc: "Search places and get directions" },
  { icon: Layers, label: "Data Layers", desc: "Weather, transit, aircraft, and more" },
  { icon: MessageCircle, label: "AI Chat", desc: "Ask about events, get recommendations" },
  { icon: LocateFixed, label: "Location", desc: "Find your position on the map" },
  { icon: Settings, label: "Settings", desc: "3D view, audio, rotation, zoom" },
  { icon: Play, label: "Demos", desc: "Flyover tours, presentations, showcases" },
] as const;

const TIPS = [
  "Click any event dot on the map for details and directions",
  "Use suggestion tiles below the chat to get started",
  "Try a flyover tour for an AI-narrated cinematic experience",
];

/** Glass-style guide panel matching the toolbar glassPill pattern. */
const glassPanel: React.CSSProperties = {
  background: "rgba(10, 10, 15, 0.82)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
};

/** First-time map guide overlay. Appears once after onboarding completes. */
export function MapGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onboardingDone = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const guideDone = localStorage.getItem(GUIDE_STORAGE_KEY);
    if (onboardingDone && !guideDone) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.4)" }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="w-full max-w-lg overflow-y-auto rounded-2xl p-6 shadow-2xl"
            style={{ ...glassPanel, maxHeight: "70vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-chakra-petch, 'Chakra Petch', sans-serif)" }}
              >
                Welcome to the Map
              </h2>
            </div>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Here&apos;s a quick overview of everything you can do.
            </p>

            {/* Toolbar features grid */}
            <div className="grid grid-cols-3 gap-3">
              {TOOLBAR_FEATURES.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center"
                  style={{ background: "rgba(255, 255, 255, 0.04)" }}
                >
                  <Icon className="h-5 w-5 text-blue-400" />
                  <span className="text-xs font-medium text-white">{label}</span>
                  <span className="text-[10px] leading-tight" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-5 h-px w-full" style={{ background: "rgba(255, 255, 255, 0.08)" }} />

            {/* Tips section */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              More things you can do
            </p>
            <ul className="mb-5 space-y-1.5">
              {TIPS.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-400" />
                  {tip}
                </li>
              ))}
            </ul>

            {/* Dismiss button */}
            <button
              onClick={dismiss}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
              style={{ background: "var(--brand-blue, #3B82F6)" }}
            >
              Got it, let&apos;s explore!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
