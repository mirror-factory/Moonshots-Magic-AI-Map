/**
 * @module app/brand-guide/page
 * Visual brand guide for Moonshots & Magic — showcases colors, typography,
 * UI patterns, animations, and the Orlando narrative timeline.
 */

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { PRESENTATION_LANDMARKS } from "@/data/presentation-landmarks";
import {
  Rocket,
  Sparkles as SparklesIcon,
  Castle,
  Music,
  Palette,
  Settings,
  Calendar,
  MapPin,
  Play,
  Pause,
  Star,
  Zap,
  Heart,
  TrendingUp,
  ArrowRight,
  Loader,
  CheckCircle,
  Download,
  Copy,
  Check,
} from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/** Generates complete brand guide as Markdown. */
function generateBrandGuideMarkdown(): string {
  return `# Moonshots & Magic — Brand Guide v1.0

## Overview
A narrative-driven event discovery platform that tells the story of a region built on ambition and wonder. From rockets to castles, from Fort Gatlin to Artemis, we help people experience Orlando through the lens of its impossible, improbable transformation.

## Color Palette

### Primary Colors
- **Brand Primary**: #0063CD (Blue) - Kennedy Space Center blue, used for accents, CTAs, and highlights
- **Background**: #050505 (Dark) / #FFFFFF (Light)
- **Text**: #E5E5E5 (Light) / #1A1A1A (Dark)
- **Text Dim**: #888888 - Secondary text, labels

### UI Colors
- **Surface**: rgba(255, 255, 255, 0.03) - Cards, panels
- **Border**: rgba(255, 255, 255, 0.1) - Dividers, outlines
- **Glass Background**: rgba(10, 10, 15, 0.6)
- **Glass Border**: rgba(255, 255, 255, 0.08)

## Typography

### Fonts
- **Display**: Oswald Black (900), ALL CAPS, letter-spacing: -0.03em
- **Body**: Inter, weight 400-600
- **Code**: Chakra Petch, monospace alternative

### Scale
- H1: 4rem (64px) - Page titles
- H2: 3rem (48px) - Section headers
- H3: 1.5rem (24px) - Subsections
- Body: 1rem (16px)
- Small: 0.875rem (14px)

## Logo Usage
- Primary: White text with blue ampersand
- Dark mode: Blue text with white ampersand
- Minimum size: 120px width
- Clear space: 20px on all sides

## UI Patterns

### Glassmorphism
- Background: rgba(10, 10, 15, 0.6)
- Backdrop filter: blur(24px)
- Border: 1px solid rgba(255, 255, 255, 0.08)
- Border radius: 12px

### Buttons
- Primary: Blue (#0063CD) with white text
- Secondary: Transparent with 5% white background
- Border radius: 9999px (fully rounded)
- Padding: 12px 20px

## Animations

### Timing
- UI interactions: 300-800ms
- Scroll animations: 0.6-1.5s
- Easing: power2.out (general), back.out (scale effects)

### Effects
- Grain texture: 4-6% opacity
- Sparkles: 15-50 count depending on context
- Pulsating elements: 1.3x scale, sine.inOut easing

## The Orlando Narrative

**Moonshots**: Cape Canaveral, Kennedy Space Center, SpaceX — the engineering ambition that sent humans to the Moon and continues to push boundaries.

**Magic**: Walt Disney World, Universal, EPCOT — the belief that wonder is engineered, not accidental.

**Together**: A region that marries ambition with imagination.

## Voice & Tone

### Do
✓ Use active voice and present tense
✓ Reference the Orlando timeline when relevant
✓ Connect events to the moonshots & magic narrative
✓ Balance technical precision with storytelling warmth

### Don't
✗ Use corporate jargon or buzzwords
✗ Oversimplify the science or engineering
✗ Ignore the human side of the story
✗ Be cynical or dismissive

## Quick Reference
- Primary Blue: #0063CD
- Dark BG: #050505
- Light BG: #FFFFFF
- Font (Display): Oswald Black (900), ALL CAPS
- Font (Body): Inter
- Border Radius: 10-16px (default: 12px)
- Blur Amount: 24px
- Animation Duration: 300-800ms (UI), 0.6-1.5s (scroll)
- Grain Opacity: 4% (light), 6% (dark)

---

**Maintained by Mirror Factory • 2026**
`;
}

