/**
 * @module app/brand-guide/opengraph-image
 * Generates the OpenGraph image for the brand guide page.
 * Automatically served at /brand-guide/opengraph-image and referenced in og:image meta tags.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Moonshots & Magic — Brand Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generates the brand guide OpenGraph image with color palette visual motif. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#050505",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Color swatches strip at top */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "6px",
            display: "flex",
          }}
        >
          {["#0063CD", "#0052AA", "#003D80", "#FFD700", "#FF4500", "#ffffff"].map((color, i) => (
            <div
              key={i}
              style={{ flex: 1, background: color }}
            />
          ))}
        </div>

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(0, 99, 205, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Color swatch blocks - decorative */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "60px",
            display: "flex",
            gap: "12px",
          }}
        >
          {["#0063CD", "#FFD700", "#ffffff20"].map((color, i) => (
            <div
              key={i}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                background: color,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

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
          Design System
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
          BRAND GUIDE
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
          Colors, typography, animations, and visual identity for the Central Florida region
        </div>

        {/* Bottom color strip */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(to right, transparent, #0063CD, #FFD700, transparent)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
