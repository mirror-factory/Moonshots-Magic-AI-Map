/**
 * @module components/effects/stars
 * Animated star field with GSAP — twinkle, forward motion, shooting stars.
 * Optimized: single staggered tweens, transform/opacity only, will-change hints.
 */

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface StarsProps {
  /** Number of stars to render. */
  count?: number;
  /** Number of shooting stars to animate. */
  shootingStars?: number;
}

/**
 * Renders an animated star field with twinkling and forward motion effects.
 * Uses GSAP stagger for efficient batch animation (one tween per property group).
 *
 * @param count - Number of stars (default: 100)
 * @param shootingStars - Number of shooting stars (default: 0)
 */
export function Stars({ count = 100, shootingStars = 0 }: StarsProps) {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    // Build star elements — only transform + opacity animated (compositor-friendly)
    const stars = Array.from({ length: count }, () => {
      const star = document.createElement("div");
      const size = Math.random() * 1.7 + 0.8;
      const isBlue = Math.random() > 0.35;
      const depth = Math.random();

      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${isBlue ? "#0063CD" : "#FFFFFF"};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.4};
        box-shadow: 0 0 ${size * 2}px currentColor;
        will-change: transform, opacity;
        pointer-events: none;
      `;
      star.dataset.depth = depth.toString();
      return star;
    });

    // Shooting star elements
    const shooters = Array.from({ length: shootingStars }, () => {
      const shooter = document.createElement("div");
      const isBlue = Math.random() > 0.5;

      shooter.style.cssText = `
        position: absolute;
        width: 50px;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${isBlue ? "#0063CD" : "#FFFFFF"});
        opacity: 0;
        will-change: transform, opacity;
        pointer-events: none;
      `;
      return shooter;
    });

    const container = starsRef.current;
    stars.forEach((star) => container.appendChild(star));
    shooters.forEach((shooter) => container.appendChild(shooter));

    const ctx = gsap.context(() => {
      // Batch twinkle — single gsap.to() with stagger instead of N individual tweens
      gsap.to(stars, {
        opacity: "random(0.05, 0.3)",
        duration: "random(3, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.05, from: "random" },
      });

      // Batch forward motion — single gsap.fromTo() with stagger
      gsap.fromTo(
        stars,
        {
          scale: (i) => {
            const depth = parseFloat(stars[i].dataset.depth || "0.5");
            return 0.5 + depth * 0.3;
          },
          x: 0,
          y: 0,
        },
        {
          scale: (i) => {
            const depth = parseFloat(stars[i].dataset.depth || "0.5");
            return (0.5 + depth * 0.3) * 4.5;
          },
          x: "random(-30, 30)",
          y: "random(-30, 30)",
          duration: (i) => {
            const depth = parseFloat(stars[i].dataset.depth || "0.5");
            return 15 + depth * 10;
          },
          repeat: -1,
          ease: "none",
          stagger: { each: 0.02, from: "random" },
        },
      );

      // Shooting stars — recursive timeline per shooter
      shooters.forEach((shooter, i) => {
        const animateShooter = () => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 60;
          const angle = Math.random() * 30 + 30;

          gsap.set(shooter, { left: `${startX}%`, top: `${startY}%`, rotation: angle });

          gsap.fromTo(
            shooter,
            { opacity: 0, x: 0, y: 0 },
            {
              opacity: 0.9,
              x: 400,
              y: 300,
              duration: Math.random() * 2 + 2,
              ease: "none",
              onComplete: () => {
                gsap.to(shooter, {
                  opacity: 0,
                  duration: 0.3,
                  onComplete: () => {
                    setTimeout(animateShooter, Math.random() * 8000 + 5000);
                  },
                });
              },
            },
          );
        };

        setTimeout(animateShooter, i * 500 + Math.random() * 1000);
      });
    }, container);

    return () => {
      ctx.revert();
      stars.forEach((star) => star.remove());
      shooters.forEach((shooter) => shooter.remove());
    };
  }, [count, shootingStars]);

  return <div ref={starsRef} className="pointer-events-none absolute inset-0 z-[5]" />;
}
