/**
 * @module app/opengraph-image
 * Generates the OpenGraph image for the homepage.
 * Automatically served at /opengraph-image and referenced in og:image meta tags.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Moonshots & Magic — Where Ambition Meets Wonder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generates the homepage OpenGraph image with dark theme and brand styling. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #050505 0%, #0a0a14 50%, #050510 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(0, 99, 205, 0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        {/* Star dots */}
        {[
          { top: "8%", left: "12%", size: 3 },
          { top: "15%", left: "78%", size: 2 },
          { top: "25%", left: "35%", size: 2 },
          { top: "70%", left: "20%", size: 3 },
          { top: "80%", left: "65%", size: 2 },
          { top: "45%", left: "88%", size: 2 },
          { top: "60%", left: "8%", size: 2 },
          { top: "30%", left: "92%", size: 3 },
          { top: "85%", left: "42%", size: 2 },
          { top: "12%", left: "55%", size: 2 },
        ].map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
            }}
          />
        ))}

        {/* Tagline */}
        <div
          style={{
            fontSize: "18px",
            fontWeight: 400,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#0063CD",
            marginBottom: "20px",
          }}
        >
          Where Ambition Meets Wonder
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "4px",
            lineHeight: 1,
            textAlign: "center",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          MOONSHOTS
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#0063CD",
            }}
          >
            &amp;
          </span>
          <span
            style={{
              fontSize: "96px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#ffffff",
            }}
          >
            MAGIC
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.6)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          The story of Central Florida — moonshots, magic, and everything in between
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(to right, transparent, #0063CD, transparent)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
