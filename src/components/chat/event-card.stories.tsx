import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventCard } from "./event-card";

const meta: Meta<typeof EventCard> = {
  title: "Chat/EventCard",
  component: EventCard,
};

export default meta;
type Story = StoryObj<typeof EventCard>;

const baseEvent = {
  id: "evt-001",
  title: "Orlando Jazz Festival",
  description:
    "A weekend celebration of jazz music featuring local and national artists performing across multiple stages in downtown Orlando.",
  category: "music" as const,
  venue: "Lake Eola Park",
  city: "Orlando",
  startDate: "2025-03-15T19:00:00Z",
  tags: ["jazz", "live-music", "outdoor"],
};

export const Default: Story = {
  args: { event: baseEvent },
};

export const FreeEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "evt-002",
      title: "Community Yoga in the Park",
      description: "Free morning yoga session open to all skill levels.",
      category: "community",
      tags: ["yoga", "free", "outdoor"],
    },
  },
};

export const Featured: Story = {
  args: {
    event: {
      ...baseEvent,
      featured: true,
    },
  },
};

export const TechEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "evt-003",
      title: "React Orlando Meetup",
      description:
        "Monthly meetup for React developers in Central Florida. Lightning talks and networking.",
      category: "tech",
      venue: "Full Sail University",
      tags: ["react", "javascript", "meetup"],
    },
  },
};

export const FoodEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "evt-004",
      title: "Orlando Food & Wine Festival",
      description:
        "Sample cuisine from 30+ local restaurants paired with craft beverages.",
      category: "food",
      venue: "Church Street District",
      tags: ["food", "wine", "festival"],
    },
  },
};

export const SportsEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "evt-005",
      title: "Orlando City SC vs Inter Miami",
      description: "MLS regular season match under the lights.",
      category: "sports",
      venue: "Exploria Stadium",
      tags: ["soccer", "mls"],
    },
  },
};
