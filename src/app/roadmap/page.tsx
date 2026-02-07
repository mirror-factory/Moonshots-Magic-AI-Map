/**
 * @module app/roadmap
 * Changelog and roadmap page with tabbed navigation.
 * Displays version history and upcoming features from JSON data files.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Brain,
  Globe,
  Zap,
  Users,
  Calendar,
  MapPin,
  Share2,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurredStars } from "@/components/effects/blurred-stars";
import Link from "next/link";
import roadmapData from "@/data/roadmap.json";
import changelogData from "@/data/changelog.json";

/** Map of icon name strings to Lucide icon components. */
const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Brain,
  Users,
  Globe,
  Zap,
  Calendar,
  MapPin,
  Share2,
  Sparkles,
  Move,
};

/** Shape of a roadmap item from roadmap.json. */
interface RoadmapItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: "in-progress" | "planned";
  priority: "high" | "medium";
  addedDate: string;
}

/** Shape of a changelog entry from changelog.json. */
interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: { type: "feat" | "fix" | "chore"; text: string }[];
}

/** Badge color config for changelog item types. */
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  feat: { bg: "rgba(53, 96, 255, 0.2)", text: "#3560FF" },
  fix: { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
  chore: { bg: "rgba(255, 255, 255, 0.1)", text: "rgba(255, 255, 255, 0.6)" },
};

type TabKey = "changelog" | "roadmap";

/**
 * Changelog and roadmap page with tabbed navigation.
 * Loads data from JSON files so items can be maintained without code changes.
 */
export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("changelog");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "changelog", label: "Changelog" },
    { key: "roadmap", label: "Roadmap" },
  ];

  return (
    <div className="relative min-h-screen bg-black">
      <BlurredStars count={150} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-6">
            <h1 className="font-bold uppercase tracking-wider">
              <span className="block text-3xl text-white">MOONSHOTS</span>
              <span className="block text-3xl text-white/70">& MAGIC</span>
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
              mirror factory
            </p>
          </div>

          <h2 className="mb-4 text-2xl font-semibold text-white">
            {activeTab === "changelog" ? "What We\u2019ve Built" : "What\u2019s Coming"}
          </h2>
          <p className="text-lg text-white/70">
            {activeTab === "changelog"
              ? "A history of features and improvements"
              : "Building the future of community discovery"}
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative z-10 rounded-md px-6 py-2 text-sm font-medium transition-colors"
                style={{
                  color: activeTab === tab.key ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {tab.label}
              </button>
            ))}
            {/* Animated underline indicator */}
            <motion.div
              className="absolute bottom-1 top-1 rounded-md"
              style={{ background: "rgba(53, 96, 255, 0.3)" }}
              layout
              animate={{
                left: activeTab === "changelog" ? 4 : "50%",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "changelog" ? (
            <motion.div
              key="changelog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-12 space-y-8"
            >
              {(changelogData as ChangelogEntry[]).map((entry) => (
                <div
                  key={entry.version}
                  className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-sm font-bold"
                      style={{
                        background: "rgba(53, 96, 255, 0.2)",
                        color: "#3560FF",
                      }}
                    >
                      v{entry.version}
                    </span>
                    <span className="text-sm text-white/50">{entry.date}</span>
                    <span className="text-sm font-medium text-white/80">{entry.title}</span>
                  </div>
                  <ul className="space-y-2">
                    {entry.items.map((item, idx) => {
                      const colors = TYPE_COLORS[item.type] ?? TYPE_COLORS.chore;
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <span
                            className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                            style={{
                              background: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {item.type}
                          </span>
                          <span className="text-sm text-white/70">{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {(roadmapData as RoadmapItem[]).map((item, index) => {
                const Icon = ICON_MAP[item.icon];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-6 w-6" style={{ color: "#3560FF" }} />}
                        {/* Priority dot */}
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{
                            background: item.priority === "high" ? "#3560FF" : "#eab308",
                          }}
                          title={`${item.priority} priority`}
                        />
                      </div>
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
                    <h3 className="mb-2 text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-white/60">{item.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

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
