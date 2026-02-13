/**
 * @module components/onboarding/onboarding-flow
 * 5-card conversational onboarding: Welcome → Vibe → Mood → Context → Launch.
 * Saves preferences to profile immediately at each step. Uses ambient context
 * for personalized greetings and context-aware category ordering.
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Leaf, Zap, Mountain, Baby, Gift, Dog, Rocket } from "lucide-react";
import type { EventCategory } from "@/lib/registries/types";
import type { Vibe, PriceRange } from "@/lib/profile";
import type { AmbientContext } from "@/lib/context/ambient-context";
import { getProfile, updateProfile, clearProfile } from "@/lib/profile-storage";
import { BlurredStars } from "@/components/effects/blurred-stars";
import { DittoAvatar } from "@/components/chat/ditto-avatar";
import { VibeTileLarge } from "./vibe-tile-large";

const ONBOARDING_STORAGE_KEY = "moonshots_onboarding_complete";

/** Categories shown in the vibe step. */
const VIBE_CATEGORIES: EventCategory[] = [
  "music", "food", "nightlife", "arts", "sports", "family",
  "outdoor", "tech", "community", "festival",
];

/** Mood options with Lucide icons. */
const MOOD_OPTIONS: { value: Vibe; label: string; Icon: typeof Leaf }[] = [
  { value: "chill", label: "Chill", Icon: Leaf },
  { value: "energetic", label: "Energetic", Icon: Zap },
  { value: "adventurous", label: "Adventurous", Icon: Mountain },
  { value: "family-friendly", label: "Family-Friendly", Icon: Baby },
];

/** Context chips with Lucide icons. */
const CONTEXT_CHIPS: { key: string; label: string; Icon: typeof Gift }[] = [
  { key: "free", label: "Free events", Icon: Gift },
  { key: "kids", label: "Has kids", Icon: Baby },
  { key: "pets", label: "Has pets", Icon: Dog },
  { key: "solo", label: "Solo explorer", Icon: Rocket },
];

interface OnboardingFlowProps {
  /** Whether the flow is visible. */
  open: boolean;
  /** All events for counting matches. */
  events?: Array<{ category: string }>;
  /** Ambient context for personalized greeting. */
  ambientContext?: AmbientContext | null;
  /** Called when onboarding completes. */
  onComplete: (categories: EventCategory[]) => void;
  /** Called when user dismisses onboarding via X button. */
  onDismiss?: () => void;
}

/** Order categories based on ambient context (time/weather). */
function orderCategories(categories: EventCategory[], context: AmbientContext | null): EventCategory[] {
  if (!context) return categories;

  const scores: Record<string, number> = {};
  for (const cat of categories) {
    let score = 0;
    if (context.timeOfDay === "evening" || context.timeOfDay === "night") {
      if (cat === "nightlife" || cat === "music") score += 3;
      if (cat === "food") score += 2;
    }
    if (context.timeOfDay === "morning" || context.timeOfDay === "afternoon") {
      if (cat === "family" || cat === "outdoor") score += 3;
      if (cat === "sports") score += 2;
    }
    if (context.isWeekend) {
      if (cat === "festival" || cat === "outdoor") score += 2;
    }
    if (context.weather) {
      const isRainy = ["Rainy", "Drizzle", "Showers", "Thunderstorm"].includes(context.weather.condition);
      if (isRainy && (cat === "arts" || cat === "tech" || cat === "food")) score += 2;
      if (!isRainy && (cat === "outdoor" || cat === "sports" || cat === "festival")) score += 1;
    }
    scores[cat] = score;
  }

  return [...categories].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
}

/** Get contextual greeting line for onboarding. */
function getContextLine(context: AmbientContext | null): string {
  if (!context) return "Let's find your next adventure";
  const { timeOfDay, weather, isWeekend } = context;

  if (weather) {
    const { temp, condition } = weather;
    if (condition === "Clear" && temp > 75) return "Beautiful warm evening — perfect for exploring";
    if (condition === "Rainy") return "Rainy day? Let's find something amazing indoors";
    if (temp < 55) return "Chilly out there — let's find something cozy";
  }

  if (isWeekend && timeOfDay === "morning") return "Weekend morning — so many possibilities!";
  if (timeOfDay === "evening") return "Evening vibes — the city's coming alive";
  if (timeOfDay === "night") return "Night owl mode activated";

  return "Let's find your next adventure";
}

