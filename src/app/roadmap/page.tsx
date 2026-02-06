/**
 * @module app/roadmap
 * Roadmap page showcasing upcoming features and enhancements.
 * Uses the same visual style as the intro modal with blurred stars background.
 */

"use client";

import { motion } from "motion/react";
import { ArrowLeft, Sparkles, Brain, Globe, Zap, Users, Calendar, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurredStars } from "@/components/effects/blurred-stars";
import Link from "next/link";

interface RoadmapItem {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  description: string;
  status: "in-progress" | "planned";
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    icon: Brain,
    title: "Enhanced AI Recommendations",
    description: "Smarter event suggestions based on your preferences and history",
    status: "in-progress",
  },
  {
    icon: Users,
    title: "Social Features",
    description: "Connect with friends, share events, and plan together",
    status: "planned",
  },
  {
    icon: Globe,
    title: "Expanded Regions",
    description: "Discover events beyond Orlando - coming to more cities",
    status: "planned",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Live notifications for event changes and recommendations",
    status: "planned",
  },
  {
    icon: Calendar,
    title: "Smart Calendar Sync",
    description: "Automatic conflict detection and schedule optimization",
    status: "planned",
  },
  {
    icon: MapPin,
    title: "AR Venue Previews",
    description: "Augmented reality tours of event venues",
    status: "planned",
  },
  {
    icon: Share2,
    title: "Event Creation",
    description: "Host and promote your own community events",
    status: "planned",
  },
  {
    icon: Sparkles,
    title: "Personalized Experiences",
    description: "Custom event categories and curated collections",
    status: "planned",
  },
];

/**
 * Roadmap page with upcoming features and enhancements.
 * Matches the visual style of the intro modal.
 */
export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Animated blurred stars background */}
      <BlurredStars count={150} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
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

          {/* Title */}
          <h2 className="mb-4 text-2xl font-semibold text-white">What&apos;s Coming</h2>
          <p className="text-lg text-white/70">
            Building the future of community discovery
          </p>
        </motion.div>

        {/* Roadmap Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ROADMAP_ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              {/* Status Badge */}
              <div className="mb-3 flex items-center justify-between">
                <item.icon className="h-6 w-6" style={{ color: "#3560FF" }} />
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    background:
                      item.status === "in-progress"
                        ? "rgba(53, 96, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                    color:
                      item.status === "in-progress"
                        ? "#3560FF"
                        : "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {item.status === "in-progress" ? "In Progress" : "Planned"}
                </span>
              </div>

              {/* Content */}
              <h3 className="mb-2 text-sm font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-xs text-white/60">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <Link href="/">
            <Button
              size="lg"
              className="gap-2"
              style={{
                background: "#3560FF",
                color: "#ffffff",
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Map
            </Button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-white/30">Mirror Factory, 2026</p>
        </motion.div>
      </div>
    </div>
  );
}
