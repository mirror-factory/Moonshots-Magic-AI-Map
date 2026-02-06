/**
 * @module components/intro/intro-modal
 * Welcome modal for first-time visitors to Moonshots & Magic.
 * Features animated blurred stars background, brand messaging, and audio narration.
 */

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MapPin, Calendar, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurredStars } from "@/components/effects/blurred-stars";
import { speak, stopSpeaking } from "@/lib/voice/cartesia-tts";

interface IntroModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Callback when the modal is dismissed. */
  onDismiss: () => void;
}

/** Intro narration script for Ditto. */
const INTRO_NARRATION = `Welcome to Moonshots and Magic! I'm Ditto, your guide to discovering amazing experiences in Orlando and Central Florida.

Whether you're looking for live music, art exhibitions, food festivals, or family-friendly adventures, I'm here to help you find the perfect event.

You can search by category, get personalized recommendations, explore locations with 3D flyover tours, and add events directly to your calendar.

Let's discover something magical together!`;

const FEATURES = [
  {
    icon: Sparkles,
    title: "Search events",
    description: "Find events by category, date, or vibe",
  },
  {
    icon: Compass,
    title: "Get recommendations",
    description: "Personalized suggestions from Ditto",
  },
  {
    icon: MapPin,
    title: "Explore with flyovers",
    description: "Narrated 3D tours of event locations",
  },
  {
    icon: Calendar,
    title: "Never miss out",
    description: "Add events directly to your calendar",
  },
];

/**
 * First-time visitor welcome modal with brand introduction.
 * Shows feature highlights, plays audio narration, and dismisses to localStorage.
 */
export function IntroModal({ open, onDismiss }: IntroModalProps) {
  // Play intro narration when modal opens
  useEffect(() => {
    if (!open) {
      stopSpeaking();
      return;
    }

    // Small delay to let the modal animate in
    const timer = setTimeout(() => {
      console.log("[Intro] Playing narration...");
      speak(INTRO_NARRATION).catch((err) => {
        console.warn("[Intro] Audio playback failed:", err);
      });
    }, 800);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [open]);

  // Handle dismiss - stop audio and close
  const handleDismiss = () => {
    stopSpeaking();
    onDismiss();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Animated blurred stars background */}
          <BlurredStars count={150} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 mx-4 max-w-md text-center"
          >
            {/* Logo */}
            <div className="mb-6">
              <h1 className="font-bold uppercase tracking-wider">
                <span className="block text-3xl text-white">MOONSHOTS</span>
                <span className="block text-3xl text-white/70">& MAGIC</span>
              </h1>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                mirror factory
              </p>
            </div>

            {/* Tagline */}
            <p className="mb-8 text-lg text-white/80">
              Discover experiences in your community to connect and grow
            </p>

            {/* Features */}
            <div className="mb-8 grid grid-cols-2 gap-4 text-left">
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + FEATURES.indexOf(feature) * 0.1 }}
                  className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                >
                  <feature.icon
                    className="mb-2 h-5 w-5"
                    style={{ color: "#3560FF" }}
                  />
                  <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                  <p className="text-xs text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                size="lg"
                onClick={handleDismiss}
                className="px-8"
                style={{
                  background: "#3560FF",
                  color: "#ffffff",
                }}
              >
                Get Started
              </Button>
            </motion.div>

            {/* Copyright */}
            <p className="mt-6 text-xs text-white/30">
              Mirror Factory, 2026
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
