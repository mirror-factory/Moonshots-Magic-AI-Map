import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkle } from "./sparkle";

const meta: Meta<typeof Sparkle> = {
  title: "Effects/Sparkle",
  component: Sparkle,
};

export default meta;
type Story = StoryObj<typeof Sparkle>;

export const Active: Story = {
  args: {
    active: true,
    children: (
      <div
        style={{
          padding: 16,
          background: "var(--surface-2, #1a1a2e)",
          borderRadius: 8,
          color: "white",
        }}
      >
        Thinking...
      </div>
    ),
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    children: (
      <div
        style={{
          padding: 16,
          background: "var(--surface-2, #1a1a2e)",
          borderRadius: 8,
          color: "white",
        }}
      >
        Idle
      </div>
    ),
  },
};

export const CustomCount: Story = {
  args: {
    active: true,
    count: 40,
    color: "#FFD700",
    glowColor: "#FFD700",
    children: (
      <div
        style={{
          padding: 16,
          background: "var(--surface-2, #1a1a2e)",
          borderRadius: 8,
          color: "white",
        }}
      >
        Golden sparkles
      </div>
    ),
  },
};
