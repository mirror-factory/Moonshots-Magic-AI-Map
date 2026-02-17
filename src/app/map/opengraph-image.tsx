/**
 * @module app/map/opengraph-image
 * Generates the OpenGraph image for the interactive map page.
 * Automatically served at /map/opengraph-image and referenced in og:image meta tags.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Moonshots & Magic — Interactive Map of Central Florida Events";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generates the map page OpenGraph image with a grid/map visual motif. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #050505 0%, #060a12 50%, #050510 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Grid lines for map feel */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={`h${i}`}
            style={{
              position: "absolute",
              top: `${i * 20}%`,
              left: "0",
              right: "0",
              height: "1px",
              background: "rgba(0, 99, 205, 0.08)",
            }}
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={`v${i}`}
            style={{
              position: "absolute",
              left: `${i * 14.28}%`,
              top: "0",
              bottom: "0",
              width: "1px",
              background: "rgba(0, 99, 205, 0.08)",
            }}
          />
        ))}

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "350px",
            background: "radial-gradient(ellipse, rgba(0, 99, 205, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Map pin dots */}
        {[
          { top: "30%", left: "25%", color: "#0063CD" },
          { top: "55%", left: "40%", color: "#0063CD" },
          { top: "40%", left: "68%", color: "#ffffff" },
          { top: "65%", left: "72%", color: "#0063CD" },
          { top: "25%", left: "55%", color: "#ffffff" },
        ].map((dot, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: dot.top,
              left: dot.left,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: dot.color,
              boxShadow: `0 0 12px ${dot.color}`,
            }}
          />
        ))}

        {/* Tag */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#0063CD",
            marginBottom: "20px",
          }}
        >
          Central Florida
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "3px",
            lineHeight: 1,
            textAlign: "center",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          MOONSHOTS &amp; MAGIC
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "8px",
            color: "#0063CD",
            marginBottom: "32px",
          }}
        >
          INTERACTIVE MAP
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.6)",
            textAlign: "center",
            maxWidth: "680px",
            lineHeight: 1.5,
          }}
        >
          Browse events, search with AI, and take a cinematic flyover tour of the region
        </div>

        {/* Bottom accent */}
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
