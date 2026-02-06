/**
 * @module components/effects/sparkle
 * CSS-based sparkle animation for the AI thinking indicator.
 * Creates a magical particle effect around the shimmer component.
 */

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

interface SparkleProps {
  /** Whether the sparkle animation is active. */
  active?: boolean;
  /** Number of sparkles to render. */
  count?: number;
  /** Color of the sparkles. */
  color?: string;
  /** Glow color for the sparkles. */
  glowColor?: string;
  /** Children to render alongside sparkles. */
  children?: React.ReactNode;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Generates random sparkle particles with position, size, and animation timing.
 * @param count - Number of sparkles to generate.
 * @returns Array of sparkle particle configurations.
 */
function generateSparkles(count: number): SparkleParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage
    y: Math.random() * 100,
    size: 2 + Math.random() * 4, // 2-6px
    delay: Math.random() * 2, // 0-2s delay
    duration: 1 + Math.random() * 1.5, // 1-2.5s duration
  }));
}

/** Individual sparkle particle with scale and opacity animation. */
function SparkleParticleComponent({
  particle,
  color,
  glowColor,
}: {
  particle: SparkleParticle;
  color: string;
  glowColor: string;
}) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        background: color,
        boxShadow: `0 0 ${particle.size * 2}px ${glowColor}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * Sparkle effect container that renders animated particles.
 * Wraps children with magical sparkle animation when active.
 */
export function Sparkle({
  active = false,
  count = 20,
  color = "#ffffff",
  glowColor = "#3560FF",
  children,
}: SparkleProps) {
  const sparkles = useMemo(() => generateSparkles(count), [count]);

  return (
    <div className="relative inline-block">
      {active && (
        <div className="pointer-events-none absolute -inset-4 overflow-visible">
          {sparkles.map((particle) => (
            <SparkleParticleComponent
              key={particle.id}
              particle={particle}
              color={color}
              glowColor={glowColor}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
