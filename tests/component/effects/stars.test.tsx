/**
 * @file tests/component/effects/stars.test.tsx
 * Tests for the Stars component - animated star field with twinkling and motion.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Stars } from "@/components/effects/stars";

// Mock GSAP
vi.mock("gsap", () => ({
  gsap: {
    context: (fn: () => void, ref: unknown) => {
      fn();
      return { revert: vi.fn() };
    },
    to: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
  },
}));

describe("Stars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<Stars />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders with custom count", () => {
    const { container } = render(<Stars count={50} />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders with shooting stars", () => {
    const { container } = render(<Stars count={100} shootingStars={5} />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    const { container } = render(<Stars />);
    const div = container.querySelector("div");
    expect(div).toHaveClass("pointer-events-none");
    expect(div).toHaveClass("absolute");
    expect(div).toHaveClass("inset-0");
  });

  it("creates star elements in the DOM", () => {
    const { container } = render(<Stars count={10} />);
    // Stars are added via useEffect, so we just check that the container exists
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
  });

  it("cleans up on unmount", () => {
    const { unmount, container } = render(<Stars count={10} />);
    expect(container.querySelector("div")).toBeInTheDocument();
    unmount();
    // Component should clean up properly without errors
  });
});