/** Animated logo component - lights up each letter/element sequentially. */
function AnimatedLogo({ className, width = 750, height = 250 }: { className?: string; width?: number; height?: number }) {
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;

    const paths = logoRef.current.querySelectorAll("path");

    // Set all paths to dim initially
    paths.forEach((path) => {
      gsap.set(path, { opacity: 0.15 });
    });

    // Group paths by word: MOONSHOTS, &, MAGIC
    const moonshotsGroup = [0, 5, 4, 2, 10, 7, 8, 14, 11]; // MOONSHOTS
    const ampersandGroup = [6]; // &
    const magicGroup = [1, 9, 15, 12, 13]; // MAGIC

    // Animate word by word: MOONSHOTS → & → MAGIC
    const timeline = gsap.timeline({ delay: 0.5 });

    // 1. Light up MOONSHOTS (all at once)
    timeline.to(
      moonshotsGroup.map(i => paths[i]),
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      0
    );

    // 2. Then light up & (after MOONSHOTS)
    timeline.to(
      paths[ampersandGroup[0]],
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      0.5
    );

    // 3. Finally light up MAGIC (after &)
    timeline.to(
      magicGroup.map(i => paths[i]),
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      0.9
    );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <svg
      ref={logoRef}
      width={width}
      height={height}
      viewBox="0 0 273 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15.3636 19.5225C19.8139 19.5414 24.2644 19.5327 28.7148 19.4965C29.4712 23.4915 30.1431 27.5018 30.7302 31.5249C31.1722 34.436 31.6129 38.1833 32.4245 40.9829C33.01 36.1149 33.8673 31.2058 34.6782 26.3647C35.0629 24.0679 35.2772 21.8401 35.7428 19.5353C39.9817 19.4304 44.6139 19.525 48.884 19.5258L48.8814 60.5078L39.1126 60.4944L39.1007 42.1983C39.1074 40.9724 39.2305 37.3699 38.8593 36.4414L38.7043 36.4636C38.2124 37.461 37.7598 41.6744 37.5605 43.0233L36.319 51.0876C35.7979 54.5143 35.1603 56.9338 34.8576 60.5117C33.072 60.5197 31.2865 60.5081 29.5012 60.477C28.252 53.0469 27.1176 45.598 26.0985 38.1331C26.002 37.4647 25.9406 36.6278 25.4035 36.2287L25.2453 36.3432C25.0204 37.0964 25.1518 43.6316 25.1565 44.848L25.1488 60.4923L15.3686 60.5012C15.1807 47.0008 15.3633 33.0596 15.3636 19.5225Z" fill="white"/>
      <path d="M120.961 64.0655C125.098 64.2421 129.864 63.9998 134.139 64.1073L134.141 90.8396C134.141 95.1215 133.979 100.766 134.189 104.969C131.035 105.049 127.532 104.998 124.363 104.967L124.353 86.1156C124.355 85.1699 124.492 81.0423 124.095 80.5128L123.947 80.5698C123.503 81.6464 122.82 87.0905 122.573 88.5639C122.053 91.6596 121.551 94.8628 121.127 97.977C120.813 100.291 120.138 102.658 119.906 105.006C118.198 104.974 116.433 104.991 114.719 104.986C114.45 102.577 113.859 99.5332 113.398 97.0892C112.389 91.7366 112.133 84.9523 110.566 79.8532C110.259 81.3073 110.367 86.7689 110.369 88.6093L110.369 104.991C107.121 105 103.874 104.99 100.626 104.962L100.631 74.1604L100.632 66.8194C100.632 66.2176 100.536 64.4913 100.778 64.1161L101.405 64.0744L113.97 64.0654C115.03 69.5589 115.683 75.2741 116.678 80.7958C116.968 82.4053 117.12 83.9592 117.468 85.5839C118.565 78.4006 119.73 71.2275 120.961 64.0655Z" fill="white"/>
      <path d="M103.479 19.5237L116.458 19.5098C116.87 21.2653 117.097 23.168 117.424 24.958L119.658 36.8761C120.232 40.0142 120.682 43.0569 121.486 46.1649C121.825 45.016 121.713 38.6316 121.713 36.9673L121.719 19.5221L131.562 19.524L131.562 59.2636L131.551 60.4875C127.456 60.5568 122.603 60.5785 118.533 60.4548C118.282 59.0828 117.906 57.6876 117.626 56.3059C116.327 49.8993 115.267 43.4253 113.852 37.0471C113.783 36.738 113.646 36.5502 113.376 36.4183C113.036 37.0142 113.176 58.0763 113.176 60.5187C110.045 60.4575 106.611 60.4803 103.479 60.5044C103.4 55.8237 103.47 50.9113 103.469 46.2099L103.479 19.5237Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M196.243 19.1661C202.567 18.4702 209.271 21.6321 210.229 28.6544C210.649 31.7255 210.346 35.7701 210.351 38.9639L210.366 46.2686C210.374 51.2254 210.41 55.1924 206.013 58.5645C203.954 60.1434 201.845 60.7793 199.278 61.087C195.464 61.2557 192.321 60.6614 189.197 58.2706C183.436 53.8604 185.184 46.5132 184.892 40.2559C184.843 39.2202 184.873 38.0421 184.889 37.0098C185.007 34.2378 184.625 31.2532 185.199 28.5254C186.427 22.6993 190.642 19.7833 196.243 19.1661ZM198.726 26.5626C198.129 26.3717 197.56 26.3561 196.945 26.4522C196.425 26.6789 195.883 26.8966 195.403 27.1944C194.749 28.4908 194.749 29.403 194.749 30.8419C194.747 37.294 194.705 43.7507 194.773 50.2022C194.78 50.9191 194.956 51.7544 195.159 52.4405C195.593 53.895 197.58 53.7485 198.802 53.6661C199.595 53.306 200.2 52.8441 200.517 52.0079C200.93 50.9207 200.826 32.4526 200.717 29.8917C200.691 29.3003 200.693 28.4862 200.437 27.9483C200.116 27.2722 199.425 26.7857 198.726 26.5626Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M88.0515 19.1625C91.549 18.8846 94.9829 19.3195 97.8239 21.4936C100.123 23.2918 101.917 26.2245 102.092 29.1811C102.466 35.4756 102.156 41.9176 102.259 48.2211C102.381 55.5963 98.4102 60.201 91.0612 61.0883C84.0186 61.4381 77.708 58.0953 76.9362 50.5199C76.6304 47.2373 76.8704 43.8952 76.7868 40.6029C76.7462 39.0038 76.8762 37.2243 76.7849 35.6606C76.2882 27.1554 78.1929 20.2832 88.0515 19.1625ZM91.9577 27.2875C90.7858 26.5619 90.2598 26.2587 88.821 26.4467C88.0786 26.7393 87.1498 27.0305 86.8181 27.8305C86.3982 28.8453 86.3846 51.2742 86.7956 52.2055C87.0677 52.817 87.6615 53.2909 88.2292 53.6205C88.9256 53.6665 89.6197 53.7264 90.3171 53.7006C91.7868 53.3617 92.2904 52.7718 92.3493 51.2025C92.503 47.1141 92.3783 43.005 92.4167 38.9125C92.4074 36.942 92.5432 29.4089 92.2272 28.0883C92.159 27.8146 92.0686 27.5469 91.9577 27.2875Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.4043 19.1639C68.2784 18.5917 74.5326 21.6541 75.3974 29.1482C75.761 32.3002 75.5756 35.7566 75.5752 38.9627C75.5746 43.2779 75.8055 47.7888 75.2119 52.0594C74.2345 57.5778 69.6181 60.4574 64.4345 61.0867C60.6044 61.2526 57.5341 60.6496 54.4218 58.3123C48.7494 54.1303 50.3554 46.7745 50.125 40.7039C50.0704 39.2654 50.2007 37.678 50.1162 36.2625C49.5982 27.5886 51.17 20.3272 61.4043 19.1639ZM65.331 27.325C64.1269 26.5666 63.6297 26.2732 62.1455 26.4383C61.4621 26.7136 61.2005 26.821 60.5664 27.2273C59.9899 28.5085 59.9656 29.4063 59.9668 30.8025C59.9726 37.3237 59.9147 43.8509 60.0009 50.3709C60.0097 51.0318 60.1864 51.846 60.3642 52.4813C60.851 53.855 62.6408 53.7321 63.7949 53.6873C64.3914 53.5066 65.0365 53.307 65.3281 52.7068C65.5064 52.3398 65.5686 51.92 65.6142 51.5184C65.761 50.2265 65.7333 48.9207 65.7343 47.6229C65.7393 41.9811 65.7385 36.3389 65.7265 30.6971C65.724 29.5677 65.7159 28.4019 65.331 27.325Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M69.7338 64.2037C74.9882 63.5013 80.4314 66.1083 82.518 71.0856C83.4568 73.3254 83.575 75.4566 83.5707 77.8365L74.8236 77.8405C74.819 76.7657 74.8636 75.6496 74.6889 74.5905C74.3624 72.6111 71.8615 71.8768 70.3207 72.9947C69.8504 73.3382 69.5418 73.8591 69.4672 74.4352C69.2502 76.0268 70.8604 77.8615 71.7846 79.069C73.4528 81.2487 75.1616 83.4028 76.8373 85.5778L91.8832 104.93C89.9575 105.026 87.7282 104.98 85.7797 104.985C84.1858 104.99 82.5911 104.981 80.9974 104.957C79.7957 103.22 77.9187 100.991 76.559 99.316C73.0287 106.643 61.4988 106.291 55.89 101.585C50.9256 97.4188 50.1156 89.3795 54.4154 84.4479C56.7816 81.734 59.247 80.8337 62.8021 80.5475C61.7619 79.0006 61.2514 77.9954 60.8685 76.108C60.3737 73.5707 60.9083 70.9412 62.3549 68.7955C64.0901 66.214 66.7289 64.7881 69.7338 64.2037ZM67.9945 88.0074C66.8679 87.3797 65.5679 87.2725 64.3051 87.4108C57.9598 88.7565 59.3016 97.0115 66.6098 96.2799C69.2548 95.6444 71.0323 93.8221 70.2807 90.9469C69.9451 89.7015 69.1212 88.6424 67.9945 88.0074Z" fill="#0063CD"/>
      <path d="M159.913 19.5213L169.672 19.5167L169.685 36.658C171.121 36.6712 172.558 36.6653 173.995 36.6408C173.961 30.9364 173.961 25.232 173.995 19.5278L183.674 19.527C183.875 32.9351 183.699 46.9563 183.678 60.3886C183.266 60.6436 175.133 60.4756 173.973 60.4503L173.972 43.8053C172.58 43.8288 171.107 43.8003 169.708 43.7961C169.492 48.8791 169.669 55.337 169.669 60.5206L159.914 60.4992C159.682 47.0851 159.899 32.9593 159.913 19.5213Z" fill="white"/>
      <path d="M173.521 63.528C177.322 63.0558 181.237 64.3568 183.967 67.0344C187.779 70.7739 187.305 75.6398 187.289 80.5324L177.519 80.5258C177.359 78.2159 177.71 75.3827 177.42 73.1715C176.977 69.7871 171.76 69.9262 171.774 74.0379C171.796 81.3465 171.558 88.7093 171.878 96.008C171.899 96.4858 172.222 96.9816 172.538 97.3222C173.065 97.8849 173.797 98.2153 174.57 98.2406C178.601 98.3885 177.176 92.9871 177.432 90.458C177.472 90.0628 177.427 89.4453 177.426 89.036C176.102 88.9681 174.786 88.8017 173.489 88.5378C173.977 86.1072 174.176 83.8084 174.397 81.3454L176.457 81.6146C180.126 82.2562 183.642 82.4627 187.287 83.0478L187.299 89.4805C187.303 93.4806 187.547 97.2861 185.065 100.689C183.222 103.173 180.466 104.831 177.4 105.302C170.95 106.292 163.355 103.236 162.312 96.0159C161.796 92.4379 162.116 88.2338 162.063 84.5783C162.007 80.7182 161.94 76.6354 162.369 72.8096C163.3 66.9589 168.196 64.2783 173.521 63.528Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M155.808 64.0771C155.852 66.0352 156.378 68.1132 156.642 70.0547C156.976 72.5135 157.357 74.9268 157.735 77.374L161.926 104.993C158.547 104.966 155.105 105.048 151.733 104.941C151.639 103.383 151.474 101.919 151.301 100.368C151.081 99.0988 150.869 97.8275 150.671 96.5547L146.405 96.5605C145.971 98.5809 145.575 102.839 145.345 104.997L135.405 104.963C136.004 100.529 136.657 96.1025 137.362 91.6846C137.712 89.5732 138.157 87.4294 138.472 85.3213L140.74 70.5312C141.048 68.5181 141.261 66.3011 141.632 64.3242C141.929 64.0026 141.995 64.1102 142.587 64.0762L155.808 64.0771ZM148.144 74.1465C147.488 79.284 147.411 84.4088 146.726 89.6797L148.812 89.708L150.395 89.71C150.313 86.4905 149.778 83.0338 149.457 79.8027C149.345 78.6676 149.218 75.2616 148.993 74.4053C148.644 74.1418 148.638 74.2154 148.144 74.1465Z" fill="white"/>
      <path d="M143.684 19.1685C144.273 19.1054 144.866 19.0767 145.458 19.0827C151.318 19.0864 156.177 22.0636 157.663 27.9074C158.162 29.8689 158.102 31.7097 158.095 33.71L148.259 33.6968C148.241 31.3253 148.637 29.33 147.557 27.2359C146.771 26.7172 145.959 26.3236 144.987 26.3979C144.318 26.448 143.7 26.7754 143.283 27.3005C142.283 28.5332 142.452 31.2222 142.591 32.7315C142.981 36.7297 147.575 36.0906 150.39 36.6152C154.833 37.4428 158.092 40.1802 158.513 44.8216C158.723 46.3486 158.603 47.8812 158.623 49.4079C158.712 55.9876 154.023 60.3356 147.52 61.0497C146.943 61.1038 146.362 61.129 145.782 61.1254C142.311 61.1094 139.134 60.0528 136.663 57.5577C133.568 54.4333 133.344 50.7547 133.361 46.6316L143.221 46.6343C143.287 48.4497 142.773 51.7406 144.197 53.0605C144.769 53.5806 145.529 53.8443 146.302 53.7901C149.526 53.5739 149.12 49.5605 148.928 47.3205C148.603 43.4979 144.39 44.1525 141.576 43.4896C136.728 42.3144 133.51 39.639 132.929 34.5833C132 26.5003 134.783 20.1568 143.684 19.1685Z" fill="white"/>
      <path d="M245.721 19.1663C246.28 19.1069 246.841 19.0784 247.402 19.0808C253.266 19.0607 258.241 21.9528 259.739 27.8959C260.239 29.8742 260.193 31.683 260.191 33.7024L250.327 33.6946C250.304 32.1591 250.384 30.7191 250.311 29.113C250.339 26.5272 246.723 25.4725 245.24 27.3765C244.316 28.5624 244.634 32.5391 244.852 33.9692C247.658 37.8377 253.093 35.2827 256.852 38.3132C258.7 39.6299 260.127 41.5706 260.467 43.8846C261.71 52.3264 259.805 59.2262 250.334 60.9531C244.779 61.8284 238.906 59.6936 236.564 54.3124C235.439 51.7267 235.451 49.3791 235.489 46.6274L245.3 46.6343C245.347 49.0334 244.532 54.1202 248.471 53.7904C249.207 53.7331 249.886 53.374 250.346 52.7988C251.369 51.5208 251.211 48.7094 251.012 47.1214C250.556 43.5287 246.348 44.1267 243.657 43.4865C239.12 42.5141 235.629 39.6176 235.055 34.9194C234.051 26.6958 236.642 20.2573 245.721 19.1663Z" fill="white"/>
      <path d="M210.967 63.5277C211.537 63.4596 212.11 63.4312 212.682 63.4429C215.946 63.5324 219.329 64.7686 221.569 67.1829C225.209 71.1062 224.789 75.5917 224.645 80.5436C221.479 80.48 218.183 80.5227 215.009 80.5218C214.938 78.5328 215.229 74.9081 214.912 73.1901C214.279 69.7601 209.217 69.747 209.262 74.449C209.33 81.544 209.101 88.6235 209.329 95.7119C209.37 96.981 210.519 98.0903 211.735 98.2483C216.147 98.8369 214.933 90.9438 214.925 87.8009L218.147 87.7977L224.689 87.8127C224.704 92.3624 225.268 96.9605 222.395 100.825C218.22 106.442 209.454 106.887 204.034 102.916C201.598 101.138 199.971 98.4656 199.515 95.4902C199.153 93.0642 199.342 87.7435 199.336 85.0567C199.569 81.2688 198.91 76.9764 199.57 73.2504C200.665 67.0778 205.401 64.3433 210.967 63.5277Z" fill="white"/>
      <path d="M211.592 19.5209L233.636 19.522L233.643 28.2003L227.482 28.2083C227.385 31.2249 227.453 34.5656 227.453 37.6012V54.5159L227.45 60.5204C224.289 60.4593 220.91 60.4949 217.746 60.5005C217.636 57.0076 217.73 53.0263 217.73 49.503L217.722 28.2146L211.59 28.1911L211.592 19.5209Z" fill="white"/>
      <path d="M189.286 64.0731C192.232 64.0572 195.178 64.0639 198.124 64.0933C198.125 67.2166 198.161 70.4372 198.063 73.5492C195.686 73.3583 192.293 71.9618 189.535 71.3336C192.073 73.0306 194.801 73.5866 197.016 75.3872C197.397 75.6961 197.887 76.4111 197.953 76.9273C198.218 78.9786 198.125 81.4017 198.125 83.4915L198.113 95.9506L198.115 104.989C194.911 105.003 191.709 104.994 188.506 104.961L188.512 77.9184C188.512 73.5457 188.376 68.5898 188.513 64.2744C188.777 64.0115 188.797 64.0982 189.286 64.0731Z" fill="white"/>
    </svg>
  );
}