/** 5-card conversational onboarding with animated transitions. */
export function OnboardingFlow({
  open,
  events,
  ambientContext = null,
  onComplete,
  onDismiss,
}: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(() => getProfile().name ?? "");
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(
    () => new Set(getProfile().interests.categories),
  );
  const [selectedVibes, setSelectedVibes] = useState<Set<Vibe>>(
    () => new Set(getProfile().interests.vibes),
  );
  const [selectedContext, setSelectedContext] = useState<Set<string>>(() => {
    const p = getProfile();
    const ctx = new Set<string>();
    if (p.interests.priceRange === "free") ctx.add("free");
    if (p.context.hasKids) ctx.add("kids");
    if (p.context.hasPets) ctx.add("pets");
    return ctx;
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const orderedCategories = useMemo(
    () => orderCategories(VIBE_CATEGORIES, ambientContext),
    [ambientContext],
  );

  const matchCount = useMemo(() => {
    if (!events || selectedCategories.size === 0) return 0;
    return events.filter((e) => selectedCategories.has(e.category as EventCategory)).length;
  }, [events, selectedCategories]);

  const handleToggleCategory = useCallback((category: EventCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);

  const handleToggleVibe = useCallback((vibe: Vibe) => {
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(vibe)) next.delete(vibe);
      else next.add(vibe);
      return next;
    });
  }, []);

  const handleToggleContext = useCallback((key: string) => {
    setSelectedContext((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /** Save profile data at each step transition. */
  const saveStep = useCallback((nextStep: number) => {
    const current = getProfile();

    if (step === 0 && name.trim()) {
      updateProfile({ name: name.trim() });
    }
    if (step === 1) {
      updateProfile({
        interests: { ...current.interests, categories: [...selectedCategories] },
      });
    }
    if (step === 2) {
      updateProfile({
        interests: { ...current.interests, vibes: [...selectedVibes] },
      });
    }
    if (step === 3) {
      const priceRange: PriceRange = selectedContext.has("free") ? "free" : "any";
      updateProfile({
        interests: { ...current.interests, priceRange },
        context: {
          hasKids: selectedContext.has("kids"),
          hasPets: selectedContext.has("pets"),
        },
      });
    }

    setStep(nextStep);
  }, [step, name, selectedCategories, selectedVibes, selectedContext]);

  const handleComplete = useCallback(() => {
    saveStep(5);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    onComplete([...selectedCategories]);
  }, [saveStep, selectedCategories, onComplete]);

  if (!open) return null;

  const contextLine = getContextLine(ambientContext);
  const totalSteps = 5;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: "#050505" }}
      >
        <BlurredStars count={200} />

        {/* X button to dismiss/skip */}
        <button
          onClick={() => {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
            if (onDismiss) { onDismiss(); } else { onComplete([...selectedCategories]); }
          }}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
          <div className="relative z-10 flex w-full max-w-md flex-col items-center">
          {/* Progress dots */}
          <div className="mb-4 flex gap-2 sm:mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 24 : 8,
                  background: i <= step ? "var(--brand-primary)" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="step-welcome"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex w-full flex-col items-center gap-4 sm:gap-6"
              >
                <DittoAvatar state="excited" size={80} />
                <h1
                  className="text-2xl tracking-wider text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  HEY THERE! I&apos;M DITTO.
                </h1>
                <p className="text-center text-sm text-white/60" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                  {contextLine}
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should I call you?"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg text-white placeholder:text-white/30 focus:border-[#0063CD] focus:outline-none focus:ring-1 focus:ring-[#0063CD]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveStep(1);
                  }}
                />
                <button
                  onClick={() => saveStep(1)}
                  className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
                  style={{
                    background: "var(--brand-primary)",
                    fontFamily: "var(--font-chakra-petch)",
                  }}
                >
                  {name.trim() ? `Let's go, ${name.trim()}!` : "Let's go!"}
                </button>
              </motion.div>
            )}

            {/* Step 1: Vibe categories */}
            {step === 1 && (
              <motion.div
                key="step-vibe"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex w-full flex-col items-center gap-4 sm:gap-6"
              >
                <h2
                  className="text-xl tracking-wider text-white sm:text-2xl"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  WHAT SOUNDS FUN?
                </h2>
                <p className="text-center text-sm text-white/60" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                  Pick as many as you like
                </p>
                <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                  {orderedCategories.map((cat) => (
                    <VibeTileLarge
                      key={cat}
                      category={cat}
                      selected={selectedCategories.has(cat)}
                      onToggle={handleToggleCategory}
                    />
                  ))}
                </div>
                {matchCount > 0 && (
                  <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-rajdhani)" }}>
                    {matchCount} event{matchCount !== 1 ? "s" : ""} match your picks
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/70 transition-colors hover:bg-white/5"
                    style={{ fontFamily: "var(--font-chakra-petch)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => saveStep(2)}
                    disabled={selectedCategories.size === 0}
                    className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-30"
                    style={{
                      background: "var(--brand-primary)",
                      fontFamily: "var(--font-chakra-petch)",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Mood / Vibe */}
            {step === 2 && (
              <motion.div
                key="step-mood"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex w-full flex-col items-center gap-4 sm:gap-6"
              >
                <h2
                  className="text-xl tracking-wider text-white sm:text-2xl"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  WHAT&apos;S YOUR VIBE?
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {MOOD_OPTIONS.map((mood) => {
                    const selected = selectedVibes.has(mood.value);
                    return (
                      <motion.button
                        key={mood.value}
                        onClick={() => handleToggleVibe(mood.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full px-5 py-2.5 text-sm transition-colors"
                        style={{
                          background: selected
                            ? "rgba(0, 99, 205, 0.3)"
                            : "rgba(255, 255, 255, 0.05)",
                          border: `2px solid ${selected ? "#0063CD" : "rgba(255,255,255,0.1)"}`,
                          color: selected ? "#66AAF0" : "rgba(255,255,255,0.8)",
                          fontFamily: "var(--font-chakra-petch)",
                        }}
                      >
                        <mood.Icon className="mr-1.5 inline h-4 w-4" /> {mood.label}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/70 transition-colors hover:bg-white/5"
                    style={{ fontFamily: "var(--font-chakra-petch)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => saveStep(3)}
                    className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
                    style={{
                      background: "var(--brand-primary)",
                      fontFamily: "var(--font-chakra-petch)",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Context (optional) */}
            {step === 3 && (
              <motion.div
                key="step-context"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex w-full flex-col items-center gap-4 sm:gap-6"
              >
                <h2
                  className="text-xl tracking-wider text-white sm:text-2xl"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  ANY PRIORITIES?
                </h2>
                <p className="text-center text-xs text-white/50" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                  Optional — skip if none apply
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {CONTEXT_CHIPS.map((chip) => {
                    const selected = selectedContext.has(chip.key);
                    return (
                      <motion.button
                        key={chip.key}
                        onClick={() => handleToggleContext(chip.key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full px-4 py-2 text-sm transition-colors"
                        style={{
                          background: selected
                            ? "rgba(0, 99, 205, 0.3)"
                            : "rgba(255, 255, 255, 0.05)",
                          border: `2px solid ${selected ? "#0063CD" : "rgba(255,255,255,0.1)"}`,
                          color: selected ? "#66AAF0" : "rgba(255,255,255,0.8)",
                          fontFamily: "var(--font-chakra-petch)",
                        }}
                      >
                        <chip.Icon className="mr-1.5 inline h-4 w-4" /> {chip.label}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/70 transition-colors hover:bg-white/5"
                    style={{ fontFamily: "var(--font-chakra-petch)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => saveStep(4)}
                    className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
                    style={{
                      background: "var(--brand-primary)",
                      fontFamily: "var(--font-chakra-petch)",
                    }}
                  >
                    {selectedContext.size > 0 ? "Continue" : "Skip"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Launch */}
            {step === 4 && (
              <motion.div
                key="step-launch"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex w-full flex-col items-center gap-4 sm:gap-6"
              >
                <DittoAvatar state="celebrating" size={80} />
                <h2
                  className="text-xl tracking-wider text-white sm:text-2xl"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  {name.trim() ? `GREAT TASTE, ${name.trim().toUpperCase()}!` : "YOU'RE ALL SET!"}
                </h2>
                <p
                  className="text-4xl font-bold"
                  style={{
                    color: "var(--brand-primary-light)",
                    fontFamily: "var(--font-rajdhani)",
                  }}
                >
                  {matchCount > 0 ? `${matchCount} events` : "Lots of events"} for you
                </p>
                <button
                  onClick={handleComplete}
                  className="rounded-xl px-10 py-4 text-base font-semibold text-white transition-transform hover:scale-105"
                  style={{
                    background: "var(--brand-primary)",
                    fontFamily: "var(--font-chakra-petch)",
                    boxShadow: "0 0 40px rgba(0, 99, 205, 0.4)",
                  }}
                >
                  Explore
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="mt-2 text-xs text-white/30 transition-colors hover:text-white/60"
                  style={{ fontFamily: "var(--font-chakra-petch)" }}
                >
                  Clear Preferences
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clear Preferences confirmation modal */}
          <AnimatePresence>
            {showClearConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="mx-4 flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0f] p-6"
                >
                  <h3
                    className="text-lg tracking-wider text-white"
                    style={{ fontFamily: "var(--font-bebas-neue)" }}
                  >
                    CLEAR ALL PREFERENCES?
                  </h3>
                  <p className="text-center text-xs text-white/50" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                    This will reset your name, interests, and all settings.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5"
                      style={{ fontFamily: "var(--font-chakra-petch)" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        clearProfile();
                        setName("");
                        setSelectedCategories(new Set());
                        setSelectedVibes(new Set());
                        setSelectedContext(new Set());
                        setStep(0);
                        setShowClearConfirm(false);
                      }}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                      style={{
                        background: "#dc2626",
                        fontFamily: "var(--font-chakra-petch)",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
