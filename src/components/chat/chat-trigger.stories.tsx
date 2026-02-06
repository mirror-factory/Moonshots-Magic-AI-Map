import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatTrigger } from "./chat-trigger";

const meta: Meta<typeof ChatTrigger> = {
  title: "Chat/ChatTrigger",
  component: ChatTrigger,
  decorators: [
    (Story) => (
      <div style={{ height: 120, position: "relative" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatTrigger>;

export const Closed: Story = {
  args: {
    open: false,
    onClick: () => console.log("toggle"),
  },
};

export const Open: Story = {
  args: {
    open: true,
    onClick: () => console.log("toggle"),
  },
};
