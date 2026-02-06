import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapAction } from "./map-action";
import { MapContext } from "@/components/map/use-map";

const meta: Meta<typeof MapAction> = {
  title: "Chat/MapAction",
  component: MapAction,
  decorators: [
    (Story) => (
      <MapContext.Provider value={null}>
        <Story />
      </MapContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MapAction>;

export const FlyTo: Story = {
  args: {
    input: {
      action: "flyTo",
      coordinates: [-81.3792, 28.5383],
      zoom: 14,
    },
  },
};

export const Highlight: Story = {
  args: {
    input: {
      action: "highlight",
      eventIds: ["evt-001", "evt-002"],
    },
  },
};

export const FitBounds: Story = {
  args: {
    input: {
      action: "fitBounds",
      eventIds: ["evt-001", "evt-002", "evt-003"],
    },
  },
};
