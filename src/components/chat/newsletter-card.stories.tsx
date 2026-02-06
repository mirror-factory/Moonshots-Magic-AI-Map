import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsletterCard } from "./newsletter-card";

const meta: Meta<typeof NewsletterCard> = {
  title: "Chat/NewsletterCard",
  component: NewsletterCard,
};

export default meta;
type Story = StoryObj<typeof NewsletterCard>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "nl-001",
        title: "Orlando's Best Weekend Events This March",
        summary:
          "A curated guide to the top events happening in Central Florida this weekend, from jazz festivals to food truck rallies.",
        category: "events",
        source: "Orlando Weekly",
        author: "Sarah Chen",
        publishedAt: "2025-03-10T08:00:00Z",
        tags: ["weekend", "events", "orlando"],
      },
    ],
  },
};

export const MultipleItems: Story = {
  args: {
    items: [
      {
        id: "nl-001",
        title: "Orlando's Best Weekend Events This March",
        summary:
          "A curated guide to the top events happening in Central Florida.",
        category: "events",
        source: "Orlando Weekly",
        author: "Sarah Chen",
        publishedAt: "2025-03-10T08:00:00Z",
        tags: ["weekend", "events"],
      },
      {
        id: "nl-002",
        title: "New Restaurants Opening in Downtown Orlando",
        summary:
          "Five exciting new dining spots have opened their doors this month.",
        category: "food",
        source: "Orlando Sentinel",
        publishedAt: "2025-03-08T10:00:00Z",
        tags: ["food", "restaurants"],
      },
      {
        id: "nl-003",
        title: "Tech Scene: Orlando Startup Week Preview",
        summary:
          "What to expect from the annual gathering of Central Florida's tech community.",
        category: "tech",
        source: "Orlando Tech Weekly",
        author: "Mike Torres",
        publishedAt: "2025-03-05T12:00:00Z",
        tags: ["tech", "startups"],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