/** Brand guide page (public, no auth required). */
export default function BrandGuidePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const effectsMenuRef = useRef<HTMLDivElement>(null);

  // Individual effect controls with localStorage persistence
  const [showBackgroundImages, setShowBackgroundImages] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("brand-guide-bg-images");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showStars, setShowStars] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("brand-guide-stars");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showEffects, setShowEffects] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("brand-guide-effects");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Show toast after 3 seconds, hide after 8 more seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowToast(true);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowToast(false);
    }, 11000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Save preferences to localStorage
  const toggleBackgroundImages = () => {
    const newValue = !showBackgroundImages;
    setShowBackgroundImages(newValue);
    localStorage.setItem("brand-guide-bg-images", JSON.stringify(newValue));
  };

  const toggleStars = () => {
    const newValue = !showStars;
    setShowStars(newValue);
    localStorage.setItem("brand-guide-stars", JSON.stringify(newValue));
  };

  const toggleEffects = () => {
    const newValue = !showEffects;
    setShowEffects(newValue);
    localStorage.setItem("brand-guide-effects", JSON.stringify(newValue));
  };

  // Fade out effects menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!effectsMenuRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 300);
      effectsMenuRef.current.style.opacity = opacity.toString();
      effectsMenuRef.current.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Skip heavy animations if effects are disabled
    if (!showEffects) return;

    // Hero animations
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 1.5,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
      });

      gsap.from(".hero-description", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.7,
        ease: "power2.out",
      });

      // Page entrance animation - fade in layers sequentially
      gsap.from(".background-images", {
        opacity: 0,
        duration: 1.5,
        delay: 0.2,
        ease: "power2.inOut",
      });

      gsap.from(".planets-container", {
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "power2.out",
      });

      // Sticky nav fade in on scroll - starts near end of hero, fully visible by color palette
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "40% top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(".brand-nav", {
            opacity: progress,
            y: -10 + progress * 10,
            duration: 0.3,
            ease: "none",
            pointerEvents: progress > 0.5 ? "auto" : "none",
          });
        },
        onLeaveBack: () => {
          gsap.to(".brand-nav", {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: "power2.in",
            pointerEvents: "none",
          });
        },
      });

      // Initial dark overlay that fades out to lighten images
      gsap.to(".initial-dark-overlay", {
        opacity: 0,
        duration: 2.7,
        delay: 1.5,
        ease: "power2.inOut",
      });

      // Independent zoom animations for background columns - faster and more noticeable
      gsap.to(".background-zoom-left", {
        scale: 1.2,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".background-zoom-center", {
        scale: 1.25,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".background-zoom-right", {
        scale: 1.2,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax scrolling - left and right move together, center moves differently
      gsap.to(".background-zoom-left", {
        y: 300,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".background-zoom-right", {
        y: 300,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".background-zoom-center", {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Periodic highlight pulse sequence - light up, hold, fade out
      const highlightTimeline = gsap.timeline({ repeat: -1, repeatDelay: 10, delay: 2 });

      // Light up sequence: left → center → right (staggered)
      highlightTimeline
        .to(".background-highlight-left", { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(".background-highlight-center", { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.8)
        .to(".background-highlight-right", { opacity: 1, duration: 0.4, ease: "power2.out" }, 1.6)
        // Hold all lit for 5 seconds
        .to({}, { duration: 5 })
        // Fade out all together in 1 second
        .to(".background-highlight-left, .background-highlight-center, .background-highlight-right", {
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        });

      // Automatic continuous animation - flying through space (optimized)
      gsap.utils.toArray<HTMLElement>(".planet").forEach((planet) => {
        const depth = parseFloat(planet.dataset.depth || "1");
        const animDuration = 25 + depth * 15; // 25-55 seconds

        // Scale animation - planets grow as they approach
        gsap.fromTo(
          planet,
          {
            scale: 0.3,
          },
          {
            scale: 1 + depth * 2,
            duration: animDuration,
            repeat: -1,
            ease: "none",
          }
        );

        // Opacity animation with fade-out as they get close
        gsap.fromTo(
          planet,
          {
            opacity: 0.2,
          },
          {
            opacity: 0,
            duration: animDuration,
            repeat: -1,
            ease: "none",
            keyframes: [
              { opacity: 0.7, duration: animDuration * 0.5 }, // Peak at 50%
              { opacity: 0, duration: animDuration * 0.5 }, // Fade out in second half
            ],
          }
        );
      });


      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>(".animate-section").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // Animate cards
      gsap.utils.toArray<HTMLElement>(".animate-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [showEffects]);

  return (
    <div ref={heroRef} className="overflow-x-hidden bg-background">
      {/* Effects Control Menu */}
      <div ref={effectsMenuRef} className="fixed left-6 bottom-6 z-[100]">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center rounded-lg p-3 text-sm font-medium transition-all hover:scale-105"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--text-dim)",
            }}
          >
            <Settings className="h-5 w-5" />
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 bottom-full mb-2 w-64 rounded-lg border p-2 shadow-lg"
              style={{
                background: "rgba(10, 10, 15, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="space-y-1">
                <button
                  onClick={toggleBackgroundImages}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-primary/10"
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors"
                    style={{
                      borderColor: showBackgroundImages ? "var(--brand-primary)" : "var(--text-dim)",
                      backgroundColor: showBackgroundImages ? "var(--brand-primary)" : "transparent",
                    }}
                  >
                    {showBackgroundImages && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span style={{ color: "var(--text)" }}>Background Images</span>
                </button>

                <button
                  onClick={toggleStars}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-primary/10"
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors"
                    style={{
                      borderColor: showStars ? "var(--brand-primary)" : "var(--text-dim)",
                      backgroundColor: showStars ? "var(--brand-primary)" : "transparent",
                    }}
                  >
                    {showStars && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span style={{ color: "var(--text)" }}>Stars</span>
                </button>

                <button
                  onClick={toggleEffects}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-brand-primary/10"
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors"
                    style={{
                      borderColor: showEffects ? "var(--brand-primary)" : "var(--text-dim)",
                      backgroundColor: showEffects ? "var(--brand-primary)" : "transparent",
                    }}
                  >
                    {showEffects && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span style={{ color: "var(--text)" }}>Sparkles & Grain</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TALLER Hero Section with Planets */}
      <section className="relative flex min-h-[95vh] flex-col justify-center overflow-hidden px-6 py-16 md:py-20">
        {/* Three-column Background with Independent Motion */}
        {showBackgroundImages && (
          <div className="background-images absolute inset-0 z-0 flex flex-col md:flex-row">
          {/* Left Third - Apollo 11 */}
          <div className="relative h-1/3 w-full overflow-hidden md:h-full md:w-1/3">
            <div
              className="background-zoom-left absolute inset-0"
              style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
            >
              <Image
                src="/images/presentation/apollo-11.jpg"
                alt="Apollo 11"
                fill
                className="object-cover"
                style={{
                  filter: "grayscale(1) blur(5px) brightness(0.5)",
                  objectPosition: "center 60%",
                }}
                priority
              />
            </div>
            {/* Initial dark overlay */}
            <div className="initial-dark-overlay absolute inset-0 bg-black/20" />
            {/* Periodic highlight pulse */}
            <div
              className="background-highlight-left absolute inset-0 bg-white/10"
              style={{ opacity: 0 }}
            />
            {/* Gradient blend on right edge */}
            <div
              className="absolute inset-y-0 right-0 w-32 md:w-48"
              style={{
                background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Center Third - Disney World */}
          <div className="relative h-1/3 w-full overflow-hidden md:h-full md:w-1/3">
            <div
              className="background-zoom-center absolute inset-0"
              style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
            >
              <Image
                src="/images/presentation/disney-world.jpg"
                alt="Disney World"
                fill
                className="object-cover"
                style={{
                  filter: "grayscale(1) blur(5px) brightness(0.5)",
                  objectPosition: "center 60%",
                }}
                priority
              />
            </div>
            {/* Initial dark overlay */}
            <div className="initial-dark-overlay absolute inset-0 bg-black/20" />
            {/* Periodic highlight pulse */}
            <div
              className="background-highlight-center absolute inset-0 bg-white/10"
              style={{ opacity: 0 }}
            />
            {/* Gradient blend on left edge */}
            <div
              className="absolute inset-y-0 left-0 w-32 md:w-48"
              style={{
                background: "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
            {/* Gradient blend on right edge */}
            <div
              className="absolute inset-y-0 right-0 w-32 md:w-48"
              style={{
                background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Right Third - JFK */}
          <div className="relative h-1/3 w-full overflow-hidden md:h-full md:w-1/3">
            <div
              className="background-zoom-right absolute inset-0"
              style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
            >
              <Image
                src="/images/presentation/jfk.webp"
                alt="JFK"
                fill
                className="object-cover"
                style={{
                  filter: "grayscale(1) blur(5px) brightness(0.5)",
                  objectPosition: "center 60%",
                }}
                priority
              />
            </div>
            {/* Initial dark overlay */}
            <div className="initial-dark-overlay absolute inset-0 bg-black/20" />
            {/* Periodic highlight pulse */}
            <div
              className="background-highlight-right absolute inset-0 bg-white/10"
              style={{ opacity: 0 }}
            />
            {/* Gradient blend on left edge */}
            <div
              className="absolute inset-y-0 left-0 w-32 md:w-48"
              style={{
                background: "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Vignette - darker edges especially at top corners */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at top left, black 0%, transparent 40%),
                radial-gradient(ellipse at top right, black 0%, transparent 40%),
                radial-gradient(ellipse at center top, rgba(0,0,0,0.6) 0%, transparent 50%)
              `,
            }}
          />

          {/* Dark overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-transparent" />

          {/* Fade to background at bottom - more gradual */}
          <div
            className="absolute inset-x-0 bottom-0 h-96"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(5, 5, 5, 0.3) 40%, rgba(5, 5, 5, 0.7) 70%, var(--background) 100%)",
            }}
          />
        </div>
        )}

        {/* Stars with shooting stars */}
        {showStars && <Stars count={150} shootingStars={4} />}

        {/* Sparkles */}
        {showEffects && <Sparkles count={50} />}

        {showEffects && <div className="grain-texture absolute inset-0 z-10" />}

        <div className="relative z-20 mx-auto max-w-6xl pt-16">
          <div className="mb-8 text-center">
            {/* Dark backdrop for text visibility */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "900px",
                height: "500px",
                background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 70%)",
                filter: "blur(60px)",
                pointerEvents: "none",
              }}
            />

            {/* MASSIVE glow behind logo */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "800px",
                height: "400px",
                background: "radial-gradient(circle, rgba(0, 99, 205, 0.4) 0%, transparent 70%)",
                filter: "blur(80px)",
                pointerEvents: "none",
              }}
            />

            {/* Subtitle above logo */}
            <p
              className="hero-subtitle relative mb-2 text-lg font-light tracking-wide"
              style={{
                color: "var(--brand-primary)",
                fontFamily: "var(--font-inter, sans-serif)",
                fontWeight: 300,
                textShadow: "0 0 30px rgba(0, 99, 205, 0.8), 0 0 60px rgba(0, 99, 205, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              Where Ambition Meets Wonder
            </p>

            {/* Logo SVG with glow effects - Animated version */}
            <div className="hero-title relative mb-4 flex justify-center">
              <div
                style={{
                  filter: "drop-shadow(0 0 60px rgba(0, 99, 205, 0.6)) drop-shadow(0 0 120px rgba(0, 99, 205, 0.4)) drop-shadow(0 0 180px rgba(0, 99, 205, 0.2))",
                }}
              >
                <AnimatedLogo className="h-auto w-[750px]" width={750} height={250} />
              </div>
            </div>

            <p
              className="hero-subtitle text-sm uppercase tracking-[0.3em]"
              style={{
                color: "var(--brand-primary)",
                textShadow: "0 0 30px rgba(0, 99, 205, 0.8), 0 0 60px rgba(0, 99, 205, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              Our Story
            </p>
          </div>
          <p
            className="hero-description mx-auto max-w-3xl text-center text-xl leading-relaxed"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-chakra-petch, sans-serif)",
              opacity: 0.85,
            }}
          >
            Born from a region that sent humans to the Moon and built worlds of magic. A place of
            immense talent, fortitude, and creativity. This is the story of Central Florida.
          </p>
        </div>
      </section>

      {/* Sticky Navigation Bar */}
      <nav
        className="brand-nav fixed left-0 right-0 top-0 z-50 border-b"
        style={{
          opacity: 0,
          transform: "translateY(-10px)",
          background: "rgba(5, 5, 5, 0.5)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <Image
              src="/images/presentation/logos/M&M Logo - White and Blue.svg"
              alt="Moonshots & Magic"
              width={180}
              height={60}
              className="h-auto w-[180px]"
            />
          </a>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <NavLink href="#colors">Colors</NavLink>
            <NavLink href="#typography">Typography</NavLink>
            <NavLink href="#animations">Animations</NavLink>
            <NavLink href="#components">Components</NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <CTAButton href="#contact" variant="secondary">
              Get in Contact
            </CTAButton>
            <CTAButton href="/" variant="primary">
              Explore Orlando Events
            </CTAButton>
          </div>
        </div>
      </nav>

      {/* Side star decorations throughout the page */}
      {showStars && (
        <>
          <div className="pointer-events-none fixed left-0 top-0 z-10 h-full w-32 opacity-50">
            <Stars count={60} shootingStars={3} />
          </div>
          <div className="pointer-events-none fixed right-0 top-0 z-10 h-full w-32 opacity-50">
            <Stars count={60} shootingStars={3} />
          </div>

          {/* Bottom corner star decorations */}
          <div className="pointer-events-none fixed bottom-0 left-0 z-10 h-64 w-48 opacity-35">
            <Stars count={40} shootingStars={2} />
          </div>
          <div className="pointer-events-none fixed bottom-0 right-0 z-10 h-64 w-48 opacity-35">
            <Stars count={40} shootingStars={2} />
          </div>
        </>
      )}

      {/* Full-width container for stars */}
      <div className="relative pb-16 pt-[350px]">
        {/* Stars at left and right edges of viewport */}
        {showStars && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-[600px] w-48 opacity-55">
              <Stars count={100} shootingStars={4} />
            </div>
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-[600px] w-48 opacity-55">
              <Stars count={100} shootingStars={4} />
            </div>
            {/* Additional stars across the full viewport top */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-64 opacity-45">
              <Stars count={140} shootingStars={5} />
            </div>
          </>
        )}

        {/* Content container with max-width */}
        <div className="mx-auto max-w-6xl px-6">
          {/* Brand Guide Introduction */}
          <div
            className={`${showEffects ? "grain-texture" : ""} animate-section mb-16 rounded-xl border p-8`}
            style={{
              background: "var(--glass-bg)",
              backdropFilter: showEffects ? "blur(var(--glass-blur))" : "none",
              WebkitBackdropFilter: showEffects ? "blur(var(--glass-blur))" : "none",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="mb-4 text-center">
              <h2
                className="mb-3 text-3xl font-black uppercase tracking-tight"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  color: "var(--brand-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Brand Guide v1.0
              </h2>
              <p className="mx-auto max-w-2xl leading-relaxed" style={{ color: "var(--text)" }}>
                A narrative-driven event discovery platform that tells the story of a region built
                on ambition and wonder. From rockets to castles, from Fort Gatlin to Artemis, we
                help people experience Orlando through the lens of its impossible, improbable
                transformation.
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <Section id="colors" title="Color Palette">
          <p className="mb-6" style={{ color: "var(--text-dim)" }}>
            Moonshots & Magic uses a restrained palette: brand primary blue, grays, blacks, and
            whites. Category colors are used sparingly for event classification only.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Primary Colors */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Primary Colors
              </h3>
              <div className="space-y-3">
                <ColorSwatch
                  color="#0063CD"
                  name="Brand Primary"
                  hex="#0063CD"
                  usage="Accent, ampersand, interactive elements"
                />
                <ColorSwatch
                  color="#FFFFFF"
                  name="Text (Dark Mode)"
                  hex="#FFFFFF"
                  usage="Primary text on dark backgrounds"
                  border
                />
                <ColorSwatch
                  color="#0A0A0F"
                  name="Text (Light Mode)"
                  hex="#0A0A0F"
                  usage="Primary text on light backgrounds"
                />
              </div>
            </div>

            {/* Surfaces */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Surface Colors
              </h3>
              <div className="space-y-3">
                <ColorSwatch color="#050505" name="Void" hex="#050505" usage="Dark mode base" />
                <ColorSwatch color="#121212" name="Surface" hex="#121212" usage="Dark panels" />
                <ColorSwatch
                  color="#FFFFFF"
                  name="Light BG"
                  hex="#FFFFFF"
                  usage="Light mode base"
                  border
                />
                <ColorSwatch
                  color="#F8F9FA"
                  name="Light Surface"
                  hex="#F8F9FA"
                  usage="Light panels"
                  border
                />
              </div>
            </div>
          </div>

          {/* Category Colors - Simple mention */}
          <div className="animate-card mt-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Category Colors (Event Classification)
            </h3>
            <p className="mb-4 text-sm" style={{ color: "var(--text-dim)" }}>
              Used sparingly for event badges and map markers. 13 categories: Music `#FF6B6B`,
              Arts `#B197FC`, Sports `#74C0FC`, Food `#FFA94D`, Tech `#69DB7C`, Community
              `#FFD43B`, Family `#F783AC`, Nightlife `#B197FC`, Outdoor `#69DB7C`, Education
              `#74C0FC`, Festival `#FF6B6B`, Market `#FFA94D`, Other `#888888`.
            </p>
          </div>
        </Section>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Typography */}
        <Section id="typography" title="Typography">
          <div className="space-y-8">
            {/* Oswald Display */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Oswald — Display Font
              </h3>
              <div className="relative space-y-4 overflow-hidden rounded-xl border border-border-color bg-surface p-8">
                {showEffects && <Sparkles count={20} />}
                <div
                  className="relative z-10 text-7xl font-black uppercase"
                  style={{
                    fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                >
                  MOONSHOTS <span style={{ color: "var(--brand-primary)" }}>&</span> MAGIC
                </div>
                <p className="relative z-10 text-sm" style={{ color: "var(--text-dim)" }}>
                  Black weight (900), uppercase, ultra-tall letters with tight tracking. Used for
                  headers and brand lockup.
                </p>
              </div>
            </div>

            {/* Type Scale */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Type Scale
              </h3>
              <div className="space-y-4 rounded-xl border border-border-color bg-surface p-6">
                <TypeExample
                  size="72px"
                  weight="900"
                  family="Oswald"
                  text="H1 PAGE TITLE"
                  label="H1 (Page Title)"
                />
                <TypeExample
                  size="48px"
                  weight="900"
                  family="Oswald"
                  text="H2 SECTION TITLE"
                  label="H2 (Section)"
                />
                <TypeExample
                  size="24px"
                  weight="700"
                  family="Oswald"
                  text="H3 CARD TITLE"
                  label="H3 (Card Title)"
                />
                <TypeExample
                  size="16px"
                  weight="400"
                  family="Inter"
                  text="Body text for readability and flow"
                  label="Body (Base)"
                  uppercase={false}
                />
                <TypeExample
                  size="12px"
                  weight="400"
                  family="Inter"
                  text="Caption text for metadata"
                  label="Caption"
                  uppercase={false}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Logo Variations */}
        <Section id="logo" title="Logo Variations">
          <div className="mb-6 rounded-xl border border-border-color bg-surface/30 p-6">
            <p style={{ color: "var(--text-dim)" }}>
              Seven logo variations designed for maximum flexibility across light/dark modes and
              brand contexts. The blue ampersand ({" "}
              <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>&</span> ) is our
              signature accent, working in both light and dark environments.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <LogoCard
              title="Blue & White"
              subtitle="Primary dark mode"
              imagePath="/images/presentation/logos/M&M Logo - Blue & White.svg"
              bgColor="#050505"
            />
            <LogoCard
              title="Blue & Black"
              subtitle="Primary light mode"
              imagePath="/images/presentation/logos/M&M Logo - Blue & Black.svg"
              bgColor="#FFFFFF"
            />
            <LogoCard
              title="White"
              subtitle="All white on dark"
              imagePath="/images/presentation/logos/M&M Logo - White.svg"
              bgColor="#1A1A1A"
            />
            <LogoCard
              title="Black"
              subtitle="All black on light"
              imagePath="/images/presentation/logos/M&M Logo - Black.svg"
              bgColor="#F8F9FA"
            />
            <LogoCard
              title="White & Blue"
              subtitle="Inverted blue accent"
              imagePath="/images/presentation/logos/M&M Logo - White and Blue.svg"
              bgColor="#0A0A0A"
            />
            <LogoCard
              title="Dark"
              subtitle="Dark variant"
              imagePath="/images/presentation/logos/M&M Logo - Dark-1.svg"
              bgColor="#FAFAFA"
            />
            <LogoCard
              title="Dark Alt"
              subtitle="Alternative dark"
              imagePath="/images/presentation/logos/M&M Logo - Dark.svg"
              bgColor="#0063CD"
            />
          </div>
          <div className="mt-6 rounded-xl border border-border-color bg-surface/30 p-6">
            <h4
              className="mb-3 uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Usage Guidelines
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
              <li>• Minimum width: 120px for legibility</li>
              <li>
                • Clear space: Maintain padding equal to the height of the ampersand around the
                logo
              </li>
              <li>• Never distort, rotate, or modify the logo proportions</li>
              <li>• The blue ampersand (#0063CD) is our signature accent — preserve it when possible</li>
              <li>• Use Blue & White for dark backgrounds, Blue & Black for light backgrounds</li>
            </ul>
          </div>
        </Section>

        {/* UI Patterns */}
        <Section id="ui-patterns" title="UI Patterns">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Frosted Glass */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Frosted Glass (Signature)
              </h3>
              <div
                className={`${showEffects ? "grain-texture" : ""} relative overflow-hidden rounded-xl p-6`}
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: showEffects ? "blur(var(--glass-blur))" : "none",
                  WebkitBackdropFilter: showEffects ? "blur(var(--glass-blur))" : "none",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {showEffects && <Sparkles count={12} />}
                <p className="relative z-10" style={{ color: "var(--text)" }}>
                  Translucent panels with backdrop blur — the defining visual signature of
                  Moonshots & Magic.
                </p>
                <div className="relative z-10 mt-4 font-mono text-xs" style={{ color: "var(--text-dim)" }}>
                  backdrop-filter: blur(24px)
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Border Radius Scale
              </h3>
              <div className="space-y-3">
                <RadiusExample size="8px" label="SM (Chips, badges)" />
                <RadiusExample size="12px" label="MD (Default)" />
                <RadiusExample size="16px" label="XL (Large panels)" />
              </div>
            </div>
          </div>

          {/* Component Examples */}
          <div className="animate-card mt-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Component Patterns
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Filter Chip */}
              <div className="rounded-xl border border-border-color bg-surface p-4">
                <p className="mb-3 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                  Filter Chips
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-brand-primary bg-brand-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-primary transition-all hover:bg-brand-primary hover:text-white">
                    Active
                  </button>
                  <button className="rounded-full border border-border-color bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-wide transition-all hover:border-brand-primary hover:text-brand-primary">
                    Inactive
                  </button>
                </div>
              </div>

              {/* Timeline Dots */}
              <div className="rounded-xl border border-border-color bg-surface p-4">
                <p className="mb-3 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                  Timeline Dots
                </p>
                <div className="flex items-center gap-4">
                  <TimelineDot active />
                  <TimelineDot visited />
                  <TimelineDot />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Image Treatment */}
        <Section id="images" title="Image Treatment">
          <p className="mb-6" style={{ color: "var(--text-dim)" }}>
            All historical images follow a consistent black & white, high-contrast aesthetic with
            rounded corners.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <HistoricalImage
              src="/images/presentation/apollo-11.jpg"
              title="Apollo 11"
              year="1969"
            />
            <HistoricalImage
              src="/images/presentation/disney-world.jpg"
              title="Disney World"
              year="1971"
            />
            <HistoricalImage src="/images/presentation/epcot.jpg" title="EPCOT" year="1982" />
          </div>
        </Section>

        {/* EXPANDED Animation Showcase */}
        <Section id="animations" title="Animations & Effects">
          <p className="mb-8" style={{ color: "var(--text-dim)" }}>
            Movement is core to the Moonshots & Magic experience. Here&apos;s our full animation
            vocabulary.
          </p>

          {/* Pulsating Elements */}
          <div className="animate-card mb-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Pulsating Glow Effect
            </h3>
            <div className="relative overflow-hidden rounded-xl border border-border-color bg-surface p-8">
              {showEffects && <Sparkles count={30} />}
              <div className="relative z-10 flex items-center justify-center gap-8">
                <PulsatingDot size="large" color="#0063CD" label="Active" />
                <PulsatingDot size="medium" color="#3388E0" label="Visited" />
                <PulsatingDot size="small" color="rgba(0, 99, 205, 0.3)" label="Default" />
              </div>
              <p className="relative z-10 mt-6 text-center text-sm" style={{ color: "var(--text-dim)" }}>
                Timeline dots pulse continuously with varying sizes and intensities
              </p>
            </div>
          </div>

          {/* Sparkle Showcase */}
          <div className="animate-card mb-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Sparkle Particles
            </h3>
            <div className="relative h-64 overflow-hidden rounded-xl border border-border-color bg-gradient-to-br from-surface via-surface-2 to-surface-3">
              {showEffects && <Sparkles count={100} />}
              <div className="relative z-10 flex h-full items-center justify-center">
                <p
                  className="text-center text-2xl font-black uppercase"
                  style={{
                    fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                    color: "var(--brand-primary)",
                    textShadow: "0 0 30px rgba(0, 99, 205, 0.6)",
                  }}
                >
                  Magical Sparkle Effect
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--text-dim)" }}>
              Blue and white particles that pulse and shimmer throughout the interface
            </p>
          </div>

          {/* Button States */}
          <div className="animate-card mb-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Button States & Interactions
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-border-color bg-surface p-6">
                <p className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                  Primary Buttons
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-brand-primary/50">
                    <Play className="h-4 w-4" />
                    Play
                  </button>
                  <button className="flex items-center gap-2 rounded-full bg-brand-primary/20 px-4 py-2 text-sm font-medium text-brand-primary transition-all hover:bg-brand-primary hover:text-white">
                    <Pause className="h-4 w-4" />
                    Pause
                  </button>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-border-color bg-surface p-6">
                <p className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                  Icon Buttons
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full bg-surface-2 p-3 transition-all hover:scale-110 hover:bg-brand-primary/20 hover:text-brand-primary">
                    <Rocket className="h-5 w-5" />
                  </button>
                  <button className="rounded-full bg-surface-2 p-3 transition-all hover:scale-110 hover:bg-brand-primary/20 hover:text-brand-primary">
                    <Castle className="h-5 w-5" />
                  </button>
                  <button className="rounded-full bg-surface-2 p-3 transition-all hover:scale-110 hover:bg-brand-primary/20 hover:text-brand-primary">
                    <SparklesIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading States */}
          <div className="animate-card mb-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Loading & Progress States
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border-color bg-surface p-6">
                <div className="mb-3 flex items-center justify-center">
                  <Loader className="h-8 w-8 animate-spin text-brand-primary" />
                </div>
                <p className="text-center text-xs" style={{ color: "var(--text-dim)" }}>
                  Spinner
                </p>
              </div>
              <div className="rounded-xl border border-border-color bg-surface p-6">
                <div className="mb-3 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div
                      className="h-2 w-2 animate-pulse rounded-full bg-brand-primary"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="h-2 w-2 animate-pulse rounded-full bg-brand-primary"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="h-2 w-2 animate-pulse rounded-full bg-brand-primary"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
                <p className="text-center text-xs" style={{ color: "var(--text-dim)" }}>
                  Dots
                </p>
              </div>
              <div className="rounded-xl border border-border-color bg-surface p-6">
                <div className="mb-3">
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full w-2/3 animate-pulse bg-brand-primary" />
                  </div>
                </div>
                <p className="text-center text-xs" style={{ color: "var(--text-dim)" }}>
                  Progress Bar
                </p>
              </div>
            </div>
          </div>

          {/* Micro-interactions */}
          <div className="animate-card mb-8">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Micro-interactions
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border-color bg-surface p-6">
                <p className="mb-3 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                  Hover Scale
                </p>
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg bg-brand-primary/20 transition-transform hover:scale-110" />
                  <div className="h-16 w-16 rounded-full bg-brand-primary/20 transition-transform hover:scale-110" />
                </div>
              </div>
              <div className="rounded-xl border border-border-color bg-surface p-6">
                <p className="mb-3 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                  Glow on Hover
                </p>
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg bg-brand-primary transition-shadow hover:shadow-lg hover:shadow-brand-primary/50" />
                  <div className="h-16 w-16 rounded-full bg-brand-primary transition-shadow hover:shadow-lg hover:shadow-brand-primary/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Reveal Pattern */}
          <div className="animate-card">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Scroll Reveal Pattern
            </h3>
            <div className="rounded-xl border border-border-color bg-surface p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <p className="text-sm">Elements fade in from opacity 0 → 1</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <p className="text-sm">Slide up 40-60px with power3.out easing</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <p className="text-sm">Trigger at 85-90% viewport scroll</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-sm">Timeline items scale and pulse when in view</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Icon Usage */}
        <Section id="icons" title="Icon Usage">
          <p className="mb-8" style={{ color: "var(--text-dim)" }}>
            We use Lucide icons throughout the interface. No emojis — only clean, consistent vector
            icons.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Icon Sizes */}
            <div className="animate-card">
              <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Icon Sizes
            </h3>
              <div className="space-y-4 rounded-xl border border-border-color bg-surface p-6">
                <div className="flex items-center gap-4">
                  <Rocket className="h-4 w-4 text-brand-primary" />
                  <span className="text-sm">Small (16px) — Inline with text</span>
                </div>
                <div className="flex items-center gap-4">
                  <Rocket className="h-5 w-5 text-brand-primary" />
                  <span className="text-sm">Medium (20px) — Buttons, chips</span>
                </div>
                <div className="flex items-center gap-4">
                  <Rocket className="h-6 w-6 text-brand-primary" />
                  <span className="text-sm">Large (24px) — Section headers</span>
                </div>
                <div className="flex items-center gap-4">
                  <Rocket className="h-8 w-8 text-brand-primary" />
                  <span className="text-sm">X-Large (32px) — Hero icons</span>
                </div>
              </div>
            </div>

            {/* Icon Library */}
            <div className="animate-card">
              <h3
                className="mb-4 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Common Icons
              </h3>
              <div className="grid grid-cols-4 gap-3 rounded-xl border border-border-color bg-surface p-6">
                <IconExample icon={<Rocket className="h-6 w-6" />} label="Rocket" />
                <IconExample icon={<Castle className="h-6 w-6" />} label="Castle" />
                <IconExample icon={<SparklesIcon className="h-6 w-6" />} label="Sparkles" />
                <IconExample icon={<Music className="h-6 w-6" />} label="Music" />
                <IconExample icon={<Palette className="h-6 w-6" />} label="Arts" />
                <IconExample icon={<Calendar className="h-6 w-6" />} label="Events" />
                <IconExample icon={<MapPin className="h-6 w-6" />} label="Location" />
                <IconExample icon={<Star className="h-6 w-6" />} label="Favorite" />
                <IconExample icon={<Zap className="h-6 w-6" />} label="Energy" />
                <IconExample icon={<Heart className="h-6 w-6" />} label="Like" />
                <IconExample icon={<TrendingUp className="h-6 w-6" />} label="Growth" />
                <IconExample icon={<Play className="h-6 w-6" />} label="Play" />
              </div>
            </div>
          </div>

          {/* Icon Colors */}
          <div className="animate-card mt-6">
            <h3
              className="mb-4 text-lg uppercase"
              style={{
                fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Icon Colors
            </h3>
            <div className="flex flex-wrap gap-6 rounded-xl border border-border-color bg-surface p-6">
              <div className="flex flex-col items-center gap-2">
                <Rocket className="h-8 w-8 text-brand-primary" />
                <span className="text-xs">Brand Primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Castle className="h-8 w-8" style={{ color: "var(--text)" }} />
                <span className="text-xs">Text Color</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <SparklesIcon className="h-8 w-8" style={{ color: "var(--text-dim)" }} />
                <span className="text-xs">Dimmed</span>
              </div>
            </div>
          </div>
        </Section>

        {/* The Orlando Narrative with SCROLL-TRIGGERED animations */}
        <Section id="narrative" title="The Orlando Narrative">
          <div className="animate-card relative overflow-hidden rounded-xl border border-border-color bg-surface p-8">
            {showEffects && <Sparkles count={25} />}
            <p
              className="relative z-10 mb-8 text-lg leading-relaxed"
              style={{
                color: "var(--text)",
                fontFamily: "var(--font-chakra-petch, sans-serif)",
              }}
            >
              <strong>Moonshots:</strong> Cape Canaveral, Kennedy Space Center, SpaceX — the
              engineering audacity that put humans on the Moon.
              <br />
              <strong style={{ color: "var(--brand-primary)" }}>Magic:</strong> Walt Disney World,
              Universal, EPCOT — the belief that wonder is engineered, not accidental.
              <br />
              <strong>Together:</strong> A region that marries ambition with imagination.
            </p>
          </div>

          {/* Timeline with scroll-triggered highlights */}
          <div className="mt-8 space-y-6">
            {PRESENTATION_LANDMARKS.map((landmark, idx) => (
              <ScrollTimelineItem
                key={landmark.id}
                index={idx}
                year={landmark.year}
                title={landmark.title}
                subtitle={landmark.subtitle}
                narrative={landmark.narrative}
                isLast={idx === PRESENTATION_LANDMARKS.length - 1}
              />
            ))}
          </div>
        </Section>

        {/* Voice & Tone */}
        <Section id="voice" title="Voice & Tone">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="animate-card rounded-xl border border-border-color bg-surface p-6">
              <h3
                className="mb-3 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Do
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
                <li>✓ Use active voice and present tense</li>
                <li>✓ Reference the Orlando timeline when relevant</li>
                <li>✓ Connect events to the moonshots & magic narrative</li>
                <li>✓ Balance technical precision with storytelling warmth</li>
              </ul>
            </div>
            <div className="animate-card rounded-xl border border-border-color bg-surface p-6">
              <h3
                className="mb-3 text-lg uppercase"
                style={{
                  fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Don&apos;t
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
                <li>✗ Use corporate jargon or buzzwords</li>
                <li>✗ Oversimplify the science or engineering</li>
                <li>✗ Ignore the human side of the story</li>
                <li>✗ Be cynical or dismissive</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Quick Reference */}
        <Section id="reference" title="Quick Reference">
          <div className="animate-card overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="p-3 text-left text-sm font-semibold">Element</th>
                  <th className="p-3 text-left text-sm font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                <RefRow label="Primary Blue" value="#0063CD" />
                <RefRow label="Dark BG" value="#050505" />
                <RefRow label="Light BG" value="#FFFFFF" />
                <RefRow label="Font (Display)" value="Oswald Black (900), ALL CAPS" />
                <RefRow label="Font (Body)" value="Inter" />
                <RefRow label="Border Radius" value="10-16px (default: 12px)" />
                <RefRow label="Blur Amount" value="24px" />
                <RefRow label="Animation Duration" value="300-800ms (UI), 0.6-1.5s (scroll)" />
                <RefRow label="Grain Opacity" value="4% (light), 6% (dark)" />
              </tbody>
            </table>
          </div>

          {/* Downloads */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <a
              href="/.claude/skills/brand-guide/SKILL.md"
              download="moonshots-magic-brand-guide.md"
              className="animate-card flex items-center gap-4 rounded-xl border border-border-color bg-surface p-6 transition-all hover:scale-105 hover:border-brand-primary"
            >
              <Download className="h-8 w-8" style={{ color: "var(--brand-primary)" }} />
              <div className="text-left">
                <h4 className="font-semibold" style={{ color: "var(--text)" }}>Brand Guide for AI</h4>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  Upload to any AI agent or system
                </p>
              </div>
            </a>

            <button
              onClick={() => {
                const markdown = generateBrandGuideMarkdown();
                const blob = new Blob([markdown], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "moonshots-magic-brand-guide-full.md";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="animate-card flex items-center gap-4 rounded-xl border border-border-color bg-surface p-6 transition-all hover:scale-105 hover:border-brand-primary"
            >
              <Download className="h-8 w-8" style={{ color: "var(--brand-primary)" }} />
              <div className="text-left">
                <h4 className="font-semibold" style={{ color: "var(--text)" }}>Complete Brand Guide</h4>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  Full Markdown documentation
                </p>
              </div>
            </button>
          </div>
        </Section>
      </div>

      {/* Footer with Stars */}
      <footer
        ref={footerRef}
        className="relative overflow-hidden border-t border-border-color px-6 py-20 text-center"
      >
        {/* Night sky background */}
        {showBackgroundImages && (
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/presentation/apollo-11.jpg"
              alt="Background"
              fill
              className="object-cover"
              style={{
                filter: "grayscale(1) blur(50px) brightness(0.25)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-background" />
            {/* Fade from background at top */}
            <div
              className="absolute inset-x-0 top-0 h-64"
              style={{
                background: "linear-gradient(to top, transparent, var(--background))",
              }}
            />
          </div>
        )}

        {showStars && <Stars count={100} />}
        {showEffects && <Sparkles count={40} />}

        <div className="relative z-20">
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>
            <strong>Moonshots & Magic Brand Guide v1.0</strong>
            <br />
            Maintained by Mirror Factory • 2026
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <a
          href="/.claude/skills/brand-guide/SKILL.md"
          download="moonshots-magic-brand-guide.md"
          onClick={() => setShowToast(false)}
          className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in duration-500"
        >
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all hover:bg-white/10"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Download className="h-3 w-3" style={{ color: "rgba(255, 255, 255, 0.5)" }} />
            <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              Tap here to download brand guide for AI
            </span>
          </div>
        </a>
      )}
    </div>
  );
}

/** Stars background component with forward motion. */
function Stars({ count = 100, shootingStars = 0 }: { count?: number; shootingStars?: number }) {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    // Regular twinkling stars with slow forward motion
    const stars = Array.from({ length: count }, () => {
      const star = document.createElement("div");
      const size = Math.random() * 2.5 + 0.5;
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
        opacity: ${Math.random() * 0.6 + 0.2};
        box-shadow: 0 0 ${Math.random() * 4 + 2}px currentColor;
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

/** Sparkles component for magical effects. */
function Sparkles({ count = 30 }: { count?: number }) {
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparklesRef.current) return;

    const sparkles = Array.from({ length: count }, () => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${Math.random() > 0.5 ? "#0063CD" : "#FFFFFF"};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.3};
        box-shadow: 0 0 ${Math.random() * 10 + 5}px currentColor;
        pointer-events: none;
      `;
      return sparkle;
    });

    sparkles.forEach((sparkle) => sparklesRef.current?.appendChild(sparkle));

    // Animate sparkles (optimized with longer duration)
    const ctx = gsap.context(() => {
      sparkles.forEach((sparkle, i) => {
        gsap.to(sparkle, {
          opacity: 0.1,
          scale: 0.5,
          duration: Math.random() * 3 + 2, // Longer duration for better performance
          delay: i * 0.05,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, sparklesRef);

    return () => {
      ctx.revert();
      sparkles.forEach((sparkle) => sparkle.remove());
    };
  }, [count]);

  return <div ref={sparklesRef} className="pointer-events-none absolute inset-0 z-10" />;
}

/** Pulsating dot component for animation showcase. */
function PulsatingDot({
  size,
  color,
  label,
}: {
  size: "small" | "medium" | "large";
  color: string;
  label: string;
}) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(dotRef.current, {
        scale: 1.3,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, dotRef);

    return () => ctx.revert();
  }, []);

  const sizeMap = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={dotRef}
        className={`${sizeMap[size]} rounded-full`}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}`,
        }}
      />
      <span className="text-xs" style={{ color: "var(--text-dim)" }}>
        {label}
      </span>
    </div>
  );
}

/** Scroll-triggered timeline item with pulsating dot and scale effect. */
function ScrollTimelineItem({
  year,
  title,
  subtitle,
  narrative,
  isLast,
  index,
}: {
  year: string;
  title: string;
  subtitle: string;
  narrative: string;
  isLast: boolean;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!itemRef.current || !dotRef.current) return;

    const ctx = gsap.context(() => {
      // Scale and highlight on scroll
      ScrollTrigger.create({
        trigger: itemRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          setIsActive(true);
          // Scale the entire item slightly
          gsap.to(itemRef.current, {
            scale: 1.02,
            duration: 0.3,
            ease: "back.out",
          });

          // Pulsate the dot
          gsap.to(dotRef.current, {
            scale: 1.3,
            boxShadow: "0 0 20px rgba(0, 99, 205, 0.8)",
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
        onLeave: () => {
          setIsActive(false);
          gsap.to(itemRef.current, { scale: 1, duration: 0.3 });
          gsap.killTweensOf(dotRef.current);
          gsap.to(dotRef.current, {
            scale: 1,
            boxShadow: "0 0 12px rgba(0, 99, 205, 0.5)",
            duration: 0.3,
          });
        },
        onEnterBack: () => {
          setIsActive(true);
          gsap.to(itemRef.current, { scale: 1.02, duration: 0.3, ease: "back.out" });
          gsap.to(dotRef.current, {
            scale: 1.3,
            boxShadow: "0 0 20px rgba(0, 99, 205, 0.8)",
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
        onLeaveBack: () => {
          setIsActive(false);
          gsap.to(itemRef.current, { scale: 1, duration: 0.3 });
          gsap.killTweensOf(dotRef.current);
          gsap.to(dotRef.current, {
            scale: 1,
            boxShadow: "0 0 12px rgba(0, 99, 205, 0.5)",
            duration: 0.3,
          });
        },
      });
    }, itemRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={itemRef} className="group relative flex gap-6 transition-all">
      {/* Timeline line */}
      <div className="relative flex flex-col items-center">
        <div
          ref={dotRef}
          className="h-4 w-4 rounded-full border-2 border-brand-primary"
          style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 0 12px rgba(0, 99, 205, 0.5)" }}
        />
        {!isLast && (
          <div className="w-px flex-1 bg-border-color" style={{ minHeight: "100px" }} />
        )}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative flex-1 overflow-hidden rounded-xl pb-10 transition-all duration-300"
        style={{
          backgroundColor: isActive ? "rgba(0, 99, 205, 0.08)" : "transparent",
          padding: isActive ? "1rem" : "0",
        }}
      >
        {/* Sparkles on scroll for second item */}
        {isActive && index === 1 && <Sparkles count={15} />}

        <div
          className="mb-3 inline-block rounded-lg px-4 py-2"
          style={{
            background: "rgba(0, 99, 205, 0.15)",
            border: "1px solid rgba(0, 99, 205, 0.3)",
          }}
        >
          <span
            className="text-3xl font-black tracking-tight"
            style={{
              fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
              color: "var(--brand-primary)",
              fontWeight: 900,
            }}
          >
            {year}
          </span>
        </div>
        <h3
          className="mb-2 text-2xl font-black uppercase tracking-tight"
          style={{ fontFamily: "var(--font-oswald, 'Oswald', sans-serif)", fontWeight: 900 }}
        >
          {title}
        </h3>
        <p className="mb-3 text-sm italic" style={{ color: "var(--brand-primary)" }}>
          {subtitle}
        </p>
        <p
          className="leading-relaxed"
          style={{
            color: "var(--text)",
            fontFamily: "var(--font-chakra-petch, sans-serif)",
            lineHeight: 1.7,
          }}
        >
          {narrative}
        </p>
      </div>
    </div>
  );
}

/** Icon example component. */
function IconExample({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-surface-2 p-3 transition-all hover:bg-brand-primary/10 hover:text-brand-primary">
      {icon}
      <span className="text-[10px]">{label}</span>
    </div>
  );
}

/** Section wrapper component. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="animate-section mb-20 scroll-mt-8">
      <h2
        className="mb-8 text-5xl uppercase"
        style={{
          fontFamily: "var(--font-oswald, 'Oswald', sans-serif)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Navigation link with sparkle hover effect. */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparklesRef.current) return;

    if (isHovered) {
      gsap.to(sparklesRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(sparklesRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isHovered]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      gsap.to(window, {
        scrollTo: { y: targetElement, offsetY: 100 },
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <a
      href={href}
      className="relative px-3 py-2 text-sm font-medium transition-colors"
      style={{ color: "var(--text)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div ref={sparklesRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
        <Sparkles count={15} />
      </div>
      <span className="relative z-10">{children}</span>
    </a>
  );
}

/** CTA button with hover effects. */
function CTAButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300"
      style={{
        background:
          variant === "primary"
            ? "var(--brand-primary)"
            : "rgba(255, 255, 255, 0.05)",
        color: "#FFFFFF",
        border: variant === "secondary" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        boxShadow: isHovered
          ? variant === "primary"
            ? "0 0 30px rgba(0, 99, 205, 0.6)"
            : "0 0 20px rgba(255, 255, 255, 0.2)"
          : "none",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}

/** Color swatch component with copy functionality. */
function ColorSwatch({
  color,
  name,
  hex,
  usage,
  border,
}: {
  color: string;
  name: string;
  hex: string;
  usage: string;
  border?: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="group relative flex items-center gap-3 rounded-lg border border-border-color bg-surface p-3 transition-transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="h-14 w-14 flex-shrink-0 rounded-lg"
        style={{
          backgroundColor: color,
          border: border ? "1px solid rgba(0, 0, 0, 0.1)" : undefined,
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{name}</p>
        <p className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
          {hex}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {usage}
        </p>
      </div>
      {isHovered && (
        <button
          onClick={handleCopy}
          className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
          title="Copy color"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

/** Type example component with copy functionality. */
function TypeExample({
  size,
  weight,
  family,
  text,
  label,
  uppercase = true,
}: {
  size: string;
  weight: string;
  family: string;
  text: string;
  label: string;
  uppercase?: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(family);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="group relative border-b border-border-color pb-4 last:border-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p
        style={{
          fontSize: size,
          fontWeight: weight,
          fontFamily: family === "Oswald" ? "var(--font-oswald)" : "var(--font-inter)",
          textTransform: uppercase ? "uppercase" : "none",
          letterSpacing: family === "Oswald" ? "-0.03em" : "0",
        }}
      >
        {text}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          {label} — {size}, {weight}, {family}
        </p>
        {isHovered && (
          <button
            onClick={handleCopy}
            className="rounded-lg bg-brand-primary/10 p-1.5 text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
            title="Copy font name"
          >
            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  );
}

/** Logo card component with download button. */
function LogoCard({
  title,
  subtitle,
  imagePath,
  bgColor,
}: {
  title: string;
  subtitle: string;
  imagePath: string;
  bgColor: string;
}) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imagePath;
    link.download = imagePath.split("/").pop() || "logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-card overflow-hidden rounded-xl border border-border-color transition-transform hover:scale-[1.02]">
      <div className="flex h-56 items-center justify-center p-6" style={{ backgroundColor: bgColor }}>
        <Image src={imagePath} alt={title} width={220} height={120} className="h-auto w-56" />
      </div>
      <div className="flex items-center justify-between bg-surface p-4">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>
            {subtitle}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
          title="Download logo"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Radius example component. */
function RadiusExample({ size, label }: { size: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-14 w-14 flex-shrink-0 border border-border-color bg-brand-primary/20 transition-transform hover:scale-110"
        style={{ borderRadius: size }}
      />
      <div>
        <p className="font-mono text-sm font-medium">{size}</p>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

/** Timeline dot component. */
function TimelineDot({ active, visited }: { active?: boolean; visited?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded-full transition-all duration-300"
        style={{
          width: active ? 12 : 8,
          height: active ? 12 : 8,
          background: active ? "#0063CD" : visited ? "rgba(0, 99, 205, 0.6)" : "rgba(255,255,255,0.15)",
          boxShadow: active ? "0 0 12px rgba(0, 99, 205, 0.6)" : "none",
          border: active ? "2px solid #FFFFFF" : "none",
        }}
      />
      <span className="text-[7px]" style={{ color: "var(--text-dim)" }}>
        {active ? "Active" : visited ? "Visited" : "Default"}
      </span>
    </div>
  );
}

/** Historical image component. */
function HistoricalImage({ src, title, year }: { src: string; title: string; year: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sparklesRef.current) return;

    if (isHovered) {
      gsap.to(sparklesRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(sparklesRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isHovered]);

  return (
    <div
      className="animate-card group relative overflow-hidden rounded-xl border border-border-color transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? "0 0 30px rgba(0, 99, 205, 0.4)" : "none",
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          style={{
            filter: "grayscale(1) contrast(1.1) brightness(0.9)",
          }}
        />
      </div>
      <div className="relative bg-surface p-4">
        {/* Sparkles with smooth transition */}
        <div ref={sparklesRef} style={{ opacity: 0 }}>
          <Sparkles count={20} />
        </div>

        <p
          className="relative z-10 text-lg font-bold uppercase"
          style={{ fontFamily: "var(--font-oswald, 'Oswald', sans-serif)" }}
        >
          {title}
        </p>
        <p className="relative z-10 text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
          {year}
        </p>
      </div>
    </div>
  );
}

/** Quick reference table row. */
function RefRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border-color transition-colors hover:bg-surface/50">
      <td className="p-3 font-semibold">{label}</td>
      <td className="p-3 font-mono text-sm" style={{ color: "var(--text-dim)" }}>
        {value}
      </td>
    </tr>
  );
}
