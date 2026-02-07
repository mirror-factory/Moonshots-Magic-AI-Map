/**
 * @module components/onboarding/onboarding-quiz
 * 3-step onboarding quiz: Name -> Vibe tiles -> Go.
 * Shown on first visit, saves preferences to profile and localStorage.
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { EventCategory } from "@/lib/registries/types";
import { getProfile, updateProfile } from "@/lib/profile-storage";
import { BlurredStars } from "@/components/effects/blurred-stars";
import { CategoryTile } from "./category-tile";
import { CATEGORY_LABELS } from "@/lib/map/config";
import { Badge } from "@/components/ui/badge";

const ONBOARDING_STORAGE_KEY = "moonshots_onboarding_complete";

const VIBE_CATEGORIES: EventCategory[] = [
  "music",
  "arts",
  "sports",
  "food",
  "tech",
  "community",
  "family",
  "nightlife",
];

interface OnboardingQuizProps {
  /** Whether the quiz overlay is visible. */
  open: boolean;
  /** Called when the quiz is completed. Returns selected categories. */
  onComplete: (categories: EventCategory[]) => void;
}

/** 3-step onboarding quiz overlay with starfield background. */
export function OnboardingQuiz({ open, onComplete }: OnboardingQuizProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());

  const handleToggleCategory = useCallback((category: EventCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleComplete = useCallback(() => {
    const categories = [...selectedCategories];
    const current = getProfile();
    updateProfile({
      name: name.trim() || undefined,
      interests: {
        ...current.interests,
        categories: categories as EventCategory[],
      },
    });
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    onComplete(categories);
  }, [name, selectedCategories, onComplete]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "#050505" }}
      >
        <BlurredStars count={120} />

        <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Name */}
            {step === 0 && (
              <motion.div
                key="step-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex w-full flex-col items-center gap-6"
              >
                <h1
                  className="text-4xl tracking-wider text-white"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  MOONSHOTS & MAGIC
                </h1>
                <p className="text-center text-white/70" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                  What should we call you?
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg text-white placeholder:text-white/30 focus:border-[#0063CD] focus:outline-none focus:ring-1 focus:ring-[#0063CD]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setStep(1);
                  }}
                />
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
                  style={{
                    background: "var(--brand-primary)",
                    fontFamily: "var(--font-chakra-petch)",
                  }}
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 1: Vibe */}
            {step === 1 && (
              <motion.div
                key="step-vibe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex w-full flex-col items-center gap-6"
              >
                <h2
                  className="text-2xl tracking-wider text-white"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  PICK YOUR VIBE
                </h2>
                <p className="text-center text-sm text-white/70" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                  Select the categories that interest you (at least 1)
                </p>
                <div className="grid w-full grid-cols-2 gap-3">
                  {VIBE_CATEGORIES.map((category) => (
                    <CategoryTile
                      key={category}
                      category={category}
                      selected={selectedCategories.has(category)}
                      onToggle={handleToggleCategory}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/70 transition-colors hover:bg-white/5"
                    style={{ fontFamily: "var(--font-chakra-petch)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={selectedCategories.size === 0}
                    className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
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

            {/* Step 2: Go */}
            {step === 2 && (
              <motion.div
                key="step-go"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex w-full flex-col items-center gap-6"
              >
                <h2
                  className="text-2xl tracking-wider text-white"
                  style={{ fontFamily: "var(--font-bebas-neue)" }}
                >
                  {name.trim() ? `HEY ${name.trim().toUpperCase()}!` : "YOU'RE ALL SET!"}
                </h2>
                <p className="text-center text-white/70" style={{ fontFamily: "var(--font-chakra-petch)" }}>
                  Here&apos;s your personalized map
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[...selectedCategories].map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        fontFamily: "var(--font-chakra-petch)",
                      }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </Badge>
                  ))}
                </div>
                <button
                  onClick={handleComplete}
                  className="rounded-xl px-10 py-4 text-base font-semibold text-white transition-transform hover:scale-105"
                  style={{
                    background: "var(--brand-primary)",
                    fontFamily: "var(--font-chakra-petch)",
                    boxShadow: "0 0 30px rgba(0, 99, 205, 0.4)",
                  }}
                >
                  Launch Map
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
