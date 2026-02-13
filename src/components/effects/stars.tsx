/**
 * @module components/effects/stars
 * Stars background component with animated twinkle and forward motion effects.
 * Used for cosmic/space-themed backgrounds with optional shooting stars.
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
 * Stars have varying sizes, colors (white/blue), and depth for parallax.
 *
 * @param count - Number of stars (default: 100)
 * @param shootingStars - Number of shooting stars (default: 0)
 */
export function Stars({ count = 100, shootingStars = 0 }: StarsProps) {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    // Regular twinkling stars with slow forward motion
    const stars = Array.from({ length: count }, () => {
      const star = document.createElement("div");
      const size = Math.random() * 1.7 + 0.8;
      const isBlue = Math.random() > 0.6; // 40% blue, 60% white
      const depth = Math.random(); // 0-1, closer stars move faster

      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${isBlue ? "#0063CD" : "#FFFFFF"};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.3 + 0.2};
        box-shadow: 0 0 ${Math.random() * 2 + 1}px currentColor;
        pointer-events: none;
      `;
      star.dataset.depth = depth.toString();
      return star;
    });

    // Shooting stars
    const shooters = Array.from({ length: shootingStars }, () => {
      const shooter = document.createElement("div");
      const isBlue = Math.random() > 0.5;

      shooter.style.cssText = `
        position: absolute;
        width: 50px;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${isBlue ? "#0063CD" : "#FFFFFF"});
        opacity: 0;
        box-shadow: 0 0 10px ${isBlue ? "#0063CD" : "#FFFFFF"};
        pointer-events: none;
      `;
      return shooter;
    });

    stars.forEach((star) => starsRef.current?.appendChild(star));
    shooters.forEach((shooter) => starsRef.current?.appendChild(shooter));

    const ctx = gsap.context(() => {
      // Twinkle animation + forward motion
      stars.forEach((star) => {
        const depth = parseFloat(star.dataset.depth || "0.5");
        const initialScale = 0.5 + depth * 0.3;

        // Twinkle
        gsap.to(star, {
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 4 + 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Forward motion - stars grow as we fly through space
        gsap.fromTo(
          star,
          { scale: initialScale },
          {
            scale: initialScale * 3,
            duration: 25 + depth * 15, // 25-40 seconds
            repeat: -1,
            ease: "none",
          }
        );
      });

      // Shooting star animations
      shooters.forEach((shooter, i) => {
        const animateShooter = () => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 60; // Upper part of screen
          const angle = Math.random() * 30 + 30; // 30-60 degrees

          gsap.set(shooter, { left: `${startX}%`, top: `${startY}%`, rotation: angle });

          gsap.fromTo(
            shooter,
            { opacity: 0, x: 0, y: 0 },
            {
              opacity: 0.9,
              x: 400,
              y: 300,
              duration: Math.random() * 2 + 2, // 2-4 seconds
              ease: "none",
              onComplete: () => {
                gsap.to(shooter, {
                  opacity: 0,
                  duration: 0.3,
                  onComplete: () => {
                    setTimeout(animateShooter, Math.random() * 10000 + 5000); // 5-15 seconds between shoots
                  },
                });
              },
            }
          );
        };

        // Stagger initial starts
        setTimeout(animateShooter, i * 3000 + Math.random() * 3000);
      });
    }, starsRef);

    return () => {
      ctx.revert();
      stars.forEach((star) => star.remove());
      shooters.forEach((shooter) => shooter.remove());
    };
  }, [count, shootingStars]);

  return <div ref={starsRef} className="pointer-events-none absolute inset-0 z-[5]" />;
}
